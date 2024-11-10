"use client"
import Link from "next/link"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

const Nav = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div
      className={cn(
        "nav fixed z-[30] top-3 md:top-9 left-3 right-3 p-3 mx-auto flex items-center justify-between md:max-w-[1240px] md:min-w-[768px]",
        isScrolled ? "md:top-0 md:bg-[#FCFCFCFC]" : "md:top-9 bg-[#FCFCFC00]"
      )}
    >
      <Link href="/" className="relative z-[1] flex items-center gap-3 scale-on-hover">
        <img src="/LimeJourney-logo-alt.svg" alt="LimeJourney" className="size-[46px] md:size-9" />
        <span className="hidden md:block font-euclid font-bold text-[#3F3F3F] text-[20px] -tracking-[0.4px]">LimeJourney</span>
      </Link>
      <nav
        className={cn(
          "flex items-start md:items-center max-md:flex-col max-md:fixed max-md:bg-[#FCFCFC] rounded-[8px] top-0 md:top-[100px] left-0 md:left-7 right-0 md:right-7 max-md:p-6 max-md:pt-[121px] gap-6 text-[22px] md:text-[14px] font-euclid -tracking-[0.28px]",
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
        <Link
          href="https://cal.com/tobi-limejourney/product-demo"
          target="_blank"
          className="relative cta max-md:!text-[22px] max-md:w-full max-md:!p-7 scale-on-hover whitespace-pre"
        >
          Book a Demo
        </Link>
      </nav>
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className={cn("relative grid md:hidden gap-[6px]", isMobileMenuOpen ? "hamburger" : "")}
      >
        <span className="block rounded-[4px] h-1 w-8 bg-[#000]"></span>
        <span className="block rounded-[4px] h-1 w-8 bg-[#000]"></span>
        <span className="block rounded-[4px] h-1 w-8 bg-[#000]"></span>
      </button>
    </div>
  )
}

export default Nav
