/** Slim photographic strip that sits behind the floating navbar on form/utility pages. */
export function BannerStrip({ image = "/images/hero.jpg" }: { image?: string }) {
  return (
    <div aria-hidden="true" className="absolute inset-x-0 top-0 -z-10 h-36 overflow-hidden rounded-b-[2.5rem] bg-sky-deep sm:h-40">
      <img src={image} alt="" className="h-full w-full object-cover" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgb(11_47_107/0.8),rgb(30_100_200/0.4))]" />
    </div>
  );
}
