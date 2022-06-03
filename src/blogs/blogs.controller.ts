import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/users/get-user.decorator';
import { User } from 'src/users/user.class';
import { Blog, BlogEntry } from './blog.class';
import { BlogsService } from './blogs.service';
import { CreateBlogDto } from './dto/create-blog';
import { CreateBlogEntryDto } from './dto/create-blog-entry.dto';
import { EditBlogEntryDto } from './dto/edit-blog-entry.dto';
import { GetBlogsFilterDto } from './dto/get-blogs-filter.dto';

@Controller('blogs')
@UseGuards(AuthGuard())
export class BlogsController {
  constructor(private blogsService: BlogsService) {}

  @Get()
  async getBlogs(
    @Body() getBlogsFilterDto: GetBlogsFilterDto,
  ): Promise<Blog[]> {
    return this.blogsService.getBlogs(getBlogsFilterDto);
  }

  @Get('/:id')
  async getBlog(@Param('id') blogId: string): Promise<Blog> {
    return this.blogsService.getBlog(blogId);
  }

  @Post()
  async createBlog(
    @Body() createBlogDto: CreateBlogDto,
    @GetUser() user: User,
  ): Promise<Blog> {
    return this.blogsService.createBlog(createBlogDto, user);
  }

  @Post('/:blogId')
  async createBlogEntry(
    @Body() createBlogEntryDto: CreateBlogEntryDto,
    @Param('blogId') blogId: string,
    @GetUser() user: User,
  ): Promise<BlogEntry> {
    return this.blogsService.createBlogEntry(blogId, createBlogEntryDto, user);
  }

  @Patch('/:blogId/:blogEntryId')
  async editBlogEntry(
    @Body() editBlogEntryDto: EditBlogEntryDto,
    @Param('blogId') blogId: string,
    @Param('blogEntryId') blogEntryId: string,
    @GetUser() user: User,
  ): Promise<BlogEntry> {
    return this.blogsService.editBlogEntry(
      blogId,
      blogEntryId,
      editBlogEntryDto,
      user,
    );
  }

  @Delete('/:blogId')
  async deleteBlog(@Param('blogId') blogId: string): Promise<void> {
    return this.blogsService.deleteBlog(blogId);
  }

  @Delete('/:blogId/:blogEntryId')
  async deleteBlogEntry(
    @Param('blogId') blogId: string,
    @Param('blogEntryId') blogEntryId: string,
    @GetUser() user: User,
  ): Promise<void> {
    return this.blogsService.deleteBlogEntry(blogId, blogEntryId, user);
  }
}
