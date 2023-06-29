const router = require('express').Router();

const {
  getUserList, getUserId, createUser, updateUserData, updateUserAvatar,
} = require('../controllers/users');

// возвращает всех пользователей
router.get('/', getUserList);
// GET /users/:userId - возвращает пользователя по _id
router.get('/:id', getUserId);
// POST /users — создаёт пользователя
router.post('/', createUser);
// Обновить профиль или аватар
router.patch('/me', updateUserData);
router.patch('/me/avatar', updateUserAvatar);

module.exports = router;
