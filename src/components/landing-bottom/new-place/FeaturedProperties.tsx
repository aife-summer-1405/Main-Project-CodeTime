import { Star } from "lucide-react";

const properties = [
  {
    id: 1,
    title: "نیویورک",
    location: "خوزستان",
    count: "26",
    rating: "4.9",
    image:
      "https://e57f6ca1ab0c25504900731154114e64.cdn.edge.sotoon.ir/cdn.jabama.com/static/_next/static/media/loan-for-trip.1083n_0bos3px.webp",
    className: "featured-main",
  },
  {
    id: 2,
    title: "بنگاهام",
    location: "لافور",
    count: "۱۰۰۰۰",
    rating: "۴.۹",
    image:
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=900&q=85",
    className: "featured-middle",
  },
  {
    id: 3,
    title: "نوروز",
    location: "اصفهان",
    count: "۵۶",
    rating: "۴.۹",
    image:
      "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=900&q=85",
    className: "featured-top",
  },
  {
    id: 4,
    title: "کلبه",
    location: "سنگلده",
    count: "۵۶",
    rating: "۴.۹",
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=85",
    className: "featured-bottom",
  },
];

export default function FeaturedProperties() {
  return (
    <section dir="rtl" className="w-full px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <header className="mb-7 text-center">
          <p className="mb-2 text-xs font-semibold text-sky-500 sm:text-sm">
            ✦✦✦ جدید ترین ها را با ما کشف کنید لذت ببرید ✦✦✦
          </p>

          <h2 className="text-xl font-extrabold sm:text-2xl">
            جدید ترین مناطق تفریحی
          </h2>
        </header>

        <div className="featured-grid">
          {properties.map((property) => (
            <article
              key={property.id}
              className={`featured-card ${property.className}`}
            >
              <img
                src={property.image}
                alt={`${property.title} در ${property.location}`}
              />

              <div className="featured-overlay" />

              <div className="featured-rating">
                <Star size={19} />
                <span>{property.rating}</span>
              </div>

              <div className="featured-info">
                <h3>
                  {property.title} در {property.location}
                </h3>
                <p>{property.count} مورد</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
