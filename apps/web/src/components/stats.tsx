"use client"
import { cn } from "@/lib/utils"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/all"
import { useEffect, useState } from "react"

const Stats = () => {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
    const mm = gsap.matchMedia()

    gsap.timeline().to(".stat .svg", {
      x: "random(-40, 50, 15)",
      y: "random(0, 150, 25)",
      duration: 10,
      ease: "none",
      repeat: -1,
      repeatRefresh: true,
    })

    mm.add("(min-width:769px)", () => {
      gsap
        .timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: ".stats",
            scrub: true,
            pin: true,
            start: "-50px 0%",
            end: innerHeight * 7,
          },
        })
        .to(".stat:nth-of-type(2)", { y: "-800px" }, 0.5)
        .to(".stat:nth-of-type(3)", { y: "-800px" }, 0)
    })
    mm.add("(max-width:768px)", () => {
      gsap
        .timeline({
          scrollTrigger: {
            trigger: ".stats",
            scrub: true,
            pin: true,
            start: "100px 0%",
            end: innerHeight * 7,
          },
        })
        .to(".stat:nth-of-type(1)", { scale: 0.975 }, 0)
        .to(".stat:nth-of-type(2), .stat:nth-of-type(3)", { y: "-400px" }, 0)
        .to(".stat:nth-of-type(1)", { scale: 0.95 }, 0.5)
        .to(".stat:nth-of-type(2)", { scale: 0.975 }, 0.5)
        .to(".stat:nth-of-type(3)", { y: "-800px" }, 0.5)
    })
  }, [])

  const cursors = ["#000", "#000", "#C6FF00"]
  const stats = [
    {
      id: 0,
      heading: "43%",
      body: "Conversion Rate",
      image: "/avatar-1.png",
      style: { top: "8px", right: "325px", backgroundColor: "#FFFFFF", color: "#000" },
      testimony: `“Our setup time was cut in half. LimeJourney made the transition seamless and efficient, allowing us to focus on what truly matters—engaging our customers.”`,
      person: "Sarah Thompson",
      role: "Marketing Lead, BrightWave",
    },
    {
      id: 1,
      heading: "64%",
      body: "Open Rate",
      image: "/avatar-2.png",
      style: { top: "125px", right: "51px", backgroundColor: "#C6FF00", color: "#000" },
      testimony: `“We've seen a remarkable 43% increase in our conversion rates since integrating LimeJourney. It's been a game-changer for our campaigns!”`,
      person: "James Lee",
      role: "CEO of InnovateX",
    },
    {
      id: 2,
      heading: "2x",
      body: "Faster Setup",
      image: "/avatar-3.png",
      style: { top: "250px", right: "290px", backgroundColor: "#1F1F1F", color: "#FFF" },
      testimony: `“With a 64% open rate, our messages are finally getting the attention they deserve. LimeJourney's smart notifications are truly effective.”`,
      person: "Brandon Rivera",
      role: "Head of Digital Marketing, TrendyBrands",
    },
  ]

  return (
    <div className="bg-[#080808] pt-[120px] md:pt-[47px] md:pt-[146px] flex stats max-md:-mb-[1px]">
      <div className="block md:flex w-full-mobile md:w-[1240px] h-[875px] mx-auto relative">
        <div>
          <p className="font-euclid text-[14px] leading-[80%] -tracking-[0.28px] py-2 px-[14px] max-md:mx-auto w-fit bg-[#C6FF00] rounded-[50px] whitespace-pre">
            Our Numbers
          </p>
          <h2 className="w-[260px] md:w-[300px] pt-5 md:pt-[18px] md:pt-4 mx-auto font-medium text-[#E3E3E3] text-[20px] md:text-[24px] max-md:text-center leading-[100%] -tracking-[0.96px]">
            We figured you'd want stats, so here's a few of them from our on-going beta.
          </h2>
        </div>
        <div>
          <ul className="mt-[54px] md:mt-[44px] flex flex-col max-md:gap-2 flex-wrap w-full-mobile max-md:relative">
            {stats.map((stat) => (
              <li
                style={stat.style}
                key={stat.id}
                className={cn(
                  "absolute w-full md:w-[395px] h-[420px] md:h-[437px] pt-[38px] px-[21.5px] px-[31px] md:px-[23px] cursor-pointer rounded-[16px] stat"
                )}
              >
                <h3 className="font-medium text-[145px] md:text-[151.2px] leading-[110px] -tracking-[6.048px] flex w-[316px] md:w-[382px] justify-between">
                  <span>{stat.heading}</span>
                </h3>
                <p className="font-euclid text-[14px] mt-[9px] md:mt-[31px] -tracking-[0.28px] max-md:pt-[14.6px] pb-[30px] duration-[500ms]">
                  {stat.body}
                </p>
                <svg
                  width="395"
                  height="1"
                  viewBox="0 0 395 1"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="absolute left-0"
                >
                  <line x1="-8" y1="0.5" x2="403" y2="0.500036" stroke="#080808" strokeDasharray="5 4" />
                </svg>
                <h4 className="mt-[30px] font-euclid text-[14px] w-[302px] md:w-[314px] leading-[1.2] -tracking-[0.28px]">
                  {stat.testimony}
                </h4>
                <div className="flex items-center gap-3 mt-[30px]">
                  <img src={stat.image} alt="" className="size-[48px] md:size-[50px]" />
                  <div>
                    <h5 className="font-bold font-[15px] -tracking-[0.6px]">{stat.person}</h5>
                    <h6 className="font-euclid text-[13.4px] md:text-[14px] -tracking-[0.28px] whitespace-pre">{stat.role}</h6>
                  </div>
                </div>
                <svg
                  className="absolute right-0 top-0 svg"
                  width="1em"
                  height="1em"
                  viewBox="0 0 14 14"
                  style={{ top: stat.style.top, right: stat.style.right }}
                >
                  <path
                    fill="none"
                    stroke={cursors[stat.id]}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.005 5.428c.157-.065.257-.094.35-.186a.494.494 0 0 0 0-.7c-.093-.092-.124-.147-.35-.214C12.78 4.262 1.81.554 1.81.554A.99.99 0 0 0 .553 1.809S4.35 12.856 4.396 13.006s.106.257.199.35a.495.495 0 0 0 .7 0c.092-.093.113-.146.183-.35l1.94-5.594s5.431-1.919 5.587-1.984"
                  />
                </svg>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Stats
