import { Link } from "react-router-dom";

const cardData = [
  {
    id: 1,
    title: "Bed Sheet",
    slug: "home-decore",
    image:
      "https://res.cloudinary.com/project01/image/upload/v1757776904/dzgpi8n9htbbsn4vhkfc.jpg",
  },
  {
    id: 2,
    title: "Books",
    slug: "novel",
    image:
      "https://res.cloudinary.com/project01/image/upload/v1757777678/bregkxof9duaekfmgvvq.jpg",
  },
  {
    id: 3,
    title: "Toys",
    slug: "teddy",
    image:
      "https://res.cloudinary.com/project01/image/upload/v1757777911/thyvg6wtsna4tlukrnn9.jpg",
  },
  {
    id: 4,
    title: "Dry fruits",
    slug: "mix-dry-fruits",
    image:
      "https://res.cloudinary.com/project01/image/upload/v1757779960/b2osrwlhj0ap4qzhnwmy.jpg",
  },
];

const HomeCardGrid = () => {
  return (
    <section className="py-10 px-4 sm:px-6 lg:px-12">
      <h2 className="text-2xl text-amber-400 md:text-3xl lg:text-4xl font-bold text-center mb-8">
        Featured Categories
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
        {cardData.map((card) => (
          <Link
            key={card.id}
            to='/shop-all'
            className="bg-white group rounded-lg  border-gray-300 hover:shadow-2xl transition-transform duration-300 ease-in-out hover:-translate-y-6 hover:scale-105 text-center overflow-hidden"
          >
            <div className="w-full h-52 bg-gray-300 flex items-center justify-center">
              <img
                src={card.image}
                alt={card.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="mt-3 rounded-t-lg bg-gray-300">
            <p className="text-gray-700 group-hover:text-yellow-500 font-medium py-3">
              {card.title}
            </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default HomeCardGrid;
