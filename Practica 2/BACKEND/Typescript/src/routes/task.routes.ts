import { create } from 'domain';
import { Router } from 'express';
import { completeTask, createTask, deleteTask, editTask, obtainAllTask } from '../controller/task.controller';


const router = Router();


router.post('/:id/create',
    createTask
)

router.get(
    '/:id',
    obtainAllTask
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