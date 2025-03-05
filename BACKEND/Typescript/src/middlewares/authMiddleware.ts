import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import { ISessionToken } from "../interfaces/SessionToken";

dotenv.config();

const JWT_KEY="FEU8IOH3FUHE3F9E4HF893489U84RJ304R34RI"
export const generateJWT = (payload: ISessionToken) => {

    const key = JWT_KEY

    if(key){

        return new Promise((resolve, reject ) => {

            jwt.sign(payload, key, {
                expiresIn: '12h'
            }, (error, token) => {
    
                if(error){
                    console.log({
                        message: 'Problems generating JWT',
                        error
                    })
                    
                    reject('Problems generating JWT')

                }else{

                    resolve(token)
                }
    
            })
        })

    }

}



export const validateToken = (req: Request, res: Response, next: NextFunction) => {

    const key = JWT_KEY

    if(key){

        try {

            const token = req.header('Authorization')?.split(' ')[1]
    
            if(!token){

                res.status(401).json({
                    ok: false,
                    message: 'Token is required in request'
                })
                return 
                
            }

            req.body.token = jwt.verify(token, key) as ISessionToken

            next()
    
        } catch (error) {

             res.status(401).json({
                ok: false,
                message: 'Invalid token',
                error
            })
            return
            
        }

    }

}