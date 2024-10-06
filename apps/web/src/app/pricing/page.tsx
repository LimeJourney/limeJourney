"use client";
import React from "react";
import { Check, Zap, ArrowRight, Server } from "lucide-react";
import NavBar from "@/components/nav-bar";
const PricingPage = () => {
  const pricingPlan = {
    name: "Pro",
    price: 50,
    billingPeriod: "month",
    features: [
      "Unlimited projects",
      "20,000 unique entities",
      "Priority support",
      "API access",
      "Advanced analytics",
    ],
  };

  return (
    <>
      <NavBar />
      <div className="bg-forest-800 min-h-screen py-24 text-meadow-100">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl sm:text-6xl font-extrabold text-center text-meadow-300 mb-4 tracking-tight">
            One Plan. Unlimited Possibilities.
          </h1>
          <p className="text-xl text-center mb-16 max-w-2xl mx-auto text-meadow-500">
            Everything you need to build, scale, and manage your projects with
            LimeJourney.
          </p>

          <div className="max-w-4xl mx-auto bg-forest-700 rounded-3xl overflow-hidden shadow-2xl mb-16">
            <div className="p-8 sm:p-12 bg-gradient-to-br from-forest-600 to-forest-700 relative overflow-hidden">
              <div className="relative z-10">
                <h2 className="text-3xl font-bold text-meadow-300 mb-4">
                  {pricingPlan.name}
                </h2>
                <div className="flex items-baseline mb-6">
                  <span className="text-6xl font-extrabold text-meadow-100">
                    ${pricingPlan.price}
                  </span>
                  <span className="text-xl ml-2 text-meadow-400">
                    /{pricingPlan.billingPeriod}
                  </span>
                </div>
                <button className="w-full sm:w-auto py-3 px-8 bg-meadow-500 text-forest-900 text-lg font-semibold rounded-full hover:bg-meadow-400 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-meadow-300 focus:ring-opacity-50 flex items-center justify-center group">
                  Get started
                  <ArrowRight className="ml-2 w-5 h-5 transition-transform duration-300 transform group-hover:translate-x-1" />
                </button>
              </div>
              <Zap className="absolute right-0 bottom-0 w-64 h-64 text-meadow-900 opacity-10 transform translate-x-1/4 translate-y-1/4" />
            </div>
            <div className="p-8 sm:p-12 bg-forest-800">
              <h3 className="text-xl font-semibold text-meadow-300 mb-6">
                Everything you need to succeed:
              </h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {pricingPlan.features.map((feature, index) => (
                  <li key={index} className="flex items-center text-meadow-100">
                    <Check className="w-5 h-5 mr-3 text-meadow-500 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="max-w-4xl mx-auto bg-forest-700 rounded-3xl overflow-hidden shadow-2xl">
            <div className="p-8 sm:p-12 bg-gradient-to-br from-forest-600 to-forest-700 relative overflow-hidden">
              <div className="relative z-10 flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold text-meadow-300 mb-2">
                    Self-Hosting Option
                  </h2>
                  <p className="text-meadow-400 mb-4">
                    Prefer to manage your own infrastructure? LimeJourney is
                    open source and available for self-hosting!
                  </p>
                </div>
                <Server className="w-16 h-16 text-meadow-500 opacity-50" />
              </div>
            </div>
            <div className="p-8 sm:p-12 bg-forest-800">
              <button className="w-full sm:w-auto py-3 px-8 bg-transparent text-meadow-300 text-lg font-semibold rounded-full border-2 border-meadow-500 hover:bg-meadow-500 hover:text-forest-900 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-meadow-300 focus:ring-opacity-50 flex items-center justify-center group">
                Learn More About Self-Hosting
                <ArrowRight className="ml-2 w-5 h-5 transition-transform duration-300 transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>

          <div className="mt-16 text-center">
            <p className="text-meadow-400 mb-4">Need something more custom?</p>
            <a
              href="#"
              className="text-meadow-300 hover:text-meadow-100 font-semibold underline"
            >
              Contact our sales team
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default PricingPage;
