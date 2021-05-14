import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '@material-ui/core';
import { follow, unfollow } from './api-user';

const FollowProfileButton = (props) => {
  const unfollowClick = () => {
    props.onButtonClick(unfollow);
  };

  const followClick = () => {
    props.onButtonClick(follow);
  };

  return (
    <div>
      {props.following ? (
        <Button variant='contained' color='secondary' onClick={unfollowClick}>
          Unfollow
        </Button>
      ) : (
        <Button variant='contained' color='primary' onClick={followClick}>
          Follow
        </Button>
      )}
    </div>
  );
};

FollowProfileButton.propTypes = {
  following: PropTypes.bool.isRequired,
  onButtonClick: PropTypes.func.isRequired,
};

export default FollowProfileButton;
