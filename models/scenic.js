var mongoose = require("mongoose");
var ScenicSchema = new mongoose.Schema({
    name: String,
    url : String,
    desc: String,
    location: String,
    rate: Number,
    lat: Number,
    lng: Number,
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment"
    }],
    author: {
        name: String,
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref : "User"
        }
    }
});
module.exports = mongoose.model("Scenic", ScenicSchema);