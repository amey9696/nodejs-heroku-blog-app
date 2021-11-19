const jwt = require('jsonwebtoken');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const authenticate = require("../middleware/authenticate");

require('../db/conn');
const User = require("../model/userSchema");

router.get('/', (req, res) => {
    res.send(`Hello from the server`);
});

router.post('/register', async (req, res) => {

    const { name, email, phone, password, cpassword} = req.body;
    
    if (!name || !email || !phone || !password || !cpassword) {
        return res.status(422).json({ error: "Plz filled the field properly" });
    }

    try {

        const userExist = await User.findOne({ email: email });

        if (userExist) {
             return res.status(422).json({ error: "Email already Exist" });
        } else if (password != cpassword) {
             return res.status(422).json({ error: "password are not matching" });
        } else {
             const user = new User({ name, email, phone, password, cpassword });
            
             //*********** Bcrypt passwordn(its middleware)
            await user.save();
            res.status(201).json({ message: "user registered successfuly" });
        }
        
    } catch (err) {
        console.log(err);
    }

});

// login route 
router.post('/login', async (req, res) => {
    try {
        let token;
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({error:"Plz Filled the data"})
        }

        const userLogin = await User.findOne({ email: email });//(dbEmail:userEnterEmail)

        if (userLogin) {
            //decrypt user password
            const isMatch = await bcrypt.compare(password, userLogin.password);//(dbpass,userEnterPass)

           

        if (!isMatch) {
            res.status(400).json({ error: "Invalid Credientials " });
        } else {
            token = await userLogin.generateAuthToken();
            // console.log(token);

            //cookie generated
            res.cookie("jwtoken", token, {
                expires: new Date(Date.now() + 25892000000),//user automatic logout means token expire in 30 days
                httpOnly:true
            });
            
            res.json({ message: "user Signin Successfully" });
        }
        } else {
             res.status(400).json({ error: "Invalid Credientials " });
        }

    } catch (err) {
        console.log(err);
    }
});

//about us page
router.get('/about', authenticate ,(req, res) => {
    res.send(req.rootUser);
});

//contact us page
router.get('/getdata',authenticate ,(req, res) => {
    res.send(req.rootUser);
})

module.exports = router;