const db = require("../models");
const Category = db.Category;
const Product = db.Product;

const categoryInclude = [
  {
    model: Category,
    as: "parent",
    attributes: ["id", "name"],
    required: false,
  },
];

function normalizeParentId(parentId) {
  if (parentId === undefined) return undefined;
  if (parentId === null || parentId === "" || parentId === "null") return null;

  const parsed = Number(parentId);
  return Number.isFinite(parsed) ? parsed : NaN;
}

function formatCategory(category, childrenCount = 0) {
  const plain = category.toJSON ? category.toJSON() : category;

  return {
    id: plain.id,
    name: plain.name,
    description: plain.description,
    parent_id: plain.parent_id ?? null,
    parent: plain.parent || null,
    children_count: childrenCount,
    deleted_at: plain.deleted_at,
    created_at: plain.created_at,
    updated_at: plain.updated_at,
  };
}

async function getActiveCategories() {
  return Category.findAll({
    where: { deleted_at: null },
    include: categoryInclude,
    order: [
      ["parent_id", "ASC"],
      ["id", "DESC"],
    ],
  });
}

function buildTree(categories) {
  const nodesById = new Map();
  const roots = [];

  categories.forEach((category) => {
    const node = {
      ...formatCategory(category),
      children: [],
    };
    nodesById.set(String(node.id), node);
  });

  nodesById.forEach((node) => {
    if (node.parent_id && nodesById.has(String(node.parent_id))) {
      nodesById.get(String(node.parent_id)).children.push(node);
      return;
    }

    roots.push(node);
  });

  return roots;
}

async function validateParentId(parentId, categoryId = null) {
  const normalizedParentId = normalizeParentId(parentId);

  if (Number.isNaN(normalizedParentId)) {
    return { error: "parent_id must be a valid category id or null" };
  }

  if (normalizedParentId === undefined || normalizedParentId === null) {
    return { parent_id: normalizedParentId };
  }

  if (categoryId && String(normalizedParentId) === String(categoryId)) {
    return { error: "parent_id cannot point to itself" };
  }

  const parent = await Category.findOne({
    where: {
      id: normalizedParentId,
      deleted_at: null,
    },
  });

  if (!parent) {
    return { error: "Parent category not found" };
  }

  if (categoryId) {
    let cursor = parent;
    const visited = new Set();

    while (cursor?.parent_id) {
      if (visited.has(String(cursor.id))) break;
      visited.add(String(cursor.id));

      if (String(cursor.parent_id) === String(categoryId)) {
        return { error: "parent_id cannot point to a child category" };
      }

      cursor = await Category.findOne({
        where: {
          id: cursor.parent_id,
          deleted_at: null,
        },
      });
    }
  }

  return { parent_id: normalizedParentId };
}

async function countChildrenByParentId(categories) {
  const counts = new Map();

  categories.forEach((category) => {
    if (!category.parent_id) return;
    const key = String(category.parent_id);
    counts.set(key, (counts.get(key) || 0) + 1);
  });

  return counts;
}

// ================= GET ALL (CHƯA XOÁ - DESC) =================
exports.findAll = async (req, res) => {
  try {
    const categories = await getActiveCategories();
    const childCounts = await countChildrenByParentId(categories);

    res.json(
      categories.map((category) =>
        formatCategory(category, childCounts.get(String(category.id)) || 0)
      )
    );
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ================= GET TREE (CHƯA XOÁ) =================
exports.findTree = async (req, res) => {
  try {
    const categories = await getActiveCategories();
    res.json(buildTree(categories));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ================= GET ONE (CHƯA XOÁ) =================
exports.findOne = async (req, res) => {
  try {
    const category = await Category.findOne({
      where: {
        id: req.params.id,
        deleted_at: null, // ✅
      },
      include: categoryInclude,
    });

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    const childrenCount = await Category.count({
      where: {
        parent_id: category.id,
        deleted_at: null,
      },
    });

    res.json(formatCategory(category, childrenCount));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ================= CREATE =================
exports.create = async (req, res) => {
  try {
    const { name, description, parent_id } = req.body;

    if (!name) {
      return res.status(400).json({ message: "name is required" });
    }

    const parentValidation = await validateParentId(parent_id);
    if (parentValidation.error) {
      return res.status(400).json({ message: parentValidation.error });
    }

    const category = await Category.create({
      name,
      description: description || null,
      parent_id: parentValidation.parent_id ?? null,
    });

    const result = await Category.findByPk(category.id, {
      include: categoryInclude,
    });

    res.status(201).json(formatCategory(result));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ================= UPDATE (CHƯA XOÁ) =================
exports.update = async (req, res) => {
  try {
    const category = await Category.findOne({
      where: {
        id: req.params.id,
        deleted_at: null, // ✅ không cho update category đã xoá
      },
    });

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    const updateData = {};

    if (req.body.name !== undefined) updateData.name = req.body.name;
    if (req.body.description !== undefined) {
      updateData.description = req.body.description || null;
    }

    if (req.body.parent_id !== undefined) {
      const parentValidation = await validateParentId(req.body.parent_id, category.id);
      if (parentValidation.error) {
        return res.status(400).json({ message: parentValidation.error });
      }

      updateData.parent_id = parentValidation.parent_id;
    }

    await category.update(updateData);

    const result = await Category.findByPk(category.id, {
      include: categoryInclude,
    });

    res.json(formatCategory(result));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ================= DELETE (XOÁ MỀM) =================
exports.delete = async (req, res) => {
  try {
    const category = await Category.findOne({
      where: {
        id: req.params.id,
        deleted_at: null, // ✅
      },
    });

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    const childrenCount = await Category.count({
      where: {
        parent_id: category.id,
        deleted_at: null,
      },
    });

    if (childrenCount > 0) {
      return res.status(400).json({
        message: "Cannot delete a category that still has child categories",
      });
    }

    const productsCount = await Product.count({
      where: {
        category_id: category.id,
        deleted_at: null,
      },
    });

    if (productsCount > 0) {
      return res.status(400).json({
        message: "Cannot delete a category that is assigned to products",
      });
    }

    await category.update({
      deleted_at: new Date(), // ✅ XOÁ MỀM
    });

    res.json({ message: "Category deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
