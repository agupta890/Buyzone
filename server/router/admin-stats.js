const express = require("express");
const router = express.Router();
const Order = require("../models/orderSchema");
const Product = require("../models/productSchema");
const { protectAdmin } = require("../middleware/authMiddleware");

router.get("/", protectAdmin, async (req, res) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);
    const last30Days = new Date(now - 30 * 24 * 60 * 60 * 1000);
    const last7Days = new Date(now - 7 * 24 * 60 * 60 * 1000);

    const [allOrders, lowStockProducts] = await Promise.all([
      Order.find()
        .populate("user", "name email")
        .populate("items.product", "name image price")
        .lean(),
      Product.find({ stock: { $lt: 5 } }).lean(),
    ]);

    const activeOrders = allOrders.filter(o => o.status !== "Cancelled");

    // Revenue
    const totalRevenue = activeOrders.reduce((s, o) => s + (o.total || 0), 0);
    const thisMonthRevenue = activeOrders
      .filter(o => new Date(o.createdAt) >= startOfMonth)
      .reduce((s, o) => s + (o.total || 0), 0);
    const lastMonthRevenue = activeOrders
      .filter(o => new Date(o.createdAt) >= startOfLastMonth && new Date(o.createdAt) <= endOfLastMonth)
      .reduce((s, o) => s + (o.total || 0), 0);
    const revenueChange = lastMonthRevenue
      ? Math.round(((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100)
      : null;

    // Orders by status
    const statusCounts = {};
    for (const o of allOrders) {
      statusCounts[o.status] = (statusCounts[o.status] || 0) + 1;
    }

    // Active customers this month
    const thisMonthUserIds = new Set(
      activeOrders
        .filter(o => new Date(o.createdAt) >= startOfMonth)
        .map(o => o.user?._id?.toString())
        .filter(Boolean)
    );

    // Open return requests
    const returnRequestCount = allOrders.filter(o => o.status === "Return_Requested").length;

    // Revenue by day — last 30 days
    const revenueByDay = {};
    for (let i = 29; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      revenueByDay[key] = 0;
    }
    for (const o of activeOrders) {
      const day = new Date(o.createdAt).toISOString().slice(0, 10);
      if (revenueByDay[day] !== undefined) revenueByDay[day] += o.total || 0;
    }
    const revenueChart = Object.entries(revenueByDay).map(([date, revenue]) => ({ date, revenue }));

    // Top 5 products by units sold
    const productSales = {};
    for (const o of activeOrders) {
      for (const item of o.items || []) {
        const pid = item.product?._id?.toString();
        if (!pid) continue;
        if (!productSales[pid]) productSales[pid] = { name: item.product?.name || "Unknown", units: 0 };
        productSales[pid].units += item.quantity || 1;
      }
    }
    const topProducts = Object.values(productSales)
      .sort((a, b) => b.units - a.units)
      .slice(0, 5);

    // Recent orders (last 10)
    const recentOrders = allOrders
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 10)
      .map(o => ({
        _id: o._id,
        user: o.user,
        total: o.total,
        status: o.status,
        payment_method: o.payment_method,
        createdAt: o.createdAt,
        itemCount: o.items?.length || 0,
        firstItem: o.items?.[0]?.product,
      }));

    // Open return requests (full)
    const returnRequests = allOrders
      .filter(o => o.status === "Return_Requested")
      .map(o => ({
        _id: o._id,
        user: o.user,
        return_reason: o.return_reason,
        total: o.total,
        createdAt: o.createdAt,
        firstItem: o.items?.[0]?.product,
      }));

    res.json({
      kpi: {
        totalRevenue,
        thisMonthRevenue,
        revenueChange,
        totalOrders: allOrders.length,
        activeCustomers: thisMonthUserIds.size,
        returnRequestCount,
        statusCounts,
      },
      revenueChart,
      topProducts,
      recentOrders,
      lowStockProducts: lowStockProducts.slice(0, 10),
      returnRequests,
    });
  } catch (err) {
    console.error("Admin stats error:", err);
    res.status(500).json({ message: "Failed to fetch stats" });
  }
});

module.exports = router;
