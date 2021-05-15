import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Grid,
  Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import unicornbikeImg from '../assets/images/unicornbike.jpg';
import auth from '../auth/auth-helper';

import Newsfeed from '../post/Newsfeed';
import FindPeople from '../user/FindPeople';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    margin: 30,
  },
  card: {
    maxWidth: 600,
    margin: 'auto',
    marginTop: theme.spacing(5),
    marginBottom: theme.spacing(5),
  },
  title: {
    padding: `${theme.spacing(3)}px ${theme.spacing(2.5)}px ${theme.spacing(
      2
    )}px`,
    color: theme.palette.openTitle,
  },
  media: {
    minHeight: 400,
  },
}));

const Home = ({ history }) => {
  const classes = useStyles();
  const [defaultPage, setDefaultPage] = useState(false);

  useEffect(() => {
    setDefaultPage(auth.isAuthenticated());
    const unlisten = history.listen(() => {
      setDefaultPage(auth.isAuthenticated());
    });
    return () => {
      unlisten();
    };
  }, []);

  console.log('🐈', defaultPage);

  return (
    <div className={classes.root}>
      {!defaultPage && (
        <Card className={classes.card}>
          <Typography variant='h6' className={classes.title}>
            Home Page
          </Typography>
          <CardMedia
            className={classes.media}
            image={unicornbikeImg}
            title='Unicorn Bicycle'
          />
          <CardContent>
            <Typography variant='body2' component='p'>
              Welcome to the MERN Skeleton home page.
            </Typography>
          </CardContent>
        </Card>
      )}
      {defaultPage && (
        <Grid container spacing={8}>
          <Grid item xs={8} sm={7}>
            <Newsfeed />
          </Grid>
          <Grid item xs={6} sm={5}>
            <FindPeople />
          </Grid>
        </Grid>
      )}
    </div>
  );
};

export default Home;
