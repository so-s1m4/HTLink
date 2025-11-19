import { Router } from "express";
import { ErrorWrapper } from "../../common/utils/utils.wrappers";
import SkillController from "./skills.controller";

const router = Router()

router.get('/', ErrorWrapper(SkillController.getSkills))

export default router