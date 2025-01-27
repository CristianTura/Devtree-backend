import { Router } from 'express';
import { body } from 'express-validator';
import { createAccount, getUser, getUserByHandle, login, searchByHandle, updateProfile, uploadImage } from './handlers';
import { handleInputErrors } from './middleware/validation';
import { authenticate } from './middleware/auth';

const router = Router()

// Autenticacion y registro
router.post('/auth/register',
    body('handle').notEmpty().withMessage('El handle es requerido'),
    body('name').notEmpty().withMessage('El nombre es requerido'),
    body('email').isEmail().withMessage('Email no válido'),
    body('password').notEmpty().isLength({min: 8}).withMessage('El password es requerido'),
    handleInputErrors,
    createAccount
)

router.post('/auth/login',
    body('email').isEmail().withMessage('Email no válido'),
    body('password').notEmpty().withMessage('El password es requerido'),
    handleInputErrors,
    login
)

router.get('/user', authenticate, getUser)
router.patch('/user',
    body('handle').notEmpty().withMessage('El handle es requerido'),
    handleInputErrors,
    authenticate, 
    updateProfile
)

router.post('/user/image', authenticate, uploadImage)

router.get('/:handle', getUserByHandle)
router.post('/search',
    body('handle').notEmpty().withMessage('El handle es requerido'),
    handleInputErrors,
    // authenticate, 
    searchByHandle
)

export default router