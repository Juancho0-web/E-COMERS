import mongoose from "mongoose"
const ProductSchema =new mongoose.Schema({

    productId:{type:String,required:true,unique:true},
    Nombre:{type:String,required:true},
    Descripcion:{type:String,required:true},
    Precio:{type:Number,required:true},
    Imagen:{type:String,required:true},
});
// forzamos para que me guarde la informacion en la correccion de productos
const Product=mongoose.model("productos",ProductSchema,"productos")
export default Product;