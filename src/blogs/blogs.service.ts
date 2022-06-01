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
        console.log('read from file');
      })
      .catch((error) => {
        console.log('error reading from file');
        console.log(error);
        throw new InternalServerErrorException();
      });
  }

  private async writeBlogs(): Promise<void> {
    await writeFile(
      join(process.cwd(), this.configService.get('BLOGS_PATH')),
      JSON.stringify(this.blogs),
      'utf-8',
    )
      .then(() => {
        console.log('written to file');
      })
      .catch((error) => {
        console.log('error writing the file');
        console.log(error);
        throw new InternalServerErrorException();
      });
  }

  async getAllBlogs(): Promise<Blog[]> {
    return this.blogs;
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
}
