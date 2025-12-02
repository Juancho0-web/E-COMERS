import express from "express";
import productos, { crearProducto,obtenerProductos} from "../controllers/productos.js";

const router=express.Router();

//ruta del producto

router.post("/",crearProducto);
//ruta para obtener todos los productos

router.get("/",obtenerProductos)

export default router;
