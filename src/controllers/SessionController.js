const User = require('../models/User');

module.exports = {
  async store(req, res) {
    const { username, password } = req.body;
    const user = await User.findOne({ username: username });
    if (user) {
      try {
        const validUser = new User(user);

        if (!validUser.validPassword(password))
          return res.send({ error: 'Usuário e/ou senha inválido' });
        validUser.generateJWT();
        return res.json(validUser.toAuthJSON());
      } catch (e) {
        console.log(e);
        return res.sendStatus(400);
      }
    }
    return res.send({ error: 'Usuário e/ou senha inválido' });
  }
};
