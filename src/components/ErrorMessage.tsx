import React from 'react';
import { Alert, Box } from '@mui/material';

interface ErrorMessageProps {
  message: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => (
  <Box my={2}>
    <Alert severity="error">{message}</Alert>
  </Box>
);

export default ErrorMessage; 