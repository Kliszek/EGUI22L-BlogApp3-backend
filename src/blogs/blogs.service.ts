import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';
import { Blog, BlogEntry } from './blog.class';
import { v4 as uuid } from 'uuid';
import { CreateBlogDto } from './dto/create-blog';
import { ConfigService } from '@nestjs/config';
import { CreateBlogEntryDto } from './dto/create-blog-entry.dto';
import { EditBlogEntryDto } from './dto/edit-blog-entry.dto';

@Injectable()
export class BlogsService {
  private blogs: Blog[] = [];
  constructor(private configService: ConfigService) {
    this.readBlogs();
  }

  private async readBlogs(): Promise<void> {
    await readFile(
      join(process.cwd(), this.configService.get('BLOGS_PATH')),
      'utf-8',
    )
      .then((data) => {
        this.blogs = JSON.parse(data);
        console.log('read blogs from file');
      })
      .catch((error) => {
        console.log('error reading blogs from file');
        console.log(error);
        if (error.code === 'ENOENT') {
          this.blogs = [];
          console.log('Set blogs to an empty array and continuing...');
        } else throw new InternalServerErrorException();
      });
  }

  private async writeBlogs(): Promise<void> {
    await writeFile(
      join(process.cwd(), this.configService.get('BLOGS_PATH')),
      JSON.stringify(this.blogs),
      'utf-8',
    )
      .then(() => {
        console.log('written blogs to file');
      })
      .catch((error) => {
        console.log('error writing blogs the file');
        console.log(error);
        throw new InternalServerErrorException();
      });
  }

  async getAllBlogs(): Promise<Blog[]> {
    return this.blogs;
  }

  async getBlog(blogId: string): Promise<Blog> {
    const foundBlog: Blog = this.blogs.find((blog) => blog.id === blogId);
    if (!foundBlog) {
      throw new NotFoundException('Blog with this ID does not exist!');
    }
    return foundBlog;
  }

  private async getBlogEntry(
    blogId: string,
    blogEntryId: string,
  ): Promise<BlogEntry> {
    const foundBlog: Blog = await this.getBlog(blogId);

    const foundBlogEntry: BlogEntry = foundBlog.blogEntryList.find(
      (blogEntry) => blogEntry.id === blogEntryId,
    );
    if (!foundBlogEntry) {
      throw new NotFoundException('Blog Entry with this ID does not exist!');
    }
    return foundBlogEntry;
  }

  async createBlog(createBlogDto: CreateBlogDto): Promise<Blog> {
    const { title } = createBlogDto;

    const blog: Blog = {
      id: uuid(),
      title,
      ownerId: 'dummyOwner',
      blogEntryList: [],
    };

    this.blogs.push(blog);

    await this.writeBlogs();

    return blog;
  }

  async createBlogEntry(
    blogId: string,
    createBlogEntryDto: CreateBlogEntryDto,
  ): Promise<BlogEntry> {
    const { title, content } = createBlogEntryDto;
    const blogEntry: BlogEntry = {
      id: uuid(),
      title,
      content,
      dateTime: new Date(),
    };

    const found: Blog = await this.getBlog(blogId);

    found.blogEntryList.push(blogEntry);
    await this.writeBlogs();
    return blogEntry;
  }

  async editBlogEntry(
    blogId: string,
    blogEntryId: string,
    editBlogEntryDto: EditBlogEntryDto,
  ): Promise<BlogEntry> {
    const { title, content } = editBlogEntryDto;

    const foundBlogEntry: BlogEntry = await this.getBlogEntry(
      blogId,
      blogEntryId,
    );

    if (title) foundBlogEntry.title = title;
    if (content) foundBlogEntry.content = content;

    this.writeBlogs();

    return foundBlogEntry;
  }

  async deleteBlog(blogId: string): Promise<void> {
    const l = this.blogs.length;
    this.blogs = this.blogs.filter((blog) => blog.id !== blogId);

    if (l === this.blogs.length) {
      throw new NotFoundException('Blog with this ID does not exist');
    }

    this.writeBlogs();
    return;
  }

  async deleteBlogEntry(blogId: string, blogEntryId: string): Promise<void> {
    const foundBlogEntry: Blog = await this.getBlog(blogId);

    const l = foundBlogEntry.blogEntryList.length;
    foundBlogEntry.blogEntryList = foundBlogEntry.blogEntryList.filter(
      (blogEntry) => blogEntry.id !== blogEntryId,
    );

    if (l === foundBlogEntry.blogEntryList.length) {
      throw new NotFoundException('Blog Entry with this ID does not exist');
    }

    this.writeBlogs();
    return;
  }
}
