import mongoose from 'mongoose';
const Schema = mongoose.Schema

const CustomersSchema = new Schema({
    email: {
        type: String,
        required: true 
    },
    roll_Number: {
        type: Number,
        required: true
    },
    room_Number: {
        type: Number,
        required: true
    },
    hostel: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    phone_Number: {
        type: Number,
        required: true
    },
    password: {
        type: String,
        required: true
    }
},{timestamps: true})

CustomersSchema.methods.comparePassword = function(candidatePassword) {
    // compare hash of the passwords
    return this.password === candidatePassword;
  };


const Customers = mongoose.model('Customers', CustomersSchema);
export default Customers;

