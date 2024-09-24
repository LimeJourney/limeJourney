import React from "react";
import { Button } from "@/components/ui/button";

const GetStartedSection = () => {
  return (
    <section className="py-56 bg-white">
      <div className="container mx-auto px-4">
        <div className="bg-[#f5602c] rounded-3xl py-24 px-4 text-white text-center relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-4xl font-bold mb-4">Get Started</h2>
            <p className="text-xl mb-8">Customer Engagement for Modern Teams</p>
            <div className="flex justify-center space-x-4">
              <Button className="bg-black text-white hover:bg-forest-500 hover:text-meadow-600">
                Get Started →
              </Button>
              <Button className="bg-white text-black hover:bg-forest-500 hover:text-meadow-600">
                Try Demo →
              </Button>
            </div>
          </div>
          <div className="absolute inset-0 opacity-10">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern
                  id="smallGrid"
                  width="20"
                  height="20"
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d="M 20 0 L 0 0 0 20"
                    fill="none"
                    stroke="white"
                    strokeWidth="1"
                  />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#smallGrid)" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GetStartedSection;
