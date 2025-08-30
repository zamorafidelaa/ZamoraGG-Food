import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
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

const API_BASE = `${import.meta.env.VITE_API_BASE_URL}/orders/reports`;

const AdminReports = () => {
  const [reportType, setReportType] = useState("daily");
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showChart, setShowChart] = useState(true);

  const fetchReport = async (type) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}?type=${type}`);
      const data = await res.json();

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

  const handlePrintPDF = () => {
    const doc = new jsPDF("p", "pt", "a4");
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 40;
    let startY = 60;

    const titleMap = {
      daily: "Daily Revenue Report",
      monthly: "Monthly Revenue Report",
      yearly: "Yearly Revenue Report",
    };
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text(titleMap[reportType] || "Revenue Report", pageWidth / 2, startY, {
      align: "center",
    });

    startY += 30;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.text(
      `Total Revenue: Rp ${totalRevenue.toLocaleString("id-ID")}`,
      margin,
      startY
    );
    startY += 20;
    doc.text(`Total Orders: ${totalOrders}`, margin, startY);
    startY += 20;
    doc.text(
      `Avg per Order: Rp ${avgOrder.toLocaleString("id-ID")}`,
      margin,
      startY
    );

    startY += 30;

    autoTable(doc, {
      startY,
      margin: { left: margin, right: margin },
      head: [["Period", "Total Orders", "Total Revenue"]],
      body: reportData.map((r) => [
        r.period,
        r.totalOrders.toLocaleString("id-ID"),
        `Rp ${r.totalRevenue.toLocaleString("id-ID")}`,
      ]),
      styles: { fontSize: 10, cellPadding: 6 },
      headStyles: {
        fillColor: [59, 130, 246],
        textColor: 255,
        halign: "center",
      },
      columnStyles: {
        1: { halign: "right" }, 
        2: { halign: "right" }, 
      },
      alternateRowStyles: { fillColor: [240, 248, 255] },
      didDrawPage: (data) => {
        const str = `Printed: ${new Date().toLocaleString()}`;
        doc.setFontSize(9);
        doc.text(
          str,
          pageWidth - margin,
          doc.internal.pageSize.getHeight() - 10,
          {
            align: "right",
          }
        );
      },
    });

    doc.save(`${reportType}-report.pdf`);
  };

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
        <h1 className="text-2xl font-bold text-blue-800">Revenue Reports</h1>
        <div className="flex gap-2 flex-wrap">
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
          <button
            onClick={handlePrintPDF}
            className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            Print PDF
          </button>
        </div>
      </div>

      {loading ? (
        <p className="text-center text-blue-600 font-semibold">Loading...</p>
      ) : (
        <>
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

          {showChart && (
            <motion.div
              className="bg-white p-4 rounded-2xl shadow-md mb-6"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-lg font-bold text-blue-700 mb-3">
                Revenue Chart (
                {reportType.charAt(0).toUpperCase() + reportType.slice(1)})
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
                        stroke="#3b82f6"
                        strokeWidth={2}
                      />
                    </LineChart>
                  ) : (
                    <BarChart data={reportData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="period" />
                      <YAxis />
                      <Tooltip />
                      <Bar
                        dataKey="totalRevenue"
                        fill={reportType === "monthly" ? "#16a34a" : "#f97316"}
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  )}
                </ResponsiveContainer>
              </div>
            </motion.div>
          )}

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
