import axios from "axios";
import { User, UserDetail, Book, BookDetail } from "../types";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const userService = {
  getUsers: () => api.get<User[]>("/users").then((res) => res.data),
  getUser: (id: number) =>
    api.get<UserDetail>(`/users/${id}`).then((res) => res.data),
  borrowBook: (userId: number, bookId: number) =>
    api.post(`/users/${userId}/borrow/${bookId}`),
  returnBook: (userId: number, bookId: number, score?: number) =>
    api.post(`/users/${userId}/return/${bookId}`, { score }),
};

export const bookService = {
  getBooks: () => api.get<Book[]>("/books").then((res) => res.data),
  getBook: (id: number) =>
    api.get<BookDetail>(`/books/${id}`).then((res) => res.data),
};

// Error handling interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.error || "An unexpected error occurred";
    return Promise.reject(new Error(message));
  }
);
