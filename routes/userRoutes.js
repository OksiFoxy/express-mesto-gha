const userRouter = require('express').Router();

const {
  getUserList, getUserId, createUser, updateUserData, updateUserAvatar,
} = require('../controllers/users');

// возвращает всех пользователей
userRouter.get('/', getUserList);
// GET /users/:userId - возвращает пользователя по _id
userRouter.get('/:id', getUserId);
// POST /users — создаёт пользователя
userRouter.post('/', createUser);
// Обновить профиль или аватар
userRouter.patch('/me', updateUserData);
userRouter.patch('/me/avatar', updateUserAvatar);

module.exports = userRouter;
