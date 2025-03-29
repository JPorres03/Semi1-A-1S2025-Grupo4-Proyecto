

import { Request, Response } from 'express';
import { Task_interface } from '../types/interfaces';
import { Task } from '../models/Task';
import { AppDataSource } from '../config/databases/mysql';
import { error } from 'console';

export const createTask = async (req: Request, res: Response) => {

    try {
        const { title, description, creation_date } = req.body;

        if (!title || !description || !creation_date) {
            res.status(400).json({ message: "All fields are required: title and description " });
            return;
        }
        const task = await AppDataSource.manager
            .createQueryBuilder(Task, "task")
            .where("task.title = :title", { title })
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

        await AppDataSource.manager.save(newtask);
        res.status(201).json({ message: "Task created successfully", task, error: false });
        return

    } catch (error: any) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error", error: true });
        return;
    }

}

export const editTask = async (req: Request, res: Response) => {
    try{
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

    }catch(error){
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