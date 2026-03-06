const db = require("../models");
const Image = db.Image;

/**
 * ================= CREATE (UPLOAD MULTIPLE)
 */
exports.uploadMultiple = async (req, res) => {
    try {
        const { variant_id } = req.body;

        if (!variant_id)
            return res.status(400).json({ message: "variant_id is required" });

        if (!req.files || req.files.length === 0)
            return res.status(400).json({ message: "No images uploaded" });

        const createdImages = await Promise.all(
            req.files.map((file, index) =>
                Image.create({
                    variant_id,
                    url: file.path,
                    sort_order: index,
                })
            )
        );

        // 👇 Format lại response
        const response = {
            variant_id: Number(variant_id),
            images: createdImages.map((img) => ({
                id: img.id,
                url: img.url,
                is_primary: img.is_primary,
                sort_order: img.sort_order,
                created_at: img.created_at,
            })),
        };

        return res.status(201).json(response);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

/**
 * ================= GET ALL (THEO PRODUCT / VARIANT)
 */
exports.findAllGroupedByVariant = async (req, res) => {
    try {
        const images = await Image.findAll({
            where: { deleted_at: null },
            order: [
                ["variant_id", "ASC"],
                ["sort_order", "ASC"],
            ],
        });

        const grouped = images.reduce((acc, img) => {
            if (!acc[img.variant_id]) {
                acc[img.variant_id] = {
                    variant_id: img.variant_id,
                    images: [],
                };
            }

            acc[img.variant_id].images.push({
                id: img.id,
                url: img.url,
                is_primary: img.is_primary,
                sort_order: img.sort_order,
            });

            return acc;
        }, {});

        return res.status(200).json(Object.values(grouped));
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message });
    }
};

/**
 * ================= GET ONE (GROUP BY VARIANT)
 */
exports.findOne = async (req, res) => {
    try {
        const image = await Image.findByPk(req.params.id);

        if (!image || image.deleted_at)
            return res.status(404).json({ message: "Image not found" });

        const images = await Image.findAll({
            where: {
                variant_id: image.variant_id,
                deleted_at: null,
            },
            order: [["sort_order", "ASC"]],
        });

        return res.json({
            variant_id: image.variant_id,
            images: images.map((img) => ({
                id: img.id,
                url: img.url,
                is_primary: img.is_primary,
                sort_order: img.sort_order,
                created_at: img.created_at,
            })),
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

/**
 * ================= UPDATE (SET PRIMARY)
 */
exports.setPrimary = async (req, res) => {
    const { id } = req.params;

    const image = await Image.findByPk(id);
    if (!image) return res.status(404).json({ message: "Image not found" });

    // reset primary
    await Image.update(
        { is_primary: false },
        { where: { variant_id: image.variant_id } }
    );

    await image.update({ is_primary: true });

    res.json({ message: "Set primary image success" });
};

/**
 * ================= DELETE (SOFT)
 */
exports.delete = async (req, res) => {
    const image = await Image.findByPk(req.params.id);
    if (!image) return res.status(404).json({ message: "Image not found" });

    await image.update({ deleted_at: new Date() });

    res.json({ message: "Image deleted" });
};