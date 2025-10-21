import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import FullCreativePathLogo from "@/public/FullCreativePathLogo.svg";
import FacebookIcon from "@/public/facebookIcon.svg";
import InstagramIcon from "@/public/instagramIcon.svg";
import LinkedinIcon from "@/public/linkedinIcon.svg";
import GithubIcon from "@/public/githubIcon.svg";
import Image from "next/image";
import Link from "next/link";

const MainNavigation = () => {
  return (
    <header className="fixed top-4 z-50 w-full">
      <div className="mx-auto max-w-7xl px-4 w-full">
        <div className="flex items-center justify-between rounded-2xl border border-white/20 bg-white/30 backdrop-blur px-6 py-3 shadow-md">
          <Link href="/">
            <Image
              src={FullCreativePathLogo}
              alt="Creative Path Logo"
              height={60}
            />
          </Link>
          <NavigationMenu className="flex-1 text-secondary">
            <NavigationMenuList className="w-full flex justify-center gap-6">
              <NavigationMenuItem>
                <NavigationMenuLink
                  asChild
                  className="hover:bg-transparent hover:text-primary"
                >
                  <Link href="/">STRONA GŁÓWNA</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink
                  asChild
                  className="hover:bg-transparent hover:text-primary"
                >
                  <Link href="/about-me">O MNIE</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink
                  asChild
                  className="hover:bg-transparent hover:text-primary"
                >
                  <Link href="/about-me">MOJE PROJEKTY</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink
                  asChild
                  className="hover:bg-transparent hover:text-primary"
                >
                  <Link href="/about-me">KONTAKT</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          <div className="flex flex-row gap-2">
            <Link href="/">
              <Image
                src={FacebookIcon}
                alt="Facebook Icon"
                width={24}
                height={24}
                className="hover:fill-primary"
              />
            </Link>
            <Image
              src={InstagramIcon}
              alt="Instagram Icon"
              width={24}
              height={24}
              className="hover:text-primary"
            />
            <Image
              src={LinkedinIcon}
              alt="LinkedIn Icon"
              width={24}
              height={24}
              className="hover:text-primary"
            />
            <Image
              src={GithubIcon}
              alt="Github Icon"
              width={24}
              height={24}
              className="hover:text-primary"
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default MainNavigation;
