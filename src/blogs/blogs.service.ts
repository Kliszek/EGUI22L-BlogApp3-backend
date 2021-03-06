import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { mkdir, readFile, writeFile } from 'fs/promises';
import { dirname, join } from 'path';
import { Blog, BlogEntry } from './blog.class';
import { v4 as uuid } from 'uuid';
import { CreateBlogDto } from './dto/create-blog';
import { ConfigService } from '@nestjs/config';
import { CreateBlogEntryDto } from './dto/create-blog-entry.dto';
import { EditBlogEntryDto } from './dto/edit-blog-entry.dto';
import { User } from 'src/users/user.class';
import { GetBlogsFilterDto } from './dto/get-blogs-filter.dto';

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
    const path = join(process.cwd(), this.configService.get('BLOGS_PATH'));
    await mkdir(dirname(path), { recursive: true }).catch((error) => {
      console.log('error creating the folder');
      console.log(error);
      throw new InternalServerErrorException();
    });

    await writeFile(path, JSON.stringify(this.blogs), 'utf-8')
      .then(() => {
        console.log('written blogs to file');
      })
      .catch((error) => {
        console.log('error writing blogs the file');
        console.log(error);
        throw new InternalServerErrorException();
      });
  }

  async getBlogs(getBlogsFilterDto: GetBlogsFilterDto): Promise<Blog[]> {
    const { username } = getBlogsFilterDto;
    if (!!username) {
      return this.blogs.filter((blog) => blog.ownerId === username);
    } else return this.blogs;
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
    user: User,
  ): Promise<BlogEntry> {
    const foundBlog: Blog = await this.getBlog(blogId);
    if (foundBlog.ownerId !== user.username) {
      throw new ForbiddenException('You cannot edit this blog!');
    }

    const foundBlogEntry: BlogEntry = foundBlog.blogEntryList.find(
      (blogEntry) => blogEntry.id === blogEntryId,
    );
    if (!foundBlogEntry) {
      throw new NotFoundException('Blog Entry with this ID does not exist!');
    }
    return foundBlogEntry;
  }

  async createBlog(createBlogDto: CreateBlogDto, user: User): Promise<Blog> {
    const { title } = createBlogDto;

    const blog: Blog = {
      id: uuid(),
      title,
      ownerId: user.username,
      blogEntryList: [],
    };

    this.blogs.unshift(blog);
    await this.writeBlogs();
    return blog;
  }

  async createBlogEntry(
    blogId: string,
    createBlogEntryDto: CreateBlogEntryDto,
    user: User,
  ): Promise<BlogEntry> {
    const { title, content } = createBlogEntryDto;
    const blogEntry: BlogEntry = {
      id: uuid(),
      title,
      content,
      dateTime: new Date(),
    };

    const foundBlog: Blog = await this.getBlog(blogId);
    if (foundBlog.ownerId !== user.username) {
      throw new ForbiddenException('You cannot edit this blog!');
    }

    foundBlog.blogEntryList.unshift(blogEntry);
    await this.writeBlogs();
    return blogEntry;
  }

  async editBlogEntry(
    blogId: string,
    blogEntryId: string,
    editBlogEntryDto: EditBlogEntryDto,
    user: User,
  ): Promise<BlogEntry> {
    const { title, content } = editBlogEntryDto;

    const foundBlogEntry: BlogEntry = await this.getBlogEntry(
      blogId,
      blogEntryId,
      user,
    );

    if (title) foundBlogEntry.title = title;
    if (content) foundBlogEntry.content = content;

    await this.writeBlogs();

    return foundBlogEntry;
  }

  async deleteBlog(blogId: string): Promise<void> {
    const l = this.blogs.length;
    this.blogs = this.blogs.filter((blog) => blog.id !== blogId);

    if (l === this.blogs.length) {
      throw new NotFoundException('Blog with this ID does not exist');
    }

    await this.writeBlogs();
    return;
  }

  async deleteBlogEntry(
    blogId: string,
    blogEntryId: string,
    user: User,
  ): Promise<void> {
    const foundBlog: Blog = await this.getBlog(blogId);
    if (foundBlog.ownerId !== user.username) {
      throw new ForbiddenException('You cannot edit this blog!');
    }

    const l = foundBlog.blogEntryList.length;
    foundBlog.blogEntryList = foundBlog.blogEntryList.filter(
      (blogEntry) => blogEntry.id !== blogEntryId,
    );

    if (l === foundBlog.blogEntryList.length) {
      throw new NotFoundException('Blog Entry with this ID does not exist');
    }

    await this.writeBlogs();
    return;
  }
}
