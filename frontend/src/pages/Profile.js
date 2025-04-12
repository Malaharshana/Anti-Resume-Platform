import React from 'react';
import { Typography, Container } from '@mui/material';

const Profile = () => {
  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        My Profile
      </Typography>
      <Typography>This is your profile page.</Typography>
    </Container>
  );
};

export default Profile;
