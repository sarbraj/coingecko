import { Box, Typography } from '@mui/material';
import CryptoTable from '../components/CryptoTable/CryptoTable';
import { FunctionComponent } from 'react';

const HomePage: FunctionComponent = () => {
  return (
    <Box>
      <Typography 
        variant="h4" 
        component="h1" 
        gutterBottom
        fontWeight="700"
        sx={{ 
          color: 'text.primary',
          letterSpacing: '-0.02em',
          mb: 3,
        }}
      >
        Cryptocurrency Market
      </Typography>
      <CryptoTable />
    </Box>
  );
};

export default HomePage;
