import React from "react";
import { UtensilsCrossed, Truck, Smartphone, CreditCard } from "lucide-react";
import { motion } from "framer-motion";

const About = () => {
  return (
    <div className="pt-8 sm:pt-10 pb-16 sm:pb-24 px-4 sm:px-6 lg:px-12 max-w-6xl mx-auto">
      <motion.div
        className="text-center mb-10 sm:mb-12"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-blue-600 mb-3 sm:mb-4">
          About <span className="text-blue-400">ZamoraGG Food</span>
        </h1>
        <p className="text-sm sm:text-base md:text-lg text-gray-700 max-w-full sm:max-w-xl md:max-w-2xl mx-auto">
          At ZamoraGG Food, we believe food is not just about taste—it’s about
          creating experiences that bring people together. Our mission is to
          make ordering, delivering, and enjoying meals as seamless as possible.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10 items-center">
        <motion.div
          className="space-y-6"
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">
            Why Choose ZamoraGG Food?
          </h2>
          <p className="text-sm sm:text-base md:text-base text-gray-700 leading-relaxed">
            From discovering new restaurants to tracking your orders in
            real-time, ZamoraGG Food is designed with you in mind. Whether
            you're craving a quick snack or a full-course meal, we ensure fast,
            reliable, and hygienic delivery straight to your door.
          </p>

          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {[
              {
                icon: UtensilsCrossed,
                label: "Variety",
                color: "text-blue-500",
              },
              { icon: Truck, label: "Fast", color: "text-green-500" },
              { icon: Smartphone, label: "Tracking", color: "text-purple-500" },
              { icon: CreditCard, label: "Secure", color: "text-red-500" },
            ].map((item, i) => (
              <motion.div
                key={i}
                className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-white rounded-lg shadow hover:shadow-md transition"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                viewport={{ once: true }}
              >
                <item.icon className={`w-5 h-5 sm:w-6 sm:h-6 ${item.color}`} />
                <span className="text-xs sm:text-sm font-medium text-gray-700">
                  {item.label}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          className="relative rounded-xl overflow-hidden shadow-lg h-[200px] sm:h-[250px] md:h-[280px]"
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <img
            src="img.png"
            alt="Delicious food delivery"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/20"></div>
        </motion.div>
      </div>

      <motion.div
        className="mt-12 sm:mt-16 text-center"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-2 sm:mb-3">
          Our Commitment
        </h2>
        <p className="text-xs sm:text-sm md:text-base text-gray-600 max-w-full sm:max-w-xl md:max-w-2xl mx-auto">
          We are committed to making food delivery more than just convenient—we
          want it to be an enjoyable, safe, and memorable experience for every
          customer. Thank you for choosing ZamoraGG Food to satisfy your
          cravings! ✨
        </p>
      </motion.div>
    </div>
  );
};

export default About;
