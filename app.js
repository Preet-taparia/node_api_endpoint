const express = require('express');
const app = express();

const check_doctor_route = require('./routes/docAvailability');

app.use("/doctor-availability", check_doctor_route);

app.listen(3333, () => {
    console.log("Server is running on port 3333");
});