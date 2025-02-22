export interface ApiError {
  error: string;
}

export interface ApiResponse<T> {
  data: T;
}

export interface UserResponse {
  id: number;
  name: string;
}

export interface UserDetailResponse extends UserResponse {
  books: {
    present: BookBasicInfo[];
    past: BookWithScore[];
  };
}

export interface BookBasicInfo {
  id: number;
  name: string;
}

export interface BookWithScore extends BookBasicInfo {
  userScore: number;
}

export interface BookDetailResponse extends BookBasicInfo {
  author: string;
  year: number;
  score: number | string;
  currentOwner?: UserResponse;
}

export const calculateAverageScore = (scores: number[]): string | number => {
  if (!scores.length) return -1;
  const sum = scores.reduce((a, b) => a + b, 0);
  return (sum / scores.length).toFixed(2);
};
