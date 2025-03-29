import { create } from 'domain';
import { Router } from 'express';
import { completeTask, createTask, deleteTask, editTask } from '../controller/task.controller';


const router = Router();


router.post('/',
    createTask
)

router.put('/:id',
    editTask
)

router.delete('/:id',
    deleteTask
)

router.patch('/:id/complete',
    completeTask
)


export { router as taskRouter };