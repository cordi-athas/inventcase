import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Container,
  CardActionArea,
  Chip,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { fetchBooks } from "../store/slices/booksSlice";
import LoadingSpinner from "./LoadingSpinner";
import ErrorMessage from "./ErrorMessage";
import "../styles/main.scss";

const BookList: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const {
    list: books,
    loading,
    error,
  } = useAppSelector((state) => state.books);

  useEffect(() => {
    dispatch(fetchBooks());
  }, [dispatch]);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <Container className="book-grid">
      <Box mb={4}>
        <Typography variant="h4" gutterBottom>
          Library Books
        </Typography>
        <Typography variant="subtitle1" color="textSecondary">
          {books.length} books available in the library
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {books.map((book) => (
          <Grid item xs={12} sm={6} md={4} key={book.id}>
            <Card>
              <CardActionArea onClick={() => navigate(`/books/${book.id}`)}>
                <CardContent>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="flex-start"
                    mb={1}
                  >
                    <Typography variant="h6" component="div" gutterBottom>
                      {book.name}
                    </Typography>
                    <Chip
                      label={`ID: ${book.id}`}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  </Box>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    sx={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                    }}
                  >
                    Click to view details, borrow, or check availability
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default BookList;
