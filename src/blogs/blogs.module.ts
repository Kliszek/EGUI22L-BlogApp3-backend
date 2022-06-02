import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from 'src/users/users.module';
import { BlogsController } from './blogs.controller';
import { BlogsService } from './blogs.service';

@Module({
  imports: [ConfigModule, UsersModule],
  controllers: [BlogsController],
  providers: [BlogsService],
})
export class BlogsModule {}
