const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../utils/cloudinary");

const storage = new CloudinaryStorage({
    cloudinary,
    params: async (req, file) => ({
        folder: `kiot/product/${req.body.product_id}/variant/${req.body.variant_id}`,
        allowed_formats: ["jpg", "jpeg", "png", "webp"],
    }),
});

const upload = multer({ storage });

module.exports = upload;