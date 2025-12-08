export default function PortfolioShowcase() {
    const works = [
      {
        title: "Wedding Invites",
        img: "https://i.etsystatic.com/38731760/r/il/97a935/6009429299/il_1588xN.6009429299_qd33.jpg",
      },
      {
        title: "Branding Prints",
        img: "https://brandpersonalities.com.au/wp-content/uploads/2024/04/Pinterest.jpeg.webp",
      },
      {
        title: "Customized Mugs",
        img: "https://cdn.shopify.com/s/files/1/0266/3546/8881/files/how-to-make-custom-mugs-to-sell-online.jpg?v=1685589972",
      },
      {
        title: "Corporate Kits",
        img: "https://register.eyantra.com/joining-kits/images/900%20AND%20700.jpg",
      },
      // {
      //   title: "Posters & Flyers",
      //   img: "https://source.unsplash.com/800x600/?poster,flyer",
      // },
      // {
      //   title: "Custom Packaging",
      //   img: "https://source.unsplash.com/800x600/?packaging,box",
      // },
    ];
  
    return (
      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Our Portfolio</h2>
  
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {works.map((work, idx) => (
            <div
              key={idx}
              className="group relative overflow-hidden rounded-2xl shadow-lg cursor-pointer"
            >
              {/* Image */}
              <img
                src={work.img}
                alt={work.title}
                className="w-full h-64 object-cover transform group-hover:scale-110 transition duration-500"
              />
  
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition duration-500">
                <h3 className="text-white text-lg font-semibold">{work.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }
  