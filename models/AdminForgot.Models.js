const mongoose = require('mongoose')

// maj de ce model mdpAdmin => password 11/02/23

const ForgotAdminSchema = mongoose.Schema({
    email: { type: String, required: true }, // Use 'required' instead of 'require'
    code: { type: String, required: true }, // Use 'required' instead of 'require'
    dateAjout: { type: Date, default: Date.now() }
})

module.exports = mongoose.model('AdminForgot',ForgotAdminSchema)