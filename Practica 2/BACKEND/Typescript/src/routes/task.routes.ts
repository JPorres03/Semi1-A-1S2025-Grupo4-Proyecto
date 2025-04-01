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
router.put('/update/:id',
    editTask
)

router.delete('/delete/:id',
    deleteTask
)

router.patch('/complete/:id',
    completeTask
)


export { router as taskRouter };