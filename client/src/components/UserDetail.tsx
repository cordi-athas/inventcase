import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Rating,
  Box,
  Divider,
  Chip,
  Paper,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { fetchUserById, returnBook } from "../store/slices/usersSlice";
import LoadingSpinner from "./LoadingSpinner";
import ErrorMessage from "./ErrorMessage";
import "../styles/main.scss";

const UserDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const {
    selectedUser: user,
    loading,
    error,
  } = useAppSelector((state) => state.users);
  const [returnDialogOpen, setReturnDialogOpen] = useState(false);
  const [selectedBookId, setSelectedBookId] = useState<number | null>(null);
  const [selectedBookName, setSelectedBookName] = useState<string>("");
  const [rating, setRating] = useState<number | null>(null);

  useEffect(() => {
    if (id) {
      dispatch(fetchUserById(parseInt(id)));
    }
  }, [dispatch, id]);

  const handleReturn = async () => {
    if (id && selectedBookId !== null && rating !== null) {
      try {
        await dispatch(
          returnBook({
            userId: parseInt(id),
            bookId: selectedBookId,
            score: rating,
          })
        ).unwrap();
        setReturnDialogOpen(false);
        setSelectedBookId(null);
        setSelectedBookName("");
        setRating(null);
        // Refresh user data
        dispatch(fetchUserById(parseInt(id)));
      } catch (error) {
        console.error("Error returning book:", error);
      }
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!user) return <ErrorMessage message="User not found" />;

  return (
    <div className="detail-page">
      <Box mb={4}>
        <Typography variant="h4" gutterBottom>
          {user.name}
        </Typography>
        <Chip
          label={`${user.books.present.length} Books Currently Borrowed`}
          color="primary"
          sx={{ mr: 1 }}
        />
        <Chip
          label={`${user.books.past.length} Books Previously Borrowed`}
          color="secondary"
        />
      </Box>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box mb={3}>
            <Typography variant="h6" color="primary" gutterBottom>
              Currently Borrowed Books
            </Typography>
            <Divider />
          </Box>
          {user.books.present.length === 0 ? (
            <Typography color="textSecondary">
              No books currently borrowed
            </Typography>
          ) : (
            <List>
              {user.books.present.map((book, index) => (
                <Paper elevation={1} sx={{ mb: 2 }} key={index}>
                  <ListItem>
                    <ListItemText
                      primary={book.name}
                      secondary="Currently borrowed"
                    />
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => {
                        setSelectedBookId(book.id);
                        setSelectedBookName(book.name);
                        setReturnDialogOpen(true);
                      }}
                    >
                      Return
                    </Button>
                  </ListItem>
                </Paper>
              ))}
            </List>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Box mb={3}>
            <Typography variant="h6" color="primary" gutterBottom>
              Borrowing History
            </Typography>
            <Divider />
          </Box>
          {user.books.past.length === 0 ? (
            <Typography color="textSecondary">No borrowing history</Typography>
          ) : (
            <List>
              {user.books.past.map((book, index) => (
                <Paper elevation={1} sx={{ mb: 2 }} key={index}>
                  <ListItem>
                    <ListItemText
                      primary={book.name}
                      secondary={
                        <Box display="flex" alignItems="center" gap={1}>
                          <Typography component="span">Your Rating:</Typography>
                          <Rating
                            value={book.userScore}
                            readOnly
                            max={10}
                            size="small"
                          />
                          <Typography component="span">
                            ({book.userScore}/10)
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                </Paper>
              ))}
            </List>
          )}
        </CardContent>
      </Card>

      <Dialog
        open={returnDialogOpen}
        onClose={() => setReturnDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Return Book</DialogTitle>
        <DialogContent>
          <Box py={2}>
            <Typography variant="h6" gutterBottom>
              {selectedBookName}
            </Typography>
            <Typography gutterBottom>How would you rate this book?</Typography>
            <Box display="flex" alignItems="center" gap={2}>
              <Rating
                max={10}
                value={rating}
                onChange={(_, newValue) => setRating(newValue)}
                size="large"
              />
              <Typography>
                {rating ? `${rating}/10` : "Select rating"}
              </Typography>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReturnDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleReturn}
            disabled={rating === null}
            variant="contained"
            color="primary"
          >
            Confirm Return
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default UserDetail;
