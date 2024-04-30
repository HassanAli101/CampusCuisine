import mongoose from 'mongoose';
const Schema = mongoose.Schema

const CustomerReviewSchema = new Schema({
    id: {
        type: Number,
        required: false
    },
    customer_email: {
        type: String,
        required: false
    },
    vendor_name: {
        type: String,
        required: false
    },
    vendor_email: {
        type: String,
        required: false
    },
    rating: {
        type: Number,
        required: true
    },
    comment: {
        type: String,
        required: true
    }
},{timestamps: true})

const CustomerReview = mongoose.model('CustomerReview', CustomerReviewSchema);
export default CustomerReview;

