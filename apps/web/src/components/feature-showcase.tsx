import React, { useEffect, useRef, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import { Plus, ArrowRight, Play } from "lucide-react";
import { useInView } from "react-intersection-observer";
import Image from "next/image";

interface FeatureItemProps {
  title: string;
  description: string;
  content: string;
  image: string;
  alt: string;
  reversed: boolean;
  customSvg: React.ReactNode;
  bottomRightContent?: React.ReactNode;
  topRightContent?: React.ReactNode;
  topLeftContent?: React.ReactNode;
}

const FeatureShowcase = () => {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    triggerOnce: false,
    threshold: 0.1,
  });

  const [videoPlaying, setVideoPlaying] = useState(false);
  const iframeRef = useRef(null);

  const handlePlayVideo = () => {
    console.log("iframeRef.current", iframeRef.current);
    if (iframeRef.current) {
      console.log("iframeRef.current", iframeRef.current);
      // Post a message to the Loom iframe to play the video
      iframeRef.current.contentWindow.postMessage({ type: "play" }, "*");
      setVideoPlaying(true);
    }
  };
  useEffect(() => {
    // Start the animation immediately for the first render
    controls.start("visible");
  }, [controls]);

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <section className="py-20 bg-[#e7f0ef] overflow-hidden">
      <div className="container mx-auto px-4 relative">
        <motion.div
          className="absolute top-0 right-0 w-64 h-64 opacity-10"
          initial={{ rotate: 0, scale: 0.8 }}
          animate={{ rotate: 360, scale: 1 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          <svg
            width="136"
            height="217"
            viewBox="0 0 136 217"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M104.763 63.6361C111.063 64.1361 116.863 64.6361 122.663 65.1361C123.963 65.2361 125.263 65.4361 126.363 65.9361C128.563 66.8361 129.663 68.6361 129.863 71.1361C130.063 74.4361 129.463 77.5361 128.263 80.5361C126.863 84.1361 125.363 87.6361 123.663 91.0361C119.563 99.4361 115.063 107.636 110.163 115.636C100.463 131.236 90.8633 146.736 81.4633 162.536C76.9633 170.036 73.2633 177.936 69.0633 185.536C64.8633 193.236 60.4633 200.936 56.2633 208.636C53.9633 212.936 50.0633 215.036 45.7633 216.336C40.7633 217.836 35.5633 214.836 33.9633 209.836C32.7633 206.036 32.6633 202.136 34.1633 198.536C36.8633 192.036 39.9633 185.736 43.0633 179.436C44.0633 177.436 45.6633 175.836 47.6633 174.636C50.6633 172.836 52.2633 173.436 53.0633 176.736C53.1633 177.036 53.1633 177.336 53.3633 178.136C54.0633 177.136 54.5633 176.536 54.9633 175.836C61.6633 165.036 67.7633 153.836 73.2633 142.336C81.8633 124.336 91.4633 106.936 101.063 89.4361C102.463 86.8361 104.163 84.4361 105.663 81.8361C106.063 81.1361 106.463 80.5361 106.963 79.6361C103.463 79.4361 100.263 79.2361 97.1633 79.0361C96.2633 78.9361 95.7633 79.4361 95.2633 80.2361C94.0633 82.1361 92.8633 84.0361 91.6633 85.9361C89.1633 90.1361 85.4633 92.0361 80.5633 91.6361C79.1633 91.5361 77.6633 91.5361 76.2633 91.1361C72.4633 90.2361 70.5633 86.8361 71.5633 83.0361C71.8633 81.9361 72.3633 80.9361 72.8633 79.9361C82.3633 62.9361 91.7633 46.0361 101.363 29.1361C104.163 24.2361 107.363 19.5361 110.363 14.6361C110.763 13.9361 111.163 13.3361 111.663 12.4361C110.263 12.3361 109.263 12.3361 108.163 12.1361C105.663 11.7361 104.363 10.3361 104.063 8.13607C103.863 6.43607 104.463 5.33607 106.063 4.63607C107.063 4.23607 107.763 3.53607 108.563 2.93607C109.463 2.23607 110.763 1.53607 111.963 1.53607C116.763 1.23607 121.363 1.03607 126.063 1.03607C127.763 1.03607 129.563 1.33607 131.263 1.73607C134.763 2.53607 136.363 5.13607 135.363 8.53607C134.863 10.3361 134.063 12.1361 132.963 13.7361C129.063 19.1361 125.663 24.9361 122.663 31.0361C117.563 41.3361 112.063 51.3361 106.163 61.1361C105.763 61.8361 105.363 62.5361 104.763 63.6361Z"
              fill="#22C55E"
            />
            <path
              d="M30.6632 105.436C27.6632 105.636 24.8632 105.836 21.9632 105.936C17.4632 106.236 12.8632 106.536 8.36322 106.736C7.36322 106.836 6.46322 106.836 5.46322 106.736C1.56322 106.336 -0.636777 103.236 0.163223 99.4361C0.263223 99.0361 0.363223 98.6361 0.563223 98.3361C5.06322 86.5361 8.26322 74.4361 11.2632 62.2361C14.6632 48.7361 18.1632 35.2361 21.6632 21.8361C22.3632 19.2361 23.1632 16.6361 23.8632 14.0361C24.8632 10.5361 26.8632 8.23607 30.6632 7.83607C34.6632 7.43607 38.5632 6.73607 42.5632 6.43607C60.5632 5.33607 78.5632 3.33607 96.4632 1.23607C100.963 0.736068 105.563 0.336068 110.063 0.036068C111.663 -0.063932 113.263 0.036068 114.763 0.436068C118.563 1.33607 120.163 4.93607 118.663 8.43607C118.163 9.53607 117.463 10.5361 116.763 11.5361C114.963 14.3361 113.163 17.0361 111.463 19.8361C106.863 27.6361 102.363 35.4361 97.6632 43.1361C92.9632 50.8361 88.1632 58.5361 83.3632 66.2361C81.9632 68.4361 80.5632 70.5361 79.1632 72.6361C78.7632 73.2361 78.3632 73.9361 77.7632 74.9361C78.7632 74.9361 79.3632 74.9361 79.9632 74.9361C88.2632 75.0361 96.5632 75.0361 104.863 75.1361C105.463 75.1361 106.163 75.2361 106.763 75.3361C110.563 76.1361 112.463 79.6361 111.063 83.2361C110.563 84.5361 109.663 85.7361 108.763 86.8361C104.663 92.2361 100.463 97.5361 96.4632 103.036C94.5632 105.636 92.8632 108.536 91.3632 111.436C83.2632 126.836 75.2632 142.136 67.3632 157.636C59.1632 173.536 51.1632 189.636 43.0632 205.536C42.4632 206.736 41.7632 207.936 40.7632 208.936C38.3632 211.436 35.1632 211.236 32.6632 208.936C30.8632 207.236 29.8632 205.236 29.7632 202.836C29.4632 198.336 29.0632 193.736 29.1632 189.136C29.4632 172.736 30.0632 156.336 30.3632 139.936C30.5632 128.836 30.5632 117.736 30.6632 106.636C30.8632 106.336 30.7632 105.936 30.6632 105.436Z"
              fill="#EA552B"
            />
          </svg>
        </motion.div>
        <motion.div
          ref={ref}
          initial="visible"
          animate={controls}
          variants={containerVariants}
        >
          {/* Video Introduction */}
          <motion.div className="mb-24 text-center" variants={itemVariants}>
            <h3 className="text-3xl font-semibold text-forest-700 mb-4">
              See LimeJourney in Action
            </h3>
            <p className="text-xl text-gray-600 mb-8">
              Watch our product demo to discover how LimeJourney can
              revolutionize your marketing strategy.
            </p>
          </motion.div>

          {/* Loom Video Embed */}
          <motion.div
            className="mb-32 rounded-lg overflow-hidden shadow-2xl relative"
            variants={itemVariants}
          >
            <div
              style={{
                position: "relative",
                paddingBottom: "56.25%",
                height: 0,
              }}
            >
              <iframe
                ref={iframeRef}
                src="https://www.loom.com/embed/61c783efe93a4464bfd3594fa0339d49"
                frameBorder="0"
                webkitallowfullscreen="true"
                mozallowfullscreen="true"
                allowFullScreen
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                }}
              ></iframe>
            </div>
            {!videoPlaying && (
              <div className="absolute inset-0 bg-forest-600 bg-opacity-50 flex items-center justify-center transition-opacity duration-300">
                <button
                  onClick={handlePlayVideo}
                  className="bg-white text-forest-600 rounded-full p-4 flex items-center space-x-2 shadow-lg hover:bg-forest-50 transition duration-300"
                >
                  <Play size={24} />
                  <span className="font-semibold">Watch Demo</span>
                </button>
              </div>
            )}
          </motion.div>

          <motion.h2
            className="text-5xl font-bold text-forest-800 mb-16 text-center relative z-10"
            variants={itemVariants}
          >
            <span className="inline-block transform -rotate-2 text-forest-500">
              Target
            </span>{" "}
            <span className="inline-block">Smarter.</span>{" "}
            <span className="inline-block transform rotate-2 text-forest-600">
              Connect
            </span>{" "}
            <br />
            <span className="inline-block transform -rotate-1 text-forest-700">
              Deeper.
            </span>{" "}
            <span className="inline-block transform rotate-1 text-forest-800">
              Convert Quicker.
            </span>
          </motion.h2>

          <FeatureItem
            title="Audience Segmentation"
            description="Target With Precision"
            content="LimeJourney allows you to segment your audience based on their preferences, behavior, and other criteria. This helps you to deliver more relevant content and offers to the right people at the right time."
            image="/segmentation-screenshot.png"
            alt="NFC Labels Showcase"
            reversed={false}
            customSvg={
              <svg
                width="50"
                height="52"
                viewBox="0 0 50 52"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  stroke="#22C55E"
                  d="M25.8216 11.803L25.8216 11.8033C25.7151 12.532 25.6005 13.3166 25.4697 14.1012C25.3375 14.8285 25.0069 15.4897 24.6763 16.1509C23.6184 18.0684 22.6927 18.1345 21.5026 16.3493C19.5851 13.44 18.9239 10.1341 18.5272 6.76197C18.5107 6.56361 18.49 6.36524 18.4694 6.16688C18.4074 5.57181 18.3454 4.97674 18.395 4.38167C18.4611 3.52212 18.5933 2.59645 18.99 1.80302C19.6512 0.414513 21.2381 -0.24668 22.7589 0.0839163C24.2796 0.348394 25.3375 1.47242 25.602 3.12541C25.7428 4.58012 25.8502 6.03484 25.9717 7.67866L25.9717 7.67872L25.9717 7.67904C26.0214 8.35125 26.0734 9.05508 26.1309 9.80346C26.0307 10.3716 25.9304 11.0581 25.8216 11.803ZM49.5715 24.8971C49.7152 24.779 49.8576 24.662 50 24.5481C49.9669 24.482 49.9504 24.3993 49.9339 24.3167C49.9173 24.234 49.9008 24.1514 49.8678 24.0852C49.7396 24.012 49.6114 23.9337 49.4818 23.8545C49.1435 23.6478 48.7956 23.4352 48.4131 23.2918C43.7848 21.176 38.8258 21.3082 33.933 21.8372C33.7567 21.8372 33.5804 21.896 33.404 21.9547L33.404 21.9548C33.3158 21.9841 33.2277 22.0135 33.1396 22.0355C31.5527 22.6306 30.5609 24.0191 30.627 25.5399C30.6931 27.0606 31.7511 28.4491 33.3379 28.8458C33.933 29.0442 34.5942 29.0442 35.1893 29.0442C36.7761 28.9781 38.363 28.8458 39.9499 28.7136C42.793 28.4491 45.4378 27.5896 47.8842 26.1349C48.5067 25.7718 49.0479 25.3272 49.5715 24.8971ZM19.1884 35.8545C18.9239 37.7719 18.7917 39.6233 18.6594 41.5407C18.5272 43.5243 18.5933 45.5079 19.1884 47.5576C19.5851 48.9461 20.1802 50.2024 21.3703 51.128C22.4282 51.9215 22.9572 51.8554 23.6845 50.7313C24.6102 49.2767 25.2714 47.756 25.4697 46.0369C25.7305 43.7768 25.9341 41.4882 26.137 39.2086C26.2427 38.0202 26.3482 36.8343 26.4615 35.6561C26.4615 35.3916 26.4615 35.061 26.3954 34.7304C26.197 33.1436 25.0069 31.9534 23.5523 31.689C22.0976 31.3584 20.5769 32.0857 19.8496 33.4742C19.519 34.2015 19.3206 35.061 19.1884 35.8545ZM19.112 28.3303C19.6916 28.1232 20.2984 27.9065 20.5769 27.1267L19.5851 26.73C14.2294 25.8044 8.87378 25.8043 3.45199 26.2011C2.65856 26.2672 1.86513 26.5317 1.20393 26.9284C-0.515169 28.0524 -0.382931 30.4327 1.53453 31.2923C2.26184 31.6229 3.18751 31.689 3.98095 31.689C5.28243 31.627 6.52582 31.4488 7.82002 31.2634C7.90655 31.251 7.99332 31.2386 8.08034 31.2261C11.7169 30.6972 15.3535 29.8376 18.7917 28.4491C18.8959 28.4074 19.0035 28.369 19.112 28.3303Z"
                  fill="#22C55E"
                />
              </svg>
            }
            bottomRightContent={
              <>
                <div className="bg-meadow-500 p-4 rounded-lg shadow-lg">
                  <span className="text-4xl font-bold text-forest-600 ">
                    +43%
                  </span>
                  <p className="text-sm text-gray-600">Conversion Rate</p>
                </div>
              </>
            }
          />

          <FeatureItem
            title="Visual Workflow Builder"
            description="Design Your Customer Journey"
            content="Create complex, multi-step customer journeys with our intuitive drag-and-drop interface. Visualize your entire marketing funnel and optimize each touchpoint for maximum engagement and conversion."
            image="/workflow-builder-screenshot.png"
            alt="Visual Workflow Builder"
            reversed={true}
            customSvg={
              <svg
                width="50"
                height="50"
                viewBox="0 0 50 50"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M25 0C11.1929 0 0 11.1929 0 25C0 38.8071 11.1929 50 25 50C38.8071 50 50 38.8071 50 25C50 11.1929 38.8071 0 25 0ZM25 7.14286C34.8214 7.14286 42.8571 15.1786 42.8571 25C42.8571 34.8214 34.8214 42.8571 25 42.8571C15.1786 42.8571 7.14286 34.8214 7.14286 25C7.14286 15.1786 15.1786 7.14286 25 7.14286ZM25 10.7143C17.1429 10.7143 10.7143 17.1429 10.7143 25C10.7143 32.8571 17.1429 39.2857 25 39.2857C32.8571 39.2857 39.2857 32.8571 39.2857 25C39.2857 17.1429 32.8571 10.7143 25 10.7143ZM25 14.2857C30.8929 14.2857 35.7143 19.1071 35.7143 25C35.7143 30.8929 30.8929 35.7143 25 35.7143C19.1071 35.7143 14.2857 30.8929 14.2857 25C14.2857 19.1071 19.1071 14.2857 25 14.2857Z"
                  fill="#22C55E"
                />
              </svg>
            }
            bottomRightContent={
              <>
                <div className="bg-forest-500 p-4 rounded-lg shadow-lg">
                  <span className="text-4xl font-bold text-meadow-500">2x</span>
                  <p className="text-sm text-white">Faster Setup</p>
                </div>
              </>
            }
          />
          <FeatureItem
            title="Template Editor"
            description="Craft with Clarity"
            content="Design and customize your message templates with our intuitive editor. Preview your creations in real-time, insert dynamic placeholders, and ensure your communication is always on-brand and personalized for each recipient."
            image="/template-editor-screenshot.png"
            alt="Template Editor"
            reversed={false}
            customSvg={
              <svg
                width="50"
                height="50"
                viewBox="0 0 50 50"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  x="5"
                  y="5"
                  width="35"
                  height="40"
                  rx="2"
                  stroke="#22C55E"
                  strokeWidth="2"
                />
                <line
                  x1="12"
                  y1="15"
                  x2="33"
                  y2="15"
                  stroke="#22C55E"
                  strokeWidth="2"
                />
                <line
                  x1="12"
                  y1="25"
                  x2="33"
                  y2="25"
                  stroke="#22C55E"
                  strokeWidth="2"
                />
                <line
                  x1="12"
                  y1="35"
                  x2="25"
                  y2="35"
                  stroke="#22C55E"
                  strokeWidth="2"
                />
                <path
                  d="M35 30L40 35L45 30"
                  stroke="#22C55E"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M40 35V45"
                  stroke="#22C55E"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            }
            bottomRightContent={
              <>
                <div className="bg-meadow-500 p-6 rounded-lg shadow-lg">
                  <span className="text-4xl font-bold text-forest-500">2x</span>
                  <p className="text-sm text-gray-600">Faster Setup</p>
                </div>
              </>
            }
          />
          <FeatureItem
            title="AI Insights & Analytics"
            description="Analyze with Intelligence"
            content="Harness the power of AI to gain deep insights into your data. Our intuitive dashboard provides real-time event overviews, quick stats, and allows you to query your data using natural language. Uncover trends, track user behavior, and make data-driven decisions with ease."
            image="/ai-insights-screenshot.png"
            alt="AI Insights & Analytics"
            reversed={true}
            customSvg={
              <svg
                width="50"
                height="50"
                viewBox="0 0 50 50"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M25 2L2 14.5L25 27L48 14.5L25 2Z"
                  stroke="#22C55E"
                  strokeWidth="2"
                />
                <path
                  d="M2 35.5L25 48L48 35.5"
                  stroke="#22C55E"
                  strokeWidth="2"
                />
                <path
                  d="M2 25L25 37.5L48 25"
                  stroke="#22C55E"
                  strokeWidth="2"
                />
                <circle cx="25" cy="25" r="5" fill="#22C55E" />
              </svg>
            }
            bottomRightContent={
              <>
                <div className="bg-meadow-500 p-6 rounded-lg shadow-lg">
                  <span className="text-4xl font-bold text-forest-600">AI</span>
                  <p className="text-sm text-gray-600">Powered Insights</p>
                </div>
              </>
            }
          />
        </motion.div>
      </div>
    </section>
  );
};

const FeatureItem = ({
  title,
  description,
  content,
  image,
  alt,
  reversed,
  customSvg,
  bottomRightContent,
  topRightContent,
  topLeftContent,
}: FeatureItemProps) => {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    triggerOnce: false,
    threshold: 0.2,
    rootMargin: "-100px 0px",
  });
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (inView || hasAnimated) {
      controls.start("visible");
      setHasAnimated(true);
    } else {
      controls.start("hidden");
    }
  }, [controls, inView, hasAnimated]);

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  const ImageSection = () => (
    <motion.div
      className="lg:w-1/2 mb-10 lg:mb-0 relative"
      variants={itemVariants}
    >
      <motion.img
        src={image}
        alt={alt}
        className="w-full h-auto rounded-lg shadow-2xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        loading="lazy"
      />
      {bottomRightContent && (
        <motion.div
          className="absolute -bottom-6 -right-6"
          variants={itemVariants}
        >
          {bottomRightContent}
        </motion.div>
      )}
      {topRightContent && (
        <motion.div
          className="absolute -top-12 -right-6"
          variants={itemVariants}
        >
          {topRightContent}
        </motion.div>
      )}
      {topLeftContent && (
        <motion.div className="absolute -top-6 -left-8" variants={itemVariants}>
          {topLeftContent}
        </motion.div>
      )}
    </motion.div>
  );

  const calendarLink = "https://cal.com/tobi-limejourney/product-demo";
  const ContentSection = () => (
    <motion.div className="lg:w-1/2 lg:pl-16" variants={containerVariants}>
      <motion.div className="mb-6" variants={itemVariants}>
        <span className="inline-block bg-green-100 rounded-full p-2">
          {customSvg}
        </span>
      </motion.div>
      <motion.p
        className="text-xl text-gray-600 mb-4 font-semibold"
        variants={itemVariants}
      >
        {title}
      </motion.p>
      <motion.h2
        className="text-4xl font-bold text-gray-900 mb-6"
        variants={itemVariants}
      >
        {description}
      </motion.h2>
      <motion.p className="text-xl text-gray-600 mb-8" variants={itemVariants}>
        {content}
      </motion.p>
      <motion.div className="space-y-4 mb-8" variants={containerVariants}>
        <FeatureListItem text="Create custom segments based on user behavior" />
        <FeatureListItem text="Target specific groups with personalized content" />
        <FeatureListItem text="Analyze and improve your campaigns with data" />
      </motion.div>
      <motion.button
        className="bg-forest-600 text-white px-6 py-3 rounded-full font-semibold flex items-center space-x-2 hover:bg-forest-700 transition duration-300"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        variants={itemVariants}
        onClick={() => window.open(calendarLink, "_blank")}
      >
        <span>Start {title}</span>
        <ArrowRight size={20} />
      </motion.button>
    </motion.div>
  );

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={containerVariants}
      className={`flex flex-col lg:flex-row items-center gap-12 mb-10 ${
        reversed ? "lg:flex-row-reverse" : ""
      }`}
    >
      <ImageSection />
      <ContentSection />
    </motion.div>
  );
};

const FeatureListItem = ({ text }: { text: string }) => (
  <motion.div
    className="flex items-center space-x-3"
    variants={{
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    }}
  >
    <div className="flex-shrink-0">
      <Plus className="w-6 h-6 text-forest-500" />
    </div>
    <span className="text-lg text-gray-700">{text}</span>
  </motion.div>
);

export default FeatureShowcase;
