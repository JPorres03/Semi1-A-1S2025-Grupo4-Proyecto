

import { Request, Response } from 'express';
import { Task_interface } from '../types/interfaces';
import { Task } from '../models/Task';
import { AppDataSource } from '../config/databases/mysql';
import { error } from 'console';

export const createTask = async (req: Request, res: Response) => {

    try {
        const { id } = req.params

        const { title, description } = req.body;

        if (!title || !description || !id) {
            res.status(400).json({ message: "All fields are required: title and id " });
            return;
        }
        const task = await AppDataSource.manager
            .createQueryBuilder(Task, "task")
            .where("task.title = :title", { title })
            .andWhere("task.id_user = :id", { id })
            .getOne();

        if (task) {
            res.status(400).json({ message: "Task already exists", error: true });
            return;
        }

        const newTask: Task_interface = {
            title,
            description,
            status: false,
        }

        const newtask = new Task();
        newtask.title = newTask.title;
        newtask.description = newTask.description;
        newtask.status = newTask.status;
        newtask.id_user = parseInt(id)

        await AppDataSource.manager.save(newtask);
        res.status(201).json({ message: "Task created successfully", newtask, error: false });
        return

    } catch (error: any) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error", error: true });
        return;
    }

}

export const editTask = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { title, description } = req.body;

        if (!title || !description) {
            res.status(400).json({ message: "All fields are required: title and description and status" });
            return;
        }

        const task = await AppDataSource.manager
            .createQueryBuilder(Task, "task")
            .where("task.id = :id", { id })
            .getOne();

        if (!task) {
            res.status(404).json({ message: "Task not found", error: true });
            return;
        }

        task.title = title;
        task.description = description;

        await AppDataSource.manager.save(task);
        res.status(200).json({ message: "Task updated successfully", task, error: false });
        return

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error", error: true });
        return;
    }
}

export const deleteTask = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const task = await AppDataSource.manager
            .createQueryBuilder(Task, "task")
            .where("task.id = :id", { id })
            .getOne();

        if (!task) {
            res.status(404).json({ message: "Task not found", error: true });
            return;
        }

        await AppDataSource.manager.remove(task);
        res.status(200).json({ message: "Task deleted successfully", error: false });
        return

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error", error: true });
        return;
    }
}

export const completeTask = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const task = await AppDataSource.manager
            .createQueryBuilder(Task, "task")
            .where("task.id = :id", { id })
            .getOne();

        if (!task) {
            res.status(404).json({ message: "Task not found", error: true });
            return;
        }

        task.status = !task.status; // Toggle the status

        await AppDataSource.manager.save(task);
        res.status(200).json({ message: "Task status updated successfully", task, error: false });
        return

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error", error: true });
        return;
    }
}

export const obtainAllTask = async (req:Request,res:Response) => {

    try {
        const { id } = req.params;

        // Obtiene todas las tareas asociadas al id_user
        const allTasks = await AppDataSource.manager
            .createQueryBuilder(Task, 'task')
            .where("task.id_user = :id", { id: id })
            .getMany();

        // Verifica si no hay tareas
        if (!allTasks || allTasks.length === 0) {
            res.status(404).json({ message: "Tasks not found", error: true });
            return;
        }

        // Devuelve las tareas encontradas
        res.status(200).json({ message: "Tasks retrieved successfully", tasks: allTasks, error: false });
        return;
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error", error: true });
        return;
    }
} 