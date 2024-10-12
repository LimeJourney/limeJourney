"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Menu } from "lucide-react";
import FeatureShowcase from "@/components/feature-showcase";
import GetStartedSection from "@/components/get-started-section";
import FooterSection from "@/components/footer-section";
import Image from "next/image";

import NavBar from "@/components/nav-bar";
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
    { name: "Teal", logo: "/Intersect.png" },
    { name: "Tev AI", logo: "/Teal.png" },
    { name: "Split Technolgies", logo: "/Wave.png" },
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
              <Image
                src={company.logo}
                alt={`${company.name} logo`}
                className="w-8 h-8 object-contain"
                width={32}
                height={32}
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

const Home = () => {
  const calendarLink = "https://cal.com/tobi-limejourney/product-demo";
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
            onClick={() => window.open(calendarLink, "_blank")}
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
