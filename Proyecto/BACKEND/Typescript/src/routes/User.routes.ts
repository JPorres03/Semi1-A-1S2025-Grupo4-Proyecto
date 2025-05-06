import { Router } from "express";
import { login, register } from "../controller/User.controller";
import { log } from "console";

const router = Router()

router.post(
    '/login',
    login
)

router.post(
    '/register',
    register
)

export { router as authRouter };