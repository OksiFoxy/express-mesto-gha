const jwt = require('jsonwebtoken');
const { SECRET } = require('../utils/constants');
const AuthError = require('../errors/AuthError');

const handleAuthError = (res, req, next) => {
  next(new AuthError('С токеном что-то не так.'));
};

const extractBearerToken = (header) => header.replace('Bearer ', '');

// eslint-disable-next-line consistent-return
module.exports = function authMiddleware(req, res, next) {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return handleAuthError(res);
  }
  const token = extractBearerToken(authorization);
  let payload;
  try {
    payload = jwt.verify(token, SECRET);
  } catch (err) {
    return handleAuthError(res);
  }
  req.user = payload; // записываем пейлоуд в объект запроса
  next(); // пропускаем запрос дальше
};
