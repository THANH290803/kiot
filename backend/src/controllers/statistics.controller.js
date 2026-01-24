const db = require("../models");
const { Op, Sequelize } = require("sequelize");

const Order = db.Order;
const OrderItem = db.OrderItem;
const Customer = db.Customer;
const User = db.User;

// Helper function to get date ranges
const getDateRange = (period, date = new Date()) => {
  const now = new Date(date);
  let startDate, endDate, previousStartDate, previousEndDate;

  switch (period) {
    case 'hour':
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours());
      endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours() + 1);
      previousStartDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours() - 1);
      previousEndDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours());
      break;

    case 'day':
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
      previousStartDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
      previousEndDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      break;

    case 'week':
      const currentDay = now.getDay();
      const diff = now.getDate() - currentDay + (currentDay === 0 ? -6 : 1); // Adjust for Sunday
      startDate = new Date(now.setDate(diff));
      startDate.setHours(0, 0, 0, 0);
      endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 7);

      previousStartDate = new Date(startDate);
      previousStartDate.setDate(startDate.getDate() - 7);
      previousEndDate = new Date(startDate);
      break;

    case 'month':
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      endDate = new Date(now.getFullYear(), now.getMonth() + 1, 1);
      previousStartDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      previousEndDate = new Date(now.getFullYear(), now.getMonth(), 1);
      break;

    default:
      throw new Error('Invalid period. Use: hour, day, week, month');
  }

  return { startDate, endDate, previousStartDate, previousEndDate };
};

// Helper function to calculate percentage change
const calculateChange = (current, previous) => {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
};

// ===== GET STATISTICS =====
exports.getStatistics = async (req, res) => {
  try {
    const { period = 'day' } = req.query;

    if (!['hour', 'day', 'week', 'month'].includes(period)) {
      return res.status(400).json({
        message: "Invalid period. Use: hour, day, week, month"
      });
    }

    const { startDate, endDate, previousStartDate, previousEndDate } = getDateRange(period);

    // Revenue Statistics
    const currentRevenueResult = await Order.findAll({
      where: {
        deleted_at: null,
        created_at: {
          [Op.gte]: startDate,
          [Op.lt]: endDate
        }
      },
      attributes: [
        [Sequelize.fn('SUM', Sequelize.col('total_amount')), 'total']
      ],
      raw: true
    });

    const previousRevenueResult = await Order.findAll({
      where: {
        deleted_at: null,
        created_at: {
          [Op.gte]: previousStartDate,
          [Op.lt]: previousEndDate
        }
      },
      attributes: [
        [Sequelize.fn('SUM', Sequelize.col('total_amount')), 'total']
      ],
      raw: true
    });

    const currentRevenue = parseInt(currentRevenueResult[0]?.total || 0);
    const previousRevenue = parseInt(previousRevenueResult[0]?.total || 0);
    const revenueChange = calculateChange(currentRevenue, previousRevenue);

    // Orders Count Statistics
    const currentOrdersCount = await Order.count({
      where: {
        deleted_at: null,
        created_at: {
          [Op.gte]: startDate,
          [Op.lt]: endDate
        }
      }
    });

    const previousOrdersCount = await Order.count({
      where: {
        deleted_at: null,
        created_at: {
          [Op.gte]: previousStartDate,
          [Op.lt]: previousEndDate
        }
      }
    });

    const ordersChange = calculateChange(currentOrdersCount, previousOrdersCount);

    // New Customers Statistics
    const currentNewCustomers = await Customer.count({
      where: {
        deleted_at: null,
        created_at: {
          [Op.gte]: startDate,
          [Op.lt]: endDate
        }
      }
    });

    const previousNewCustomers = await Customer.count({
      where: {
        deleted_at: null,
        created_at: {
          [Op.gte]: previousStartDate,
          [Op.lt]: previousEndDate
        }
      }
    });

    const customersChange = calculateChange(currentNewCustomers, previousNewCustomers);

    // Estimated Profit (assuming 20% profit margin)
    const profitMargin = 0.2; // 20%
    const currentProfit = Math.round(currentRevenue * profitMargin);
    const previousProfit = Math.round(previousRevenue * profitMargin);
    const profitChange = calculateChange(currentProfit, previousProfit);

    // Additional metrics
    const totalOrdersAllTime = await Order.count({
      where: { deleted_at: null }
    });

    const totalCustomers = await Customer.count({
      where: { deleted_at: null }
    });

    const totalRevenueAllTimeResult = await Order.findAll({
      where: { deleted_at: null },
      attributes: [
        [Sequelize.fn('SUM', Sequelize.col('total_amount')), 'total']
      ],
      raw: true
    });

    const totalRevenueAllTime = parseInt(totalRevenueAllTimeResult[0]?.total || 0);

    const response = {
      period,
      dateRange: {
        current: {
          start: startDate.toISOString(),
          end: endDate.toISOString()
        },
        previous: {
          start: previousStartDate.toISOString(),
          end: previousEndDate.toISOString()
        }
      },
      statistics: {
        revenue: {
          current: currentRevenue,
          previous: previousRevenue,
          change: parseFloat(revenueChange.toFixed(2)),
          trend: revenueChange >= 0 ? 'up' : 'down'
        },
        orders: {
          current: currentOrdersCount,
          previous: previousOrdersCount,
          change: parseFloat(ordersChange.toFixed(2)),
          trend: ordersChange >= 0 ? 'up' : 'down'
        },
        newCustomers: {
          current: currentNewCustomers,
          previous: previousNewCustomers,
          change: parseFloat(customersChange.toFixed(2)),
          trend: customersChange >= 0 ? 'up' : 'down'
        },
        estimatedProfit: {
          current: currentProfit,
          previous: previousProfit,
          change: parseFloat(profitChange.toFixed(2)),
          trend: profitChange >= 0 ? 'up' : 'down'
        }
      },
      summary: {
        totalOrders: totalOrdersAllTime,
        totalCustomers: totalCustomers,
        totalRevenue: totalRevenueAllTime,
        averageOrderValue: totalOrdersAllTime > 0 ? Math.round(totalRevenueAllTime / totalOrdersAllTime) : 0
      }
    };

    res.json(response);
  } catch (error) {
    console.error('Statistics error:', error);
    res.status(500).json({ message: error.message });
  }
};

// ===== GET REVENUE CHART DATA =====
exports.getRevenueChart = async (req, res) => {
  try {
    const { period = 'month', months = 12 } = req.query;

    if (!['day', 'week', 'month'].includes(period)) {
      return res.status(400).json({
        message: "Invalid period for chart. Use: day, week, month"
      });
    }

    const chartData = [];
    const now = new Date();

    for (let i = parseInt(months) - 1; i >= 0; i--) {
      let startDate, endDate, label;

      if (period === 'month') {
        startDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
        endDate = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
        label = startDate.toLocaleDateString('vi-VN', { month: 'short', year: 'numeric' });
      } else if (period === 'week') {
        const weekStart = new Date(now);
        weekStart.setDate(now.getDate() - (i * 7) - now.getDay() + 1);
        startDate = new Date(weekStart);
        endDate = new Date(weekStart);
        endDate.setDate(startDate.getDate() + 7);
        label = `Tuần ${Math.ceil(startDate.getDate() / 7)}/${startDate.getMonth() + 1}`;
      } else { // day
        startDate = new Date(now);
        startDate.setDate(now.getDate() - i);
        endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 1);
        label = startDate.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
      }

      const revenueResult = await Order.findAll({
        where: {
          deleted_at: null,
          created_at: {
            [Op.gte]: startDate,
            [Op.lt]: endDate
          }
        },
        attributes: [
          [Sequelize.fn('SUM', Sequelize.col('total_amount')), 'total'],
          [Sequelize.fn('COUNT', Sequelize.col('id')), 'count']
        ],
        raw: true
      });

      chartData.push({
        label,
        revenue: parseInt(revenueResult[0]?.total || 0),
        orders: parseInt(revenueResult[0]?.count || 0),
        date: startDate.toISOString().split('T')[0]
      });
    }

    res.json({
      period,
      data: chartData
    });
  } catch (error) {
    console.error('Revenue chart error:', error);
    res.status(500).json({ message: error.message });
  }
};

// ===== GET TOP PRODUCTS =====
exports.getTopProducts = async (req, res) => {
  try {
    const { limit = 10, period = 'month' } = req.query;

    const { startDate, endDate } = getDateRange(period);

    const topProducts = await OrderItem.findAll({
      where: {
        '$order.deleted_at$': null,
        '$order.created_at$': {
          [Op.gte]: startDate,
          [Op.lt]: endDate
        }
      },
      include: [
        {
          model: Order,
          as: 'order',
          attributes: []
        },
        {
          model: db.Product,
          as: 'product',
          attributes: ['id', 'name']
        },
        {
          model: db.ProductVariant,
          as: 'variant',
          attributes: ['id', 'sku'],
          required: false
        }
      ],
      attributes: [
        'product_id',
        [Sequelize.fn('SUM', Sequelize.col('quantity')), 'total_quantity'],
        [Sequelize.fn('SUM', Sequelize.col('total')), 'total_revenue'],
        [Sequelize.fn('COUNT', Sequelize.col('order_id')), 'order_count']
      ],
      group: ['product_id', 'product.id', 'product.name', 'variant.id', 'variant.sku'],
      order: [[Sequelize.fn('SUM', Sequelize.col('total')), 'DESC']],
      limit: parseInt(limit),
      raw: true
    });

    const formattedProducts = topProducts.map(item => ({
      product_id: item.product_id,
      product_name: item['product.name'],
      variant_sku: item['variant.sku'] || null,
      total_quantity: parseInt(item.total_quantity),
      total_revenue: parseInt(item.total_revenue),
      order_count: parseInt(item.order_count)
    }));

    res.json({
      period,
      dateRange: {
        start: startDate.toISOString(),
        end: endDate.toISOString()
      },
      topProducts: formattedProducts
    });
  } catch (error) {
    console.error('Top products error:', error);
    res.status(500).json({ message: error.message });
  }
};

// ===== GET REVENUE BAR CHART =====
exports.getRevenueBarChart = async (req, res) => {
  try {
    const { period = 'day', count = 24 } = req.query;

    if (!['hour', 'day', 'week', 'month'].includes(period)) {
      return res.status(400).json({
        message: "Invalid period. Use: hour, day, week, month"
      });
    }

    const chartData = [];
    const now = new Date();

    // Generate data points based on period
    for (let i = parseInt(count) - 1; i >= 0; i--) {
      let startDate, endDate, label;

      switch (period) {
        case 'hour':
          // Last 24 hours
          startDate = new Date(now.getTime() - (i + 1) * 60 * 60 * 1000);
          endDate = new Date(now.getTime() - i * 60 * 60 * 1000);
          label = startDate.toLocaleTimeString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit'
          });
          break;

        case 'day':
          // Last N days
          startDate = new Date(now);
          startDate.setDate(now.getDate() - i);
          startDate.setHours(0, 0, 0, 0);
          endDate = new Date(startDate);
          endDate.setDate(startDate.getDate() + 1);
          label = startDate.toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit'
          });
          break;

        case 'week':
          // Last N weeks
          startDate = new Date(now);
          startDate.setDate(now.getDate() - (i * 7) - now.getDay() + 1);
          endDate = new Date(startDate);
          endDate.setDate(startDate.getDate() + 7);
          const weekNum = Math.ceil(startDate.getDate() / 7);
          label = `Tuần ${weekNum}/${startDate.getMonth() + 1}`;
          break;

        case 'month':
          // Last N months
          startDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
          endDate = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
          label = startDate.toLocaleDateString('vi-VN', {
            month: 'short',
            year: 'numeric'
          });
          break;
      }

      const revenueResult = await Order.findAll({
        where: {
          deleted_at: null,
          created_at: {
            [Op.gte]: startDate,
            [Op.lt]: endDate
          }
        },
        attributes: [
          [Sequelize.fn('SUM', Sequelize.col('total_amount')), 'revenue'],
          [Sequelize.fn('COUNT', Sequelize.col('id')), 'orders']
        ],
        raw: true
      });

      const revenue = parseInt(revenueResult[0]?.revenue || 0);
      const orders = parseInt(revenueResult[0]?.orders || 0);

      chartData.push({
        label,
        revenue,
        orders,
        date: startDate.toISOString().split('T')[0],
        period: period
      });
    }

    // Calculate totals for percentage
    const totalRevenue = chartData.reduce((sum, item) => sum + item.revenue, 0);
    const totalOrders = chartData.reduce((sum, item) => sum + item.orders, 0);

    const chartDataWithPercentage = chartData.map(item => ({
      ...item,
      revenuePercentage: totalRevenue > 0 ? parseFloat(((item.revenue / totalRevenue) * 100).toFixed(2)) : 0,
      ordersPercentage: totalOrders > 0 ? parseFloat(((item.orders / totalOrders) * 100).toFixed(2)) : 0
    }));

    res.json({
      period,
      count: parseInt(count),
      totalRevenue,
      totalOrders,
      data: chartDataWithPercentage
    });
  } catch (error) {
    console.error('Revenue bar chart error:', error);
    res.status(500).json({ message: error.message });
  }
};

// ===== GET CATEGORY REVENUE PIE CHART =====
exports.getCategoryRevenuePie = async (req, res) => {
  try {
    const { period = 'month' } = req.query;

    if (!['hour', 'day', 'week', 'month'].includes(period)) {
      return res.status(400).json({
        message: "Invalid period. Use: hour, day, week, month"
      });
    }

    const { startDate, endDate } = getDateRange(period);

    const categoryRevenue = await OrderItem.findAll({
      where: {
        '$order.deleted_at$': null,
        '$order.created_at$': {
          [Op.gte]: startDate,
          [Op.lt]: endDate
        }
      },
      include: [
        {
          model: Order,
          as: 'order',
          attributes: []
        },
        {
          model: db.Product,
          as: 'product',
          attributes: ['id', 'name'],
          include: [
            {
              model: db.Category,
              as: 'category',
              attributes: ['id', 'name']
            }
          ]
        }
      ],
      attributes: [
        [Sequelize.fn('SUM', Sequelize.col('total')), 'revenue'],
        [Sequelize.fn('COUNT', Sequelize.col('order_id')), 'orders'],
        [Sequelize.fn('SUM', Sequelize.col('quantity')), 'quantity']
      ],
      group: ['product.category.id', 'product.category.name'],
      order: [[Sequelize.fn('SUM', Sequelize.col('total')), 'DESC']],
      raw: true
    });

    const totalRevenue = categoryRevenue.reduce((sum, item) => sum + parseInt(item.revenue || 0), 0);
    const totalOrders = categoryRevenue.reduce((sum, item) => sum + parseInt(item.orders || 0), 0);
    const totalQuantity = categoryRevenue.reduce((sum, item) => sum + parseInt(item.quantity || 0), 0);

    const pieData = categoryRevenue.map(item => ({
      category_id: item['product.category.id'],
      category_name: item['product.category.name'],
      revenue: parseInt(item.revenue || 0),
      orders: parseInt(item.orders || 0),
      quantity: parseInt(item.quantity || 0),
      percentage: totalRevenue > 0 ? parseFloat(((parseInt(item.revenue || 0) / totalRevenue) * 100).toFixed(2)) : 0
    }));

    res.json({
      period,
      dateRange: {
        start: startDate.toISOString(),
        end: endDate.toISOString()
      },
      summary: {
        totalRevenue,
        totalOrders,
        totalQuantity,
        categoriesCount: pieData.length
      },
      data: pieData
    });
  } catch (error) {
    console.error('Category revenue pie error:', error);
    res.status(500).json({ message: error.message });
  }
};