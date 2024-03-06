require('dotenv').config();
const express = require('express')
const mongoose = require('mongoose');
const cors = require('cors');

// UTILS
const getPreviousDates = require('./src/utils');

// MODELS
require('./src/models/User')
require('./src/models/Task')
require('./src/models/Dates')

const app = express()
const PORT = process.env.PORT || 8080
const mongoDBConnectURL = process.env.MONGODB_CONNECT_URL

async function main() {
    await mongoose.connect(mongoDBConnectURL);
}

main().then(() => console.log('Database connected')).catch(err => console.log(err));


const User = mongoose.model('User');
const Task = mongoose.model('Task');
const Dates = mongoose.model('Dates');

app.use(cors())
// Middleware to parse JSON bodies
app.use(express.json());

// Middleware to parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

app.post('/create-user', async (req, res) => {
    const {username} = req.body;
    const existingUser = await User.findOne({ username });
    if(existingUser) {
        return res.send({user: existingUser, message: `User with username ${username} already exists.`});
    }
    const user = await new User({username}).save(); 
    if(user.username) {
        return res.status(200).send({message: `${username} created!`, user});
    }
    return res.status(400);
})

app.get('/get-spaced-repetition', async (req, res) => {
    const {userID, timeZoneOffset} = req.query;
    try {
        const query = await Dates.findOne({userID}, 'dates');
        if(!query) {
            return res.status(400).send('Something went wrong');
        }
        const datesList = getPreviousDates(query.dates, timeZoneOffset);
        if(datesList) {
            const tasks = await Task.find({userID, dateCreated: {$in: datesList}});
            return res.status(200).send({tasks, status: 200});
        } else {
            return res.status(201).send('No Task Found');
        }
    } catch(e) {
        console.log(e);
        return res.status(400).send('Something went wrong');
    }
})

app.get('/get-today-tasks', async (req, res) => {
    const {userID, timeZoneOffset} = req.query;
    try {
        // passing [0] for today
        const datesList = getPreviousDates([0], timeZoneOffset);
        if(datesList) {
            const tasks = await Task.find({userID, dateCreated: {$in: datesList}});
            return res.status(200).send({tasks, status: 200});
        } else {
            return res.status(201).send('No Task Found');
        }
    } catch(e) {
        console.log(e);
        return res.status(400).send('Something went wrong');
    }
})

app.put('/set-spaced-repetition-algorithm', async (req, res) => {
    const {dates, userID} = req.body;
    try {
        const response = await new Dates({dates, userID}).save();
        if(response) {
            return res.status(200).send({status: 200, message: 'Success', dates: response});
        } else {
            return res.status(400).send('Could not set the dates');
        }
    }   catch(e) {
        console.log(e);
        return res.status(400).send('Something went wrong');
    }
})

app.post('/create-task', async (req, res) => {
    const {taskDescription, userID, completed, dateCreated} = req.body;
    try {
        const task = await new Task({task: taskDescription, dateCreated, userID, completed}).save();
        if(task) {
            return res.status(200).send({message: 'Task Created Successfully.', task, status: 200});
        } else {
            return res.status(400).send('Could not create the task');
        }
    } catch(e) {
        console.log(e);
        return res.status(400).send('Something went wrong');
    }
})

app.put('/update-task', async (req, res) => {
    const {taskID, taskTitle, completed} = req.body;
    try {
        const updateFields = {completed}
        if(taskTitle) {
            updateFields.task = taskTitle
        }
        const task = await Task.updateOne({_id: taskID}, {$set: updateFields});
        if(task) {
            return res.status(200).send({task, status: 200});
        } else {
            return res.status(400).send('Could not update the task');
        }
    } catch(e) {
        console.log(e);
        return res.status(400).send('Something went wrong');
    }
})


app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
