"use client";
import React, { useEffect, useState } from "react";
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
import { motion } from "framer-motion";
import { Menu } from "lucide-react";
import FeatureShowcase from "@/components/feature-showcase";
import GetStartedSection from "@/components/get-started-section";
import FooterSection from "@/components/footer-section";

const HeroBackground = ({ height = "100vh" }) => {
  return (
    <div
      className={`absolute top-0 left-0 w-full z-0 pointer-events-none overflow-hidden`}
      style={{ height }}
    >
      <div
        className="w-full h-full opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(to right, #34d399 1px, transparent 1px),
            linear-gradient(to bottom, #34d399 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-forest-100 via-meadow-100 to-forest-200 opacity-40" />
      <div className="absolute top-20 left-10 w-96 h-96 rounded-full bg-gradient-to-br from-forest-300 to-meadow-300 opacity-30 blur-2xl" />
      <div className="absolute bottom-40 right-20 w-128 h-128 rounded-full bg-gradient-to-tl from-meadow-300 to-forest-300 opacity-30 blur-2xl" />
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-forest-400 to-transparent" />
    </div>
  );
};

const CompanyDisplay = () => {
  const companies = [
    { name: "TechNova", logo: "/logos/technova.svg" },
    { name: "GreenLeaf Solutions", logo: "/logos/greenleaf.svg" },
    { name: "Quantum Dynamics", logo: "/logos/quantum.svg" },
    { name: "AeroSpace Innovations", logo: "/logos/aerospace.svg" },
    { name: "OceanTech Research", logo: "/logos/oceantech.svg" },
    // Duplicates for seamless loop
    { name: "TechNova", logo: "/logos/technova.svg" },
    { name: "GreenLeaf Solutions", logo: "/logos/greenleaf.svg" },
    { name: "Quantum Dynamics", logo: "/logos/quantum.svg" },
    { name: "AeroSpace Innovations", logo: "/logos/aerospace.svg" },
    { name: "OceanTech Research", logo: "/logos/oceantech.svg" },
  ];

  return (
    <div className="mb-16">
      <p className="text-lg text-forest-400 mb-4 text-center">
        Modern teams of all sizes use LimeJourney to talk to their customers:
      </p>
      <div className="w-[200px] mx-auto">
        <motion.div
          className="flex space-x-12"
          animate={{ x: [0, -50 * companies.length] }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 20,
              ease: "linear",
            },
          }}
        >
          {companies.map((company, index) => (
            <div
              key={index}
              className="flex items-center space-x-3 flex-shrink-0"
            >
              <img
                src={company.logo}
                alt={`${company.name} logo`}
                className="w-8 h-8 object-contain"
              />
              <span className="text-sm font-semibold text-forest-500 whitespace-nowrap">
                {company.name}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

const BorderSpotlightButton = ({ children, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="relative px-6 py-3 bg-white text-meadow-300 font-semibold rounded-full overflow-hidden group focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-forest-600 focus:ring-meadow-300"
    >
      <span className="relative z-10">{children}</span>
      <div className="absolute inset-0 overflow-hidden rounded-full">
        <div className="absolute inset-0 bg-gradient-to-r from-meadow-300 via-meadow-400 via-meadow-500 to-meadow-600 animate-glow-outline opacity-75"></div>
      </div>
      <div className="absolute inset-0 bg-forest-600 border border-meadow-300 rounded-full m-[2px]"></div>
      <style jsx>{`
        @keyframes glow-outline {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
        .animate-glow-outline {
          animation: glow-outline 4s linear infinite;
        }
      `}</style>
    </button>
  );
};

const NavBar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
        <div className="flex items-center space-x-4 min-w-[180px]">
          <img
            src="/LimeJourney-logo.svg"
            alt="LimeJourney"
            className="w-8 h-8"
          />
          <span className="text-xl font-bold text-forest-500">LimeJourney</span>
        </div>

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
                    <ListItem href="/features" title="Features">
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
                    <ListItem href="/case-studies" title="Case Studies">
                      See how others succeed with LimeJourney
                    </ListItem>
                    <ListItem href="/testimonials" title="Testimonials">
                      Hear from our satisfied customers
                    </ListItem>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink
                  className="text-gray-800 hover:text-black bg-transparent"
                  href="/customers"
                >
                  Customers
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-gray-800 hover:text-black bg-transparent">
                  Resources
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                    <ListItem href="/blog" title="Blog">
                      Latest insights and tips
                    </ListItem>
                    <ListItem href="/docs" title="Documentation">
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
          >
            Login
          </Button>
          <Button className="bg-forest-500 hover:bg-meadow-500 text-white transition-colors duration-300">
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
            <a
              href="/features"
              className="py-2 text-forest-500 hover:text-forest-600"
            >
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
            <a
              href="/testimonials"
              className="py-2 text-forest-500 hover:text-forest-600"
            >
              Testimonials
            </a>
            <a
              href="/customers"
              className="py-2 text-forest-500 hover:text-forest-600"
            >
              Customers
            </a>
            <a
              href="/blog"
              className="py-2 text-forest-500 hover:text-forest-600"
            >
              Blog
            </a>
            <a
              href="/docs"
              className="py-2 text-forest-500 hover:text-forest-600"
            >
              Documentation
            </a>
            <Button
              variant="ghost"
              className="justify-start px-0 text-forest-500 hover:text-forest-600 hover:bg-transparent"
            >
              Login
            </Button>
            <Button className="mt-2 bg-forest-500 hover:bg-meadow-500 text-white transition-colors duration-300">
              Book a demo
            </Button>
          </nav>
        </div>
      )}
    </div>
  );
};

const Home = () => {
  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      <NavBar />
      <section className="relative min-h-screen flex flex-col">
        <HeroBackground height="100%" />
        <div className="flex-grow relative z-10 container mx-auto px-4 flex flex-col justify-center items-center text-center pt-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center space-y-8  mb-12 mt-40"
          >
            <h1 className="text-7xl font-bold text-forest-800 leading-tight drop-shadow-sm">
              Say The Right Thing,
              <br />
              At The Right Time
            </h1>
            <p className="text-xl text-bold text-forest-700 max-w-2xl mx-auto drop-shadow-sm">
              Your customers are waiting to hear from you — LimeJourney helps
              businesses deliver the perfect message at the perfect moment
              powered by AI.
            </p>
          </motion.div>

          <BorderSpotlightButton
            onClick={() => console.log("Get Started clicked")}
          >
            Get Started
          </BorderSpotlightButton>

          <div className="mt-auto">
            <CompanyDisplay />
          </div>
        </div>
      </section>

      <FeatureShowcase />
      <div className="w-full h-1 bg-gradient-to-r from-transparent via-forest-400 to-transparent" />
      <GetStartedSection />
      <FooterSection />
    </div>
  );
};

export default Home;
