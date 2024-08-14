/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from 'react';
import { Typography, Grid, Box } from '@mui/material';
import { Video } from './Video';

export function TutorialModal({ tutorial }) {
  return (
    <div>
      <Box
        display='flex'
        sx={{
          width: '100%',
          marginTop: '0.5rem',
          backgroundColor: '#FFF',
          margin: 'auto',
          padding: '15px',
        }}
        flexDirection='column'
      >
        <Grid container>
          <Grid item xs={12}>
            <Typography variant='h6' component='h6'>
              {tutorial?.section}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography
              variant='h5'
              component='h5'
              style={{ color: '#00D959' }}
            >
              {tutorial?.title}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <div style={{ minHeight: window.innerWidth > 768 && '500px', margin: '10px 0' }}>
              <Video url={tutorial?.media} />
            </div>
          </Grid>
          <Grid item xs={12}>
            <Typography variant='body1'>{tutorial?.subject}</Typography>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
}

export default TutorialModal;
