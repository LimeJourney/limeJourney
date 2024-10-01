"use client";

import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Leaf, Mail, Linkedin, Github } from "lucide-react";

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-forest-800 relative overflow-hidden">
      {/* Meadow border */}

      {/* Animated grass */}
      <div className="absolute bottom-0 left-0 right-0 h-32 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute bottom-0 w-4 bg-meadow-400"
            style={{
              height: `${Math.random() * 100 + 50}px`,
              left: `${i * 5}%`,
            }}
            animate={{
              skew: ["-5deg", "5deg"],
            }}
            transition={{
              repeat: Infinity,
              repeatType: "reverse",
              duration: 2 + Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 container mx-auto px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-center mb-16"
        >
          <Leaf className="text-meadow-400 w-24 h-24 mx-auto mb-4" />
          <h1 className="text-6xl font-bold text-meadow-100">
            The LimeJourney Story
          </h1>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="bg-forest-700 rounded-lg p-8 shadow-xl"
          >
            <h2 className="text-3xl font-semibold text-meadow-300 mb-6">
              A Vision for Better Communication
            </h2>
            <p className="text-meadow-100 mb-6">
              LimeJourney was born from a real need I encountered while running
              Teal. I needed a way to communicate with customers at the right
              time, triggered by specific actions. However, existing tools posed
              two major challenges:
            </p>
            <ul className="list-disc list-inside text-meadow-200 mb-6 space-y-2">
              <li>High costs that didn't scale well for growing businesses</li>
              <li>
                The requirement to overhaul our entire communication stack
              </li>
            </ul>
            <h3 className="text-2xl font-semibold text-meadow-300 mb-4">
              Our Key Principles
            </h3>
            <div className="space-y-4">
              <div className="bg-forest-600 rounded p-4">
                <h4 className="text-meadow-400 font-semibold mb-2">
                  1. Open-Source Accessibility
                </h4>
                <p className="text-meadow-200">
                  We've made LimeJourney open-source, empowering smaller teams
                  and developers to use it freely. For those preferring a
                  managed solution, we offer a cloud version.
                </p>
              </div>
              <div className="bg-forest-600 rounded p-4">
                <h4 className="text-meadow-400 font-semibold mb-2">
                  2. BYOI (Bring Your Own Integrations)
                </h4>
                <p className="text-meadow-200">
                  LimeJourney seamlessly connects with your existing tools,
                  eliminating the need for a complete overhaul of your
                  communication stack.
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="space-y-8"
          >
            <div className="bg-forest-700 rounded-lg p-8 shadow-xl">
              <h2 className="text-3xl font-semibold text-meadow-300 mb-6">
                Meet the Visionary
              </h2>
              <div className="flex items-center mb-6">
                <div className="w-24 h-24 bg-meadow-600 rounded-full flex items-center justify-center mr-6">
                  <span className="text-4xl font-bold text-forest-800">TO</span>
                </div>
                <div>
                  <h3 className="text-2xl font-semibold text-meadow-100">
                    Tobi Okewole
                  </h3>
                  <p className="text-meadow-200">Founder & CEO</p>
                </div>
              </div>
              <p className="text-meadow-200 mb-6">
                Passionate entrepreneur with a background in software
                engineering and product management. Tobi's experience running
                Teal led him to create LimeJourney, aiming to revolutionize
                customer communication for businesses of all sizes.
              </p>
              <div className="flex space-x-4">
                <Button
                  variant="outline"
                  className="bg-meadow-600 text-forest-800 hover:bg-meadow-500"
                >
                  <Mail className="mr-2 h-4 w-4" />
                  Connect via Email
                </Button>
                <Button
                  variant="outline"
                  className="bg-meadow-600 text-forest-800 hover:bg-meadow-500"
                >
                  <Linkedin className="mr-2 h-4 w-4" />
                  LinkedIn Profile
                </Button>
              </div>
            </div>

            <div className="bg-forest-700 rounded-lg p-8 shadow-xl">
              <h2 className="text-3xl font-semibold text-meadow-300 mb-6">
                Join the Revolution
              </h2>
              <p className="text-meadow-200 mb-6">
                While we're currently a one-person show, we're excited about the
                future and potential growth of LimeJourney. Be part of something
                extraordinary - try our demo or contribute to our open-source
                project.
              </p>
              <div className="space-y-4">
                <Button className="w-full bg-meadow-600 text-forest-800 hover:bg-meadow-500">
                  Experience the Demo
                </Button>
                <Button
                  variant="outline"
                  className="w-full bg-forest-600 text-meadow-400 hover:bg-forest-500"
                >
                  <Github className="mr-2 h-4 w-4" />
                  Explore on GitHub
                </Button>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="mt-12 bg-forest-700 rounded-lg p-8 shadow-xl text-center"
        >
          <p className="text-xl italic text-meadow-300 mb-4">
            "I'm always excited to chat about LimeJourney and how it can
            transform your business communication. Let's connect and explore the
            possibilities together."
          </p>
          <p className="text-meadow-400 font-semibold">
            - Tobi Okewole, Founder
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default AboutPage;
