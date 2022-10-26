const { validationResult } = require("express-validator");
const User = require("../models/user");

const HttpError = require("../models/http-error");

const getUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find({}, "-password");
  } catch (err) {
    const error = new HttpError("Fetching users failed. try again.", 500);
    return next(error);
  }
  res.json({ users: users.map((user) => user.toObject({ getters: true })) });
};

const signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    return next(new HttpError("Invalid inputs, check your data.", 422));
  }
  const { name, email, password } = req.body;

  let existingUser;
  try {
    const existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError("SignUp failed! try again later.", 500);
    return next(error);
  }

  if (existingUser) {
    const error = new HttpError(
      "User exists already. please login instead.",
      422
    );
    return next(error);
  }

  const createdUser = new User({
    name,
    email,
    image:
      "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.facebook.com%2Frandomimagesbr%2F&psig=AOvVaw0lzWQytY948zoiWQr0J6K9&ust=1666884903015000&source=images&cd=vfe&ved=0CAwQjRxqFwoTCOCAl6Wc_voCFQAAAAAdAAAAABAE",
    password,
    places: [],
  });

  try {
    await createdUser.save();
  } catch (err) {
    const error = new HttpError("SignUp Failed. Please try again.", 500);
    return next(error);
  }

  res.status(201).json({ user: createdUser.toObject({ getters: true }) });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  let existingUser;

  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError("Login failed! try again later.", 500);
    return next(error);
  }

  if (!existingUser || existingUser.password !== password) {
    const error = new HttpError("Wrong username or password.", 401);
    return next(error);
  }

  res.json({ message: "Logged in!" });
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
