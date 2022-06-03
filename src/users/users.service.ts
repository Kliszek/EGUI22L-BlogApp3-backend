import {
  ConflictException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { mkdir, readFile, writeFile } from 'fs/promises';
import { dirname, join } from 'path';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.class';
import { v4 as uuid } from 'uuid';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    private configService: ConfigService,
    private jwtService: JwtService,
  ) {
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
    const path = join(process.cwd(), this.configService.get('USERS_PATH'));
    await mkdir(dirname(path), { recursive: true }).catch((error) => {
      console.log('error creating the folder');
      console.log(error);
      throw new InternalServerErrorException();
    });

    await writeFile(path, JSON.stringify(this.users), 'utf-8')
      .then(() => {
        console.log('written users to file');
      })
      .catch((error) => {
        console.log('error writing users the file');
        console.log(error);
        throw new InternalServerErrorException();
      });
  }

  async createUser(createUserDto: CreateUserDto): Promise<void> {
    const { username, email, password } = createUserDto;

    if (!!this.users.find((user) => user.email === email)) {
      throw new ConflictException('Username with this email already exists!');
    }
    if (!!this.users.find((user) => user.username === username)) {
      throw new ConflictException('This username is already taken!');
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const user: User = {
      id: uuid(),
      username,
      email,
      password: hashedPassword,
    };

    this.users.push(user);
    await this.writeUsers();
    return;
  }

  async getUser(username: string): Promise<User> {
    const result: User = this.users.find((user) => user.username === username);
    if (!result) {
      throw new NotFoundException('User with this username does not exists!');
    } else return result;
  }

  async logIn(loginUserDto: LoginUserDto): Promise<{ accessToken: string }> {
    const { username, password } = loginUserDto;
    const user: User = await this.getUser(username);

    if (!(await bcrypt.compare(password, user.password))) {
      throw new ForbiddenException('Provided password is incorrect!');
    }

    const payload: JwtPayload = { username };
    const accessToken: string = await this.jwtService.sign(payload);

    return { accessToken };
  }
}
