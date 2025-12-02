import express from "express"
import { obtenerperfil,actualizarPerfil,eliminarPerfil} from "../controllers/perfil.js";

const router =express.Router();


router.post('/obtener',obtenerperfil);
router.put("/actualizar",actualizarPerfil);
router.delete("/eliminar",eliminarPerfil)

export default router;

