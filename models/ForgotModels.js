const mongoose = require('mongoose')

// maj de ce model mdpAdmin => password 11/02/23

const ForgotSchema = mongoose.Schema({
    tel: { type: String, required: true }, // Use 'required' instead of 'require'
    code: { type: String, required: true }, // Use 'required' instead of 'require'
    dateAjout: { type: Date, default: Date.now() }
})

module.exports = mongoose.model('AccountForgot',ForgotSchema)