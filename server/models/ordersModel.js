import mongoose from 'mongoose';
const Schema = mongoose.Schema

const ordersSchema = new Schema({
    id: {
        type: Number,
        required: false 
    },
    item_id: {
        type: Number,
        required: false 
    },
    client: {
        type: String,
        required: true 
    },
    clientEmail: {
        type: String,
        required: true
    },
    vendor: {
        type: String,
        required: true
    },
    vendorEmail: {
        type: String,
        required: true
    },
    client_addr: {
        type: String,
        required: true
    },
    vendor_addr: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: false
    },
    price: {
        type: Number,
        required: true
    },
    total: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        required: false
    },
    delivery: {
        type: Boolean,
        required: false
    },
    delivered_by: {
        type: String,
        required: false
    },
},{timestamps: true})

const Order = mongoose.model('Order', ordersSchema);
export default Order;