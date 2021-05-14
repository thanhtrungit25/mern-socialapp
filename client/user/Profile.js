import {
  Avatar,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
  Paper,
  Typography,
} from '@material-ui/core';
import { Edit } from '@material-ui/icons';
import React, { useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import auth from '../auth/auth-helper';
import { Link } from 'react-router-dom';
import { read } from './api-user';
import DeleteUser from './DeleteUser';

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 600,
    margin: 'auto',
    textAlign: 'center',
    padding: theme.spacing(3),
    marginTop: theme.spacing(5),
  },
  title: {
    marginTop: theme.spacing(3),
    color: theme.palette.protectedTitle,
  },
  bigAvatar: {
    width: 60,
    height: 60,
    margin: 10,
  },
}));

const Profile = ({ match }) => {
  const classes = useStyles();
  const [user, setUser] = useState({});
  const [redirectToSignIn, setRedirectToSignIn] = useState(false);

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;
    const jwt = auth.isAuthenticated();

    read(
      {
        userId: match.params.userId,
      },
      { t: jwt.token },
      signal
    ).then((data) => {
      if (data && data.error) {
        setRedirectToSignIn(true);
      } else {
        setUser(data);
      }
    });

    return function clearup() {
      abortController.abort();
    };
  }, [match.params.userId]);

  if (redirectToSignIn) {
    return <Redirect to='/signin' />;
  }

  console.log(user);

  const photoUrl = user._id
    ? `/api/users/photo/${user._id}?${new Date().getTime()}`
    : '/api/users/defaultphoto';

  return (
    <Paper elevation={4} className={classes.root}>
      <Typography variant='h6' className={classes.title}>
        Profile
      </Typography>
      <List>
        <ListItem>
          <ListItemAvatar>
            <Avatar src={photoUrl} className={classes.bigAvatar} />
          </ListItemAvatar>
          <ListItemText primary={user.name} secondary={user.email} />
          {auth.isAuthenticated().user &&
            auth.isAuthenticated().user._id == user._id && (
              <ListItemSecondaryAction>
                <Link to={'/user/edit/' + user._id}>
                  <IconButton aria-label='Edit' color='primary'>
                    <Edit />
                  </IconButton>
                </Link>
                <DeleteUser userId={user._id} />
              </ListItemSecondaryAction>
            )}
        </ListItem>
        <Divider />
        <ListItem>
          <ListItemText
            primary={user.about}
            secondary={'Joined ' + new Date(user.created).toDateString()}
          />
        </ListItem>
      </List>
    </Paper>
  );
};

export default Profile;
