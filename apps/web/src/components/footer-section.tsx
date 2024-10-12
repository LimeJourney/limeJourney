import React from "react";
import Image from "next/image";
import { ChevronRight, Facebook, Github, Linkedin } from "lucide-react";

const FooterSection = () => {
  const footerLinks = [
    {
      title: "Developers",
      links: ["Documentation", "API Status", "Changelog"],
    },
    {
      title: "Legal",
      links: ["Terms of Service", "Privacy Policy"],
    },
    {
      title: "Company",
      links: ["About", "Contact"],
    },
  ];

  const socialLinks = [
    { icon: Facebook, href: "https://www.linkedin.com/company/limejourney/" },
    { icon: Github, href: "https://github.com/LimeJourney" },
    { icon: Linkedin, href: "https://www.linkedin.com/company/limejourney/" },
  ];

  return (
    <footer className="bg-forest-500 text-white py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <div className="flex items-center space-x-4 mb-6">
              <img
                src="/LimeJourney-logo.svg"
                alt="LimeJourney"
                className="h-12 w-auto"
              />
              <span className="text-2xl font-bold text-meadow-700">
                LimeJourney
              </span>
            </div>
            <p className="text-gray-300 mb-6">
              Empowering your journey through innovative solutions.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className="text-gray-300 hover:text-meadow-700 transition-colors"
                >
                  <social.icon className="w-6 h-6" />
                </a>
              ))}
            </div>
          </div>
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
            <Image
              src="/LimeJourney-logo.svg"
              alt="LimeJourney"
              className="h-10 w-auto"
              width={10}
              height={10}
            />
            <span className="text-2xl font-bold text-meadow-700">
              LimeJourney
            </span>
          </div>
          <div className="text-gray-400 text-sm text-center md:text-right">
            <div className="text-gray-400 text-sm mb-4 md:mb-0">
              <p>
                © {new Date().getFullYear()} LimeJourney Corporation. All
                rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
