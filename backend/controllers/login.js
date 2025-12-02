import bcrypt from "bcrypt";
import Users from "../models/user.js";

// Validación de email
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Rate limiting simple en memoria
const loginAttempts = new Map();



export const LoginUsuario = async (req, res) => {
    try {
        const { Correo, Passwords } = req.body;

        // 1. Validar que todos los campos estén presentes
        if (!Correo || !Passwords) {
            return res.status(400).json({ 
                message: "Todos los campos son obligatorios" 
            });
        }

        // 2. Validar formato de email
        if (!emailRegex.test(Correo)) {
            return res.status(400).json({ 
                message: "Formato de email inválido" 
            });
        }

        // 3. Validar longitud mínima de contraseña
        if (Passwords.length < 6) {
            return res.status(400).json({ 
                message: "La contraseña debe tener al menos 6 caracteres" 
            });
        }

        // 4. Rate limiting (5 intentos por email cada 15 minutos)
        const attempts = loginAttempts.get(Correo) || { count: 0, time: Date.now() };
        
        if (attempts.count >= 5 && Date.now() - attempts.time < 900000) {
            return res.status(429).json({ 
                message: "Demasiados intentos fallidos. Intenta en 15 minutos" 
            });
        }

        // 5. Buscar el usuario en la base de datos
        const usuario = await Users.findOne({ Correo });

        // 6. Validar contraseña
        const passwordValida = usuario 
            ? await bcrypt.compare(Passwords, usuario.Passwords)
            : false;

        // ✅ Mensaje genérico para no revelar si el usuario existe
        if (!usuario || !passwordValida) {
            // Incrementar intentos fallidos
            loginAttempts.set(Correo, {
                count: attempts.count + 1,
                time: attempts.count === 0 ? Date.now() : attempts.time
            });

            return res.status(401).json({ 
                message: "Credenciales incorrectas" 
            });
        }

        // 7. Limpiar intentos fallidos en login exitoso
        loginAttempts.delete(Correo);

        // 8. Respuesta exitosa
        res.status(200).json({
            message: "Inicio de sesión correcto",
            usuario: {
                id: usuario._id,
                Nombre: usuario.Nombre,
                Apellido: usuario.Apellido,
                Telefono: usuario.Telefono,
                email: usuario.Correo
            }
        });

    } catch (error) {
        console.error("Error en login:", error);
        res.status(500).json({ 
            message: "Error interno del servidor" 
        });
    }
};