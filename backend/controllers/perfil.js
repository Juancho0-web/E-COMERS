import Users from "../models/user.js";

// Obtener perfil
export const obtenerperfil = async (req, res) => {
    try {
        const {email} = req.body;
        
        if(!email){
            return res.status(400).json({message:"Email es Requerido"});
        }
        
        const usuario = await Users.findOne({Correo:email}).select('-Passwords');
        
        if(!usuario){
            return res.status(404).json({message:"Usuario no encontrado"});
        }
        
        res.status(200).json({
            usuario:{
                id: usuario._id,
                Nombre: usuario.Nombre,
                Apellido: usuario.Apellido,
                Telefono: usuario.Telefono,
                email: usuario.Correo
            }
        });
    } catch (error) {
        res.status(500).json({
            message:"Error al obtener el perfil",
            error: error.message
        });
    }
};

// ✅ FUNCIÓN CORREGIDA: editarPerfil → actualizarPerfil
export const actualizarPerfil = async (req,res) => {
    try {
        const {email, Nombre, Apellido, Telefono} = req.body;
        
        if (!email){
            return res.status(400).json({message:"Email es requerido"});        
        }
        
        if (!Nombre || !Apellido || !Telefono){
            return res.status(400).json({message:"Todos los campos son obligatorios"});
        }
        
        // ✅ CORRECCIÓN: findOneAndUpdate en lugar de findByIdAndUpdate
        const usuarioActualizado = await Users.findOneAndUpdate(
            {Correo: email},
            {
                Nombre: Nombre,
                Apellido: Apellido,
                Telefono: Telefono
            },
            {new: true}
        ).select('-Passwords'); // ✅ Corregido: -Passwords (no -paswords)

        if (!usuarioActualizado) {
            return res.status(404).json({message: "Usuario no encontrado"});
        }
        
        res.status(200).json({
            message: "Perfil actualizado exitosamente",
            usuario:{
                id: usuarioActualizado._id,
                Nombre: usuarioActualizado.Nombre,
                Apellido: usuarioActualizado.Apellido,
                email: usuarioActualizado.Correo,
                Telefono: usuarioActualizado.Telefono
            }
        });

    } catch (error) {
        res.status(500).json({
            message: "Error al actualizar el perfil",
            error: error.message
        });
    }
};

// ✅ FUNCIÓN CORREGIDA: eliminarperfil → eliminarPerfil
export const eliminarPerfil = async(req, res) => {
    try{
        const {email} = req.body;

        if(!email){
            return res.status(400).json({message: "Email es requerido"});
        }

        const usuarioEliminado = await Users.findOneAndDelete({
            Correo: email
        });

        if (!usuarioEliminado) {
            return res.status(404).json({message:"Usuario no encontrado"});
        }

        res.status(200).json({
            message: "Usuario eliminado exitosamente",
            usuario:{
                id: usuarioEliminado._id,
                Nombre: usuarioEliminado.Nombre,
                Apellido: usuarioEliminado.Apellido,
                email: usuarioEliminado.Correo,
                Telefono: usuarioEliminado.Telefono,
            }
        });
    } catch(error) {
        res.status(500).json({
            message:"Error al eliminar perfil",
            error: error.message 
        });
    }
};