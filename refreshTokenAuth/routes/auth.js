const router = require("express").Router();
const User = require('../models/User');
const { validate } = require('express-validation')
const { registerValidation, loginValidation } = require('../validation')
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');

//REGISTER
router.post('/register', async (req, res) => {
    //Validate the data before making user
    const body = req.body;
    const { error } = registerValidation(body);

    if (error) return res.status(400).send(error.details[0].message);

    //Check if user is already in database
    const emailExist = await User.findOne({ email: req.body.email })
    if (emailExist) return res.status(400).send('Email already exist!')

    //hash the password #generate salt to hash password

    const salt = await bcrypt.genSalt(10);

    // now we set user password to hashed password
    const hashedPassowrd = await bcrypt.hash(req.body.password, salt)
    //user.password = await bcrypt.hash(user.password, salt);

    //Create a new user
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassowrd
    });

    try {
        const savedUser = await user.save();
        res.send({ user: user._id });

    } catch (err) {
        res.status(400).send(err);
    }
}

)


//LOGIN
router.post('/login', async (req, res) => {
    const body = req.body;
    const { error } = loginValidation(body);

    if (error) return res.status(400).send(error.details[0].message);
    //Check if email is already in database
    const user = await User.findOne({ email: req.body.email })
    if (!user) return res.status(400).send('Email is not found!')
    //Check password is correct
    const validPass = await bcrypt.compare(req.body.password, user.password)
    if (!validPass) return res.status(400).send('Invalid password!')

    //Create and assign a token
    const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET)
    res.header('auth-token', token).send(token)

})


module.exports = router

