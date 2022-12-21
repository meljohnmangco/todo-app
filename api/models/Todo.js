const mongoose = require('mongoose');
const newSchema = mongoose.Schema;

const toDoSchema = new newSchema({
    text: {
        type: String,
        required: true,
    },
    complete: {
        type: Boolean,
        default: false
    },
    timestamp: {
        type: String,
        default: Date.now()
    }
})

const Todo = mongoose.model("Todo", toDoSchema);

module.exports = Todo;