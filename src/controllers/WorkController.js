const Work = require('../models/Work');
const User = require('../models/User');

module.exports = {
  async index(req, res) {
    const { role, roleUser } = req.body;

    const works =
      role === 'normal'
        ? await Work.find({ userManager: roleUser }).select('-steps')
        : await Work.find().select('-steps');

    return res.json(works);
  },

  async store(req, res) {
    const work = req.body;
    const { userManager } = work;

    const userManagerExist = await User.findOne({
      username: userManager.toLowerCase()
    });

    if (!userManagerExist) {
      return res.status(409).send({ error: 'Usuário responsável não existe!' });
    } else if (userManagerExist && userManagerExist.type === 'admin') {
      return res
        .status(400)
        .send({ error: 'Responsável não pode ser um Admin!' });
    }

    let newWork = await Work.create(work);
    newWork.steps = undefined;

    return res.json(newWork);
  },

  async update(req, res) {
    const { id } = req.params;
    let newWork = req.body;
    const userManagerExist = await User.findOne({
      username: newWork.userManager.toLowerCase()
    });

    if (!userManagerExist) {
      return res.status(409).send({ error: 'Usuário responsável não existe!' });
    } else if (userManagerExist && userManagerExist.type === 'admin') {
      return res
        .status(400)
        .send({ error: 'Responsável não pode ser um Admin!' });
    }

    const oldWork = await Work.findOne({ _id: id });

    if (oldWork) {
      try {
        newWork = await Work.updateOne(
          { _id: id },
          {
            $set: { ...newWork, steps: [...oldWork.steps, ...newWork.steps] }
          }
        );
        return res.json(newWork);
      } catch (e) {
        console.log(e);
        return res.sendStatus(400);
      }
    }

    return res.sendStatus(404);
  },

  async destroy(req, res) {
    const { id } = req.params;
    let work = await Work.findOne({ _id: id });

    if (work) {
      try {
        work = await Work.deleteOne({ _id: id });
        return res.json({ work });
      } catch (e) {
        console.log(e);
        return res.sendStatus(400);
      }
    }

    return res.sendStatus(404);
  }
};
