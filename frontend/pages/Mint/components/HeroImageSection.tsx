interface HeroImageSectionProps {}

export const HeroImageSection: React.FC<HeroImageSectionProps> = () => {
  return (
    <section>
      <div className="mx-auto max-w-5xl">
        <img src="/hero.webp" alt="" />
      </div>
    </section>
  );
};
