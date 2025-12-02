import mongoose from "mongoose"
const UsersShema = new mongoose.Schema({
    Nombre:{type:String,required:true},
    Apellido:{type:String,required:true},
    Telefono:{type:Number,required:true,minlength:12},
    Correo:{type:String,required:true},
    Passwords:{type:String,required:true}
});
// forzamos para que me guarde la informacion en la correccion de productos
const Users=mongoose.model("Users",UsersShema,"Users")
export default Users;