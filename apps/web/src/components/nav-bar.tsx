import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { Menu } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const NavBar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const calendarLink = "https://cal.com/tobi-limejourney/product-demo";
  const ListItem = React.forwardRef(
    ({ className, title, children, ...props }, ref) => {
      return (
        <li>
          <NavigationMenuLink asChild>
            <a
              ref={ref}
              className={cn(
                "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-meadow-200 hover:text-forest-600 focus:bg-meadow-200 focus:text-forest-600",
                className
              )}
              {...props}
            >
              <div className="text-sm font-medium leading-none">{title}</div>
              <p className="line-clamp-2 text-sm leading-snug text-forest-300">
                {children}
              </p>
            </a>
          </NavigationMenuLink>
        </li>
      );
    }
  );
  ListItem.displayName = "ListItem";

  return (
    <div
      className={cn(
        "fixed left-1/2 transform -translate-x-1/2 z-50 transition-all duration-300",
        isScrolled ? "top-4" : "top-8"
      )}
    >
      <div
        className={cn(
          "bg-meadow-100 shadow-lg rounded-full px-6 py-1 flex items-center justify-between space-x-4 transition-all duration-300",
          isScrolled ? "bg-opacity-100" : "bg-opacity-70"
        )}
      >
        <a href="/">
          <div className="flex items-center space-x-4 min-w-[180px]">
            <img
              src="/LimeJourney-logo.svg"
              alt="LimeJourney"
              className="w-8 h-8"
            />
            <span className="text-xl font-bold text-forest-500">
              LimeJourney
            </span>
          </div>
        </a>

        {/* Desktop Menu */}
        <div className="hidden md:block">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-gray-800 hover:text-black bg-transparent">
                  Product
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                    <ListItem href="/" title="Features">
                      Explore our powerful features
                    </ListItem>
                    <ListItem href="/pricing" title="Pricing">
                      Flexible plans for every team
                    </ListItem>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-gray-800 hover:text-black bg-transparent">
                  Why LimeJourney?
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                    <ListItem href="/" title="Case Studies">
                      See how others succeed with LimeJourney(coming soon)
                    </ListItem>
                    <ListItem href="/" title="Testimonials">
                      Hear from our satisfied customers(coming soon)
                    </ListItem>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink
                  className="text-gray-800 hover:text-black bg-transparent"
                  href="/about"
                >
                  About
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-gray-800 hover:text-black bg-transparent">
                  Resources
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                    <ListItem href="/blog" title="Blog">
                      Latest insights and tips(coming soon)
                    </ListItem>
                    <ListItem
                      href="https://docs.limejourney.com"
                      title="Documentation"
                    >
                      Comprehensive guides and API references
                    </ListItem>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <div className="hidden md:flex items-center space-x-4">
          <Button
            variant="ghost"
            className="text-forest-500 hover:text-forest-600 hover:bg-meadow-200"
            onClick={() => router.push("/auth")}
          >
            Login
          </Button>
          <Button
            onClick={() => window.open(calendarLink, "_blank")}
            className="bg-forest-500 hover:bg-meadow-500 hover:text-forest-500 text-white transition-colors duration-300"
          >
            Book a demo
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <Button
            variant="ghost"
            className="text-forest-500 hover:text-forest-600"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <Menu />
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-meadow-100 shadow-lg mt-2 rounded-lg">
          <nav className="flex flex-col p-4">
            <a href="/" className="py-2 text-forest-500 hover:text-forest-600">
              Features
            </a>
            <a
              href="/pricing"
              className="py-2 text-forest-500 hover:text-forest-600"
            >
              Pricing
            </a>
            <a
              href="/case-studies"
              className="py-2 text-forest-500 hover:text-forest-600"
            >
              Case Studies
            </a>
            <a href="/" className="py-2 text-forest-500 hover:text-forest-600">
              Testimonials
            </a>
            <a href="/" className="py-2 text-forest-500 hover:text-forest-600">
              Customers
            </a>
            <a href="/" className="py-2 text-forest-500 hover:text-forest-600">
              Blog
            </a>
            <a
              href="/docs"
              className="py-2 text-forest-500 hover:text-forest-600"
            >
              Documentation
            </a>
            <Button
              onClick={() => window.open(calendarLink, "_blank")}
              variant="ghost"
              className="justify-start px-0 text-forest-500 hover:text-forest-600 hover:bg-transparent"
            >
              Login
            </Button>
            <Button
              onClick={() => window.open(calendarLink, "_blank")}
              className="mt-2 bg-forest-500 hover:bg-meadow-500 text-white transition-colors duration-300"
            >
              Book a demo
            </Button>
          </nav>
        </div>
      )}
    </div>
  );
};

export default NavBar;
