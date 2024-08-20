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
  verified: boolean;
  featured: boolean;
  game: "Genshin" | "WuWa";
  createdAt: string;
  updatedAt: string;
  added: Date;
}
