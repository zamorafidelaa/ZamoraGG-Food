import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/AdminDashboard";
import "./index.css";
import AdminCouriers from "./pages/AdminCouriers";
import AdminLayout from "./layout/AdminLayout";
import AdminRestaurants from "./pages/AdminRestaurants";
import AdminMenus from "./pages/AdminMenus";
import UnassignedOrders from "./pages/UnassignedOrders";
import About from "./pages/About";
import Menu from "./pages/Menu";
import { CartProvider } from "./components/CartContext";
import Cart from "./pages/Cart";
import CourierDashboard from "./pages/CourierDashboard";
import CustomerOrders from "./pages/CustomerOrders";
import AdminReports from "./pages/AdminReports";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/about", element: <About /> },
      { path: "/login", element: <Login /> },
      { path: "/register", element: <Register /> },
      { path: "/menu", element: <Menu /> },
      { path: "/cart", element: <Cart /> },
      { path: "/orders", element: <CustomerOrders /> },
    ],
  },
  {
    path: "/admin",
    element: <AdminLayout />, // Layout khusus admin
    children: [
      { path: "dashboard", element: <AdminDashboard /> },
      { path: "couriers", element: <AdminCouriers /> },
      { path: "restaurants", element: <AdminRestaurants /> },
      { path: "menus", element: <AdminMenus /> },
      { path: "unassigned", element: <UnassignedOrders /> },
      { path: "reports", element: <AdminReports /> },
    ],
  },
  {
    path: "/courier", // Layout atau halaman khusus kurir
    element: <CourierDashboard />, // bisa juga pakai CourierLayout
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <CartProvider>
      <RouterProvider router={router} />
    </CartProvider>
  </React.StrictMode>
);
