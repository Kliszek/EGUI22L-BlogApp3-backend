import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { Blog, BlogEntry } from './blog.class';
import { BlogsService } from './blogs.service';
import { CreateBlogDto } from './dto/create-blog';
import { CreateBlogEntryDto } from './dto/create-blog-entry.dto';

@Controller('blogs')
export class BlogsController {
  constructor(private blogsService: BlogsService) {}

  @Get()
  async getAllBlogs(): Promise<Blog[]> {
    return this.blogsService.getAllBlogs();
  }

  @Post()
  async createBlog(@Body() createBlogDto: CreateBlogDto): Promise<Blog> {
    return this.blogsService.createBlog(createBlogDto);
  }
}
