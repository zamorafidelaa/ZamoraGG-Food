import React, { useEffect, useRef } from "react";
import { Utensils, ShoppingBag, Bike } from "lucide-react";

const categories = [
  {
    id: 1,
    name: "Drinks",
    image:
      "https://i.pinimg.com/736x/55/2c/67/552c67aabfb8db3a152aa1c8310ea3b1.jpg",
  },
  {
    id: 2,
    name: "Snacks",
    image:
      "https://i.pinimg.com/1200x/a8/8a/02/a88a026aafbadfb9a5ae6dc579a1f999.jpg",
  },
  {
    id: 3,
    name: "Light Bites",
    image:
      "https://i.pinimg.com/736x/83/ff/3c/83ff3cf883bb8bde0f4c22a39a0332f8.jpg",
  },
  {
    id: 4,
    name: "Main Dishes",
    image:
      "https://i.pinimg.com/736x/26/53/45/2653455dc0da0cf9c6ee16ecef5f3eff.jpg",
  },
  {
    id: 5,
    name: "Desserts",
    image:
      "https://i.pinimg.com/1200x/23/cc/17/23cc176e7e967058152d2dcb51a5f7fc.jpg",
  },
  {
    id: 6,
    name: "Healthy & Salad",
    image:
      "https://i.pinimg.com/736x/08/c7/0d/08c70d473888e35bd1c4cd9d1d2983d7.jpg",
  },
  {
    id: 7,
    name: "Bakery & Cakes",
    image:
      "https://i.pinimg.com/1200x/d9/8a/c0/d98ac065b4e651488dae85021dfe58dd.jpg",
  },
  {
    id: 8,
    name: "Seafood",
    image:
      "https://i.pinimg.com/736x/64/af/a9/64afa9e9f836fcbbd0bf61ab0351f6eb.jpg",
  },
  {
    id: 9,
    name: "Fast Food",
    image:
      "https://i.pinimg.com/736x/23/96/dd/2396ddebe05f12861cf5cd378e4949b5.jpg",
  },
];

const AnimatedCard = ({ children, className = "" }) => {
  const ref = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && ref.current) {
          ref.current.classList.add(
            "opacity-100",
            "translate-y-0",
            "scale-100"
          );
        }
      },
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`opacity-0 translate-y-8 scale-95 transition-all duration-700 ${className}`}
    >
      {children}
    </div>
  );
};

const CategoryCard = ({ category }) => (
  <AnimatedCard className="rounded-3xl overflow-hidden shadow-md hover:scale-105 hover:shadow-2xl group relative">
    <img
      src={category.image}
      alt={category.name}
      className="w-full h-48 sm:h-56 md:h-60 object-cover transition-transform duration-700 group-hover:scale-110"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-center justify-center">
      <h3 className="text-white text-xl sm:text-2xl font-extrabold text-center drop-shadow-lg tracking-wide">
        {category.name}
      </h3>
    </div>
  </AnimatedCard>
);

const Home = () => {
  return (
    <div
      className="w-full flex flex-col overflow-hidden bg-white"
      style={{ fontFamily: "'Poppins', sans-serif" }}
    >
      <div className="relative w-full min-h-[70vh] sm:h-screen">
        <video
          className="absolute top-0 left-0 w-full h-full object-cover"
          src="/video.mp4"
          autoPlay
          loop
          muted
        />
        <div className="absolute top-0 left-0 w-full h-full bg-black/50"></div>

        <div className="relative z-10 flex flex-col justify-center items-center text-center h-full px-4 sm:px-6">
          <h1 className="text-2xl xs:text-3xl sm:text-5xl md:text-6xl font-extrabold text-white mb-3 xs:mb-4 sm:mb-6 leading-snug">
            ZamoraGG <span className="text-blue-400">Food Delivery</span>
          </h1>
          <p className="text-xs xs:text-sm sm:text-lg md:text-xl text-white mb-4 xs:mb-6 sm:mb-12 max-w-[90%] xs:max-w-sm sm:max-w-xl md:max-w-2xl mx-auto leading-relaxed">
            Order your favorite meals, track deliveries in real-time, and enjoy
            fresh food right at your doorstep.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-6 max-w-full sm:max-w-4xl mx-auto -mt-12 sm:-mt-10 mb-16 sm:mb-24">
            {[
              {
                icon: (
                  <Utensils className="w-10 h-10 sm:w-14 sm:h-14 text-blue-600 mb-2" />
                ),
                title: "Restaurants",
                desc: "Browse and discover the best local restaurants.",
              },
              {
                icon: (
                  <ShoppingBag className="w-10 h-10 sm:w-14 sm:h-14 text-blue-600 mb-2" />
                ),
                title: "Orders",
                desc: "Place your orders easily and track in real-time.",
              },
              {
                icon: (
                  <Bike className="w-10 h-10 sm:w-14 sm:h-14 text-blue-600 mb-2" />
                ),
                title: "Delivery",
                desc: "Fast and reliable delivery service to your door.",
              },
            ].map((item, idx) => (
              <AnimatedCard
                key={idx}
                className="bg-white p-4 sm:p-6 rounded-2xl flex flex-col items-center text-center shadow-md hover:shadow-2xl transition"
              >
                {item.icon}
                <h3 className="text-sm sm:text-2xl font-bold text-gray-800 mb-2">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600">{item.desc}</p>
              </AnimatedCard>
            ))}
          </div>
        </div>
      </div>
      <div className="w-full py-16 sm:py-24 bg-gray-50">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-center mb-8 sm:mb-12 text-gray-900">
          Explore <span className="text-blue-600">Categories</span>
        </h2>
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 sm:gap-8 px-4 sm:px-6">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </div>

      <div className="w-full py-16 sm:py-20 bg-gradient-to-r from-blue-50 to-white">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-center mb-12 text-gray-900">
          Various <span className="text-blue-600">Delicious Cuisines</span>
        </h2>
        <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6 px-4 sm:px-8">
          {[
            {
              name: "Martabak",
              image:
                "https://i.pinimg.com/736x/3c/3f/30/3c3f309a0cb7dbfbf691321881648f28.jpg",
            },
            {
              name: "Meatballs & Soup",
              image:
                "https://i.pinimg.com/1200x/a9/d8/1c/a9d81c9df012327fa920521f554a6337.jpg",
            },
            {
              name: "Bread & Pastry",
              image:
                "https://i.pinimg.com/1200x/cf/9b/af/cf9bafa8f904bb4c2aacf06cebf46331.jpg",
            },
            {
              name: "Chinese",
              image:
                "https://i.pinimg.com/736x/d5/76/4c/d5764cab71d2d735155512b090e5379d.jpg",
            },
            {
              name: "Western",
              image:
                "https://i.pinimg.com/736x/fb/a1/c6/fba1c64f65724258cb3eaf34b17d3df5.jpg",
            },
            {
              name: "Fast Food",
              image:
                "https://i.pinimg.com/1200x/d5/d4/bb/d5d4bb7e8a83e3cc20f3383e4ca3e5c7.jpg",
            },
          ].map((item, idx) => (
            <AnimatedCard
              key={idx}
              className="flex flex-col items-center text-center transition-all duration-700 ease-in-out transform hover:-translate-y-1 hover:scale-105"
            >
              <div className="w-20 sm:w-24 md:w-32 h-20 sm:h-24 md:h-32 rounded-full overflow-hidden shadow-xl mb-2 sm:mb-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-xs sm:text-sm md:text-lg font-bold text-gray-800">
                {item.name}
              </p>
            </AnimatedCard>
          ))}
        </div>
      </div>

      <div className="w-full py-16 sm:py-20 bg-white">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-center mb-12 text-gray-900">
          Discover <span className="text-blue-600">Popular Picks</span>
        </h2>
        <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 sm:gap-6 px-4 sm:px-8">
          {[
            {
              name: "Best Sellers",
              image:
                "https://i.gojekapi.com/darkroom/gofood-id/v2/images/uploads/57fafe35-8b39-4842-9e7a-18a2e2eb302b_gofood_categories_best_sellers.png?auto=format",
            },
            {
              name: "Budget Meals",
              image:
                "https://i.gojekapi.com/darkroom/gofood-id/v2/images/uploads/03e6f8cf-25f2-46ed-ab93-d0d64a1ea188_gofood_categories_near_me.png?auto=format",
            },
            {
              name: "Economical Menu",
              image:
                "https://i.gojekapi.com/darkroom/gofood-id/v2/images/uploads/d94e8f34-300a-43d0-ab19-438b392281c7_budget-meal.png?auto=format",
            },
            {
              name: "Favorites",
              image:
                "https://i.gojekapi.com/darkroom/gofood-id/v2/images/uploads/9e241706-2fbe-4249-a0d7-9cb5cfd58a1e_gofood_categories_most_loved.png?auto=format",
            },
            {
              name: "Open 24/7",
              image:
                "https://i.gojekapi.com/darkroom/gofood-id/v2/images/uploads/6278c6f9-d28e-4663-8c31-d0c9d722067a_gofood_categories_twenty_four_hours.png?auto=format",
            },
            {
              name: "Healthy Choices",
              image:
                "https://i.gojekapi.com/darkroom/gofood-id/v2/images/uploads/9550dc29-2fbb-4734-90e0-40b91a847549_gofood_categories_lebaran_healthy_food.png?auto=format",
            },
          ].map((item, idx) => (
            <AnimatedCard
              key={idx}
              className="bg-gray-50 rounded-2xl shadow-md hover:shadow-xl p-4 sm:p-6 flex flex-col items-center justify-center text-center transition-all duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-105"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-12 sm:w-16 h-12 sm:h-16 mb-2 sm:mb-4"
              />
              <p className="text-xs sm:text-sm md:text-lg font-bold text-gray-800">
                {item.name}
              </p>
            </AnimatedCard>
          ))}
        </div>
      </div>

      <div className="w-full py-16 sm:py-20 bg-gray-50">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-center mb-12 text-gray-900">
          Why <span className="text-blue-600">Choose ZamoraGG?</span>
        </h2>
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 px-4 sm:px-6">
          {[
            {
              title: "20,000+ Reviews",
              desc: "Fresh customer feedback every day.",
              image: "https://cdn-icons-png.flaticon.com/512/1828/1828884.png",
            },
            {
              title: "Pickup Available",
              desc: "Choose delivery or pick it up yourself.",
              image: "https://cdn-icons-png.flaticon.com/512/1046/1046786.png",
            },
            {
              title: "Always Promo",
              desc: "Enjoy discounts on your favorite meals.",
              image: "https://cdn-icons-png.flaticon.com/512/709/709496.png",
            },
            {
              title: "Fast & Secure",
              desc: "Delivered safely with reliable service.",
              image: "https://cdn-icons-png.flaticon.com/512/633/633597.png",
            },
          ].map((item, idx) => (
            <AnimatedCard
              key={idx}
              className="bg-white rounded-2xl p-4 sm:p-6 shadow-md hover:shadow-xl transition transform hover:-translate-y-1 text-center"
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-10 sm:w-14 h-10 sm:h-14 mx-auto mb-2 sm:mb-4"
              />
              <h3 className="text-sm sm:text-lg md:text-xl font-bold mb-1 sm:mb-2 text-gray-900">
                {item.title}
              </h3>
              <p className="text-xs sm:text-sm text-gray-600">{item.desc}</p>
            </AnimatedCard>
          ))}
        </div>
      </div>

      <div className="w-full py-16 sm:py-28 bg-white">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-center mb-12 text-gray-900">
          How It <span className="text-blue-600">Works</span>
        </h2>
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-12 px-4 sm:px-6 text-center">
          {[
            {
              step: "1",
              title: "Choose Your Meal",
              desc: "Explore categories and pick your favorite dishes.",
            },
            {
              step: "2",
              title: "Order & Pay",
              desc: "Add to cart, checkout, and pay with ease.",
            },
            {
              step: "3",
              title: "Enjoy Your Meal",
              desc: "Our couriers deliver fast, fresh, and safe to your door.",
            },
          ].map((item, idx) => (
            <AnimatedCard
              key={idx}
              className="transition transform hover:-translate-y-1 hover:scale-105"
            >
              <div className="w-16 sm:w-20 h-16 sm:h-20 bg-blue-600 text-white flex items-center justify-center rounded-full mx-auto mb-2 sm:mb-4 text-xl sm:text-2xl font-bold shadow-lg">
                {item.step}
              </div>
              <h3 className="text-sm sm:text-2xl font-semibold mb-1 sm:mb-2 text-gray-900">
                {item.title}
              </h3>
              <p className="text-xs sm:text-sm text-gray-600">{item.desc}</p>
            </AnimatedCard>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
