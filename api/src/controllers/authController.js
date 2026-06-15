const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const generateToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '7d' });

const register = async (req, res) => {
  const { email, phone, password } = req.body;
  try {
    if (!email || !password)
      return res.status(400).json({ message: 'Email et mot de passe requis' });

    const exists = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (exists.rows.length > 0)
      return res.status(400).json({ message: 'Email déjà utilisé' });

    const hash = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (email, phone, password) VALUES ($1,$2,$3) RETURNING id, email, phone, name, bio, photo_url',
      [email, phone, hash]
    );
    const user = result.rows[0];
    res.status(201).json({ token: generateToken(user.id), user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password)
      return res.status(400).json({ message: 'Email et mot de passe requis' });

    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0)
      return res.status(400).json({ message: 'Email ou mot de passe incorrect' });

    const user = result.rows[0];
    const valid = await bcrypt.compare(password, user.password);
    if (!valid)
      return res.status(400).json({ message: 'Email ou mot de passe incorrect' });

    const { password: _, ...safeUser } = user;
    res.json({ token: generateToken(user.id), user: safeUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

module.exports = { register, login };
