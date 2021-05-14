import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import TextField from '@material-ui/core/TextField';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import CommentIcon from '@material-ui/icons/Comment';
import FavoriteIcon from '@material-ui/icons/Favorite';
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
  commentField: {
    width: '96%',
  },
}));

export default function RecipeReviewCard(props) {
  const classes = useStyles();

  return (
    <Card className={classes.card}>
      <CardHeader
        avatar={<Avatar src={`/api/users/photo/${props.post.postedBy._id}`} />}
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
        <IconButton
          className={classes.button}
          aria-label='Like'
          color='secondary'
        >
          <FavoriteIcon />
        </IconButton>
        <IconButton
          className={classes.button}
          aria-label='Comment'
          color='secondary'
        >
          <CommentIcon />
        </IconButton>
      </CardActions>
      <Divider />
      <CardHeader
        avatar={
          <Avatar src={`/api/users/photo/${auth.isAuthenticated().user._id}`} />
        }
        title={
          <TextField
            placeholder='Write Something...'
            className={classes.commentField}
            margin='normal'
          />
        }
        className={classes.cardHeader}
      />
    </Card>
  );
}
