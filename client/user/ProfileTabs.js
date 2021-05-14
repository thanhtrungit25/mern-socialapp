import React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { AppBar, Typography } from '@material-ui/core';
import FollowGrid from './FollowGrid';

export default function ProfileTabs(props) {
  const [tab, setTab] = React.useState(1);

  const handleTabChange = (event, newValue) => {
    setTab(newValue);
  };

  return (
    <div>
      <AppBar position='static' color='default'>
        <Tabs
          value={tab}
          onChange={handleTabChange}
          indicatorColor='primary'
          textColor='primary'
          variant='fullWidth'
        >
          <Tab label='Posts' />
          <Tab label='Following' />
          <Tab label='Followers' />
        </Tabs>
      </AppBar>
      {tab === 0 && 'Posts'}
      {tab === 1 && (
        <TabContainer>
          <FollowGrid people={props.user.following} />
        </TabContainer>
      )}
      {tab === 2 && (
        <TabContainer>
          <FollowGrid people={props.user.followers} />
        </TabContainer>
      )}
    </div>
  );
}

ProfileTabs.propTypes = {
  user: PropTypes.object.isRequired,
};

const TabContainer = (props) => {
  return (
    <Typography component='div' style={{ padding: 8 * 2 }}>
      {props.children}
    </Typography>
  );
};

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
};
