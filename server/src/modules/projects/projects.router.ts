import {Router} from "express";
import {ErrorWrapper} from "../../common/utils/utils.wrappers";
import ProjectsController from "./projects.controller";
import { upload } from "../../common/multer/multer.photo";
import JWTMiddleware from "../../common/middlewares/JWTMiddleware";

const projectsRouter = Router();


// should work
projectsRouter.post('/', JWTMiddleware, upload.array('image', 5), ErrorWrapper(ProjectsController.createProject));
projectsRouter.get('/', JWTMiddleware, ErrorWrapper(ProjectsController.list));

// My projects must be before /:id to avoid route collision
projectsRouter.get("/my_projects", JWTMiddleware, ErrorWrapper(ProjectsController.getMyProjects));

// projectsRouter.patch('/:id/update_status', ErrorWrapper(ProjectsController.updateStatus));
// should also work
projectsRouter.get("/:id", JWTMiddleware, ErrorWrapper(ProjectsController.getProjectById));
projectsRouter.patch("/:id/update", JWTMiddleware, ErrorWrapper(ProjectsController.updateProject))
projectsRouter.delete("/:id", JWTMiddleware, ErrorWrapper(ProjectsController.deleteProject));

export default projectsRouter;