// routes/role.routes.ts
import { Router } from "express";
import { getRoles } from "./roles.controller";

const router = Router();

router.get("/roles", getRoles);

export default router;