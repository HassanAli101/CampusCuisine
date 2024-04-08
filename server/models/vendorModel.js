import mongoose from 'mongoose';
const Schema = mongoose.Schema

const VendorsSchema = new Schema({
    email: {
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
        required: false, // Set to false for not required
    },
    keywords: {
        type: String,
        required: false, // Set to false for not required
    },
    application: {
        type: String,
        required: false, // Set to false for not required
    }
},{timestamps: true})

VendorsSchema.methods.comparePassword = function(candidatePassword) {
    // compare hash of the passwords
    return this.password === candidatePassword;
  };


const Vendors = mongoose.model('Vendors', VendorsSchema);
export default Vendors;

