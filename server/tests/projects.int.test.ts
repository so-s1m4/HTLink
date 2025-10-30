import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import setCategories from "../src/scripts/setCategories";
import setSkills from "../src/scripts/setSkills";
import app from "../src/app";
import request from "supertest";
import { makeCreateProjectPayload } from "./fixtures/projects";
import { beforeAll, afterAll, it, expect, describe } from "@jest/globals";
import path from "path";
import { Project, ProjectStatus } from "../src/modules/projects/projects.model";
import { Category } from "../src/modules/categories/category.model";
import { Skill } from "../src/modules/skills/skills.model";
import { fail } from "assert";

let projectId: string
let mongo: MongoMemoryServer;

// Helper function to prepare project payload with category and skills
async function prepareProjectPayload(base: ReturnType<typeof makeCreateProjectPayload>, overrides?: any) {
    const category = await Category.findOne({ name: base.category });
    const skills = await Skill.find({ name: { $in: base.skills } });
    const skillIds = skills.map(s => s._id.toString());

    const { category: _, skills: __, ...baseWithoutCategoryAndSkills } = base;
    const payload = {
        ...baseWithoutCategoryAndSkills,
        categoryId: category?._id.toString() || '',
        skills: skillIds.join(','),
        ...overrides,
    };

    return { payload, skillIds, categoryId: category?._id.toString() || '' };
}

// Helper function to create project via API
async function createProjectRequest(payload: any) {
    return request(app)
        .post("/projects")
        .field("data", JSON.stringify(payload))
        .attach("image", path.join(__dirname, "fixtures/test.jpg"))
        .attach("image", path.join(__dirname, "fixtures/test.jpg"));
}

// Helper function to ensure project exists
async function ensureProjectExists(base: ReturnType<typeof makeCreateProjectPayload>) {
    const existingData = await Project.findOne({ title: base.title });
    if (!existingData) {
        const { payload } = await prepareProjectPayload(base);
        const res = await createProjectRequest(payload);
        projectId = res.body.project._id;
    } else {
        projectId = existingData._id.toString();
    }
}

beforeAll(async () => {
    mongo = await MongoMemoryServer.create();
    const uri = mongo.getUri();

    await mongoose.connect(uri);

    await new setCategories().set();
    await new setSkills().set();
});

afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongo.stop();
});

describe("Create new project", () => { 
    it("should create a new project", async () => {
        const base = makeCreateProjectPayload();
        const { payload, skillIds } = await prepareProjectPayload(base);

        const res = await createProjectRequest(payload);

        // Access the DB using mongoose.model to check saved data
        const ProjectModel = mongoose.connection.collection("projects");
        const dbProject = await ProjectModel.findOne({ _id: new mongoose.Types.ObjectId(res.body.project._id) });

        expect(dbProject).toHaveProperty("title", base.title);
        expect(dbProject?.categoryId?.toString()).toBe(payload.categoryId);
        expect(dbProject).toHaveProperty("shortDescription", payload.shortDescription);
        expect(dbProject).toHaveProperty("fullReadme", payload.fullReadme);

        if (dbProject) {
            expect(new Date(dbProject.deadline).toISOString()).toBe(base.deadline);
            const dbSkillIds = (dbProject.skills || []).map((id: any) => id.toString()).sort();
            expect(dbSkillIds).toEqual(skillIds.sort());
            expect(dbProject.ownerId).toBeDefined();
            expect(dbProject.status).toBe(ProjectStatus.PLANNED);
            expect(dbProject._id.toString()).toBe(res.body.project._id.toString());
        }
        else {
            fail("Project not found in database");
        }

        projectId = res.body.project._id;
    
        expect(res.status).toBe(201);  
        expect(res.body).toHaveProperty("project");
        expect(res.body.project._id).toBeDefined();
        expect(res.body.project.title).toBe(base.title);
        expect(res.body.project.category).toBe(payload.categoryId);
        expect(res.body.project.shortDescription).toBe(base.shortDescription);
        expect(res.body.project.fullReadme).toBe(base.fullReadme);
        expect(new Date(res.body.project.deadline).toISOString()).toBe(base.deadline);
        expect(res.body.project.skills.sort()).toEqual(skillIds.sort());
        expect(res.body.project.ownerId).toBeDefined();
        expect(res.body.project.status).toBe(ProjectStatus.PLANNED);

        // check images
        expect(res.body.project.images).toHaveLength(2);
        expect(res.body.project.images[0]).toHaveProperty("image_path");
        expect(res.body.project.images[0]).toHaveProperty("projectId");
        expect(res.body.project.images[0]).toHaveProperty("createdAt");
        expect(res.body.project.images[0]).toHaveProperty("updatedAt");
        expect(res.body.project.images[1]).toHaveProperty("image_path");
        expect(res.body.project.images[1]).toHaveProperty("projectId");
        expect(res.body.project.images[1]).toHaveProperty("createdAt");
        expect(res.body.project.images[1]).toHaveProperty("updatedAt");
      })

      it("should return 409 if the project already exists", async () => {
        const base = makeCreateProjectPayload();
        await ensureProjectExists(base);

        const { payload } = await prepareProjectPayload(base);
        const res = await createProjectRequest(payload);

        expect(res.status).toBe(409);
      })

      it("should return 400 if the payload is invalid", async () => {
        const base = makeCreateProjectPayload();
        const skills = await Skill.find({ name: { $in: base.skills } });
        const skillIds = skills.map(s => s._id.toString());

        const { category: _, skills: __, title: ___, ...baseWithoutCategoryAndSkills } = base;
        const payload = {
            ...baseWithoutCategoryAndSkills,
            categoryId: "some category",
            title: "different title",
            skills: skillIds.join(',') || '',
        };

        const res = await createProjectRequest(payload);
        expect(res.status).toBe(400);

        const base2 = makeCreateProjectPayload();
        const { payload: payload2 } = await prepareProjectPayload(base2, { deadline: "not a date" });

        const res2 = await createProjectRequest(payload2);
        expect(res2.status).toBe(400);
      })

    it('should update project status by passing project id and new status', async() => {
        const base = makeCreateProjectPayload();
        await ensureProjectExists(base);

        const data = {
            status: ProjectStatus.IN_PROGRESS,
        };
        const res = await request(app)
            .patch(`/projects/${projectId}/update_status`)
            .send(data)
            .expect(200);
        expect(res.body.project.status).toBe(ProjectStatus.IN_PROGRESS);
    });

    it('should return 404 because of wrong project id', async() => {
        const base = makeCreateProjectPayload();
        await ensureProjectExists(base);
        projectId = projectId.slice(1) + "1"
        const data = {
            status: ProjectStatus.IN_PROGRESS,
        };
        const res = await request(app)
            .patch(`/projects/${projectId}/update_status`)
            .send(data)
            .expect(404);
    });
    it('should return 400 because of invalid id', async() => {
        const base = makeCreateProjectPayload();
        await ensureProjectExists(base);
        projectId = projectId + "1"
        const data = {
            status: "wrong status",
        };
        const res = await request(app)
        .patch(`/projects/${projectId}/update_status`)
        .send(data)
        .expect(400);
    })
})