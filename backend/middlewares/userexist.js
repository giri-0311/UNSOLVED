const User = require('../models/User');

const userexists = async (req, res, next) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email : email });
    if (user) {
      return res.status(400).json({
        message: 'Email is already in use'
      });
    }
    next();
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
};

module.exports = {userexists};
