import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { AppBar, Toolbar, Typography, Button, Container } from "@mui/material";

const Navigation: React.FC = () => {
  return (
    <AppBar position="static" sx={{ mb: 4 }}>
      <Container>
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            component={RouterLink}
            to="/"
            sx={{
              flexGrow: 1,
              textDecoration: "none",
              color: "inherit",
            }}
          >
            Library Management
          </Typography>
          <Button
            component={RouterLink}
            to="/users"
            color="inherit"
            sx={{ mx: 1 }}
          >
            Users
          </Button>
          <Button
            component={RouterLink}
            to="/books"
            color="inherit"
            sx={{ mx: 1 }}
          >
            Books
          </Button>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navigation;
