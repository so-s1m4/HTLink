import Joi from "joi"

export type ProjectPreviewCardDto = { id: string,
    title: string,
    shortDescription: string,
    tags: string[],
    deadline: Date,
    status: string,
}

