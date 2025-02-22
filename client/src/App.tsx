import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import {
  Container,
  CssBaseline,
  ThemeProvider,
  createTheme,
} from "@mui/material";
import { Provider } from "react-redux";
import { store } from "./store";
import Navigation from "./components/Navigation";
import UserList from "./components/UserList";
import UserDetail from "./components/UserDetail";
import BookList from "./components/BookList";
import BookDetail from "./components/BookDetail";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#dc004e",
    },
  },
});

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Navigation />
          <Container>
            <Routes>
              <Route path="/" element={<Navigate to="/books" replace />} />
              <Route path="/users" element={<UserList />} />
              <Route path="/users/:id" element={<UserDetail />} />
              <Route path="/books" element={<BookList />} />
              <Route path="/books/:id" element={<BookDetail />} />
            </Routes>
          </Container>
        </Router>
      </ThemeProvider>
    </Provider>
  );
};

export default App;
