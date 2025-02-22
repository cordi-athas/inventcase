import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Book, BookDetail } from "../../types";
import { bookService } from "../../services/api";

interface BooksState {
  list: Book[];
  selectedBook: BookDetail | null;
  loading: boolean;
  error: string | null;
}

const initialState: BooksState = {
  list: [],
  selectedBook: null,
  loading: false,
  error: null,
};

export const fetchBooks = createAsyncThunk("books/fetchBooks", async () => {
  return await bookService.getBooks();
});

export const fetchBookById = createAsyncThunk(
  "books/fetchBookById",
  async (bookId: number) => {
    return await bookService.getBook(bookId);
  }
);

const booksSlice = createSlice({
  name: "books",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBooks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBooks.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchBooks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch books";
      })
      .addCase(fetchBookById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBookById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedBook = action.payload;
      })
      .addCase(fetchBookById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch book";
      });
  },
});

export default booksSlice.reducer;
