var mongoose = require('mongoose');
var articleSchema = new mongoose.Schema({
    title: {
        type: String,
        require: true,
        validate: [function(val) {
            return val.length <= 120
        }, "title is too long"],
        default: "new post"
    },
    text: {
        type: String
    },
    published: {
        type: Boolean,
        default: false
    },
    slug: {
        type: String,
        set: function(val) {
            return val.toLowerCase().replace(" ", "-")
        }
    }

})
articleSchema.static({
    list: function(callback) {
        this.find({}, null, { sort: { _id: -1 } }, callback)
        }
})
module.exports = mongoose.model("Articles", articleSchema);
