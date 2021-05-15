import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import CardHeader from '@material-ui/core/CardHeader';
import TextField from '@material-ui/core/TextField';
import Avatar from '@material-ui/core/Avatar';
import auth from '../auth/auth-helper';
import { Link } from 'react-router-dom';
import { Icon } from '@material-ui/core';
import { comment, uncomment } from './api-post';

const useStyles = makeStyles((theme) => ({
  cardHeader: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
  commentField: {
    width: '96%',
  },
  commentBody: {
    backgroundColor: 'white',
    padding: theme.spacing(1),
    margin: `2px ${theme.spacing(2)}px 2px 2px`,
  },
  commentDate: {
    display: 'block',
    color: 'gray',
    fontSize: '0.8em',
  },
  commentDelete: {
    fontSize: '1.6em',
    verticalAlign: 'middle',
    cursor: 'pointer',
  },
}));

export default function Comments(props) {
  const classes = useStyles();
  const [text, setText] = useState('');
  const jwt = auth.isAuthenticated();

  const handleChange = (event) => {
    setText(event.target.value);
  };

  const addComment = (event) => {
    if (event.keyCode === 13 && event.target.value) {
      event.preventDefault();
      comment(
        {
          userId: jwt.user._id,
        },
        {
          t: jwt.token,
        },
        props.postId,
        { text: text }
      ).then((data) => {
        if (data.error) {
          console.log(data.error);
        } else {
          console.log('🐈 addComment success', data);
          setText('');
          props.updateComments(data.comments);
        }
      });
    }
  };

  const deleteComment = (comment) => (event) => {
    uncomment(
      {
        userId: jwt.user._id,
      },
      {
        t: jwt.token,
      },
      props.postId,
      comment
    ).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        props.updateComments(data.comments);
      }
    });
  };

  const commentBody = (item) => {
    return (
      <p className={classes.commentBody}>
        <Link to={`/user/${item.postedBy._id}`}>{item.postedBy.name}</Link>
        <br />
        {item.text}
        <span className={classes.commentDate}>
          {new Date(item.created).toDateString()}
          {auth.isAuthenticated().user._id === item.postedBy._id && (
            <Icon
              className={classes.commentDelete}
              onClick={deleteComment(item)}
            >
              delete
            </Icon>
          )}
        </span>
      </p>
    );
  };

  return (
    <div>
      <CardHeader
        avatar={
          <Avatar src={`/api/users/photo/${auth.isAuthenticated().user._id}`} />
        }
        title={
          <TextField
            placeholder='Write Something...'
            className={classes.commentField}
            margin='normal'
            value={text}
            onChange={handleChange}
            onKeyDown={addComment}
          />
        }
        className={classes.cardHeader}
      />
      {props.comments.map((item, i) => {
        return (
          <CardHeader
            key={i}
            avatar={<Avatar src={`/api/users/photo/${item.postedBy._id}`} />}
            title={commentBody(item)}
            className={classes.cardHeader}
          />
        );
      })}
    </div>
  );
}

Comments.propTypes = {
  postId: PropTypes.string.isRequired,
  comments: PropTypes.array.isRequired,
  updateComments: PropTypes.func.isRequired,
};
