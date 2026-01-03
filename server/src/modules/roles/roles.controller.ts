import { Types } from "mongoose";
import { Role } from "./roles.model";

export async function getRoles(req: any, res: any) {
  try {
    const { categoryId, q, page = "1", limit = "50" } = req.query;

    if (!categoryId || !Types.ObjectId.isValid(String(categoryId))) {
      return res.status(400).json({ message: "Invalid or missing categoryId" });
    }

    const pageNum = Math.max(parseInt(String(page), 10) || 1, 1);
    const limitNum = Math.min(Math.max(parseInt(String(limit), 10) || 50, 1), 200);

    const filter: any = { category: new Types.ObjectId(String(categoryId)) };

    if (q && String(q).trim()) {
      filter.name = { $regex: String(q).trim(), $options: "i" };
    }

    const [items, total] = await Promise.all([
      Role.find(filter)
        .select("_id name category")
        .sort({ name: 1 })
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum)
        .lean(),
      Role.countDocuments(filter)
    ]);

    return res.json({
      items,
      page: pageNum,
      limit: limitNum,
      total
    });
  } catch (e) {
    return res.status(500).json({ message: "Server error" });
  }
}