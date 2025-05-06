import { Request, Response } from "express";
import { AppDataSource } from "../config/database/config";
import { User } from "../models/User.models";
import * as crypto from "crypto";
import { awsCognitoKey } from "../utils/credential.utils";
import { decode } from 'jsonwebtoken';
import {CognitoUserAttribute, CognitoUserPool, AuthenticationDetails, CognitoUser} from 'amazon-cognito-identity-js';

const userPool = new CognitoUserPool(awsCognitoKey.cognito);

export const login = async (req: Request, res: Response) =>{
    try{
        const {email, password} = req.body;

        if(!email || !password){
            res.status(400).json({ message: "All fields are required" });
            return
        }

        const hash = crypto.createHash('sha256').update(password).digest('hex');
        const modifiedPassword = `${hash}D**`;

        const authenticationDetails = new AuthenticationDetails({
            Username: email,
            Password: modifiedPassword
        });

        const userData = {
            Username: email,
            Pool: userPool
        };

        const repositorioUser = AppDataSource.getRepository(User)
        const userlog = await AppDataSource.manager
        .createQueryBuilder(User, "user")
        .where("user.email = :email", {email})
        .getOne();

        console.log(userlog);



        const cognitoUser = new CognitoUser(userData);
        cognitoUser.setAuthenticationFlowType('USER_PASSWORD_AUTH');

        cognitoUser.authenticateUser(authenticationDetails, {
            onSuccess: (result) => {
                const idToken = result.getIdToken().getJwtToken();
                const decodedToken: any = decode(idToken);

                const userData = {
                    email: decodedToken.email,
                    name: decodedToken.name,
                    userId: userlog?.id
                };

                res.json({
                  success: true,
                  message: "Inicio de sesion exitoso",
                  user: userData
                })
            },
            onFailure: (err) => {
              handleCognitoError(err, res);
            }
        });

       



    } catch(error: any){
        res.status(500).json({
            message: "Error register user, ", error
        });
        return
    }
}

export const register = async (req: Request, res: Response) => {
    try{
        const {username, email, password} = req.body;

        if(!email || !password){
            res.status(400).json({ message: "All fields are required" });
            return
        }

        const attributeList: CognitoUserAttribute[] = [];

        // Atributo estándar: nombre
        const attributeName = new CognitoUserAttribute({
            Name: "name",
            Value: username,
        });
        attributeList.push(attributeName);

        const attributeEmail = new CognitoUserAttribute({
            Name: "email",
            Value: email,
          });
        attributeList.push(attributeEmail);

        const attributeUsername = new CognitoUserAttribute({
            Name: "custom:username",
            Value: username,
          });
        attributeList.push(attributeUsername);

        const hash = crypto.createHash("sha256").update(password).digest("hex");
        const modifiedPassword = hash + "D**";

        userPool.signUp(email, modifiedPassword, attributeList, [], async (err, data) => {
            if (err) {
              console.error("Error al registrar en Cognito:", err);
              const error = handleCognitoError(err, res);
              return res.status(400).json({ error: error});
            }

            const newUser = new User();
            newUser.email = email;
            newUser.password = modifiedPassword;
            newUser.username = username;

            await AppDataSource.manager.save(newUser);
      
            res.json({ message: `${email} registrado correctamente.` });
          });

    } catch(error: any){
        res.status(500).json({
            message: "Error register user, ", error
        });
        return
    }   
}



// Manejador de errores de Cognito
export const handleCognitoError = (err: Error, res: Response) => {
    console.error('Error Cognito:', err);
  
    const errorMapping: { [key: string]: { status: number; message: string } } = {
      'UserNotConfirmedException': {
        status: 401,
        message: 'Usuario no confirmado'
      },
      'NotAuthorizedException': {
        status: 401,
        message: 'Credenciales inválidas'
      },
      'UsernameExistsException': {
        status: 409,
        message: 'El usuario ya existe'
      }
    };
  
    const errorInfo = errorMapping[err.name] || {
      status: 400,
      message: err.message || 'Error en la solicitud'
    };
  
    res.status(errorInfo.status).json({
      success: false,
      message: errorInfo.message
    });
  };