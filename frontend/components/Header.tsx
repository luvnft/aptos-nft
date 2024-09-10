import { Link, useLocation } from "react-router-dom";
import { WalletSelector } from "./WalletSelector";
import { buttonVariants } from "@/components/ui/button";

const NavList = [
  {
    name: "Home",
    link: "/",
  },
  {
    name: "Collections",
    link: "/collections",
  },
  {
    name: "Create Collection",
    link: "/create-collection",
  },
  {
    name: "Craft NFT",
    link: "/craft-nft",
  },
];

export function Header() {
  const location = useLocation();

  return (
    <div className="flex items-center justify-between px-4 pt-2 pb-4 max-w-screen-xl mx-auto w-full flex-wrap">
      <h1 className="display">
        <Link to="/">Move NFT Studio</Link>
      </h1>

      <div className="flex gap-2 items-center flex-wrap">
        {NavList.map((item, i) => {
          return (
            <Link
              key={i}
              className={`${buttonVariants({ variant: "link" })} ${item.link === location.pathname ? "underline" : ""}`}
              to={item.link}
            >
              {item.name}
            </Link>
          );
        })}
        <WalletSelector />
      </div>
    </div>
  );
}
