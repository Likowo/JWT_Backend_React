const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../../models/User');
const { check, validationResult } = require('express-validator');

// @route:   GET api/users
// @desc:    Test route
// @access:  Public
router.get('/', (req, res) => res.send('User Route'));


// Mount Routes (route.post)
// @route:   POST api/users
// @desc:    Register User 
// @access:  Public

router.post('/', [
    //Put validation in here ( Create an array of checks)
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password','Please enter a password with 6 or more characters').isLength({min: 6})
],async (req,res)=> {
    //Check if there are validation errors
    //If error occurs, below variable will be an array of those errors

    const errors = validationResult(req);

    //We check if ther are errors in errors array
    if(!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array() });
    }
    //To test infor being sent
    // return res.send(req.body)

    //Descructure needed information
    const { name, email, password} = req.body

    try{
        //Searching database for user with spefic email
        let user = await User.findOne({ email})

        //If user exists,send error message
        if (user){
            res.status(400).json({error: [{ msg: 'User Already Exists'}]})
        }
// If no user,create one with data from req.body
        user = new User({
            name,
            email,
            password
        })

        //Create a salt i.e number of rountes to encrpty a password
        const salt = await bcrypt.genSalt(10)
        user.password = await bcrypt.hash(password, salt)

        //save user to DB
        await user.save()

        //Create JWT payLoad
        const payload ={
            user: {
                id:user.id,
            }
        }
        //Create,sign and sned our JWT token   
        jwt.sign(
            payload, // Payload
            process.env.jwtSecret, //JWT secret
            { expiresIn: 3600000 },
            (err, token) => {
              if (err) throw err;
    
              res.json({ token });
            }
          );

    } catch (err) {
        console.error(err.message)
        res.staus(500).send("Server Error")
    }
});

module.exports = router;
