const userRouter = require('express').Router();

const {
  getUserList, getUserId, getCurrentUser, updateUserData, updateUserAvatar,
} = require('../controllers/users');

//GET /users — возвращает всех пользователей
userRouter.get('/', getUserList);
userRouter.get('/me', getCurrentUser);
// GET /users/:userId - возвращает пользователя по _id
userRouter.get('/:id', getUserId);
// Обновить профиль или аватар
userRouter.patch('/me', updateUserData);
userRouter.patch('/me/avatar', updateUserAvatar);

module.exports = userRouter;
