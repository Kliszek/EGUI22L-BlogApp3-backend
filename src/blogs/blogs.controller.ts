import { Controller, Get } from '@nestjs/common';
import { Blog } from './blog.class';
import { BlogsService } from './blogs.service';

@Controller('blogs')
export class BlogsController {
  constructor(private blogsService: BlogsService) {}

  @Get()
  async getAllBlogs(): Promise<Blog[]> {
    return this.blogsService.GetAllBlogs();
  }
}
