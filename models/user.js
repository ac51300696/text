var mongoose = require('mongoose');
var userSchema = new mongoose.Schema({
    email: {
        type: String,
        require: true,
        set: function(val) {
            return val.toLowerCase().trim();
        },
        validate: [function(val) {
            return val.match(/^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/)
        }, "email not vailable"],
        default: "new post"
    },
    password: {
        type: String
    },
    admin: {
        type: Boolean,
        default: false
    },
})
module.exports = mongoose.model("User", userSchema);
