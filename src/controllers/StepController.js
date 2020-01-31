const Work = require('../models/Work');

module.exports = {
  async index(req, res) {
    const { id } = req.params;
    const { role, roleUser } = req.body;

    const workSteps =
      role === 'normal'
        ? await Work.findOne({ _id: id, userManager: roleUser }).select('steps')
        : await Work.findOne({ _id: id }).select('steps');

    return res.json(workSteps);
  },

  async update(req, res) {
    const { id } = req.params;
    const { step_id, role, roleUser } = req.body;

    work = null;
    if (role === 'normal') {
      work = await Work.findOne({ _id: id, userManager: roleUser });
    } else {
      work = await Work.findOne({ _id: id });
    }

    if (work && req.file) {
      try {
        const foundIndex = work.steps.findIndex(step => step._id == step_id);

        if (foundIndex === -1) {
          return res.sendStatus(400);
        }
        const dateNow = new Date();

        work.steps[foundIndex] = {
          _id: work.steps[foundIndex]._id,
          doneDate: dateNow,
          order: work.steps[foundIndex].order,
          name: work.steps[foundIndex].name,
          img: {
            data: req.file.buffer,
            contentType: req.file.mimetype
          },
          done: true
        };

        const updatedStep = await Work.updateOne(
          { _id: id },
          {
            $set: work
          }
        );
        return res.json(updatedStep);
      } catch (e) {
        console.log(e);
        return res.sendStatus(400);
      }
    }

    return res.sendStatus(404);
  }
};
