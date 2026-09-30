import { motion } from "framer-motion";
import { Section } from "@/components/marketing/kit/Section";
import { galleryImages } from "@/data/media";

export function GallerySection() {
  return (
    <Section eyebrow="Clean Energy" title="Powering A Brighter India">
      <div className="grid auto-rows-[11rem] grid-cols-2 gap-3 sm:grid-cols-4 sm:auto-rows-[12rem]">
        {galleryImages.map((img, i) => (
          <motion.div
            key={img.src}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.6, delay: (i % 4) * 0.08 }}
            className={`group relative overflow-hidden rounded-3xl ${img.span}`}
          >
            <img
              src={img.src}
              alt={img.alt}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div aria-hidden="true" className="absolute inset-0 bg-sky-deep/0 transition-colors duration-500 group-hover:bg-sky-deep/25" />
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
