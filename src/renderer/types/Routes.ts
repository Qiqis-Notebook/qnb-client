export interface Author {
  displayName: string;
  image: string;
  _id: string;
}

// Route details, no markers or notes
export interface RouteDetail {
  _id: string;
  author: Author | null;
  title: string;
  description: string;
  values: string[];
  verified: boolean;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface RouteVanityObject extends Pick<RouteDetail, "_id"> {
  vanity: string;
}
export interface RouteVanityResponse {
  data: RouteVanityObject;
  dt: string;
}

export interface RouteListResponse {
  data: RouteDetail[];
  dt: string;
}

// Custom marker in a route
export interface CustomMarker {
  name: string;
  notes: string;
  value: string;
  x: number;
  y: number;
  z: number;
  layer: number;
  markerId: number;
}

// Custom note in a route
export interface Note {
  note: string;
  layer: number;
  x: number;
  y: number;
  z: number;
}

// Full route detail
export interface RouteObject {
  _id: string;
  author: Author | null;
  title: string;
  description: string;
  markers: (CustomMarker | number)[];
  notes: Note[];
  values: string[];
  verified: boolean;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface RouteResponse {
  data: RouteObject;
  dt: string;
}

// Route list
export interface RoutesObject {
  _id: string;
  author: Author;
  title: string;
  description: string;
  values: string[];
  public: boolean;
  verified: boolean;
  featured: boolean;
  game: "Genshin" | "WuWa";
  createdAt: string;
  updatedAt: string;
}

export interface RoutesResponse {
  data: {
    routes: RoutesObject[];
    totalPages: number;
    totalDocuments: number;
  };
  dt: string;
}
