import { Category } from "../modules/categories/category.model";
import { Role } from "../modules/roles/roles.model";

export const categoriesWithRole = {
  "Web Development": [
    "Frontend Developer",
    "Backend Developer",
    "Fullstack Developer",
    "Web Developer",
    "JavaScript Developer",
    "TypeScript Developer",
    "PHP Developer",
    "Ruby on Rails Developer",
    "WordPress Developer",
    "Web Performance Engineer"
  ],

  "Frontend Development": [
    "Frontend Developer",
    "React Developer",
    "Vue.js Developer",
    "Angular Developer",
    "UI Developer",
    "CSS Engineer",
    "Web Accessibility Specialist"
  ],

  "Backend Development": [
    "Backend Developer",
    "Node.js Developer",
    "Java Developer",
    "Python Developer",
    "Go Developer",
    "C# Developer",
    "API Developer",
    "Microservices Engineer"
  ],

  "Mobile Development": [
    "Android Developer",
    "iOS Developer",
    "Flutter Developer",
    "React Native Developer",
    "Mobile App Developer",
    "Swift Developer",
    "Kotlin Developer"
  ],

  "Game Development": [
    "Game Developer",
    "Unity Developer",
    "Unreal Engine Developer",
    "Gameplay Programmer",
    "Game Engine Developer",
    "Game Designer",
    "Technical Artist"
  ],

  "DevOps & Infrastructure": [
    "DevOps Engineer",
    "Site Reliability Engineer (SRE)",
    "Cloud Engineer",
    "Platform Engineer",
    "Build Engineer",
    "Release Engineer",
    "Infrastructure Engineer"
  ],

  "Cloud Computing": [
    "Cloud Architect",
    "AWS Engineer",
    "Azure Engineer",
    "Google Cloud Engineer",
    "Cloud Security Engineer",
    "Cloud Consultant"
  ],

  "Data & Analytics": [
    "Data Analyst",
    "Data Engineer",
    "Data Scientist",
    "BI Developer",
    "Analytics Engineer",
    "Big Data Engineer"
  ],

  "Artificial Intelligence & ML": [
    "Machine Learning Engineer",
    "AI Engineer",
    "Deep Learning Engineer",
    "NLP Engineer",
    "Computer Vision Engineer",
    "ML Researcher"
  ],

  "Cybersecurity": [
    "Security Engineer",
    "Cybersecurity Analyst",
    "Penetration Tester",
    "Ethical Hacker",
    "SOC Analyst",
    "Security Architect",
    "Incident Response Specialist"
  ],

  "QA & Testing": [
    "QA Engineer",
    "Manual QA Tester",
    "Automation QA Engineer",
    "Test Engineer",
    "Performance Tester",
    "Security Tester"
  ],

  "UI / UX & Design": [
    "UI Designer",
    "UX Designer",
    "Product Designer",
    "Interaction Designer",
    "UX Researcher",
    "Design Systems Engineer"
  ],

  "Product & Management": [
    "Product Manager",
    "Project Manager",
    "Technical Product Manager",
    "Scrum Master",
    "Agile Coach",
    "Program Manager"
  ],

  "Embedded & Hardware": [
    "Embedded Software Engineer",
    "Firmware Engineer",
    "IoT Developer",
    "Robotics Engineer",
    "Hardware Engineer"
  ],

  "Blockchain & Web3": [
    "Blockchain Developer",
    "Smart Contract Developer",
    "Solidity Developer",
    "Web3 Developer",
    "Crypto Engineer"
  ],

  "AR / VR": [
    "AR Developer",
    "VR Developer",
    "XR Engineer",
    "Metaverse Developer",
    "3D Application Developer"
  ],

  "IT Support & Administration": [
    "System Administrator",
    "Network Administrator",
    "IT Support Specialist",
    "Help Desk Technician",
    "IT Operations Engineer"
  ],

  "Database & Storage": [
    "Database Administrator (DBA)",
    "Database Engineer",
    "SQL Developer",
    "NoSQL Engineer",
    "Data Storage Architect"
  ]
}

type CategoryName = keyof typeof categoriesWithRole;

export default class SetCategoriesAndRoles {
  private categories: CategoryName[];

  constructor(categories?: CategoryName[]) {
    this.categories = categories?.length
      ? categories
      : (Object.keys(categoriesWithRole) as CategoryName[]);
  }

  async set() {
    // 1) Upsert categories
    await Promise.all(
      this.categories.map((name) =>
        Category.updateOne({ name }, { $set: { name } }, { upsert: true })
      )
    );

    // 2) Load categories to map name -> _id
    const categoryDocs = await Category.find({ name: { $in: this.categories } })
      .select("_id name")
      .lean();

    const catIdByName = new Map<string, any>(
      categoryDocs.map((c: any) => [c.name, c._id])
    );

    // 3) Upsert roles
    const roleOps = [];

    for (const catName of this.categories) {
      const categoryId = catIdByName.get(catName);
      if (!categoryId) continue;

      for (const roleName of categoriesWithRole[catName]) {
        roleOps.push({
          updateOne: {
            filter: { category: categoryId, name: roleName },
            update: { $set: { category: categoryId, name: roleName } },
            upsert: true
          }
        });
      }
    }

    if (roleOps.length) {
      await Role.bulkWrite(roleOps, { ordered: false });
    }

    console.log("Categories and roles were set");
  }
}