const express = require("express");
const { check } = require("express-validator");

const usersConrollers = require("../controllers/users-controllers");

const router = express.Router();

router.get("/", usersConrollers.getUsers);

router.post(
  "/signup",
  [
    check("name").not().isEmpty(),
    check("email").normalizeEmail().isEmail(),
    check("password").isLength({ min: 6 }),
  ],
  usersConrollers.signup
);

router.post("/login", usersConrollers.login);

module.exports = router;
