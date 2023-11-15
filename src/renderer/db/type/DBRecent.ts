export default interface DBRecent {
  _id: string;
  author: {
    displayName: string;
    image: string;
    _id: string;
  };
  title: string;
  description: string;
  values: string[];
  public: boolean;
  verified: boolean;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
  added: Date;
}
