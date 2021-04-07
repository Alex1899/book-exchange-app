const mongoose = require("mongoose");

const verifytokenSchema = new mongoose.Schema({
    email: {
        type:String, 
        required: true
    }, 
    token: {
        type: String, 
        required: true
    },
    created_at: {
        type: Date, 
        default: Date.now(),
        expires: 600
    }
})

const Token = mongoose.model("Verifytoken", verifytokenSchema);

module.exports = Token;