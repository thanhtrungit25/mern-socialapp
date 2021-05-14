import React, { useEffect, useState } from 'react';
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
import { Link } from 'react-router-dom';
import { Edit } from '@material-ui/icons';
import { Redirect } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { read } from './api-user';
import { listByUser } from '../post/api-post';
import auth from '../auth/auth-helper';

import DeleteUser from './DeleteUser';
import FollowProfileButton from './FollowProfileButton';
import ProfileTabs from './ProfileTabs';
import FindPeople from './FindPeople';

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 600,
    margin: 'auto',
    textAlign: 'center',
    padding: theme.spacing(3),
    marginTop: theme.spacing(5),
  },
  title: {
    margin: `${theme.spacing(2)}px ${theme.spacing(1)}px 0`,
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
  const [values, setValues] = useState({
    user: { following: [], followers: [] },
    redirectToSignIn: false,
    following: false,
  });
  const [posts, setPosts] = useState([]);
  const jwt = auth.isAuthenticated();

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    read(
      {
        userId: match.params.userId,
      },
      { t: jwt.token },
      signal
    ).then((data) => {
      if (data && data.error) {
        setValues({ ...values, redirectToSignIn: true });
      } else {
        let following = checkFollow(data);
        setValues({ ...values, user: data, following: following });

        loadPosts(data._id);
      }
    });

    return function clearup() {
      abortController.abort();
    };
  }, [match.params.userId]);

  const checkFollow = (user) => {
    const match = user.followers.some((follower) => {
      return follower._id == jwt.user._id;
    });
    return match;
  };

  const clickFollowButton = (callApi) => {
    callApi(
      {
        userId: jwt.user._id,
      },
      {
        t: jwt.token,
      },
      values.user._id
    ).then((data) => {
      if (data.error) {
        console.log(data.error);
        setValues({ ...values, error: data.error });
      } else {
        setValues({
          ...values,
          error: '',
          user: data,
          following: !values.following,
        });
      }
    });
  };

  const loadPosts = (userId) => {
    listByUser(
      {
        userId: userId,
      },
      {
        t: jwt.token,
      }
    ).then((data) => {
      console.log('🐈', data);
      if (data.error) {
        console.log(data.error);
      } else {
        setPosts(data);
      }
    });
  };

  if (values.redirectToSignIn) {
    return <Redirect to='/signin' />;
  }

  const photoUrl = values.user._id
    ? `/api/users/photo/${values.user._id}?${new Date().getTime()}`
    : '/api/users/defaultphoto';

  console.log('😽', posts);
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
          <ListItemText
            primary={values.user.name}
            secondary={values.user.email}
          />
          {auth.isAuthenticated().user &&
          auth.isAuthenticated().user._id == values.user._id ? (
            <ListItemSecondaryAction>
              <Link to={'/user/edit/' + values.user._id}>
                <IconButton aria-label='Edit' color='primary'>
                  <Edit />
                </IconButton>
              </Link>
              <DeleteUser userId={values.user._id} />
            </ListItemSecondaryAction>
          ) : (
            <FollowProfileButton
              onButtonClick={clickFollowButton}
              following={values.following}
            />
          )}
        </ListItem>
        <Divider />
        <ListItem>
          <ListItemText
            primary={values.user.about}
            secondary={'Joined ' + new Date(values.user.created).toDateString()}
          />
        </ListItem>
        <Divider />
        <ProfileTabs user={values.user} posts={posts} />
      </List>
      <FindPeople />
    </Paper>
  );
};

export default Profile;
