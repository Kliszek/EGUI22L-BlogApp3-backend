import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BlogsController } from './blogs.controller';
import { BlogsService } from './blogs.service';

@Module({
  imports: [ConfigModule],
  controllers: [BlogsController],
  providers: [BlogsService],
})
export class BlogsModule {}
