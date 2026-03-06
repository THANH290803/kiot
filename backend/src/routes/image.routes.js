const express = require("express");
const router = express.Router();
const imageController = require("../controllers/image.controller");
const upload = require("../middlewares/upload.middleware");

/**
 * @swagger
 * tags:
 *   name: Images
 *   description: Quản lý ảnh sản phẩm / biến thể
 */

/**
 * @swagger
 * /api/images/upload:
 *   post:
 *     summary: Upload nhiều ảnh cho biến thể sản phẩm
 *     tags: [Images]
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - product_id
 *               - variant_id
 *               - images
 *             properties:
 *               product_id:
 *                 type: integer
 *               variant_id:
 *                 type: integer
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: Upload ảnh thành công
 *       400:
 *         description: Dữ liệu không hợp lệ
 *       500:
 *         description: Lỗi server
 */
router.post(
    "/upload",
    upload.array("images", 10),
    imageController.uploadMultiple
);

/**
 * @swagger
 * /api/images:
 *   get:
 *     summary: Lấy danh sách ảnh (theo variant nếu có)
 *     tags: [Images]
 *     parameters:
 *       - in: query
 *         name: variant_id
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Danh sách ảnh
 *       500:
 *         description: Lỗi server
 */
router.get("/", imageController.findAllGroupedByVariant);

/**
 * @swagger
 * /api/images/{id}:
 *   get:
 *     summary: Lấy chi tiết ảnh
 *     tags: [Images]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Thông tin ảnh
 *       404:
 *         description: Không tìm thấy ảnh
 *       500:
 *         description: Lỗi server
 */
router.get("/:id", imageController.findOne);

/**
 * @swagger
 * /api/images/{id}/primary:
 *   patch:
 *     summary: Đặt ảnh làm ảnh chính của biến thể
 *     tags: [Images]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Đặt ảnh chính thành công
 *       404:
 *         description: Không tìm thấy ảnh
 *       500:
 *         description: Lỗi server
 */
router.patch("/:id/primary", imageController.setPrimary);

/**
 * @swagger
 * /api/images/{id}:
 *   delete:
 *     summary: Xoá ảnh (xoá mềm)
 *     tags: [Images]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Xoá ảnh thành công
 *       404:
 *         description: Không tìm thấy ảnh
 *       500:
 *         description: Lỗi server
 */
router.delete("/:id", imageController.delete);

module.exports = router;