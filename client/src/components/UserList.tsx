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
import { fetchUsers } from "../store/slices/usersSlice";
import LoadingSpinner from "./LoadingSpinner";
import ErrorMessage from "./ErrorMessage";
import "../styles/main.scss";

const UserList: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const {
    list: users,
    loading,
    error,
  } = useAppSelector((state) => state.users);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <Container className="user-grid">
      <Box mb={4}>
        <Typography variant="h4" gutterBottom>
          Library Members
        </Typography>
        <Typography variant="subtitle1" color="textSecondary">
          {users.length} registered members
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {users.map((user) => (
          <Grid item xs={12} sm={6} md={4} key={user.id}>
            <Card>
              <CardActionArea onClick={() => navigate(`/users/${user.id}`)}>
                <CardContent>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="flex-start"
                    mb={1}
                  >
                    <Typography variant="h6" component="div" gutterBottom>
                      {user.name}
                    </Typography>
                    <Chip
                      label={`ID: ${user.id}`}
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
                    Click to view borrowing history and manage books
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

export default UserList;
