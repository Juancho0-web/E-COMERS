import productos from "../models/Productos.js";
// crear producto
export const crearProducto= async (req,res) => {
    
     try{
        const{productId,Nombre,Descripcion,Precio,Imagen}=req.body;
        const newProduct=new productos({
            productId,
            Nombre,
            Descripcion,
            Precio,
            Imagen
        });
        await newProduct.save();
        res.status(201).json({message:"producto guardado con exito"});
    
    }catch (error){
        console.error("error al guardar el producto", error);
        res.status(400).json({message:"error al ingresar el producto"
        });

    }
};

//traer los datos de la base de datos 
export const obtenerProductos=async (req, res) => {
    try {
        const Listarproductos = await productos.find();
        res.json(Listarproductos);
    } catch (error){
        res.status(500).json({message:"error al obtener los productos"});
    }
};

export default productos;