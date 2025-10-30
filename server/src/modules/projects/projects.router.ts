import {Router} from "express";
import fs from "fs";
import {ErrorWrapper} from "../../common/utils/utils.wrappers";
import ProjectsController from "./projects.controller";
import {upload, uploadDir} from "./utils/storage";

const projectsRouter = Router();

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

projectsRouter.post('/', upload.array('image', 5), ErrorWrapper(ProjectsController.createProject));
projectsRouter.get('/', ErrorWrapper(ProjectsController.list));
projectsRouter.patch('/:id/update_status', ErrorWrapper(ProjectsController.updateStatus));

export default projectsRouter;