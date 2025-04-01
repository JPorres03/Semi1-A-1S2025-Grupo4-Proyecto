

import { Request, Response } from 'express';
import { Task_interface } from '../types/interfaces';
import { Task } from '../models/Task';
import { AppDataSource } from '../config/databases/mysql';
import { error } from 'console';
import { User } from '../models/User';
import { File } from '../models/File';


export const uploadFile = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const {url}= req.body;
        // buscamos el usuario primero

        const existUser =  AppDataSource.manager
            .createQueryBuilder(User, "user")
            .select(["id"])
            .where("user.id = :id", { id: id })
            .getOne()

        if(!existUser){
            res.status(400).json({error:true,message:"User not found"})
            return;
        }

        const existFile  = await AppDataSource.manager
        .createQueryBuilder(File,"file")
        .where("file.url =:url",{url})
        .getOne()

        if (existFile) {
            res.status(400).json({ error: true, message: "File already exists" });
            return;
        }

        const createFile = new File();
        createFile.user_id = parseInt(id)
        createFile.url= url

        await AppDataSource.manager.save(createFile)
        res.status(200).json({error:false,message:"File upload correctly"})



    } catch (error: any) {
        res.status(500).json({ message: "Internal Server Error", error });
        return;
    }
}

export const getFiles = async (req: Request, res: Response) => {
    try{
        const {id} = req.params

        if(!id ){
            res.status(400).json({error:true,message:'All fields are required: id '})
        }
        const existUser =  AppDataSource.manager
            .createQueryBuilder(User, "user")
            .select(["id"])
            .where("user.id = :id", { id: id })
            .getOne()

        if(!existUser){
            res.status(400).json({error:true,message:"User not found"})
            return;
        }

        const allFiles = await AppDataSource.manager
        .createQueryBuilder(File,'file')
        .where("file.user_id = :id", {id})
        .getRawMany()

        if (allFiles.length === 0){
            res.status(400).json({error:true,message:"Files not found"})
            return;
        }

        
        res.status(200).json({error:false,files:allFiles})
        return


    }catch(error:any){
        res.status(500).json({ message: "Internal Server Error", error });
        return;
    }
}