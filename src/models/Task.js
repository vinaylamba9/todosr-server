const mongoose = require('mongoose');
const { Schema } = mongoose;

const taskSchema = new Schema({
  task: {type: String, required: true},
  dateCreated: { type: String, required: true },
  completed: Boolean,
  userID: { type: Schema.Types.ObjectId, ref: 'User', required: true }
});

taskSchema.index({userID: 1, dateCreated: 1})

mongoose.model('Task', taskSchema);
