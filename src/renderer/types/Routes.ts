interface Author {
  displayName: string;
  image: string;
  _id: string;
}

export interface RoutesObject {
  _id: string;
  author: Author;
  title: string;
  description: string;
  values: string[];
  public: boolean;
  verified: boolean;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface RoutesResponse {
  data: RoutesObject[];
  dt: string;
}
