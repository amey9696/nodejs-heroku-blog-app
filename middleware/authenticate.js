const jwt = require("jsonwebtoken");
const User = require("../model/userSchema");

//User Authentication i.e using middleware
const Authenticate = async (req, res, next) => {
    try {

        const token = req.cookies.jwtoken;//get token
        const verifyToken = jwt.verify(token, process.env.SECRET_KEY);//verify token i.e compare token with secret key

        const rootUser = await User.findOne({ _id: verifyToken._id, "tokens.token": token });//tokens.token": token means in schema, in tokens part save token then user token match

        if (!rootUser) { throw new Error('User not Found') }
        
        req.token = token;//get db tokan
        req.rootUser = rootUser;//get user data
        req.userID = rootUser._id;//get db user id

        next(); //used for next process after complete try block
        
    } catch (err) {
        res.status(401).send('Unauthorized:No token provided');//user not validated
        console.log(err);
    }
}

module.exports = Authenticate;
