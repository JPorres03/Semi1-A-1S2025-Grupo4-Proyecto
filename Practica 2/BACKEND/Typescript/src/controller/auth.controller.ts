
import { Request, Response } from 'express';
import { AppDataSource } from "../config/databases/mysql";
import { User } from "../models/User";
import bcrypt from "bcrypt";


export const register = async (req: Request, res: Response) => {

    try {
        const { username, email, password, confirm_password } = req.body;

        if (!username || !email || !password || !confirm_password) {
            res.status(400).json({ message: "All fields are required" });
            return
        }
        if (password !== confirm_password) {
            res.status(400).json({ message: "Passwords do not match" });
            return
        }
        const user = await AppDataSource.manager
            .createQueryBuilder(User, "user")
            .where("user.email = :email", { email })
            .orWhere("user.username = :username", { username })
            .getOne();

        if (user) {
            res.status(400).send({ message: "User already exists", error: true });
            return
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        console.log("aqui ando")
        const newUser = new User();
        newUser.username = username;
        newUser.email = email;
        newUser.password = hashedPassword;
        newUser.profile_picture_url = ""; // Set a default profile picture URL or handle it as needed

        await AppDataSource.manager.save(newUser);

        res.status(201).json({ message: "User created successfully", user: newUser });
        return


    } catch (error) {
        res.status(500).json({ message: "Error creating user", error });
        return
    }
}

export const login = async (req: Request, res: Response) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            res.status(400).json({ message: "All fields are required" });
            return
        }

        const user = await AppDataSource.manager
            .createQueryBuilder(User, "user")
            .where("user.username = :username", { username })
            .getOne();

        if (!user) {
            res.status(400).json({ message: "User not found", error: true });
            return
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            res.status(400).json({ message: "Invalid credentials", error: true });
            return
        }

        res.status(200).json({ message: "Login successful", data: user, error: false });
        return
    } catch (error) {
        res.status(500).json({ message: "Error logging in", error });
        return
    }
}