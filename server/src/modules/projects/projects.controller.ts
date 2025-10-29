import { NextFunction } from "express";
import ProjectsService from "./projects.service";
import type { Request, Response } from "express";
import { createProjectDto } from "./dto/create.project.dto";

export default class ProjectsController{

    static async createProject(req: Request, res: Response, next: NextFunction) {
        try {
            const raw = typeof req.body?.data === 'string' ? JSON.parse(req.body.data) : req.body;
            const dto = createProjectDto(raw);
            const files = (req.files as Express.Multer.File[]) || [];
            const project = await  ProjectsService.createProject(dto, files);
            res.status(201).json({ project });
        } catch (err) {
            next(err);
        }
    }
}