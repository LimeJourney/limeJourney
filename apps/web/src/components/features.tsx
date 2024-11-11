"use client"
import { cn } from "@/lib/utils"
import { useState } from "react"

const Features = () => {
  const features = [
    {
      id: 0,
      heading: "Audience Segmentation 👥",
      body: "Segment your audience based on their preferences, behavior, and other criteria. This helps you to deliver more relevant content and offers to the right people at the right time.",
      image: "/segmentation-screenshot.png",
      alt: "NFC Labels Showcase",
      bg: "#18353B",
      features: [
        "Create custom segments based on user behavior",
        "Target specific groups with personalized content",
        "Analyze and improve your campaigns with data",
      ],
    },
    {
      id: 1,
      heading: "Visual Workflow Builder 📑",
      body: "Create complex, multi-step customer journeys with our intuitive drag-and-drop interface. Visualize your entire marketing funnel and optimize each touchpoint for maximum engagement and conversion.",
      image: "/workflow-builder-screenshot.png",
      alt: "Visual Workflow Builder",
      bg: "#18353B",
      features: [
        "Create custom segments based on user behavior",
        "Target specific groups with personalized content",
        "Analyze and improve your campaigns with data",
      ],
    },
    {
      id: 2,
      heading: "Text Editor 📝",
      body: "Design and customize your message templates with our intuitive editor. Preview your creations in real-time, insert dynamic placeholders, and ensure your communication is always on-brand and personalized for each recipient.",
      image: "/template-editor-screenshot.png",
      alt: "Template Editor",
      bg: "#0b2529",
      features: [
        "Create custom segments based on user behavior",
        "Target specific groups with personalized content",
        "Analyze and improve your campaigns with data",
      ],
    },
    {
      id: 3,
      heading: "AI Insights & Analytics ✨",
      body: "Uncover trends, track user behavior, and make data-driven decisions with ease. Our intuitive dashboard provides real-time event overviews, quick stats, and allows you to query your data using natural language.",
      image: "/ai-insights-screenshot.png",
      alt: "AI Insights & Analytics",
      bg: "#0b2529",
      features: [
        "Create custom segments based on user behavior",
        "Target specific groups with personalized content",
        "Analyze and improve your campaigns with data",
      ],
    },
  ]

  const [active, setActive] = useState(0)
  return (
    <div className="bg-[#080808] pt-[47px] md:pt-20">
      <p className="font-euclid text-[14px] leading-[80%] -tracking-[0.28px] py-2 px-[14px] mx-auto w-fit bg-[#C6FF00] rounded-[50px]">
        Our Features
      </p>
      <h2 className="w-[346px] md:w-[640px] pt-5 md:pt-20 md:pt-4 mx-auto font-medium text-[#E3E3E3] text-center text-[20px] md:text-[24px] leading-[100%] -tracking-[0.96px]">
        You've seen how LimeJourney can transform your customer engagement through these real-world scenarios, now discover the
        robust features that make all this possible.
      </h2>
      <ul className="mt-10 md:mt-[44px] mx-auto flex flex-col max-md:gap-2 flex-wrap w-full-mobile md:w-[1240px] relative">
        {features.map((feature) => (
          <li
            key={feature.id}
            className={cn(
              "w-full md:w-[452px] h-[54px] md:h-[59px] pt-[18px] md:pt-[19.5px] px-[21.5px] md:px-[23px] cursor-pointer feature",
              active === feature.id ? "h-[692px] md:h-[354px] pt-[22px] md:pt-[28px] active" : ""
            )}
            onClick={() => setActive(feature.id)}
          >
            <h3 className="text-[18px] text-[#353535] leading-[100%] -tracking-[0.72px] flex w-[316px] md:w-[382px] justify-between">
              <span>{feature.heading}</span>
              {active === feature.id ? <Minus /> : <Plus />}
            </h3>
            <p className="font-euclid text-[14px] mt-[9px] md:mt-[18px] -tracking-[0.28px] max-md:pt-[14.6px] pb-5 max-md:border-t border-b max-md:border-t-[#eee] border-b-[#eee] opacity-[0.5] transition-opacity duration-[500ms]">
              {feature.body}
            </p>
            <figure
              style={{ backgroundColor: feature.bg }}
              className="max-md:-mx-[21.5px] static md:absolute top-0 right-0 w-full-mobile md:w-[788px] h-[333px] md:h-[531px] md:py-[44px] px-[17.35px] md:px-[127px] md:rounded-[16px] max-md:grid place-content-center opacity-0 transition-opacity"
            >
              <img src={feature.image} alt={feature.alt} className="clip max-h-[442px]" />
            </figure>
            <h4 className="my-[14px] md:my-[17px] flex gap-4 items-center">
              <Users />
              <span className="font-euclid text-[14px] w-3/5 md:w-1/2 leading-[1.2] -tracking-[0.28px]">
                {feature.features[0]}
              </span>
            </h4>
            <h4 className="my-[14px] md:my-[17px] flex gap-4 items-center">
              <Target />
              <span className="font-euclid text-[14px] w-3/5 md:w-1/2 leading-[1.2] -tracking-[0.28px]">
                {feature.features[1]}
              </span>
            </h4>
            <h4 className="my-[14px] md:my-[17px] flex gap-4 items-center">
              <Stat />
              <span className="font-euclid text-[14px] w-3/5 md:w-1/2 leading-[1.2] -tracking-[0.28px]">
                {feature.features[2]}
              </span>
            </h4>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Features

const Plus = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none" className="max-md:size-4">
    <path
      d="M10 3.125V10M10 10V16.875M10 10H3.125M10 10H16.875"
      stroke="black"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

const Minus = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="max-md:size-4">
    <path d="M3.125 10H10H16.875" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const Users = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path
      d="M17.75 19.25H22.5C22.2294 15.6058 20.3551 12.75 17 12.75C16.5539 12.75 16.134 12.8005 15.7406 12.8966M11.25 7C11.25 8.79493 9.79493 10.25 8 10.25C6.20507 10.25 4.75 8.79493 4.75 7C4.75 5.20507 6.20507 3.75 8 3.75C9.79493 3.75 11.25 5.20507 11.25 7ZM19.75 7.5C19.75 9.01878 18.5188 10.25 17 10.25C15.4812 10.25 14.25 9.01878 14.25 7.5C14.25 5.98122 15.4812 4.75 17 4.75C18.5188 4.75 19.75 5.98122 19.75 7.5ZM1.75 20.25C2.05745 16.0451 4.18738 12.75 8 12.75C11.8126 12.75 13.9425 16.0451 14.25 20.25H1.75Z"
      stroke="black"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

const Target = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path
      d="M21.1935 10.9722C21.2308 11.3097 21.25 11.6526 21.25 12C21.25 17.1086 17.1086 21.25 12 21.25C6.89137 21.25 2.75 17.1086 2.75 12C2.75 6.89137 6.89137 2.75 12 2.75C12.3474 2.75 12.6903 2.76915 13.0278 2.80645M11.4867 6.75C8.82714 7.01406 6.75 9.25797 6.75 11.987C6.75 14.8937 9.10633 17.25 12.013 17.25C14.742 17.25 16.9858 15.173 17.25 12.5136M14.25 9.75H18.3L22 6.25L18.75 5.25L17.75 2L14.25 5.7V9.75ZM14.25 9.75L11.5 12.5"
      stroke="black"
      strokeWidth="1.5"
    />
  </svg>
)

const Stat = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path
      d="M2.75 10.75V19.25M8.91602 4.75V19.25M15.082 13.75V19.25M21.248 7.75V19.25"
      stroke="black"
      strokeWidth="1.5"
      strokeLinecap="square"
    />
  </svg>
)
