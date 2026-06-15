const pool = require('../config/db');

const getMe = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, email, phone, name, age, bio, photo_url FROM users WHERE id = $1',
      [req.user.id]
    );
    if (result.rows.length === 0)
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

const updateMe = async (req, res) => {
  const { name, age, bio, photo_url } = req.body;
  try {
    const result = await pool.query(
      'UPDATE users SET name=$1, age=$2, bio=$3, photo_url=$4 WHERE id=$5 RETURNING id, email, phone, name, age, bio, photo_url',
      [name, age, bio, photo_url, req.user.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

module.exports = { getMe, updateMe };
