import bcrypt from 'bcrypt';

const saltRounds = 10; // Número de rondas para generar el hash

// Función para encriptar una contraseña
async function encryptPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(password, salt);
    return hash;
}

// Función para comparar una contraseña con su hash
async function comparePassword(password: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
}