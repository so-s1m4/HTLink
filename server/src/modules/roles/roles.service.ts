import { Role } from "./roles.model";

class RolesService {
  static async getRoles() {
    const roles = await Role.find();
    return roles.map(role => ({
      id: role._id.toString(),
      name: role.name
    }));
  }
}

export default RolesService;