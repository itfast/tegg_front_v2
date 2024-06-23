// import { makeStyles, createStyles } from '@material-ui/core/styles';
// import makeStyles from '@mui/styles/makeStyles';
import { createStyles, makeStyles } from '@mui/styles';

const useStyles = makeStyles(theme =>
  createStyles({
    container: {
      display: 'flex',
      height: '100vh',
      width: '100vw',
      justifyContent: 'center',
      alignItems: 'center',
    },
    sectionForm: {
      height: '100vh',
      width: '100vw',
      backgroundColor: theme.palette.background.paper,
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100%',
      position: 'relative',
      padding: theme.spacing(0, 5),
      margin: theme.spacing(0, 5),
      [theme.breakpoints.down('sm')]: {
        margin: theme.spacing(0, 0),
      },
    },
    formError: {
      color: 'red',
    },
    backgroundImage: {
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center center',
    },
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      backgroundColor: 'rgba(255, 255, 255, .75)',
    },
    tipografy: {
      // color: theme.palette.common.white,
      fontWeight: 'bold',
      fontSize: 16,
    },
    logo: {
      animation: '$rotation 0.5s infinite linear',
      // zIndex: theme.zIndex.drawer + 2,
      marginLeft: 15,
      marginRight: 15,
    },
    '@keyframes rotation': {
      from: {
        transform: 'rotate(0deg)',
      },
      to: {
        transform: 'rotate(359deg)',
      },
    },
    formButton: {
      borderRadius: 10,
      padding: '13px 22px',
      '& > span': {
        fontSize: 18,
        fontWeight: 600,
      },
    },
  }),
);

export default useStyles;
