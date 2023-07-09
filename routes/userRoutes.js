const userRouter = require('express').Router();

const {
  getUserList, getUserId, getCurrentUser, updateUserData, updateUserAvatar,
} = require('../controllers/users');
const { validUserId, validUserUpdate, validUpdateAvatar } = require('../utils/validate');

// GET /users — возвращает всех пользователей
userRouter.get('/', getUserList);
// Получение пользователя
userRouter.get('/me', getCurrentUser);
// GET /users/:userId - возвращает пользователя по _id
userRouter.get('/:userId', validUserId, getUserId);
// Обновить профиль или аватар
userRouter.patch('/me', validUserUpdate, updateUserData);
userRouter.patch('/me/avatar', validUpdateAvatar, updateUserAvatar);

module.exports = userRouter;
