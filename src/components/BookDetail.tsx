import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Typography,
  Card,
  CardContent,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Rating,
  Divider,
  Chip,
  Snackbar,
  Alert,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { fetchBookById } from "../store/slices/booksSlice";
import { fetchUsers, borrowBook } from "../store/slices/usersSlice";
import LoadingSpinner from "./LoadingSpinner";
import ErrorMessage from "./ErrorMessage";
import "../styles/main.scss";

const BookDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const {
    selectedBook: book,
    loading,
    error,
  } = useAppSelector((state) => state.books);
  const { list: users } = useAppSelector((state) => state.users);
  const [borrowDialogOpen, setBorrowDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<string>("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );

  useEffect(() => {
    if (id) {
      dispatch(fetchBookById(parseInt(id)));
      dispatch(fetchUsers());
    }
  }, [dispatch, id]);

  const handleBorrow = async () => {
    if (id && selectedUser) {
      try {
        await dispatch(
          borrowBook({
            userId: parseInt(selectedUser),
            bookId: parseInt(id),
          })
        ).unwrap();

        setBorrowDialogOpen(false);
        setSelectedUser("");

        setSnackbarMessage("Book borrowed successfully!");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);

        await dispatch(fetchBookById(parseInt(id)));
      } catch (error: any) {
        setSnackbarMessage(error.message || "Failed to borrow book");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
        console.error("Error borrowing book:", error);

        setBorrowDialogOpen(false);
        setSelectedUser("");
        await dispatch(fetchBookById(parseInt(id)));
      }
    }
  };

  useEffect(() => {
    if (id) {
      dispatch(fetchBookById(parseInt(id)));
      dispatch(fetchUsers());

      const refreshInterval = setInterval(() => {
        dispatch(fetchBookById(parseInt(id)));
      }, 5000);

      return () => clearInterval(refreshInterval);
    }
  }, [dispatch, id]);

  const handleDialogOpen = () => {
    if (id) {
      dispatch(fetchBookById(parseInt(id)));
    }
    setBorrowDialogOpen(true);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!book) return <ErrorMessage message="Book not found" />;

  const isBookAvailable = !book.currentOwner;

  return (
    <div className="detail-page">
      <Typography variant="h4" gutterBottom>
        {book.name}
      </Typography>

      <Card>
        <CardContent>
          <Box mb={3}>
            <Typography variant="h6" gutterBottom color="primary">
              Book Details
            </Typography>
            <Divider />
          </Box>

          <Box display="grid" gridTemplateColumns="auto 1fr" gap={2} mb={3}>
            <Typography variant="subtitle1">
              <strong>Author:</strong>
            </Typography>
            <Typography>{book.author}</Typography>

            <Typography variant="subtitle1">
              <strong>Publication Year:</strong>
            </Typography>
            <Typography>{book.year}</Typography>

            <Typography variant="subtitle1">
              <strong>Status:</strong>
            </Typography>
            <Typography>
              {book.currentOwner ? (
                <Chip
                  color="secondary"
                  label={`Borrowed by ${book.currentOwner.name}`}
                />
              ) : (
                <Chip color="success" label="Available" />
              )}
            </Typography>
          </Box>

          <Box className="rating-display">
            <Typography variant="subtitle1">
              <strong>Average Rating:</strong>
            </Typography>
            <Rating
              value={Number(book.score)}
              readOnly
              max={10}
              precision={0.5}
              size="large"
            />
            <Typography>
              {book.score === -1 ? "Not rated yet" : `${book.score}/10`}
            </Typography>
          </Box>

          {isBookAvailable && (
            <Box className="action-buttons">
              <Button
                variant="contained"
                color="primary"
                size="large"
                onClick={handleDialogOpen}
              >
                Borrow Book
              </Button>
            </Box>
          )}
        </CardContent>
      </Card>

      <Dialog
        open={borrowDialogOpen}
        onClose={() => setBorrowDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Borrow Book
          {!isBookAvailable && (
            <Typography color="error" variant="caption" display="block">
              This book is no longer available
            </Typography>
          )}
        </DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Select User</InputLabel>
            <Select
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              label="Select User"
              disabled={!isBookAvailable}
            >
              {users.map((user) => (
                <MenuItem key={user.id} value={user.id}>
                  {user.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBorrowDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleBorrow}
            disabled={!selectedUser || !isBookAvailable}
            variant="contained"
            color="primary"
          >
            Confirm Borrow
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default BookDetail;
