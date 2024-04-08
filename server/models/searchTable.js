import mongoose from 'mongoose';
const Schema = mongoose.Schema

const searchTableSchema = new Schema({
    index: {
        type: Number,
        required: false
    },
    email: {
        type: String,
        required: false
    },
    keyword: {
        type: String,
        required: false
    },
    item:{
        type: String,
        required: false
    },
},{timestamps: true})


const searchTable = mongoose.model('searchTable', searchTableSchema);
export default searchTable;

