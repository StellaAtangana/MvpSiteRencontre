const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const generateToken = (userId) => {
    return jwt.sign(
        {id: userId},
        process.env.JWT_SECRET,
        { expiresIn:'7d'}
    );
};

const register = async (req, res) => {
    const{email, phone,password } = req.body;
    try{
        const userExists = await pool.query(
            'SELECT * FROM users WHERE email = $1 OR phone = $2',
            [email,phone]
        );
        if (userExists.rows.length > 0) {
            return res.status(400).json({message: 'Utilisateur déjà existant'});
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await pool.query(
            'INSERT INTO users (email, phone , password) VALUES ($1, $2, $3) RETURNING id, email, phone',[email, phone, hashedPassword]
        );
        const token = generateToken(newUser.rows[0].id);
        res.status(201).json({
            message: 'Inscription réussie !',
            token,
            user: newUser.rows[0]
        });
        } 
        catch(error){
            console.error(error);
            res.status(500).json({ message: 'Erreur serveur'});
        }
};

const login = async (req, res) => {
    const { email, password } = req.body;
    try{
        const user = await pool.query(
            'SELECT * FROM users WHERE email = $1',
            [email]
        );

        if (user.rows.length === 0){
            return res.status(400).json({ message: 'Email ou mot de passe incorrect'});
        }
        const token = generateToken(user.rows[0].id);
        res.status(200).json({
            message: 'connexion réussie !',
            token,
            user:{
                id:user.rows[0].id,
                email: user.rows[0].email,
                phone:user.rows[0].phone
            }
        });
    }
    catch(error){
        console.error(error);
        res.status(500).json({ message: 'Erreur serveur'});
    }
};

module.exports = { register, login};