import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post('signup')
  signUp(@Body() createUserDto: CreateUserDto): Promise<void> {
    return this.usersService.createUser(createUserDto);
  }

  @Post('signin')
  signIn(@Body() loginUserDto: LoginUserDto): Promise<{ accessToken: string }> {
    return this.usersService.logIn(loginUserDto);
  }
}
