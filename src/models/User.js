const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
  username: {type: String, required: true}
});

mongoose.model('User', userSchema);
