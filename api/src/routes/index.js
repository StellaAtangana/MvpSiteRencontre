const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');
const { getMe, updateMe } = require('../controllers/profileController');
const { discover, likeUser, getMatches } = require('../controllers/matchController');
const { getMessages, sendMessage } = require('../controllers/messageController');
const auth = require('../middlewares/authMiddleware');

router.post('/auth/register', register);
router.post('/auth/login', login);

router.get('/profile/me', auth, getMe);
router.put('/profile/me', auth, updateMe);

router.get('/match/discover', auth, discover);
router.post('/match/like/:toId', auth, likeUser);
router.get('/match/matches', auth, getMatches);

router.get('/messages/:matchId', auth, getMessages);
router.post('/messages/:matchId', auth, sendMessage);

module.exports = router;
