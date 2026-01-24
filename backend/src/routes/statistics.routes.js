const express = require("express");
const statisticsController = require("../controllers/statistics.controller");
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Statistics
 *   description: Statistics and analytics
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     StatisticsResponse:
 *       type: object
 *       properties:
 *         period:
 *           type: string
 *           enum: [hour, day, week, month]
 *         dateRange:
 *           type: object
 *           properties:
 *             current:
 *               type: object
 *               properties:
 *                 start:
 *                   type: string
 *                   format: date-time
 *                 end:
 *                   type: string
 *                   format: date-time
 *             previous:
 *               type: object
 *               properties:
 *                 start:
 *                   type: string
 *                   format: date-time
 *                 end:
 *                   type: string
 *                   format: date-time
 *         statistics:
 *           type: object
 *           properties:
 *             revenue:
 *               type: object
 *               properties:
 *                 current:
 *                   type: integer
 *                 previous:
 *                   type: integer
 *                 change:
 *                   type: number
 *                   format: float
 *                 trend:
 *                   type: string
 *                   enum: [up, down]
 *             orders:
 *               type: object
 *               properties:
 *                 current:
 *                   type: integer
 *                 previous:
 *                   type: integer
 *                 change:
 *                   type: number
 *                   format: float
 *                 trend:
 *                   type: string
 *                   enum: [up, down]
 *             newCustomers:
 *               type: object
 *               properties:
 *                 current:
 *                   type: integer
 *                 previous:
 *                   type: integer
 *                 change:
 *                   type: number
 *                   format: float
 *                 trend:
 *                   type: string
 *                   enum: [up, down]
 *             estimatedProfit:
 *               type: object
 *               properties:
 *                 current:
 *                   type: integer
 *                 previous:
 *                   type: integer
 *                 change:
 *                   type: number
 *                   format: float
 *                 trend:
 *                   type: string
 *                   enum: [up, down]
 *         summary:
 *           type: object
 *           properties:
 *             totalOrders:
 *               type: integer
 *             totalCustomers:
 *               type: integer
 *             totalRevenue:
 *               type: integer
 *             averageOrderValue:
 *               type: integer
 */

/**
 * @swagger
 * /api/statistics/overview:
 *   get:
 *     summary: Get comprehensive statistics with comparison
 *     tags: [Statistics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: period
 *         schema:
 *           type: string
 *           enum: [hour, day, week, month]
 *           default: day
 *         description: Time period for statistics (hour/day/week/month)
 *     responses:
 *       200:
 *         description: Statistics overview
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StatisticsResponse'
 *       400:
 *         description: Invalid period parameter
 */
router.get("/overview", authMiddleware, statisticsController.getStatistics);

/**
 * @swagger
 * /api/statistics/revenue-chart:
 *   get:
 *     summary: Get revenue chart data for dashboard
 *     tags: [Statistics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: period
 *         schema:
 *           type: string
 *           enum: [day, week, month]
 *           default: month
 *         description: Chart period grouping
 *       - in: query
 *         name: months
 *         schema:
 *           type: integer
 *           default: 12
 *         description: Number of periods to show (for month period) or days/weeks
 *     responses:
 *       200:
 *         description: Revenue chart data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 period:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       label:
 *                         type: string
 *                       revenue:
 *                         type: integer
 *                       orders:
 *                         type: integer
 *                       date:
 *                         type: string
 *                         format: date
 */
router.get("/revenue-chart", authMiddleware, statisticsController.getRevenueChart);

/**
 * @swagger
 * /api/statistics/top-products:
 *   get:
 *     summary: Get top selling products
 *     tags: [Statistics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: period
 *         schema:
 *           type: string
 *           enum: [hour, day, week, month]
 *           default: month
 *         description: Time period for top products
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of top products to return
 *     responses:
 *       200:
 *         description: Top products list
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 period:
 *                   type: string
 *                 dateRange:
 *                   type: object
 *                   properties:
 *                     start:
 *                       type: string
 *                       format: date-time
 *                     end:
 *                       type: string
 *                       format: date-time
 *                 topProducts:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       product_id:
 *                         type: integer
 *                       product_name:
 *                         type: string
 *                       variant_sku:
 *                         type: string
 *                         nullable: true
 *                       total_quantity:
 *                         type: integer
 *                       total_revenue:
 *                         type: integer
 *                       order_count:
 *                         type: integer
 */
router.get("/top-products", authMiddleware, statisticsController.getTopProducts);

/**
 * @swagger
 * /api/statistics/revenue-bar-chart:
 *   get:
 *     summary: Get revenue bar chart data (hourly, daily, weekly, monthly)
 *     tags: [Statistics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: period
 *         schema:
 *           type: string
 *           enum: [hour, day, week, month]
 *           default: day
 *         description: Time period grouping for the chart
 *       - in: query
 *         name: count
 *         schema:
 *           type: integer
 *           default: 24
 *         description: Number of data points to return (e.g., 24 hours, 7 days, 4 weeks, 12 months)
 *     responses:
 *       200:
 *         description: Revenue bar chart data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 period:
 *                   type: string
 *                 count:
 *                   type: integer
 *                 totalRevenue:
 *                   type: integer
 *                 totalOrders:
 *                   type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       label:
 *                         type: string
 *                       revenue:
 *                         type: integer
 *                       orders:
 *                         type: integer
 *                       date:
 *                         type: string
 *                         format: date
 *                       period:
 *                         type: string
 *                       revenuePercentage:
 *                         type: number
 *                         format: float
 *                       ordersPercentage:
 *                         type: number
 *                         format: float
 */
router.get("/revenue-bar-chart", authMiddleware, statisticsController.getRevenueBarChart);

/**
 * @swagger
 * /api/statistics/category-revenue-pie:
 *   get:
 *     summary: Get category revenue distribution pie chart
 *     tags: [Statistics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: period
 *         schema:
 *           type: string
 *           enum: [hour, day, week, month]
 *           default: month
 *         description: Time period for category revenue calculation
 *     responses:
 *       200:
 *         description: Category revenue pie chart data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 period:
 *                   type: string
 *                 dateRange:
 *                   type: object
 *                   properties:
 *                     start:
 *                       type: string
 *                       format: date-time
 *                     end:
 *                       type: string
 *                       format: date-time
 *                 summary:
 *                   type: object
 *                   properties:
 *                     totalRevenue:
 *                       type: integer
 *                     totalOrders:
 *                       type: integer
 *                     totalQuantity:
 *                       type: integer
 *                     categoriesCount:
 *                       type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       category_id:
 *                         type: integer
 *                       category_name:
 *                         type: string
 *                       revenue:
 *                         type: integer
 *                       orders:
 *                         type: integer
 *                       quantity:
 *                         type: integer
 *                       percentage:
 *                         type: number
 *                         format: float
 */
router.get("/category-revenue-pie", authMiddleware, statisticsController.getCategoryRevenuePie);

module.exports = router;