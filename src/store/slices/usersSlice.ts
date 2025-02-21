import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { User, UserDetail } from "../../types";
import { userService } from "../../services/api";

interface UsersState {
  list: User[];
  selectedUser: UserDetail | null;
  loading: boolean;
  error: string | null;
}

const initialState: UsersState = {
  list: [],
  selectedUser: null,
  loading: false,
  error: null,
};

export const fetchUsers = createAsyncThunk("users/fetchUsers", async () => {
  return await userService.getUsers();
});

export const fetchUserById = createAsyncThunk(
  "users/fetchUserById",
  async (userId: number) => {
    return await userService.getUser(userId);
  }
);

export const borrowBook = createAsyncThunk(
  "users/borrowBook",
  async ({ userId, bookId }: { userId: number; bookId: number }) => {
    await userService.borrowBook(userId, bookId);
    return await userService.getUser(userId);
  }
);

export const returnBook = createAsyncThunk(
  "users/returnBook",
  async ({
    userId,
    bookId,
    score,
  }: {
    userId: number;
    bookId: number;
    score?: number;
  }) => {
    await userService.returnBook(userId, bookId, score);
    return await userService.getUser(userId);
  }
);

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch users";
      })
      .addCase(fetchUserById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedUser = action.payload;
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch user";
      })
      .addCase(borrowBook.fulfilled, (state, action) => {
        state.selectedUser = action.payload;
      })
      .addCase(returnBook.fulfilled, (state, action) => {
        state.selectedUser = action.payload;
      });
  },
});

export default usersSlice.reducer;
