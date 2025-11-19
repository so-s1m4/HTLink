import Joi from "joi"

export type ProjectPreviewCardDto = { id: string,
    title: string,
    shortDescription: string,
    tags: string[],
    deadline: Date,
    status: string,
    images: Array<{
        _id: string;
        image_path: string;
        projectId: string;
    }>;
}

