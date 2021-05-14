import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import { Avatar, Typography } from '@material-ui/core';
import { Link } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper,
  },
  gridList: {
    width: 500,
    height: 220,
  },
  bigAvatar: {
    width: 60,
    height: 60,
    margin: 'auto',
  },
  tileText: {
    textAlign: 'center',
    marginTop: 10,
  },
}));

export default function FollowGrid(props) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <GridList cellHeight={160} className={classes.gridList} cols={4}>
        {props.people.map((person, i) => (
          <GridListTile key={i} style={{ height: 120 }}>
            <Link to={`/user/${person._id}`}>
              <Avatar
                src={`/api/users/photo/${person._id}`}
                className={classes.bigAvatar}
              />
            </Link>
            <Typography className={classes.tileText}>{person.name}</Typography>
          </GridListTile>
        ))}
      </GridList>
    </div>
  );
}

FollowGrid.propTypes = {
  people: PropTypes.array.isRequired,
};
