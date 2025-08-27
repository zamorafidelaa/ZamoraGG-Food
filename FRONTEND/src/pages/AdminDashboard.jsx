import React from "react";
import { Link } from "react-router-dom";
import { Users, Coffee, List, Package, ClipboardList } from "lucide-react";

const AdminDashboard = () => {
  const cards = [
    {
      title: "Manage Couriers",
      description: "Add, remove, or update courier information.",
      icon: <Users className="w-6 h-6 text-blue-600" />,
      link: "/admin/couriers",
    },
    {
      title: "Manage Restaurants",
      description: "Manage registered restaurant data.",
      icon: <Coffee className="w-6 h-6 text-blue-600" />,
      link: "/admin/restaurants",
    },
    {
      title: "Manage Menus",
      description: "Update menus and prices for each restaurant.",
      icon: <List className="w-6 h-6 text-blue-600" />,
      link: "/admin/menus",
    },
    {
      title: "Assign Courier",
      description: "Assign couriers to unassigned orders.",
      icon: <Package className="w-6 h-6 text-blue-600" />,
      link: "/admin/unassigned",
    },
    {
      title: "Revenue Reports",
      description: "View all incoming orders and revenue data.",
      icon: <ClipboardList className="w-6 h-6 text-blue-600" />,
      link: "/admin/orders",
    },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold text-blue-800 mb-6">
        Manage Your Platform
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {cards.map((card) => (
          <div
            key={card.title}
            className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between"
          >
            <div className="flex items-center gap-3 mb-4">
              {card.icon}
              <h2 className="font-semibold text-lg text-gray-800">
                {card.title}
              </h2>
            </div>
            <p className="text-gray-600 flex-1">{card.description}</p>
            <Link
              to={card.link}
              className="mt-4 inline-block text-blue-700 font-semibold hover:underline"
            >
              Go
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
