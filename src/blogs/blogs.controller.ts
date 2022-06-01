import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { Blog, BlogEntry } from './blog.class';
import { BlogsService } from './blogs.service';
import { CreateBlogDto } from './dto/create-blog';
import { CreateBlogEntryDto } from './dto/create-blog-entry.dto';
import { EditBlogEntryDto } from './dto/edit-blog-entry.dto';

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

  @Post('/:blogId')
  async createBlogEntry(
    @Body() createBlogEntryDto: CreateBlogEntryDto,
    @Param('blogId') blogId: string,
  ): Promise<BlogEntry> {
    return this.blogsService.createBlogEntry(blogId, createBlogEntryDto);
  }

  @Patch('/:blogId/:blogEntryId')
  async editBlogEntry(
    @Body() editBlogEntryDto: EditBlogEntryDto,
    @Param('blogId') blogId: string,
    @Param('blogEntryId') blogEntryId: string,
  ): Promise<BlogEntry> {
    return this.blogsService.editBlogEntry(
      blogId,
      blogEntryId,
      editBlogEntryDto,
    );
  }
}
