import { Router } from "express";
import { ErrorWrapper } from "../../common/utils/utils.wrappers";
import CategoryController from "./category.controller";

const router = Router()

router.get('/', ErrorWrapper(CategoryController.getCategories))
router.get("/categories-with-roles", ErrorWrapper(CategoryController.getCategoriesWithRoles));
export default router