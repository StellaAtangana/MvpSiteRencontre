const pool = require('../config/db');

const discover = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id, name, age, bio, photo_url
      FROM users
      WHERE id != $1
        AND id NOT IN (
          SELECT to_user_id FROM likes WHERE from_user_id = $1
        )
        AND name IS NOT NULL
      LIMIT 20
    `, [req.user.id]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

const likeUser = async (req, res) => {
  const fromId = req.user.id;
  const toId = req.params.toId;
  try {
    await pool.query(
      'INSERT INTO likes (from_user_id, to_user_id) VALUES ($1,$2) ON CONFLICT DO NOTHING',
      [fromId, toId]
    );

    const mutual = await pool.query(
      'SELECT id FROM likes WHERE from_user_id=$1 AND to_user_id=$2',
      [toId, fromId]
    );

    if (mutual.rows.length > 0) {
      const matchResult = await pool.query(
        `INSERT INTO matches (user1_id, user2_id)
          VALUES ($1,$2)
          ON CONFLICT DO NOTHING
          RETURNING id`,
        [fromId, toId]
      );
      return res.json({ match: true, matchId: matchResult.rows[0]?.id });
    }

    res.json({ match: false });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

const getMatches = async (req, res) => {
  const userId = req.user.id;
  try {
    const result = await pool.query(`
      SELECT
        m.id AS match_id,
        CASE WHEN m.user1_id = $1 THEN m.user2_id ELSE m.user1_id END AS other_id,
        u.name, u.photo_url, u.age,
        (SELECT content FROM messages WHERE match_id = m.id ORDER BY created_at DESC LIMIT 1) AS last_message,
        (SELECT created_at FROM messages WHERE match_id = m.id ORDER BY created_at DESC LIMIT 1) AS last_message_at
      FROM matches m
      JOIN users u ON u.id = CASE WHEN m.user1_id = $1 THEN m.user2_id ELSE m.user1_id END
      WHERE m.user1_id = $1 OR m.user2_id = $1
      ORDER BY last_message_at DESC NULLS LAST, m.created_at DESC
    `, [userId]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

module.exports = { discover, likeUser, getMatches };
