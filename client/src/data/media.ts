/** Photography shared across pages. All files live in /public/images. */
export const productImages: Record<string, string> = {
  "solar-panels": "/images/panels-grass.jpg",
  inverters: "/images/datacentre.jpg",
  "mounting-structures": "/images/field-sky.jpg",
  accessories: "/images/wiring.jpg",
};

export const galleryImages = [
  { src: "/images/hero.jpg", alt: "Ground-mounted solar array under a cloudy sky", span: "sm:col-span-2 sm:row-span-2" },
  { src: "/images/house-pool.jpg", alt: "Home with rooftop solar potential", span: "" },
  { src: "/images/wind.jpg", alt: "Wind turbines at sunset", span: "" },
  { src: "/images/closeup.jpg", alt: "Close-up of solar modules", span: "" },
  { src: "/images/hillside.jpg", alt: "Solar panels on a hillside", span: "" },
  { src: "/images/offshore-wind.jpg", alt: "Offshore wind farm", span: "sm:col-span-2" },
  { src: "/images/blueprints.jpg", alt: "Solar system design blueprints", span: "" },
];
