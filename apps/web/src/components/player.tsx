import { useEffect, useState } from "react"
import { GumletPlayer } from "@gumlet/react-embed-player"

const Player = () => {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return <></>
  return (
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
  )
}

export default Player
