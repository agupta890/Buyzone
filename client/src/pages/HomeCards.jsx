import { Link } from "react-router-dom";
import cardImg3 from "../assets/home-card3.jpg";

const cardData = [
  { id: 1, title: "Mens Fashion", slug: "mens-fashion", image: cardImg3 },
  { id: 2, title: "Women Fashion", slug: "women-fashion", image: cardImg3 },
  { id: 3, title: "Kids Fashion", slug: "kids-fashion", image: cardImg3 },
  { id: 4, title: "Accessories", slug: "accessories", image: cardImg3 },
];

const HomeCardGrid = () => {
  return (
    <section className="py-10 px-4 sm:px-6 lg:px-12">
      <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-8">
        Featured Categories
      </h2>

      <div className="grid grid-cols-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
        {cardData.map((card) => (
          <Link
            key={card.id}
            to={`/category/${card.slug}`}
            className="bg-white group rounded-lg border border-gray-200 hover:shadow-2xl transition-transform duration-300 ease-in-out hover:-translate-y-1 hover:scale-105 text-center overflow-hidden"
          >
            <img
              src={card.image}
              alt={card.title}
              className="w-full h-48 object-cover"
            />
            <p className="text-gray-700 group-hover:text-yellow-500 font-medium py-3">
              {card.title}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default HomeCardGrid;
