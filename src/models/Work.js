const mongoose = require('mongoose');

mongoose.set('useCreateIndex', true);

const WorkSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    description: String,
    userManager: {
      type: String,
      lowercase: true,
      required: [true, 'Não pode ficar vazio!']
    },
    steps: {
      type: [
        {
          order: Number,
          name: String,
          img: {
            type: {
              data: Buffer,
              contentType: String
            }
          },
          done: Boolean
        }
      ],
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Work', WorkSchema);
