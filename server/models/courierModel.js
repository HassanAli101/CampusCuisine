import mongoose from 'mongoose';
const Schema = mongoose.Schema

const couriersSchema = new Schema({
    email: {
        type: String,
        required: true 
    },
    roll_Number: {
        type: Number,
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
    application: {
        type: String,
        required: false
    }
},{timestamps: true})

couriersSchema.methods.comparePassword = function(candidatePassword) {
    // compare hash of the passwords
    return this.password === candidatePassword;
  };
  
const Couriers = mongoose.model('Couriers', couriersSchema);
export default Couriers;

