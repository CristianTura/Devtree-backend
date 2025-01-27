import jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from "express";
import User, { IUser } from '../models/User';

declare global {
    namespace Express {
        interface Request {
            user?: IUser
        }
    }
}

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
    const bearer = req.headers.authorization
    
    if(!bearer) {
        const error = new Error('No autorizado')
        res.status(401).json({ error: error.message })
        return
    }

    const [, token] = bearer.split(' ')

    if(!token) {
        const error = new Error('No autorizado')
        res.status(401).json({ error: error.message })
        return
    }

    try {
        const result = jwt.verify(token, process.env.JWT_SECRET)
        if(typeof result === 'object' && result.id) {
            const user = await User.findById(result.id).select('-password')
            if(!user) {
                res.status(404).json({ error: 'Usuario no encontrado' })
                return
            }
            req.user = user
            next()
        }
    } catch (error) {
        res.status(500).json({ error: "Token no válido" })
    }
}