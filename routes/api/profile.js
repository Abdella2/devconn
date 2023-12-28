const express = require('express');
const { body, validationResult } = require('express-validator');

const auth = require('../../middlewares/auth');
const Profile = require('../../models/Profile');

const router = express.Router();

router.get('/me', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id }).populate(
      'user',
      ['name', 'avatar']
    );
    if (!profile)
      return res.status(400).json({ msg: 'There is no profile for this user' });

    return res.json(profile);
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('Server error');
  }
});

// @desc get profile by userId
router.get('/users/:user_id', async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.params.user_id
    }).populate('user', 'name avatar');
    if (!profile) return res.status(404).json({ msg: 'Profile not found' });

    return res.json(profile);
  } catch (err) {
    console.error(err.message);
    if ((err.kind = 'ObjectId'))
      return res.status(404).json({ msg: 'Profile not found' });
    return res.status(500).send('Server error');
  }
});

// @desc get all profiles
router.get('/', async (req, res) => {
  try {
    const profiles = await Profile.find().populate('user', 'name avatar');
    return res.json(profiles);
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('Server error');
  }
});

// @desc Create or update user profile
router.post(
  '/',
  [
    auth,
    body('status', 'Status is required').notEmpty(),
    body('skills', 'You should have to include at least one skill').notEmpty()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const {
      company,
      website,
      location,
      status,
      skills,
      bio,
      githubusername,
      youtube,
      twitter,
      facebook,
      linkedin,
      instagram
    } = req.body;

    const profile = {};
    profile.user = req.user.id;
    if (company) profile.company = company;
    if (website) profile.website = website;
    if (location) profile.location = location;
    if (status) profile.status = status;
    if (bio) profile.bio = bio;
    if (githubusername) profile.githubusername = githubusername;
    if (skills) profile.skills = skills.split(',').map((skill) => skill.trim());

    profile.social = {};
    if (youtube) profile.social = youtube;
    if (twitter) profile.social = twitter;
    if (facebook) profile.social = facebook;
    if (linkedin) profile.social = linkedin;
    if (instagram) profile.social = instagram;

    try {
      let profileInDB = await Profile.findOne({ user: req.user.id });
      if (profileInDB) {
        profileInDB = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profile },
          { new: true }
        );
        return res.json(profileInDB);
      }

      profileInDB = new Profile(profile);
      await profileInDB.save();

      return res.json(profileInDB);
    } catch (err) {
      console.error(err.message);
      return res.status(500).send('Server error');
    }
  }
);

// @desc Delete profile, user and posts
router.delete('/', auth, async (req, res) => {
  try {
    await Profile.deleteOne({ user: req.user.id });
    await User.deleteOne({ _id: req.user.id });

    return res.json({ msg: 'User deleted' });
  } catch (err) {
    console.log(err.message);
    return res.status(500).send('Server error');
  }
});

// @desc Add profile experience
router.put(
  '/experience',
  [
    auth,
    [
      body('title', 'Title is required').notEmpty(),
      body('company', 'Company is required').notEmpty(),
      body('from', 'From date is required').notEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const { title, company, location, from, to, current, description } =
      req.body;

    const newExp = { title, company, location, from, to, current, description };

    try {
      const profile = await Profile.findOne({ user: req.user.id });

      profile.experience.unshift(newExp);
      await profile.save();

      return res.json(profile);
    } catch (err) {
      console.error(err.message);
      return res.status(500).send('Server error');
    }
  }
);

// @desc Delete profile experience
router.delete('/experience/:exp_id', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });

    const index = profile.experience.findIndex(
      (exp) => exp.id === req.params.exp_id
    );
    profile.experience.splice(index, 1);

    await profile.save();

    return res.json(profile);
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('Server error');
  }
});

// @desc Add education to profile
router.put(
  '/education',
  [
    auth,
    [
      body('school', 'School is required').notEmpty(),
      body('degree', 'Degree is required').notEmpty(),
      body('fieldOfStudy', 'Field of study is required').notEmpty(),
      body('from', 'From date is required').notEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(404).json({ errors: errors.array() });

    const { school, degree, fieldOfStudy, from, to, current, description } =
      req.body;
    const newEdu = {
      school,
      degree,
      fieldOfStudy,
      from,
      to,
      current,
      description
    };

    try {
      const profile = await Profile.findOne({ user: req.user.id });

      profile.education.unshift(newEdu);

      await profile.save();

      return res.json(profile);
    } catch (err) {
      console.error(err.message);
      return res.status(500).send('Server error');
    }
  }
);

// desc Delete education from profile
router.delete('/education/:edu_id', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });

    const removeIndex = profile.education.findIndex(
      (edu) => edu.id === req.params.edu_id
    );
    profile.education.splice(removeIndex, 1);

    await profile.save();

    return res.json(profile);
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('Server error');
  }
});

module.exports = router;
