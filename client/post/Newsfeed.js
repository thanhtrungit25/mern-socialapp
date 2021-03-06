import React, { useEffect, useState } from 'react';
import { Card, Divider, Typography } from '@material-ui/core';
import { listNewsFeed } from './api-post';
import { makeStyles } from '@material-ui/core/styles';
import auth from '../auth/auth-helper';

import PostList from './PostList';
import NewPost from './NewPost';

const useStyles = makeStyles((theme) => ({
  card: {
    margin: 'auto',
    paddingTop: 0,
    paddingBottom: theme.spacing(3),
  },
  title: {
    padding: `${theme.spacing(3)}px ${theme.spacing(2.5)}px ${theme.spacing(
      2
    )}px`,
    color: theme.palette.openTitle,
    fontSize: '1em',
  },
  media: {
    minHeight: 330,
  },
}));

const Newsfeed = () => {
  const classes = useStyles();
  const [posts, setPosts] = useState([]);

  const jwt = auth.isAuthenticated();

  useEffect(() => {
    listNewsFeed(
      {
        userId: jwt.user._id,
      },
      {
        t: jwt.token,
      }
    ).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        setPosts(data);
      }
    });
  }, []);

  const addPost = (post) => {
    const updatedPosts = [...posts];
    updatedPosts.unshift(post);
    setPosts(updatedPosts);
  };

  const removePost = (post) => {
    const updatedPosts = [...posts];
    const index = updatedPosts.indexOf(post);
    updatedPosts.splice(index, 1);
    setPosts(updatedPosts);
  };

  return (
    <Card>
      <Typography type='title' className={classes.title}>
        Newsfeed
      </Typography>
      <Divider />
      <NewPost addUpdate={addPost} />
      <Divider />
      <PostList removeUpdate={removePost} posts={posts} />
    </Card>
  );
};

export default Newsfeed;
