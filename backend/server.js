import express from 'express'
import cors from 'cors';
import "./db/db.js";
import ProductRoutes from "./routes/productos.js";
import UsersRoutes from './routes/Users.js';
import  LoginUsuario from './routes/login.js';
import PerfilRouter from './routes/perfil.js';
import recuperarPasword from './routes/recuperar.js'


const app =express()
app.use(express.json());
//habilitar todas las rutas

app.use(cors());
            
// primera ruta

app.get('/',(req,res)=>{
    res.send('Bienvenido al Cuerso de node express');
});
app.use("/api/productos",ProductRoutes);
app.use("/api/Users",UsersRoutes);
app.use("/api/login",LoginUsuario);
app.use("/api/perfil",PerfilRouter);
app.use("/api/recuperar",recuperarPasword)


app.listen(8081,()=> console.log('servidor corriendo en http://localhost:8081'));

