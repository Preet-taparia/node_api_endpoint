const express = require('express');
const app = express();

const check_doctor_route = require('./routes/docAvailability');

app.use("/doctor-availability", check_doctor_route);

app.get("/",(req,res)=>{
  req.send("Nothing here go to '/doctor-availability' with params in date=YYYY-MM-HH&time=HH:MM format");
})

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});