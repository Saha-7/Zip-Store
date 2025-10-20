import mongoose from "mongoose";

const categorySchema =new mongoose.Schema({
    name:{
        type: String,
        default: ""
    },
    image:{
        type: String,
        default: ""
    },

},{timestamps: true})


const CategoryModel = new mongoose.model('Category', categorySchema )

export default CategoryModel