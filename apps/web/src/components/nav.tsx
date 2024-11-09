"use client"
import Link from "next/link"
import { useState } from "react"
import { cn } from "@/lib/utils"

const Nav = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  return (
    <div className="fixed top-7 md:top-12 left-7 right-7 mx-auto flex items-center justify-between md:max-w-[1240px] md:min-w-[768px]">
      <Link href="/" className="flex items-center gap-3 scale-on-hover">
        <img src="/LimeJourney-logo-alt.svg" alt="LimeJourney" className="size-9" />
        <span className="hidden md:block font-euclid font-bold text-[#3F3F3F] text-[20px] -tracking-[0.4px]">LimeJourney</span>
      </Link>
      <nav
        className={cn(
          "flex items-center max-md:flex-col max-md:fixed max-md:bg-[#F2F2F2] rounded-[8px] top-[100px] left-7 right-7 max-md:p-6 gap-6 text-[14px] font-euclid -tracking-[0.28px]",
          isMobileMenuOpen ? "" : "max-md:hidden"
        )}
      >
        <Link href="/features">
          <span className="dbunderline-on-hover">Features</span>
        </Link>
        <Link href="/prcing">
          <span className="dbunderline-on-hover">Pricing</span>
        </Link>
        <Link href="/about">
          <span className="dbunderline-on-hover">About</span>
        </Link>
        <Link href="https://docs.limejourney.com/introduction" target="_blank">
          <span className="dbunderline-on-hover">Documentation</span>
        </Link>
        <Link href="https://github.com/LimeJourney/limeJourney/" target="_blank">
          <span className="dbunderline-on-hover">Star us on Github</span>
        </Link>
        <button className="cta scale-on-hover whitespace-pre">Book a Demo</button>
      </nav>
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className={cn("grid md:hidden gap-[6px]", isMobileMenuOpen ? "hamburger" : "")}
      >
        <span className="block rounded-[4px] h-1 w-8 bg-[#000]"></span>
        <span className="block rounded-[4px] h-1 w-8 bg-[#000]"></span>
        <span className="block rounded-[4px] h-1 w-8 bg-[#000]"></span>
      </button>
      <style jsx>{`
        .scale-on-hover {
          transition: transform 0.5s ease;
        }
        .scale-on-hover:hover {
          transform: scale(1.05);
        }

        .cta {
          display: flex;
          height: 44px;
          padding: 12px 24px;
          justify-content: center;
          align-items: center;
          gap: 10px;
          border-radius: 8px;
          border: 1px solid #b0e200;
          background: #c6ff00;
          color: #120e00;
          font-family: var(--font-euclid);
          font-size: 16px;
          font-style: normal;
          font-weight: 700;
          line-height: normal;
          letter-spacing: -0.32px;
        }

        .dbunderline-on-hover {
          cursor: pointer;
          position: relative;
          white-space: nowrap;
        }

        .dbunderline-on-hover::before {
          content: "";
          position: absolute;
          width: 100%;
          height: 1px;
          background: currentColor;
          top: 100%;
          left: 0;
          pointer-events: none;
          transform-origin: 100% 50%;
          transform: scale3d(0, 1, 1);
          transition: transform 0.3s cubic-bezier(0.2, 1, 0.8, 1);
        }

        .dbunderline-on-hover:hover::before {
          transform-origin: 0% 50%;
          transform: scale3d(1, 2, 1);
          transition-timing-function: cubic-bezier(0.7, 0, 0.2, 1);
        }

        .dbunderline-on-hover::after {
          content: "";
          position: absolute;
          width: 100%;
          height: 1px;
          background: currentColor;
          top: 100%;
          left: 0;
          pointer-events: none;
          top: calc(100% + 4px);
          transform-origin: 100% 50%;
          transform: scale3d(0, 1, 1);
          transition: transform 0.4s 0.1s cubic-bezier(0.2, 1, 0.8, 1);
        }

        .dbunderline-on-hover:hover::after {
          transform-origin: 0% 50%;
          transform: scale3d(1, 1, 1);
          transition-timing-function: cubic-bezier(0.7, 0, 0.2, 1);
        }

        .hamburger span {
          transition: 0.5s;
        }
        .hamburger span:nth-of-type(1) {
          transform: rotate(45deg) scaleX(1.2) translateY(-50%);
          transform-origin: 0% 0%;
        }
        .hamburger span:nth-of-type(2) {
          opacity: 0;
          transform: scale(0);
        }
        .hamburger span:nth-of-type(3) {
          transform: rotate(-45deg) scaleX(1.2) translate(-11%, 50%);
          transform-origin: 0% 0%;
        }
      `}</style>
    </div>
  )
}

export default Nav
