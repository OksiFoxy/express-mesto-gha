const router = require('express').Router();

const {
  getUserList, getUserId, getCurrentUser, updateUserData, updateUserAvatar,
} = require('../controllers/users');

//GET /users — возвращает всех пользователей
router.get('/', getUserList);
router.get('/me', getCurrentUser);
// GET /users/:userId - возвращает пользователя по _id
router.get('/:id', getUserId);
// Обновить профиль или аватар
router.patch('/me', updateUserData);
router.patch('/me/avatar', updateUserAvatar);

module.exports = router;
