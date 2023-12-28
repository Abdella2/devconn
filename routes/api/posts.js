const express = require('express');
const { body, validationResult } = require('express-validator');

const auth = require('../../middlewares/auth');
const Pst = require('../../models/Post');
const User = require('../../models/User');

const router = express.Router();

// @desc Create a post
router.post(
  '/',
  [auth, [body('text', 'Text is required').notEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    try {
      const user = await User.findById(req.user.id);

      const post = await Pst({
        text: req.body.text,
        user: req.user.id,
        name: user.name,
        avatar: user.avatar
      });

      await post.save();

      return res.json(post);
    } catch (err) {
      console.error(err.message);
      return res.status(500).send('Server error');
    }
  }
);

// @desc Get all posts
router.get('/', auth, async (req, res) => {
  try {
    const posts = await Pst.find().sort({ date: -1 });
    return res.json(posts);
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('Server error');
  }
});

// @desc Get post by id
router.get('/:id', auth, async (req, res) => {
  try {
    const post = await Pst.findById(req.params.id);

    if (!post) return res.status(404).json({ msg: 'Post not found.' });
    return res.json(post);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId')
      return res.status(404).json({ msg: 'Post not found.' });
    return res.status(500).send('Server error');
  }
});

module.exports = router;
