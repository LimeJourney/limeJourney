"use client"
import Link from "next/link"
import { Button } from "./moving-border"

const Footer = () => {
  return (
    <div className="bg-[#080808] flex -max-md:mt-[1px]">
      <div className="block w-full-mobile md:w-[1240px] mx-auto relative">
        <div className="hidden md:flex max-md:flex-col relative justify-between gap-4 md:mt-2 mx-auto w-[1054px] mx-auto">
          <Link
            href="https://cal.com/tobi-limejourney/product-demo"
            target="_blank"
            className="cta scale-on-hover whitespace-pre w-36"
          >
            Book a Demo
          </Link>
          <Link href="/auth" className="cta scale-on-hover secondary whitespace-pre flex items-center w-36 mt-10">
            <ChevronLeft />
            <span>Try it now</span>
            <ChevronLeft />
          </Link>
        </div>
        <svg
          width="1070"
          height="455"
          viewBox="0 0 1070 455"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="absolute top-0 left-0 right-0 mx-auto pointer-events-none max-md:hidden"
        >
          <path d="M569 380L569 455" stroke="#313131" />
          <rect x="907.5" y="40.5" width="162" height="59" rx="11.5" stroke="#313131" />
          <rect x="0.5" y="0.5" width="160" height="59" rx="11.5" stroke="#313131" />
          <path d="M75.5 59.5V132H271.5L399.5 260" stroke="#313131" />
          <path d="M906.5 68.5H823.5L774.5 117.5V259.5" stroke="#313131" />
          <line x1="843" y1="68.5" x2="878" y2="68.5" stroke="url(#paint0_radial_2053_4722)" />
          <defs>
            <radialGradient
              id="paint0_radial_2053_4722"
              cx="0"
              cy="0"
              r="1"
              gradientUnits="userSpaceOnUse"
              gradientTransform="translate(859 68.5) scale(17 0.668939)"
            >
              <stop stop-color="#BFF100" />
              <stop offset="1" stop-color="#313131" />
            </radialGradient>
          </defs>
        </svg>
        <h3 className="w-[238px] mx-auto mt-0 md:mt-[3px] mb-[50px] md:mb-[94px] text-[20px] md:text-[24px] leading-[1] text-[#FFF] text-center -tracking-[0.96px]">
          Ready to Nudge Your Business Forward?
        </h3>
        <Button borderRadius={"16px"} className="shiny-cta">
          <span className="font-medium text-[55px] md:text-[87.76px] mb-2 -tracking-[3.51px] gradient-text leading-[1.12] md:leading-[1.5]">
            Start your Journey
          </span>
          <span className="absolute top-[68.25px] left-[670px] -rotate-[1.57deg] font-euclid text-[10.95px] -tracking-[0.219px] bg-[#202020] py-[6px] px-[13px] rounded-[30px]">
            because we're limejourney, get it?*
          </span>
        </Button>
        <p className="font-euclid mt-[29px] mb-[49px] text-center text-[14px] text-[#fff] -tracking-[0.28px] md:hidden">
          *this joke was written by an intern.
        </p>
        <div className="flex md:hidden max-md:flex-col relative items-center justify-center gap-4 w-full-mobile md:mt-2 mx-auto w-[1054px] mx-auto">
          <Link
            href="https://cal.com/tobi-limejourney/product-demo"
            target="_blank"
            className="cta scale-on-hover whitespace-pre w-36"
          >
            Book a Demo
          </Link>
          <Link href="/auth" className="cta scale-on-hover secondary whitespace-pre flex items-center w-36 mt-[23px]">
            <ChevronLeft />
            <span>Try it now</span>
            <ChevronLeft />
          </Link>
        </div>
        <form className="mt-[56px] mx-auto p-1.5 flex items-center w-full-mobile md:w-[496px] rounded-[14px] border border-[#313131]">
          <Mail />
          <input
            type="text"
            placeholder="coolgenius@yourmail.com"
            className="px-3 border-none bg-transparent outline-none font-euclid text-[#fff] placeholder-[#454545] w-full"
          />
          <button className="cta submit scale-on-hover secondary whitespace-pre flex items-center w-[147px]">
            <ChevronLeft />
            <span>Join Waitlist</span>
            <ChevronLeft />
          </button>
        </form>
        <p className="font-euclid mt-[98px] md:mt-32 mb-[42px] md:mb-[49px] text-[14px] text-[#fff] -tracking-[0.28px] flex justify-center md:justify-between">
          <span>© 2024 LimeJourney Corporation. All rights reserved.</span>
          <span className="max-md:hidden">*this joke was written by an intern.</span>
        </p>
      </div>
    </div>
  )
}

export default Footer

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

const Mail = () => (
  <svg width="39" height="33" viewBox="0 0 39 33" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M11.638 23.173L12.092 22.282L12.092 22.282L11.638 23.173ZM10.327 21.862L9.43597 22.316L9.43597 22.316L10.327 21.862ZM27.673 21.862L28.564 22.316L28.564 22.316L27.673 21.862ZM26.362 23.173L25.908 22.282L25.908 22.282L26.362 23.173ZM27.673 11.138L28.564 10.684L28.564 10.684L27.673 11.138ZM26.362 9.82698L25.908 10.718L25.908 10.718L26.362 9.82698ZM10.327 11.138L11.218 11.592L11.218 11.592L10.327 11.138ZM11.638 9.82698L12.092 10.718L12.092 10.718L11.638 9.82698ZM20.8741 16.0007L20.2494 15.2199L20.2494 15.2199L20.8741 16.0007ZM17.1259 16.0007L16.5012 16.7816L16.5012 16.7816L17.1259 16.0007ZM27 14.3V18.7H29V14.3H27ZM23.2 22.5H14.8V24.5H23.2V22.5ZM11 18.7V14.3H9V18.7H11ZM14.8 10.5H23.2V8.5H14.8V10.5ZM14.8 22.5C13.9434 22.5 13.3611 22.4992 12.911 22.4624C12.4726 22.4266 12.2484 22.3617 12.092 22.282L11.184 24.064C11.6694 24.3113 12.1861 24.4099 12.7482 24.4558C13.2986 24.5008 13.9764 24.5 14.8 24.5V22.5ZM9 18.7C9 19.5236 8.99922 20.2014 9.04419 20.7518C9.09012 21.3139 9.18868 21.8306 9.43597 22.316L11.218 21.408C11.1383 21.2516 11.0734 21.0274 11.0376 20.589C11.0008 20.1389 11 19.5566 11 18.7H9ZM12.092 22.282C11.7157 22.0903 11.4097 21.7843 11.218 21.408L9.43597 22.316C9.81947 23.0686 10.4314 23.6805 11.184 24.064L12.092 22.282ZM27 18.7C27 19.5566 26.9992 20.1389 26.9624 20.589C26.9266 21.0274 26.8617 21.2516 26.782 21.408L28.564 22.316C28.8113 21.8306 28.9099 21.3139 28.9558 20.7518C29.0008 20.2014 29 19.5236 29 18.7H27ZM23.2 24.5C24.0236 24.5 24.7014 24.5008 25.2518 24.4558C25.8139 24.4099 26.3306 24.3113 26.816 24.064L25.908 22.282C25.7516 22.3617 25.5274 22.4266 25.089 22.4624C24.6389 22.4992 24.0566 22.5 23.2 22.5V24.5ZM26.782 21.408C26.5903 21.7843 26.2843 22.0903 25.908 22.282L26.816 24.064C27.5686 23.6805 28.1805 23.0686 28.564 22.316L26.782 21.408ZM29 14.3C29 13.4764 29.0008 12.7986 28.9558 12.2482C28.9099 11.6861 28.8113 11.1694 28.564 10.684L26.782 11.592C26.8617 11.7484 26.9266 11.9726 26.9624 12.411C26.9992 12.8611 27 13.4434 27 14.3H29ZM23.2 10.5C24.0566 10.5 24.6389 10.5008 25.089 10.5376C25.5274 10.5734 25.7516 10.6383 25.908 10.718L26.816 8.93597C26.3306 8.68868 25.8139 8.59012 25.2518 8.54419C24.7014 8.49922 24.0236 8.5 23.2 8.5V10.5ZM28.564 10.684C28.1805 9.93139 27.5686 9.31947 26.816 8.93597L25.908 10.718C26.2843 10.9097 26.5903 11.2157 26.782 11.592L28.564 10.684ZM11 14.3C11 13.4434 11.0008 12.8611 11.0376 12.411C11.0734 11.9726 11.1383 11.7484 11.218 11.592L9.43597 10.684C9.18868 11.1694 9.09012 11.6861 9.04419 12.2482C8.99922 12.7986 9 13.4764 9 14.3H11ZM14.8 8.5C13.9764 8.5 13.2986 8.49922 12.7482 8.54419C12.1861 8.59012 11.6694 8.68868 11.184 8.93597L12.092 10.718C12.2484 10.6383 12.4726 10.5734 12.911 10.5376C13.3611 10.5008 13.9434 10.5 14.8 10.5V8.5ZM11.218 11.592C11.4097 11.2157 11.7157 10.9097 12.092 10.718L11.184 8.93597C10.4314 9.31947 9.81947 9.93139 9.43597 10.684L11.218 11.592ZM26.8753 9.91913L20.2494 15.2199L21.4988 16.7816L28.1247 11.4809L26.8753 9.91913ZM17.7506 15.2199L11.1247 9.91913L9.87529 11.4809L16.5012 16.7816L17.7506 15.2199ZM20.2494 15.2199C19.5189 15.8042 18.481 15.8042 17.7506 15.2199L16.5012 16.7816C17.9621 17.9503 20.0379 17.9503 21.4988 16.7816L20.2494 15.2199Z"
      fill="#676767"
    />
    <line x1="38.5" y1="2.18556e-08" x2="38.5" y2="33" stroke="#1F1F1F" />
  </svg>
)
