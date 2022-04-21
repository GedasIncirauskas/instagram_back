const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const { enterUserDataToDB, getCrediantialsFromDB } = require('../database');

const userSchema = Joi.object({
  email: Joi.string().email().trim().lowercase().required(),
  password: Joi.string().min(3).max(30).required(),
});

const userRegistration = async (req, res) => {
  let userInput = req.body;
  try {
    userInput = await userSchema.validateAsync(userInput);
  } catch (err) {
    return res.status(400).send({ err: 'Incorrect data provided' });
  }

  try {
    const registerUser = await enterUserDataToDB(userInput);
    return res.send(registerUser);
  } catch (err) {
    return res.status(500).send({ err: 'Internal Server Error' });
  }
};

const userLogin = async (req, res) => {
  let userInput = req.body;
  try {
    userInput = await userSchema.validateAsync(userInput);
  } catch (err) {
    return res.status(400).send({ err: 'Incorrect email or pass' });
  }

  try {
    const data = await getCrediantialsFromDB(userInput);
    const answer = bcrypt.compareSync(userInput.password, data[0].password);
    if (!answer) {
      return res.status(400).send({ err: 'Incorrect data email or pass' });
    }
    const token = jwt.sign({ id: data[0].id, email: data[0].email, password: data[0].password }, process.env.JWT_SECRET);
    return res.send({ msg: 'Login successfully', token, id: data[0].id });
  } catch (err) {
    return res.status(500).send({ err: 'Internal Server Error' });
  }
};

module.exports = {
  userRegistration,
  userLogin,
};
