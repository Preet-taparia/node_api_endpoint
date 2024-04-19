const express = require('express');
const router = express.Router();

const {checkAvailability} = require("../controllers/docAvailability");

router.route("/").get(checkAvailability);

module.exports = router;