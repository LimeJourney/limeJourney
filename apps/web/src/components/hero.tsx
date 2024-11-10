"use client"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { GumletPlayer } from "@gumlet/react-embed-player"

const Hero = () => {
  return (
    <div className="relative pt-[121px] md:pt-[144px] mx-auto md:max-w-[1240px] md:min-w-[768px] grid place-content-center">
      <img
        src="/hero-bg.webp"
        alt=""
        className="absolute top-0 left-0 mx-auto right-0 h-[768px] md:h-[1008px] pointer-events-none"
      />
      <h1 className="font-extrabold text-center text-[#120E00] text-[40px] md:text-[64px] -tracking-[2.4px] leading-[100%] md:leading-[95%] relative">
        Your Message,
        <br /> Perfectly Delivered.
      </h1>
      <p className="text-center text-[16px] -tracking-[0.32px] mt-5 mx-auto w-[328px] md:w-[610px] relative">
        LimeJourney helps you nudge users at just the right time with smart 📲 notifications. Like that friend who texts 💬 you
        exactly when you're thinking about them.
      </p>
      <div className="flex max-md:flex-col relative justify-center gap-4 mt-7 mx-auto">
        <Link
          href="https://cal.com/tobi-limejourney/product-demo"
          target="_blank"
          className="cta scale-on-hover whitespace-pre w-36"
        >
          Book a Demo
        </Link>
        <Link href="/auth" className="cta scale-on-hover secondary whitespace-pre flex items-center w-36">
          <ChevronLeft />
          <span>Try it now</span>
          <ChevronLeft />
        </Link>
      </div>
      <div className="w-full md:w-[1280px] mt-[26px] md:mt-[50px] mx-auto">
        <GumletPlayer
          videoID="672ddd1cfbe814b2520d1a15"
          title="Gumlet Player Example"
          preload="true"
          start_high_res="true"
          schemaOrgVideoObject={{
            "@context": "https://schema.org",
            "@type": "VideoObject",
            name: "LimeJourney",
            description: "",
            embedUrl: "https://play.gumlet.io/embed/672ddd1cfbe814b2520d1a15e",
          }}
        />
      </div>
      <div className="flex flex-wrap gap-4 items-center max-md:justify-center max-md:w-[300px] max-md:mb-[72px] mx-auto mt-10 md:mt-20">
        <span className="block max-md:w-full text-center text-[14px] md:text-[16px]">Trusted by</span>
        <img src="/Framer.png" alt="" className="w-[110px] h-[39px]" />
        <img src="/Slice.png" alt="" className="w-[110px] h-[39px]" />
        <img src="/StrideUX.png" alt="" className="w-[110px] h-[39px]" />
        <img src="/Webflow.png" alt="" className="w-[110px] h-[39px]" />
      </div>
    </div>
  )
}

export default Hero

const ChevronLeft = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" className="chevron-left">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M5.52729 2.19526C5.78764 1.93491 6.20975 1.93491 6.4701 2.19526L10.8606 6.58577C11.6417 7.36682 11.6417 8.63315 10.8606 9.4142L6.4701 13.8047C6.20975 14.0651 5.78764 14.0651 5.52729 13.8047C5.26694 13.5444 5.26694 13.1223 5.52729 12.8619L9.91782 8.47139C10.1782 8.21104 10.1782 7.78893 9.91782 7.52858L5.52729 3.13807C5.26694 2.87772 5.26694 2.45561 5.52729 2.19526Z"
      fill="black"
    />
  </svg>
)
