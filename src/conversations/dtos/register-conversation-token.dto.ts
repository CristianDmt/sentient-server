import { IsNumber, IsString } from "class-validator";

export class RegisterConversationTokenDto {
  @IsString()
  name: string;

  @IsNumber()
  companyId: number;

  @IsNumber()
  teamId: number;

  constructor(data) {
    Object.assign(this, data);
  }
}