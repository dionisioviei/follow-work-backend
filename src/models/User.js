const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const secret = require('../config').secret;

console.log(secret);

mongoose.set('useCreateIndex', true);

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      lowercase: true,
      unique: true,
      required: [true, 'Não pode ficar vazio!'],
      match: [/^[a-zA-Z0-9]+$/, 'Inválido!'],
      index: true
    },
    type: String,
    hash: String,
    salt: String
  },
  { timestamps: true }
);

UserSchema.plugin(uniqueValidator, { message: 'Usuário já existe!' });

UserSchema.methods.setPassword = function(password) {
  this.salt = crypto.randomBytes(16).toString('hex');
  this.hash = crypto
    .pbkdf2Sync(password, this.salt, 1000, 128, 'sha512')
    .toString('hex');
};

UserSchema.methods.validPassword = function(password) {
  const hash = crypto
    .pbkdf2Sync(password, this.salt, 1000, 128, 'sha512')
    .toString('hex');
  return this.hash === hash;
};

UserSchema.methods.generateJWT = function() {
  const today = new Date();
  const exp = new Date(today);

  exp.setDate(today.getDate() + 60);

  return jwt.sign(
    {
      id: this._id,
      username: this.username,
      type: this.type,
      exp: parseInt(exp.getTime() / 1000)
    },
    secret
  );
};

UserSchema.methods.toAuthJSON = function() {
  return {
    username: this.username,
    type: this.type,
    token: this.generateJWT()
  };
};

module.exports = mongoose.model('User', UserSchema);
