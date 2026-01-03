import { Category } from "./category.model";

class CategoryService {
    static async getCategories() {
        const categories = await Category.find();
        return categories.map(category => ({
            id: category._id.toString(),
            name: category.name
        }));
    }

    static async getCategoriesWithRoles(req: any) {
      const data = await Category.aggregate([
        { $sort: { name: 1 } },
        {
          $lookup: {
            from: "roles",          // важно: коллекция Roles обычно называется "roles"
            localField: "_id",
            foreignField: "category",
            as: "roles"
          }
        },
        {
          $project: {
            _id: 1,
            name: 1,
            roles: {
              $map: {
                input: "$roles",
                as: "r",
                in: { _id: "$$r._id", name: "$$r.name" }
              }
            }
          }
        }
      ]);
      return data.map(item => ({
        id: item._id.toString(),
        name: item.name,
        roles: item.roles.map((role: any) => ({
          id: role._id.toString(),
          name: role.name
        }))
      }));;
    }
}

export default CategoryService;