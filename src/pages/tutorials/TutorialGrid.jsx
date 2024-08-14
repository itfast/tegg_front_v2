/* eslint-disable no-unused-vars */
/* eslint-disable no-useless-escape */
/* eslint-disable react/prop-types */
import React, { useState } from 'react';
// import Carousel from 'react-elastic-carousel';

import { Typography, Avatar, Grid } from '@mui/material';

import { FaPlay, FaAngleRight, FaAngleLeft } from 'react-icons/fa';
// import { makeStyles, createStyles } from '@material-ui/core/styles';
import { TutorialModal } from './Modal';
import { Dialog } from '@mui/material';
import { Button } from '../../../globalStyles';
import { AvatarContainer } from './TutorialStyles';

function YouTubeGetID(youtubeUrl) {
  let url = youtubeUrl;
  let ID = '';
  url = String(url)
    .replace(/(>|<)/gi, '')
    .split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
  if (url[2] !== undefined) {
    ID = url[2].split(/[^0-9a-z_\-]/i);
    ID = String(ID[0]);
  } else {
    ID = url;
  }
  return ID;
}

// const useStyles = makeStyles(() =>
//   createStyles({
//     div: {
//       width: '100%',
//       height: 200,
//       backgroundColor: '#71717130',
//       display: 'flex',
//       flexWrap: 'wrap',
//       justifyContent: 'center',
//       alignContent: 'center',
//     },
//     avatar: {
//       width: 55,
//       height: 55,
//       backgroundColor: '#2898FF',
//       transition: 'all .3s ease-in-out',
//       '&:hover': {
//         transform: 'scale(1.2)',
//       },
//     },
//     icon: {
//       width: 55,
//       height: 55,
//       color: '#00D959',
//     },
//   }),
// );

function Tutorial({ tutorial, onClick }) {
  // const classes = useStyles();
  const idVideo = YouTubeGetID(tutorial?.media || '');
  return (
    <div style={{ width: 300}}>
      <Typography
        variant='h6'
        component='h6'
        style={{ color: '#00D959', textAlign: 'center' }}
      >
        {tutorial.title}
      </Typography>
      <div
        style={{
          width: '100%',
          height: 200,
          backgroundColor: '#71717130',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          alignContent: 'center',
          backgroundImage:
            idVideo.length > 1
              ? `url("https://i.ytimg.com/vi/${idVideo}/hqdefault.jpg")`
              : '',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <AvatarContainer>
          <Avatar
            onClick={onClick(tutorial)}
            sx={{
              width: 55,
              height: 55,
              backgroundColor: '#00D959',
              transition: 'all 0.3s ease-in-out',
              '&:hover': {
                transform: 'scale(1.2)',
              },
            }}
          >
            <FaPlay />
          </Avatar>
        </AvatarContainer>
      </div>
    </div>
  );
}

export function TutorialGrid({ tutorials }) {
  // const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState();
  const openModal = (tutorial) => {
    return () => {
      setOpen(true);
      setSelected(tutorial);
    };
  };
  

  return (
    <>
      <Grid container spacing={2} style={{display: 'flex', justifyContent: window.innerWidth < 768 ? 'center' : 'start'}}>
        {tutorials.map((tut, idx) => (
          <Grid key={idx} item>
            <Tutorial tutorial={tut} onClick={openModal} />
          </Grid>
        ))}
      </Grid>
      {/* </Carousel> */}
      {selected && (
        <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth='lg'>
          <TutorialModal tutorial={selected} />
        </Dialog>
      )}
    </>
  );
}
