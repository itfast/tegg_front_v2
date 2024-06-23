import { Box, Grid, Typography, Backdrop } from '@mui/material';
import { LoadingContainer } from './Loading.style';

// eslint-disable-next-line react/prop-types
export function Loading({ open, msg }) {
  return (
    <Backdrop
      style={{
        zIndex: 9999,
        backgroundColor: 'rgba(0,0,0,.75)',
        // width: '100%'
      }}
      id='backdrop'
      open={open}
    >
      <Grid
        container
        spacing={0}
        style={{ alignItems: 'center', justifyContent: 'center' }}
        id='name1'
      >
        <Grid
          item
          xs={12}
          alignItems='center'
          container
          spacing={3}
          id='name2'
        >
          <Box
            width='100vw'
            display='flex'
            justifyContent='center'
            alignItems='center'
          >
            <LoadingContainer>
              <img
                src='/assets/tegg-logo.png'
                alt='icon'
                width='100'
                height='100'
                className='image'
              />
            </LoadingContainer>
          </Box>
        </Grid>
        <Grid
          style={{ marginTop: 20 }}
          item
          xs={12}
          container
          spacing={3}
        >
          <Box
            width='100vw'
            display='flex'
            justifyContent='center'
            alignItems='center'
          >
            {msg && (
              <Typography
                style={{
                  fontWeight: 'bold',
                  fontSize: 16,
                  color: '#00D959'
                }}
              >
                {msg}
              </Typography>
            )}
          </Box>
        </Grid>
      </Grid>
    </Backdrop>
  );
}
