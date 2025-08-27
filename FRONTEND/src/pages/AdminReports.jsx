// src/pages/AdminReports.jsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

const API_BASE = "http://localhost:8080/orders/reports"; // pastikan endpoint sama di backend

const AdminReports = () => {
  const [reportType, setReportType] = useState("daily");
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showChart, setShowChart] = useState(true); // toggle chart

  const fetchReport = async (type) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}?type=${type}`);
      const data = await res.json();
      console.log("Report response:", data);

      // Konversi report object ke array
      const formattedData = Object.entries(data.report || {}).map(
        ([period, totalRevenue]) => ({
          period,
          totalRevenue,
          totalOrders: data.orders_count || 0,
        })
      );

      setReportData(formattedData);
    } catch (err) {
      console.error("Failed to fetch reports:", err);
      setReportData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport(reportType);
  }, [reportType]);

  const totalRevenue = reportData.reduce(
    (sum, r) => sum + (r.totalRevenue || 0),
    0
  );
  const totalOrders = reportData.reduce(
    (sum, r) => sum + (r.totalOrders || 0),
    0
  );
  const avgOrder = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
        <h1 className="text-2xl font-bold text-blue-800">Revenue Reports</h1>
        <div className="flex gap-2">
          <select
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
            className="p-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-300"
          >
            <option value="daily">Daily Report</option>
            <option value="monthly">Monthly Report</option>
            <option value="yearly">Yearly Report</option>
          </select>
          <button
            onClick={() => setShowChart((prev) => !prev)}
            className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            {showChart ? "Hide Chart" : "Show Chart"}
          </button>
        </div>
      </div>

      {loading ? (
        <p className="text-center text-blue-600 font-semibold">Loading...</p>
      ) : (
        <>
          {/* Summary Cards */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="bg-white p-3 rounded-xl shadow text-center">
              <p className="text-sm text-gray-500">Total Revenue</p>
              <p className="text-lg font-bold text-blue-700">
                Rp {totalRevenue.toLocaleString("id-ID")}
              </p>
            </div>
            <div className="bg-white p-3 rounded-xl shadow text-center">
              <p className="text-sm text-gray-500">Total Orders</p>
              <p className="text-lg font-bold text-blue-700">{totalOrders}</p>
            </div>
            <div className="bg-white p-3 rounded-xl shadow text-center">
              <p className="text-sm text-gray-500">Avg. per Order</p>
              <p className="text-lg font-bold text-blue-700">
                Rp {avgOrder.toLocaleString("id-ID")}
              </p>
            </div>
          </motion.div>

          {/* Chart Section (toggle) */}
          {showChart && (
            <motion.div
              className="bg-white p-4 rounded-2xl shadow-md mb-6"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-lg font-bold text-blue-700 mb-3">
                Revenue Chart
              </h2>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  {reportType === "daily" ? (
                    <LineChart data={reportData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="period" />
                      <YAxis />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="totalRevenue"
                        stroke="#3b82f6" // biru untuk daily
                        strokeWidth={2}
                      />
                    </LineChart>
                  ) : reportType === "monthly" ? (
                    <BarChart data={reportData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="period" />
                      <YAxis />
                      <Tooltip />
                      <Bar
                        dataKey="totalRevenue"
                        fill="#16a34a" // hijau untuk monthly
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  ) : (
                    <BarChart data={reportData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="period" />
                      <YAxis />
                      <Tooltip />
                      <Bar
                        dataKey="totalRevenue"
                        fill="#f97316" // oranye untuk yearly
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  )}
                </ResponsiveContainer>
              </div>
            </motion.div>
          )}

          {/* Table Section */}
          <motion.div
            className="overflow-x-auto rounded-lg shadow-md bg-white"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <table className="w-full table-auto">
              <thead className="bg-blue-200 text-blue-900">
                <tr>
                  <th className="p-2 text-left">Period</th>
                  <th className="p-2 text-left">Total Orders</th>
                  <th className="p-2 text-left">Total Revenue</th>
                </tr>
              </thead>
              <tbody>
                {reportData.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="text-center py-3">
                      No data available
                    </td>
                  </tr>
                ) : (
                  reportData.map((row, idx) => (
                    <tr
                      key={idx}
                      className="border-b hover:bg-blue-50 transition-colors"
                    >
                      <td className="p-2">{row.period}</td>
                      <td className="p-2">{row.totalOrders}</td>
                      <td className="p-2 text-blue-700 font-semibold">
                        Rp {row.totalRevenue.toLocaleString("id-ID")}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </motion.div>
        </>
      )}
    </div>
  );
};

export default AdminReports;
