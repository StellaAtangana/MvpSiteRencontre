const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const pool = require('./db');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL
},
async (accessToken, refreshToken, profile, done) => {
    try{
        const userExists = await pool.query(
            'SELECT * FROM users WHERE google8id = $1',[profile.id]
        );
    if (userExists.rows.length > 0) {
        return done(null, userExists.rows[0]);
    } 
    const newUser = await pool.query(
        'INSERT INTO users (google_id, email) VALUES ($1,$2) RETURNING *',
        [profile.id,profile.emails[0].value]
    );
    return done(null, newUser.rows[0]);
    }
    catch(error){
        return done(error,null);
    }
}
));

module.exports =passport;