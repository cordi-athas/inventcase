export interface User {
  id: number;
  name: string;
}

export interface UserDetail extends User {
  books: {
    present: { id: number; name: string }[];
    past: { id: number; name: string; userScore: number }[];
  };
}

export interface Book {
  id: number;
  name: string;
}

export interface BookDetail extends Book {
  score: number | string;
  author: string;
  year: number;
  currentOwner?: User;
}

export interface ApiError {
  error: string;
}
