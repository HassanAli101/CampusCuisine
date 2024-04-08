import mongoose from 'mongoose';
const Schema = mongoose.Schema

const UsersSchema = new Schema({
    email: {
        type: String,
        required: true 
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    },
    status:{
        type: String,
        required: false
    },
},{timestamps: true})

UsersSchema.methods.comparePassword = function(candidatePassword) {
    // compare hash of the passwords
    return this.password === candidatePassword;
  };


const Users = mongoose.model('Users', UsersSchema);
export default Users;

