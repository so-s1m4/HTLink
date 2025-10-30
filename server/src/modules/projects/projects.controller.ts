import { NextFunction } from "express";
import ProjectsService from "./projects.service";
import type { Request, Response } from "express";
import { createProjectSchema } from "./dto/create.project.dto";
import {validationWrapper} from "../../common/utils/utils.wrappers";
import {statusSchema} from "./dto/status.dto";
import {ErrorWithStatus} from "../../common/middlewares/errorHandlerMiddleware";

export default class ProjectsController{

    static async createProject(req: Request, res: Response, next: NextFunction) {
        try {
            const raw = typeof req.body?.data === 'string' ? JSON.parse(req.body.data) : req.body;
            const dto = validationWrapper(createProjectSchema, raw);
            const files = (req.files as Express.Multer.File[]) || [];
            const project = await  ProjectsService.createProject(dto, files);
            res.status(201).json({ project });
        } catch (err) {
            next(err);
        }
    }

    static async updateStatus(req: Request, res: Response, next: NextFunction) {
        try {
            const dto = validationWrapper(statusSchema, req.body);
            const projectId = req.params.id;
            if (!projectId) throw new ErrorWithStatus(400, "Project ID is required");
            const updatedProject = await ProjectsService.updateStatus(projectId, dto.status);
            res.status(200).json({ project: updatedProject });
        }
        catch (err) {
            next(err);
        }
    }
}