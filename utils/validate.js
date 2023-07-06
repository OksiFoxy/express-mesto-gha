const { celebrate, Joi } = require('celebrate');
const validRegex = require('./validRegex');

const validUserId = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().hex().length(24).required(),
  }),
});

const validUserUpdate = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    about: Joi.string().min(2).max(30).required(),
  }),
});

const validUpdateAvatar = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().pattern(validRegex).required(),
  }),
});

const validLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().min(7).required().email(),
    password: Joi.string().required(),
  }),
});

const validCreateUser = celebrate({
  body: Joi.object().keys({
    email: Joi.string().min(7).required().email(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(validRegex),
  }),
});

const validCardId = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().hex().length(24).required(),
  }),
});

const validNewCard = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string().pattern(validRegex).required(),
  }),
});

module.exports = {
  validUserId,
  validUserUpdate,
  validUpdateAvatar,
  validLogin,
  validCreateUser,
  validCardId,
  validNewCard,
};
