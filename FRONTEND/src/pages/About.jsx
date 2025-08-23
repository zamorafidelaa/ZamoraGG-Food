import React from "react";
import { UtensilsCrossed, Truck, Smartphone, CreditCard } from "lucide-react";
import { motion } from "framer-motion";

const About = () => {
  return (
    <div className="pt-10 pb-24 px-6 lg:px-12 max-w-6xl mx-auto">
      {/* Hero Section */}
      <motion.div
        className="text-center mb-12"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-3xl md:text-4xl font-extrabold text-blue-600 mb-4">
          About <span className="text-blue-400">ZamoraGG Food</span>
        </h1>
        <p className="text-base md:text-lg text-gray-700 max-w-2xl mx-auto">
          At ZamoraGG Food, we believe food is not just about taste—it’s about 
          creating experiences that bring people together. Our mission is to 
          make ordering, delivering, and enjoying meals as seamless as possible. 
        </p>
      </motion.div>

      {/* Features Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        {/* Left Text */}
        <motion.div
          className="space-y-6"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-xl font-bold text-gray-800">
            Why Choose ZamoraGG Food?
          </h2>
          <p className="text-gray-700 leading-relaxed text-sm md:text-base">
            From discovering new restaurants to tracking your orders in real-time, 
            ZamoraGG Food is designed with you in mind. Whether you're craving 
            a quick snack or a full-course meal, we ensure fast, reliable, and 
            hygienic delivery straight to your door.
          </p>

          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: UtensilsCrossed, label: "Variety", color: "text-blue-500" },
              { icon: Truck, label: "Fast", color: "text-green-500" },
              { icon: Smartphone, label: "Tracking", color: "text-purple-500" },
              { icon: CreditCard, label: "Secure", color: "text-red-500" },
            ].map((item, i) => (
              <motion.div
                key={i}
                className="flex items-center gap-3 p-3 bg-white rounded-xl shadow hover:shadow-md transition"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: i * 0.2 }}
                viewport={{ once: true }}
              >
                <item.icon className={`w-6 h-6 ${item.color}`} />
                <span className="text-sm font-medium text-gray-700">{item.label}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Right Image */}
        <motion.div
          className="relative rounded-2xl overflow-hidden shadow-lg"
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <img
            src="img.png"
            alt="Delicious food delivery"
            className="w-full h-[280px] object-cover"
          />
          <div className="absolute inset-0 bg-black/20"></div>
        </motion.div>
      </div>

      {/* Closing Section */}
      <motion.div
        className="mt-16 text-center"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <h2 className="text-xl font-bold text-gray-800 mb-3">
          Our Commitment
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto text-sm md:text-base">
          We are committed to making food delivery more than just convenient—
          we want it to be an enjoyable, safe, and memorable experience for every 
          customer. Thank you for choosing ZamoraGG Food to satisfy your cravings! ✨
        </p>
      </motion.div>
    </div>
  );
};

export default About;
