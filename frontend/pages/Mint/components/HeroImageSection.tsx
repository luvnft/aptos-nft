import { IMG_BASE_PATH } from "@/constants";

interface HeroImageSectionProps {}

export const HeroImageSection: React.FC<HeroImageSectionProps> = () => {
  return (
    <section>
      <div className="mx-auto max-w-5xl">
        <img src={`${IMG_BASE_PATH}/hero.webp`} alt="" />
      </div>
    </section>
  );
};
