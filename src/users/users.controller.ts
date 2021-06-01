import { Body, Get, HttpCode, HttpStatus, Patch, Post } from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { RequestUser } from 'src/common/decorators/request-user.decorator';
import { AuthenticateUserResponseDto } from './dtos/authenticate-user-response.dto';
import { AuthenticateUserDto } from './dtos/authenticate-user.dto';
import { PatchUserProfileDto } from './dtos/patch-user-profile.dto copy';
import { RegisterUserDto } from './dtos/register-user.dto';
import { UserProfileFullResponseDto } from './dtos/user-profile-full-response.dto';
import { UserProfileResponseDto } from './dtos/user-profile-response.dto';
import { UsersService } from './users.service';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post('auth/register')
  async registerUser(
    @Body() registerUserDto: RegisterUserDto
  ): Promise<AuthenticateUserResponseDto> {
    return await this.usersService.registerUser(registerUserDto);
  }

  @Post('auth/login')
  @HttpCode(HttpStatus.OK)
  async authenticateUser(
    @Body() authUserDto: AuthenticateUserDto
  ): Promise<AuthenticateUserResponseDto> {
    return await this.usersService.authenticateUser(authUserDto);
  }

  @Get('users/profiles/me')
  async getUserProfile(@RequestUser() userId: number): Promise<UserProfileFullResponseDto> {
    return new UserProfileFullResponseDto(await this.usersService.getUserById(userId));
  }

  @Patch('users/profiles/me')
  async patchUserProfile(
    @RequestUser() userId: number,
    @Body() patchUserProfileDto: PatchUserProfileDto
  ): Promise<UserProfileResponseDto> {
    await this.usersService.updateUserProfile(userId, patchUserProfileDto);
    return new UserProfileResponseDto(await this.usersService.getUserById(userId));
  }
}
