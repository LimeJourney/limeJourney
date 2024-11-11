"use client"
import { cn } from "@/lib/utils"
import gsap from "gsap"
import { useEffect, useState } from "react"

const Stats = () => {
  useEffect(() => {
    gsap
      .timeline()
      .to(
        ".stat",
        {
          x: "random(-550, 150, 50)",
          y: "random(-100, 200, 25)",
          duration: 10,
          ease: "none",
          repeat: -1,
          repeatRefresh: true,
        },
        0
      )
      .to(
        ".stat .svg",
        {
          x: "random(-40, 50, 15)",
          y: "random(0, 150, 25)",
          duration: 10,
          ease: "none",
          repeat: -1,
          repeatRefresh: true,
        },
        0
      )
  }, [])

  const [index, setIndex] = useState([0, 0, 0])

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
    <div className="bg-[#080808] pt-[120px] md:pt-[47px] md:pt-[146px] flex">
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
                style={{ ...stat.style, zIndex: index[stat.id] }}
                key={stat.id}
                className={cn(
                  "absolute w-full md:w-[395px] h-[420px] md:h-[437px] pt-[38px] px-[21.5px] px-[31px] md:px-[23px] cursor-pointer rounded-[16px] stat"
                )}
                onMouseEnter={() => {
                  const temp = index.slice()
                  temp[stat.id] = Math.max(...index) + 1
                  setIndex(temp)
                  console.log(temp)
                }}
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
