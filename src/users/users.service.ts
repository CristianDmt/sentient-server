import { ConflictException, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/sequelize';
import { RegisterUserDto } from './dtos/register-user.dto';
import { User, USER_SCOPE_AUTH as USER_SCOPE_AUTH, USER_SCOPE_FULL } from './models/user.model';
import * as argon2 from 'argon2';
import * as jwt from 'jsonwebtoken';
import { AuthenticateUserDto } from './dtos/authenticate-user.dto';
import { AuthenticateUserResponseDto } from './dtos/authenticate-user-response.dto';
import { TokenInterface } from './interfaces/token.interface';
import { PatchUserProfileDto } from './dtos/patch-user-profile.dto copy';

const CONFIG_TOKEN_EXPIRATION = 'auth.jwt.expiration';
const CONFIG_TOKEN_SECRET = 'auth.jwt.secret';

@Injectable()
export class UsersService {
  constructor(
    private readonly configService: ConfigService,
    @InjectModel(User) private readonly userModel: typeof User
  ) { }

  async registerUser(user: RegisterUserDto): Promise<AuthenticateUserResponseDto> {
    if (await this.getUserByEmail(user.email)) {
      throw new ConflictException(`This e-mail address is already taken.`);
    }

    const password = await argon2.hash(user.password);
    const newUser = new User({ ...user, password });
    const createdUser = await newUser.save();

    return this.generateAuthenticationResponse(createdUser);
  }

  async authenticateUser(auth: AuthenticateUserDto): Promise<AuthenticateUserResponseDto> {
    const user = await this.getUserByEmail(auth.email);
    
    if (!user) {
      throw new UnauthorizedException(`Account does not exist`);
    }

    if (!user.isActive) {
      throw new ForbiddenException(`Account is disabled`);
    }
    
    if (!await argon2.verify(user.password, auth.password)) {
      throw new UnauthorizedException(`Bad credentials`);
    }

    return this.generateAuthenticationResponse(user);
  }

  async getUserByEmail(email: string): Promise<User> {
    return await this.userModel.scope(USER_SCOPE_AUTH).findOne({
      where: {
        email: email
      }
    });
  }

  async getUserById(userId: number): Promise<User> {
    return await this.userModel.scope(USER_SCOPE_FULL).findOne({
      where: {
        id: userId
      },
    });
  }

  async updateUserProfile(userId: number, profileData: PatchUserProfileDto): Promise<User> {
    const user = await this.getUserById(userId);

    if (profileData.email && profileData.email !== user.email) {
      const userByEmail = await this.getUserByEmail(profileData.email)

      if (userByEmail) {
        throw new ConflictException(`This e-mail address is already taken.`);
      }
    }

    if (profileData.password) {
      profileData.password = await argon2.hash(profileData.password);
    }

    return await user.update(profileData);
  }

  decodeAuthToken(token: string): TokenInterface {
    return jwt.verify(token, this.configService.get('auth.jwt.secret')) as TokenInterface;
  }

  private generateUserToken(user: User): string {
    return jwt.sign({ userId: user.id } as TokenInterface,
      this.configService.get(CONFIG_TOKEN_SECRET),
      { expiresIn: this.configService.get(CONFIG_TOKEN_EXPIRATION) }
    );
  }

  private generateAuthenticationResponse(user: User): AuthenticateUserResponseDto {
    return new AuthenticateUserResponseDto({
      ...user.get({ plain: true }),
      token: this.generateUserToken(user)
    });
  }
}
