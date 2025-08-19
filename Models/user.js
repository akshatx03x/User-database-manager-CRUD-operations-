const mongoose  = require("mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/testapp1");

const userSchema = new mongoose.Schema({
    image: { type: String },
    email: { type: String },
    name: { type: String }
});

module.exports = mongoose.model("User", userSchema);
