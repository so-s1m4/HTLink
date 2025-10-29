import multer from "multer";
import {publicDir} from "../../../app";

export const uploadDir = publicDir;
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
export const upload = multer({
    storage,
    limits: {fileSize: 5 * 1024 * 1024},
});