// HomeCardGrid.tsx
// import cardImg1 from "../assets/home-card1.jpg";
// import cardImg2 from "../assets/home-card2.jpg";
import cardImg3 from "../assets/home-card3.jpg";

const cardData = [
  { id: 1, title: "Mens Fashion", image: cardImg3 },
  { id: 2, title: "Women Fashion", image: cardImg3 },
  { id: 3, title: "Kids Fashion", image: cardImg3 },
  { id: 4, title: "Kids Fashion", image: cardImg3 },
];


const HomeCardGrid = () => {
  return (
   <section className="py-10 px-6">
  <h2 className="text-2xl lg:tetx-4xl font-bold text-center mb-8">Featured Homes</h2>

  <div className="flex justify-center">
    <div className="grid grid-cols-3 lg:grid-cols-4  lg:w-full w-4xl min-h-max gap-6">
      {cardData.map((card) => (
        <div
          key={card.id}
          className="bg-white group rounded-lg border-gray-200 border hover:shadow-2xl transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-105 text-center overflow-hidden">
          <img
            src={card.image}
            alt={card.title}
            className="w-fit max-h-min p-3 rounded-2xl object-cover"
          />
          <p className="text-gray-700 group-hover:text-yellow-500 font-medium py-2">{card.title}</p>
        </div>
      ))}
    </div>
  </div>
</section>

  );
};

export default HomeCardGrid;
