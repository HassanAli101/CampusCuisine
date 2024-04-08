import mongoose from 'mongoose';
const Schema = mongoose.Schema

const adminsSchema = new Schema({
    email: {
        type: String,
        required: true 
    },
    password: {
        type: String,
        required: true
    }
},{timestamps: true})

adminsSchema.methods.comparePassword = function(candidatePassword) {
    // compare hash of the passwords
    return this.password === candidatePassword;
  };


const Admins = mongoose.model('Admins', adminsSchema);
export default Admins;

