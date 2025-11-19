import Joi from "joi";
import {ProjectStatus} from "../projects.model";

export type StatusDto = {
    status: ProjectStatus;
}

export const statusSchema = Joi.object({
    status: Joi.string().valid(...Object.values(ProjectStatus)).required()
})


