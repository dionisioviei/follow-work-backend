const User = require('../models/User');

module.exports = {
  async index(req, res) {
    const users = await User.find().select('-salt -hash');

    return res.json(users);
  },

  async store(req, res) {
    const { username, password, type } = req.body;
    const newUser = new User({ username: username.toLowerCase(), type });

    let userExist = await User.findOne({ username: username.toLowerCase() });

    if (userExist) {
      return res
        .status(409)
        .send({ error: 'Já existe um usuário com este nome' });
    }
    newUser.setPassword(password);

    const user = await User.create(newUser);

    return res.json(user);
  },

  async update(req, res) {
    const { password } = req.body;
    const { id } = req.params;

    let user = await User.findOne({ _id: id });

    if (user) {
      try {
        const newUser = new User(user);
        newUser.setPassword(password);

        user = await User.updateOne(
          { _id: id },
          {
            $set: newUser
          }
        );
        return res.json(user);
      } catch (e) {
        console.log(e);
        return res.status(400).send({ error: e });
      }
    } else {
      return res.sendStatus(404);
    }
  },

  async destroy(req, res) {
    const { id } = req.params;
    let user = await User.findOne({ _id: id });

    if (user) {
      try {
        user = await User.deleteOne({ _id: id });
        return res.json({ user });
      } catch (e) {
        console.log(e);
        return res.sendStatus(400);
      }
    }

    return res.sendStatus(404);
  }
};
