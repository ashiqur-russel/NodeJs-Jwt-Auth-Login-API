const express = require('express')
const app = express();
const mongoose = require("mongoose")
const dotenv = require('dotenv')
const port = process.env.PORT || 8080;

//Import Routes
const authRoute = require('./routes/auth')
const postRoute = require('./routes/posts')

dotenv.config();

//Connect to db
mongoose.connect(process.env.DB_CONNECT, () => {
    console.log('Connect to db!')
});

//Middleware
app.use(express.json());

//Route middleare
app.use('/api/user', authRoute);
app.use('/api/posts', postRoute)


app.listen(port, () => console.log(`listening on port ${port}...`))