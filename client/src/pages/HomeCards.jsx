// HomeCardGrid.tsx
import cardImg1 from "../assets/home-card1.jpg";
import cardImg2 from "../assets/home-card2.jpg";
import cardImg3 from "../assets/home-card3.jpg";

const cardData = [
  { id: 1, title: "Card 1", image: cardImg1 },
  { id: 2, title: "Card 2", image: cardImg2 },
  { id: 3, title: "Card 3", image: cardImg3 },
];


const HomeCardGrid = () => {
  return (
   <section className="py-10 px-6">
  <h2 className="text-3xl font-bold text-center mb-8">Featured Homes</h2>

  <div className="flex justify-center">
    <div className="grid grid-cols-3 w-full min-h-min gap-6">
      {cardData.map((card) => (
        <div
          key={card.id}
          className="bg-white rounded-lg shadow hover:shadow-lg transition duration-300 text-center overflow-hidden"
        >
          <img
            src={card.image}
            alt={card.title}
            className="w-full h-fit object-cover"
          />
          <p className="text-gray-700 font-medium py-2">{card.title}</p>
        </div>
      ))}
    </div>
  </div>
</section>

  );
};

export default HomeCardGrid;
