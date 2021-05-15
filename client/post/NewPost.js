import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import Button from '@material-ui/core/Button';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import TextField from '@material-ui/core/TextField';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import PhotoCamera from '@material-ui/icons/PhotoCamera';
import auth from '../auth/auth-helper';
import { create } from './api-post';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: '#efefef',
    padding: `${theme.spacing(3)}px 0px 1px`,
  },
  card: {
    maxWidth: 600,
    margin: 'auto',
    marginBottom: theme.spacing(3),
    backgroundColor: 'rgba(65, 150, 136, 0.09)',
    boxShadow: 'none',
  },
  cardHeader: {
    paddingTop: 8,
    paddingBottom: 8,
  },
  cardContent: {
    backgroundColor: 'white',
    paddingTop: 0,
    paddingBottom: 0,
  },
  textField: {
    width: '90%',
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
  },
  input: {
    display: 'none',
  },
  photoButton: {
    height: 20,
  },
  submit: {
    margin: theme.spacing(2),
  },
  filename: {
    verticalAlign: 'super',
  },
}));
export default function NewPost(props) {
  const classes = useStyles();

  const [values, setValues] = useState({
    text: '',
    photo: '',
    error: '',
    user: {},
  });
  const jwt = auth.isAuthenticated();

  useEffect(() => {
    setValues({ ...values, user: auth.isAuthenticated().user });
  }, []);

  const handleChange = (name) => (event) => {
    const value = name === 'photo' ? event.target.files[0] : event.target.value;
    setValues({ ...values, [name]: value });
  };

  const clickPost = () => {
    let postData = new FormData();
    values.text && postData.append('text', values.text);
    values.photo && postData.append('photo', values.photo);
    create(
      {
        userId: jwt.user._id,
      },
      {
        t: jwt.token,
      },
      postData
    ).then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setValues({ ...values, error: '', text: '', photo: '' });
        props.addUpdate(data);
      }
    });
  };

  const photoURL = values.user._id
    ? `/api/users/photo/${values.user._id}`
    : '/api/users/defaultPhoto';

  return (
    <div className={classes.root}>
      <Card className={classes.card}>
        <CardHeader
          avatar={<Avatar src={photoURL} />}
          title={values.user.name}
          className={classes.cardHeader}
        />
        <CardContent className={classes.cardContent}>
          <TextField
            placeholder='Share your thoughts...'
            multiline
            rows='3'
            value={values.text}
            margin='normal'
            className={classes.textField}
            onChange={handleChange('text')}
          />
          <input
            id='icon-button-file'
            accept='image/*'
            type='file'
            className={classes.input}
            onChange={handleChange('photo')}
          />
          <label htmlFor='icon-button-file'>
            <IconButton
              color='secondary'
              className={classes.photoButton}
              component='span'
            >
              <PhotoCamera />
            </IconButton>
          </label>{' '}
          <span className={classes.filename}>
            {values.photo ? values.photo.name : ''}
          </span>
        </CardContent>
        <CardActions>
          <Button
            color='primary'
            variant='contained'
            className={classes.submit}
            disabled={values.text === ''}
            onClick={clickPost}
          >
            Post
          </Button>
        </CardActions>
      </Card>
    </div>
  );
}
