import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Button,
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import React, { useState } from 'react';
import auth from '../auth/auth-helper';
import { remove } from './api-user';
import { Redirect } from 'react-router-dom';

const DeleteUser = (props) => {
  const [open, setOpen] = useState(false);
  const [redirect, setRedirect] = useState(false);

  const clickButton = () => {
    setOpen(true);
  };

  const handleRequestClose = () => {
    setOpen(false);
  };

  const deleteAccount = () => {
    const jwt = auth.isAuthenticated();
    remove(
      {
        userId: props.userId,
      },
      { t: jwt.token }
    ).then((data) => {
      if (data && data.error) {
        console.log(data.error);
      } else {
        auth.clearJWT(() => console.log('deleted'));
        setRedirect(true);
      }
    });
  };

  if (redirect) {
    return <Redirect to='/' />;
  }

  return (
    <span>
      <IconButton aria-label='Delete' color='secondary' onClick={clickButton}>
        <DeleteIcon />
      </IconButton>

      <Dialog open={open} onClose={handleRequestClose}>
        <DialogTitle>{'Delete Account'}</DialogTitle>
        <DialogContent>
          <DialogContentText>Confirm to delete your account.</DialogContentText>
          <DialogActions>
            <Button onClick={handleRequestClose} color='primary'>
              Cancel
            </Button>
            <Button onClick={deleteAccount} color='secondary'>
              Confirm
            </Button>
          </DialogActions>
        </DialogContent>
      </Dialog>
    </span>
  );
};

export default DeleteUser;
