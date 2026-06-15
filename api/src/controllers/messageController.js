const pool = require('../config/db');

const getMessages = async (req, res) => {
  const { matchId } = req.params;
  const userId = req.user.id;
  try {
    const check = await pool.query(
      'SELECT id FROM matches WHERE id=$1 AND (user1_id=$2 OR user2_id=$2)',
      [matchId, userId]
    );
    if (check.rows.length === 0)
      return res.status(403).json({ message: 'Accès refusé' });

    const result = await pool.query(
        `SELECT m.id, m.sender_id, m.content, m.created_at, u.name AS sender_name
        FROM messages m
        JOIN users u ON u.id = m.sender_id
        WHERE m.match_id = $1
        ORDER BY m.created_at ASC`,
      [matchId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

const sendMessage = async (req, res) => {
  const { matchId } = req.params;
  const { content } = req.body;
  const userId = req.user.id;
  try {
    if (!content || !content.trim())
      return res.status(400).json({ message: 'Message vide' });

    const check = await pool.query(
      'SELECT id FROM matches WHERE id=$1 AND (user1_id=$2 OR user2_id=$2)',
      [matchId, userId]
    );
    if (check.rows.length === 0)
      return res.status(403).json({ message: 'Accès refusé' });

    const result = await pool.query(
      'INSERT INTO messages (match_id, sender_id, content) VALUES ($1,$2,$3) RETURNING *',
      [matchId, userId, content.trim()]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

module.exports = { getMessages, sendMessage };
