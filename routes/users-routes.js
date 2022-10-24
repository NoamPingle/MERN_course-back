const express = require("express");

const usersConrollers = require("../controllers/users-controllers");

const router = express.Router();

router.get("/", usersConrollers.getUsers);

router.post("/signup", usersConrollers.signup);

router.post("/login", usersConrollers.login);

module.exports = router;
