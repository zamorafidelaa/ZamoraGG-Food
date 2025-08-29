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
import Cart from "./pages/Cart";
import CourierDashboard from "./pages/CourierDashboard";
import CustomerOrders from "./pages/CustomerOrders";
import AdminReports from "./pages/AdminReports";
import Profile from "./pages/Profile";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/register", element: <Register /> },
      { path: "/login", element: <Login /> },
      { path: "/about", element: <About /> },
      { path: "/menu", element: <Menu /> },
      { path: "/cart", element: <Cart /> },
      { path: "/orders", element: <CustomerOrders /> },
      { path: "/profile", element: <Profile /> },
    ],
  },
  {
    path: "/admin",
    element: <AdminLayout />,
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
    path: "/courier",
    element: <CourierDashboard />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
