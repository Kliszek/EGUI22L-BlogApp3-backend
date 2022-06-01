export class BlogEntry {
  title: string;
  //ownerId: string;
  dateTime: Date;
  content: string;
}

export class Blog {
  id: string;
  title: string;
  ownerId: string;
  blogEntryList: BlogEntry[];
}
