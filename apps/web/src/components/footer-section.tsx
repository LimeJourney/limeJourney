import React from "react";
import { ChevronRight } from "lucide-react";
import { title } from "process";

const FooterSection = () => {
  const footerLinks = [
    {
      title: "Features",
      links: ["Something", "Something", "Something"],
    },
    {
      title: "Use Cases",
      links: ["Something", "Something", "Something"],
    },
    {
      title: "Developers",
      links: [
        "Documentation",
        "Demo",
        "API Status",
        "Libraries and SDKs",
        "Changelog",
      ],
    },
    {
      title: "Legal",
      links: ["Terms of Service", "Privacy Policy"],
    },
    {
      title: "Resources",
      links: ["Blog", "Press"],
    },
    {
      title: "Company",
      links: ["About", "Careers", "Contact"],
    },
  ];

  return (
    <footer className="bg-forest-500 text-white py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {footerLinks.map((column, index) => (
            <div key={index} className="space-y-4">
              <h3 className="text-lg font-semibold text-meadow-700">
                {column.title}
              </h3>
              <ul className="space-y-2">
                {column.links.map((link, linkIndex) => (
                  <li key={linkIndex} className="group">
                    <a
                      href="#"
                      className="text-gray-300 hover:text-white transition-colors flex items-center"
                    >
                      <ChevronRight className="w-4 h-4 mr-1 text-meadow-700 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <span>{link}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-16 border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-4 mb-4 md:mb-0">
            <img
              src="/LimeJourney-logo.svg"
              alt="LimeJourney"
              className="h-10 w-auto"
            />
            <span className="text-2xl font-bold text-meadow-700">
              LimeJourney
            </span>
          </div>
          <div className="text-gray-400 text-sm text-center md:text-right">
            <p>
              © {new Date().getFullYear()} LimeJourney Corporation. All rights
              reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
