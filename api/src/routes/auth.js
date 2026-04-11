const express = require('express');
const router = express.Router();
const { register,login} = require('../controllers/authController');
const passport = require('passport');

router.post('/register',register);
router.post('/login',login);
router.get('/google',
    passport.authenticate('google',{scope:['profile','email']})
),

router.get('/google/callback',
    passport.authenticate('google',{session:false}),
    (req,res)=>{
        const token = JsonWebTokenError.sign(
            {
                id: req.user.id
            },
            process.env.JWT_SECRET,
            {expiresIn: '7d'}
        );
        res.redirect(`artmatch://auth?token=${token}`);
    }
);

module.exports = router;