import mongoose from 'mongoose';
const Schema = mongoose.Schema

const cartsSchema = new Schema({
    cart_id: {
        type: Number,
        required: false 
    },
    itemId: {
        type: Number,
        required: false 
    },
    customer_email: {
        type: String,
        required: true
    },
    vendor_email: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: false
    },
    item_name: {
        type: String,
        required: false
    },
    item_id: {
        type: String,
        required: false
    },
    price: {
        type: Number,
        required: false
    },
    total: {
        type: Number,
        required: false
    },
    image: {
        type: String,
        required: false
    },
},{timestamps: true})

const carts = mongoose.model('carts', cartsSchema);
export default carts;

