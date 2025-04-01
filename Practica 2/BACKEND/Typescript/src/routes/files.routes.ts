import { create } from 'domain';
import { Router } from 'express';
import { getFiles, uploadFile } from '../controller/files.controller';


const router = Router();


router.post('/:id/upload',
    uploadFile
)
router.get(
    '/:id',
    getFiles
)


export { router as filesRouter };