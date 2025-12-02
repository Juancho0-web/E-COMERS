import Users from "../models/user.js";
import bcrypt from "bcrypt";

// crear productos

export const registrarUsers = async (req,res) => {
    try {
        const{Nombre,Apellido,Telefono,Correo,Passwords} =req.body;

         //validar que no falte campo

        if (!Nombre||!Apellido||!Telefono||!Correo||!Passwords){
            return res.status(400).json({menssage:"Todos los campas son obligatorioas"});

        }
        //validar si el user ya existe
        const existeUsuario = await Users.findOne({Correo});
        if(existeUsuario){
            return res.status(400).json({menssage:"Usuario ya registrado"});
        }
        //encriptar la contraseña

        const saltRounds=10;
        const hashedPassword=await bcrypt.hash(Passwords,saltRounds);
        //Crear el Usuario en la base de datos
        const nuevoUsuario = new Users({Nombre,Apellido,Telefono,Correo,Passwords:hashedPassword});
        await nuevoUsuario.save();
        res.status(201).json({menssage:"Usuario Registrado con exito"});

    } catch (error) {
        
        res.status(500).json({menssage:"Error al registrar Usuario",Error:Error.menssage});
    }


}
    