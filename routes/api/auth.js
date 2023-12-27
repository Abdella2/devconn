const express = require('express');
const auth = require('../../middlewares/auth');
const User = require('../../models/User');

const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    return res.json(user);
  } catch (err) {
    console.log(err.message);
    return res.status(500).send('Server error.');
  }
});

module.exports = router;
