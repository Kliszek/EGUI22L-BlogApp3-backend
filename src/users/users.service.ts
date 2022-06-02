import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.class';

@Injectable()
export class UsersService {
  constructor(private configService: ConfigService) {
    this.readUsers();
  }

  private users: User[] = [];

  private async readUsers(): Promise<void> {
    await readFile(
      join(process.cwd(), this.configService.get('USERS_PATH')),
      'utf-8',
    )
      .then((data) => {
        this.users = JSON.parse(data);
        console.log('read users from file');
      })
      .catch((error) => {
        console.log('error reading users from file');
        console.log(error);
        if (error.code === 'ENOENT') {
          this.users = [];
          console.log('Set users to an empty array and continuing...');
        } else throw new InternalServerErrorException();
      });
  }

  private async writeUsers(): Promise<void> {
    await writeFile(
      join(process.cwd(), this.configService.get('USERS_PATH')),
      JSON.stringify(this.users),
      'utf-8',
    )
      .then(() => {
        console.log('written users to file');
      })
      .catch((error) => {
        console.log('error writing users the file');
        console.log(error);
        throw new InternalServerErrorException();
      });
  }

  // async createUser(createUserDto: CreateUserDto): Promise<void> {

  // }
}
