import LogoLoop from './LogoLoop';

const partners = [
  { src: "/partner1.png", alt: "Partner 1" },
  { src: "/partner2.png", alt: "Partner 2" },
  { src: "/partner3.png", alt: "Partner 3" }
];

const TrustMarquee = () => {
  return (
    <section className="py-16 border-y border-border/50 overflow-hidden">
      <LogoLoop
        logos={partners}
        speed={75}
        direction="left"
        logoHeight={96}
        gap={65}
        pauseOnHover={false}
        fadeOut={true}
        fadeOutColor="#000000"
        ariaLabel="Partner companies"
        className="w-full"
      />
    </section>
  );
};

export default TrustMarquee;