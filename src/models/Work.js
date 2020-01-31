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
          done: Boolean,
          doneDate: {
            type: Date,
            default: Date.now
          }
        }
      ],
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Work', WorkSchema);
