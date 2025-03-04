import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "";


export const generarToken = (userId: string) => {
    const payload = { userId };

    const token = jwt.sign(payload, process.env.JWT_SECRET as string, {
      expiresIn: '1h',  // El token expira en 1 hora
    });
  
    return token;
}



export const verificarToken = (req: Request, res: Response, next: NextFunction): void=> {
    // Obtener el token de la cabecera Authorization
    const token = req.header("Authorization") || "";

    if (!token || token === "") {
        res.status(401).json({ mensaje: "Acceso denegado. No hay token." });
    }

    try {
        // Verificar el token
        const tokenVerificado = jwt.verify(token.split(" ")[1], JWT_SECRET) as JwtPayload;
        req.body.usuario = tokenVerificado; // Guardar los datos del usuario en req.usuario
        next(); // Continuar con la siguiente función (controlador o middleware)
    } catch (error) {
         res.status(403).json({ mensaje: "Token inválido." });
    }
};
