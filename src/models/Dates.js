const mongoose = require('mongoose');
const { Schema } = mongoose;

const datesSchema = new Schema({
    dates: {type: Array, required: true},
    userID: { type: Schema.Types.ObjectId, ref: 'User', required: true }
});

mongoose.model('Dates', datesSchema);
