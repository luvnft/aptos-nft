import HeroImage from "@/assets/img/hero.webp";

interface HeroImageSectionProps {}

export const HeroImageSection: React.FC<HeroImageSectionProps> = () => {
  return (
    <section className="mx-auto max-w-5xl">
      <div>
        <img src={HeroImage} alt="" />
      </div>
      <p className="mt-8">
        Move NFT Studio is a user-friendly platform that simplifies the creation and management of NFTs on the Movement
        blockchain—no coding skills required. Our app empowers creators, collectors, and businesses by unlocking
        advanced NFT features, such as minting, combining, layering, composing, and more. Move NFT Studio is your
        gateway to the future of NFTs. Join us in democratizing cutting-edge NFT technology and unleashing infinite
        creativity in the Movement ecosystem!
      </p>
    </section>
  );
};
