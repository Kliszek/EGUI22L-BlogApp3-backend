import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BlogsModule } from './blogs/blogs.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`.env.stage.${process.env.stage}`],
    }),
    BlogsModule,
    UsersModule,
  ],
})
export class AppModule {}
