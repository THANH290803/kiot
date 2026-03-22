const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../utils/cloudinary");

function resolveFolder(req, file) {
    if (req.body.product_id && req.body.variant_id) {
        return `kiot/product/${req.body.product_id}/variant/${req.body.variant_id}`;
    }

    if (file.fieldname === "avatar") {
        return process.env.CLOUDINARY_FOLDER || "avatarProduct";
    }

    return "kiot/product/pending/variant";
}

const storage = new CloudinaryStorage({
    cloudinary,
    params: async (req, file) => ({
        folder: resolveFolder(req, file),
        allowed_formats: ["jpg", "jpeg", "png", "webp"],
    }),
});

const upload = multer({ storage });

module.exports = upload;
