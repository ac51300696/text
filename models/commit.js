var mongoose = require('mongoose');
var userSchema = new mongoose.Schema({
    email: {
        type: String,
        require: true,
    },
    txt: {
        type: String,
        require:true
    },
    publish_time: {
        type: int,
        default:  new Date().getTime()
    },
})
module.exports = mongoose.model("User", userSchema);
