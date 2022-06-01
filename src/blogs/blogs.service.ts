import { Injectable } from '@nestjs/common';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { Blog } from './blog.class';

@Injectable()
export class BlogsService {
  async GetAllBlogs(): Promise<Blog[]> {
    let blogs: Blog[];
    await readFile(join(process.cwd(), 'data/blogs.json'), 'utf-8').then(
      (data) => {
        blogs = JSON.parse(data);
      },
    );
    return blogs;
  }
}
