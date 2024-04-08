import mongoose from 'mongoose';
const Schema = mongoose.Schema

const studentVendorsSchema = new Schema({
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
    },
    status: {
        type: String,
        required: false, 
    }
},{timestamps: true})

studentVendorsSchema.methods.comparePassword = function(candidatePassword) {
    // compare hash of the passwords
    return this.password === candidatePassword;
  };


const studentVendors = mongoose.model('StudentVendors', studentVendorsSchema);
export default studentVendors;

