const jwt = require('jsonwebtoken');
const { SECRET } = require('../utils/constants');
const AuthError = require('../errors/AuthError');

const handleAuthError = (res, req, next) => {
  next(new AuthError('Необходима авторизация.'));
};

const extractBearerToken = (header) => header.replace('Bearer ', '');

// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return handleAuthError(req, res, next);
  }

  const token = extractBearerToken(authorization);
  let payload;

  try {
    payload = jwt.verify(token, SECRET);
  } catch (err) {
    return handleAuthError(req, res, next);
  }

  req.user = payload; // записываем пейлоуд в объект запроса

  next(); // пропускаем запрос дальше
};
