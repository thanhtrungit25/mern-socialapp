import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import CommentIcon from '@material-ui/icons/Comment';
import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import DeleteIcon from '@material-ui/icons/Delete';
import Comments from './Comments';
import { like, remove, unlike } from './api-post';
import auth from '../auth/auth-helper';

const useStyles = makeStyles((theme) => ({
  card: {
    maxWidth: 600,
    margin: 'auto',
    marginBottom: theme.spacing(3),
    backgroundColor: 'rgba(0, 0, 0, 0.06)',
  },
  text: {
    margin: theme.spacing(2),
  },
  media: {
    height: 200,
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  cardHeader: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
  cardContent: {
    backgroundColor: 'white',
    padding: `${theme.spacing(2)}px 0px`,
  },
  button: {},
}));

export default function Post(props) {
  const classes = useStyles();

  const jwt = auth.isAuthenticated();

  const checkLike = (likes) => {
    let match = likes.indexOf(jwt.user._id) !== -1;
    return match;
  };

  const [values, setValues] = useState({
    comments: props.post.comments,
    like: checkLike(props.post.likes),
    likes: props.post.likes.length,
  });

  const updateComments = (comments) => {
    setValues({ ...values, comments: comments });
  };

  const deletePost = () => {
    remove(
      {
        postId: props.post._id,
      },
      {
        t: jwt.token,
      }
    ).then((data) => {
      if (data.error) {
        console.error(data.error);
      } else {
        console.log('Delete post success 😙', props.post);
        props.onRemove(props.post);
      }
    });
  };

  const clickLike = () => {
    let callApi = values.like ? unlike : like;
    callApi(
      {
        userId: jwt.user._id,
      },
      {
        t: jwt.token,
      },
      props.post._id
    ).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        setValues({
          ...values,
          like: !values.like,
          likes: data.likes.length,
        });
      }
    });
  };

  return (
    <Card className={classes.card}>
      <CardHeader
        avatar={<Avatar src={`/api/users/photo/${props.post.postedBy._id}`} />}
        action={
          props.post.postedBy._id === auth.isAuthenticated().user._id && (
            <IconButton>
              <DeleteIcon onClick={deletePost} />
            </IconButton>
          )
        }
        title={props.post.postedBy.name}
        subheader={new Date(props.post.created).toDateString()}
        className={classes.cardHeader}
      />
      <CardContent className={classes.cardContent}>
        <Typography component='p' className={classes.text}>
          {props.post.text}
        </Typography>
        {props.post.photo && (
          <div>
            <img
              className={classes.media}
              src={`/api/posts/photo/${props.post._id}`}
            />
          </div>
        )}
      </CardContent>
      <CardActions disableSpacing>
        {values.like ? (
          <IconButton
            className={classes.button}
            aria-label='Like'
            color='secondary'
            onClick={clickLike}
          >
            <FavoriteIcon />
          </IconButton>
        ) : (
          <IconButton
            className={classes.button}
            aria-label='Unlike'
            color='secondary'
            onClick={clickLike}
          >
            <FavoriteBorderIcon />
          </IconButton>
        )}{' '}
        <span>{values.likes}</span>
        <IconButton
          className={classes.button}
          aria-label='Comment'
          color='secondary'
        >
          <CommentIcon />
        </IconButton>{' '}
        <span>{values.comments.length}</span>
      </CardActions>
      <Divider />
      <Comments
        postId={props.post._id}
        comments={values.comments}
        updateComments={updateComments}
      />
    </Card>
  );
}

Post.propTypes = {
  posts: PropTypes.object.isRequired,
  onRemove: PropTypes.func.isRequired,
};
