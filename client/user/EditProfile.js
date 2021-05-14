import React, { useState, useEffect } from 'react';
import {
  Avatar,
  Button,
  Card,
  CardActions,
  CardContent,
  Icon,
  TextField,
  Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Redirect } from 'react-router';
import auth from '../auth/auth-helper';
import { read, update } from './api-user';
import FileUploadIcon from '@material-ui/icons/AddPhotoAlternate';

const useStyles = makeStyles((theme) => ({
  card: {
    maxWidth: 600,
    margin: 'auto',
    textAlign: 'center',
    marginTop: theme.spacing(5),
    paddingBottom: theme.spacing(2),
  },
  error: {
    verticalAlign: 'middle',
  },
  title: {
    marginTop: theme.spacing(2),
    color: theme.palette.protectedTitle,
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 300,
  },
  submit: {
    margin: 'auto',
    marginBottom: theme.spacing(2),
  },
  bigAvatar: {
    width: 60,
    height: 60,
    margin: 'auto',
  },
  input: {
    display: 'none',
  },
  filename: {
    marginLeft: 10,
  },
}));

const EditProfile = ({ match }) => {
  const classes = useStyles();
  const [values, setValues] = useState({
    id: '',
    name: '',
    about: '',
    photo: '',
    email: '',
    password: '',
    error: '',
    redirectToProfile: false,
  });
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
        setValues({ ...values, error: data.error });
      } else {
        setValues({
          ...values,
          id: data._id,
          name: data.name,
          about: data.about,
          email: data.email,
        });
      }
    });

    return function clearup() {
      abortController.abort();
    };
  }, [match.params.userId]);

  const handleChange = (name) => (event) => {
    const value = name === 'photo' ? event.target.files[0] : event.target.value;
    setValues({ ...values, [name]: value });
  };

  const clickSubmit = () => {
    let userData = new FormData();
    values.name && userData.append('name', values.name);
    values.email && userData.append('email', values.email);
    values.about && userData.append('about', values.about);
    values.password && userData.append('password', values.password);
    values.photo && userData.append('photo', values.photo);

    update(
      {
        userId: match.params.userId,
      },
      { t: jwt.token },
      userData
    ).then((data) => {
      if (data && data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setValues({
          ...values,
          error: '',
          userId: data._id,
          redirectToProfile: true,
        });
      }
    });
  };

  if (values.redirectToProfile) {
    return <Redirect to={`/user/${values.userId}`} />;
  }

  const photoUrl = values.id
    ? `/api/users/photo/${values.id}?${new Date().getTime()}`
    : '/api/users/defaultphoto';

  return (
    <div>
      <Card className={classes.card}>
        <CardContent>
          <Typography variant='h6' className={classes.title}>
            Edit Profile
          </Typography>
          <Avatar src={photoUrl} className={classes.bigAvatar} />
          <input
            accept='image/*'
            onChange={handleChange('photo')}
            type='file'
            className={classes.input}
            id='icon-button-file'
          />
          <label htmlFor='icon-button-file'>
            <Button
              style={{ marginTop: 10 }}
              variant='contained'
              color='default'
              component='span'
            >
              Upload <FileUploadIcon />
            </Button>
          </label>
          <span className={classes.filename}>
            {values.photo ? values.photo.name : ''}
          </span>
          <br />
          <TextField
            id='name'
            label='Name'
            margin='normal'
            className={classes.textField}
            value={values.name}
            onChange={handleChange('name')}
          />
          <br />
          <TextField
            id='about'
            label='About'
            margin='normal'
            className={classes.textField}
            value={values.about}
            onChange={handleChange('about')}
          />
          <br />
          <TextField
            id='email'
            type='email'
            label='Email'
            margin='normal'
            className={classes.textField}
            value={values.email}
            onChange={handleChange('email')}
          />
          <br />
          <TextField
            id='password'
            type='password'
            label='Password'
            margin='normal'
            className={classes.textField}
            value={values.password}
            onChange={handleChange('password')}
          />
          <br />
          {values.error && (
            <Typography component='p' color='error'>
              <Icon color='error' className={classes.error}>
                error
              </Icon>
              {values.error}
            </Typography>
          )}
        </CardContent>
        <CardActions>
          <Button
            color='primary'
            variant='contained'
            className={classes.submit}
            onClick={clickSubmit}
          >
            Submit
          </Button>
        </CardActions>
      </Card>
    </div>
  );
};

export default EditProfile;
