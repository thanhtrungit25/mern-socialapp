import fs from 'fs';
import Post from '../models/post.model';
import formidable from 'formidable';
import errorHandler from '../helpers/dbErrorHandler';

const listNewsFeed = async (req, res, next) => {
  let following = req.profile.following;
  following.push(req.profile._id);

  try {
    let posts = await Post.find({
      postedBy: { $in: req.profile.following },
    })
      .populate('comments.postedBy', '_id name')
      .populate('postedBy', '_id name')
      .sort('-created')
      .exec();

    res.json(posts);
  } catch (error) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(error),
    });
  }
};

const listByUser = async (req, res, next) => {
  try {
    let posts = await Post.find({ postedBy: req.profile._id })
      .populate('comments.postedBy', '_id name')
      .populate('postedBy', '_id name')
      .sort('-created')
      .exec();

    res.json(posts);
  } catch (error) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(error),
    });
  }
};

const create = async (req, res, next) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: 'Image could not be upload',
      });
    }
    try {
      let post = new Post(fields);
      if (files.photo) {
        post.photo.data = fs.readFileSync(files.photo.path);
        post.photo.contentType = files.photo.type;
      }
      post.postedBy = req.profile;
      const result = await post.save();
      res.json(result);
    } catch (error) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(error),
      });
    }
  });
};

const postByID = async (req, res, next, id) => {
  try {
    let post = await Post.findById(id).populate('postedBy', '_id name').exec();
    if (!post) {
      return res.status(400).json({
        error: 'Post not found',
      });
    }
    req.post = post;
    next();
  } catch (error) {
    return res.status(400).json({
      error: 'Could not retrieve user post',
    });
  }
};

const photo = (req, res, next) => {
  res.set('Content-Type', req.post.photo.contentType);
  return res.send(req.post.photo.data);
};

export default {
  listNewsFeed,
  listByUser,
  create,
  photo,
  postByID,
};
