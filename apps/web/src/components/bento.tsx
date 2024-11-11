"use client"
import { useEffect } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/all"

const Bento = () => {
  useEffect(() => {
    if (!window) return
    gsap.registerPlugin(ScrollTrigger)
    const mm = gsap.matchMedia()
    mm.add("(max-width:768px)", () => {
      gsap
        .timeline({
          scrollTrigger: {
            trigger: ".bentos",
            scrub: true,
            pin: true,
            end: innerHeight * 3,
          },
        })
        .to(".bento:nth-of-type(1)", { scale: 0.975 }, 0)
        .to(".bento:nth-of-type(2)", { y: "-290px" }, 0)
        .to(".bento:nth-of-type(1)", { scale: 0.95 }, 0.5)
        .to(".bento:nth-of-type(2)", { scale: 0.975 }, 0.5)
        .to(".bento:nth-of-type(3)", { y: "-580px" }, 0.5)
        .to(".bento:nth-of-type(1)", { scale: 0.925 }, 1)
        .to(".bento:nth-of-type(2)", { scale: 0.95 }, 1)
        .to(".bento:nth-of-type(3)", { scale: 0.975 }, 1)
        .to(".bento:nth-of-type(4)", { y: "-860px" }, 1)
        .to(".bento:nth-of-type(1)", { scale: 0.9 }, 1.5)
        .to(".bento:nth-of-type(2)", { scale: 0.925 }, 1.5)
        .to(".bento:nth-of-type(3)", { scale: 0.95 }, 1.5)
        .to(".bento:nth-of-type(4)", { scale: 0.975 }, 1.5)
        .to(".bento:nth-of-type(5)", { y: "-1140px" }, 1.5)
    })
  }, [])
  return (
    <div className="bentos max-md:h-[704px]">
      <h2 className="w-[314px] max-md:pt-20 md:w-[490px] mx-auto font-medium text-[#363636] text-center text-[20px] md:text-[24px] leading-[100%] -tracking-[0.96px]">
        Think of us as your marketing team's <span className="text-[#ADADAD]">secret</span> weapon — quietly observing, perfectly
        timing, and making you look like a mind reader.
      </h2>
      <ul className="mt-8 mx-auto mb-[110px] flex max-md:gap-2 flex-wrap w-full-mobile md:w-[1240px]">
        <li className="w-[630px] h-[302px] md:h-[308px] bento group">
          <img
            src="/bento-1-image.webp"
            alt=""
            className="w-[549px] absolute -top-[150px] left-0 right-0 mx-auto grayscale group-hover:-top-[97px] group-hover:grayscale-0"
          />
          <div className="absolute left-0 right-0 bottom-0 h-[214px] fade pointer-events-none" />
          <h3>Recover Abandoned Carts</h3>
          <p className="w-[297px] md:w-[418px]">
            Send timely reminders to customers who abandon their carts. Nudge them back to complete their purchase.
          </p>
        </li>
        <li className="w-[610px] h-[302px] md:h-[308px] bento group">
          <img
            src="/bento-2-image.webp"
            alt=""
            className="w-[591px] absolute -top-[19px] left-0 right-0 mx-auto grayscale group-hover:top-[29px] group-hover:grayscale-0"
          />
          <div className="absolute left-0 right-0 bottom-0 h-[214px] fade pointer-events-none" />
          <h3>Deliver Personalized Promotions</h3>
          <p className="w-[297px] md:w-[458px]">
            Drive sales by targeting specific customer segments with personalized promotions. Engage your audience with offers
            they'll love.
          </p>
        </li>
        <li className="w-[413px] h-[302px] md:h-[308px] bento group">
          <img
            src="/bento-3-image.webp"
            alt=""
            className="w-[397px] absolute -top-[40px] left-0 right-0 mx-auto grayscale group-hover:top-[10px] group-hover:grayscale-0"
          />
          <div className="absolute left-0 right-0 bottom-0 h-[214px] fade pointer-events-none" />
          <h3>Onboard New Users Efficiently</h3>
          <p className="w-[297px] md:w-[293px]">Make a great first impression by automating your welcome messages.</p>
        </li>
        <li className="w-[414px] h-[302px] md:h-[308px] bento group">
          <img
            src="/bento-4-image.webp"
            alt=""
            className="w-[215px] absolute -top-[26px] left-0 right-0 mx-auto grayscale group-hover:top-[25px] group-hover:grayscale-0"
          />
          <img
            src="/notification.webp"
            alt=""
            className="w-[259px] absolute top-[80.5px] scale-[0.7] left-0 right-0 mx-auto grayscale group-hover:top-[80.5px] group-hover:grayscale-0 group-hover:scale-[1]"
          />
          <div className="absolute left-0 right-0 bottom-0 h-[214px] fade pointer-events-none" />
          <h3>Re-Engage Inactive Users</h3>
          <p className="w-[308px] md:w-[320px]">
            Win back inactive users with tailored messages. Let them know you’re still thinking of them.
          </p>
        </li>
        <li className="w-[413px] h-[302px] md:h-[308px] bento group">
          <img
            src="/bento-5-image.webp"
            alt=""
            className="w-[334px] absolute -top-[13px] left-0 right-0 mx-auto grayscale group-hover:top-[23px] group-hover:grayscale-0"
          />
          <div className="absolute left-0 right-0 bottom-0 h-[214px] fade pointer-events-none" />
          <h3>Send Event and Appointment Reminders</h3>
          <p className="w-[308px] md:w-[356px]">
            Ensure no one misses out on your events. Automate reminders to keep your audience informed and excited.
          </p>
        </li>
      </ul>
    </div>
  )
}

export default Bento
