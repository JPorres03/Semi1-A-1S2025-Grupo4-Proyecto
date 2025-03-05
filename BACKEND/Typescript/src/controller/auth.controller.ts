import { Request, Response } from 'express';
import { pool } from "../config/database/Postgres";
import bcrypt from "bcrypt";



export const register = async (req: Request, res: Response): Promise<void> => {
    try {
        const { nombre, apellido, password, email} = req.body;

        // Validación de los datos requeridos
        if (!nombre || !email || !password) {
            res.status(400).json({ message: 'Faltan datos requeridos (nombre, email, password)' });
            return
        }

        // Verificar si el usuario ya existe
        const usuarioExistente = await pool.query(
        `SELECT * FROM Usuarios WHERE Email = $1`,
            [email]
        );
        console.log(usuarioExistente.rows)
        if (usuarioExistente.rows.length > 0) {
            res.status(400).json({ mensaje: "El usuario ya está registrado, Prueba con otro email!" });
            return
        }
        
        const hashedPassword = await bcrypt.hash(password, 10);
        const date = new Date();
        const nuevoUsuario = await pool.query(
            `INSERT INTO Usuarios (Nombres,Apellidos,Email,Password_hash,Foto_perfil_url,Fecha_nacimiento,Rol) VALUES ($1, $2, $3,$4, $5, $6,$7) RETURNING *`,
            [nombre, apellido, email, hashedPassword, , date, "usuario"]
        );

        res.status(201).json({
            mensaje: "Usuario registrado con éxito",
            usuario: nuevoUsuario.rows[0],
            error:false
        });
        return

    } catch (error: any) {

        res.status(500).send({ message: 'Error al registrar el usuario', error: error.message });
        return
    }
};

export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            res.status(400).json({ message: 'Faltan datos requeridos (email, password)' });
            return;
        }

        const usuario = await pool.query(`SELECT * FROM Usuarios WHERE Email = $1`, [email]);
        if (usuario.rows.length === 0) {
            res.status(404).json({ mensaje: "Usuario no encontrado" ,error:true});
            return;
        }
        

        const esValida = await bcrypt.compare(password, usuario.rows[0].password_hash);
        if (!esValida) {
            res.status(401).json({ mensaje: "Contraseña incorrecta",error:true });
            return
        }
        res.json({ mensaje: "Login exitoso", usuario: usuario.rows[0].nombres });
        return
    } catch (error: any) {
        res.status(500).json({ message: 'Error interno del servidor', error: error.message });
        return
    }
};

/* export const userDetails = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email } = req.params;

        if (!email) {
            res.status(400).json({ message: 'Faltan datos requeridos (email)' });
            return;
        }

        const user = await User.findOne({ email });

        if (!user) {
            res.status(401).json({ message: 'Usuario no existe' });
            return;
        }

        res.status(200).json({
            userData: {
                nombre: user.nombre,
                email: user.email,
                phone: user.telefono,
                role: user.tipo_usuario,
                password: user.password_hash,
                tickets: user.boletos_comprados
            },
        });
    } catch (error: any) {
        res.status(500).json({ message: 'Error interno del servidor', error: error.message });
        return
    }
}

export const updateUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email } = req.params;
        const updates = req.body;

        // Validación de los parametros que si se pueden actualizar 
        const allowedUpdates = ['nombre', 'telefono', 'password_hash', 'tipo_usuario'];
        const isValidOperation = Object.keys(updates).every(update =>
            allowedUpdates.includes(update)
        );

        if (!isValidOperation) {
            res.status(400).json({ message: 'campos no permitidos para actualizacion' });
            return;
        }

        //buscar usuario
        const user = await User.findOneAndUpdate(
            { email },
            updates,
            { new: true, runValidators: true }
        );

        if (!user) {
            res.status(404).json({ message: 'Usuario no encontrado' });
            return;
        }

        const { password_hash, ...userWithoutPassword } = user.toObject();
        res.status(201).json(userWithoutPassword);
        return;
    } catch (error: any) {
        res.status(500).json({ message: 'Error interno del servidor', error: error.message });
        return
    }
}

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email } = req.params;

        const UserDisable = await User.findOne({ email });

        if (!UserDisable) {
            res.status(404).json({ message: 'Usuario no encontrado' });
            return;
        }

        UserDisable.disableAt = new Date();
        await UserDisable.save();


        res.status(201).json(UserDisable);
        return;
    } catch (error: any) {
        res.status(500).json({ message: 'Error interno del servidor', error: error.message });
        return
    }

}

export const activateUser = async (req: Request, res: Response) => {
    try {
        const { email } = req.params;

        const UserDisable = await User.findOne({ email });

        if (!UserDisable) {
            res.status(404).json({ message: 'Usuario no encontrado' });
            return;
        }

        UserDisable.disableAt = null;
        await UserDisable.save();


        res.status(201).json(UserDisable);
        return;

    } catch (error: any) {
        res.status(500).json({ message: 'Error interno del servidor', error: error.message });
        return
    }
}

export const allUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const users = await User.find({}, { password_hash: 0 });

        if (users.length === 0) {
            res.status(404).json({ message: 'No se encontraron usuarios' });
            return;
        }

        res.status(201).json(users);
        return;
    } catch (error: any) {
        res.status(500).json({ message: 'Error interno del servidor', error: error.message });
        return
    }

} */