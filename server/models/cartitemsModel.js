import mongoose from 'mongoose';
const Schema = mongoose.Schema

const cartitemsSchema = new Schema({
    id: {
        type: Number,
        required: true 
    },
    cart_id: {
        type: Number,
        required: true
    },
    item_id: {
        type: Number,
        required: true
    },
    quantity:{
        type: Number,
        required: false
    },
},{timestamps: true})


const cartitems = mongoose.model('cartitems', cartitemsSchema);
export default cartitems;

