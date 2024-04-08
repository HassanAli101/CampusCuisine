import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const ItemsSchema = new Schema({
    itemId: {
        type: Number,
        required: true
    },
    itemName: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    stock: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    calories: {
        type: Number,
        required: false
    },
    vendorEmail: {
        type: String,
        required: true
    }
}, { timestamps: true });

const Items = mongoose.model('Items', ItemsSchema);
export default Items;
