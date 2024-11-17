"use client"
// https://github.com/darkroomengineering/satus/blob/main/components/scrollbar/index.js
import { useRect } from "@darkroom.engineering/hamo"
import { useLenis } from "../lib/lenis"
import { mapRange } from "../lib/math"
import { useEffect, useRef } from "react"

export function Scrollbar() {
  const thumbRef = useRef(null!)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const lenis = useLenis()
  const [innerMeasureRef, { height: innerHeight }] = useRect()
  const [thumbMeasureRef, { height: thumbHeight }] = useRect()

  useLenis(
    ({ scroll, limit }) => {
      const progress = scroll / limit

      thumbRef.current.style.transform = `translate3d(0,${progress * (innerHeight - thumbHeight)}px,0)`
    },
    [innerHeight, thumbHeight]
  )

  useEffect(() => {
    let start = null

    function onPointerMove(e) {
      if (!start) return
      e.preventDefault()

      const scroll = mapRange(start, innerHeight - (thumbHeight - start), e.clientY, 0, lenis.limit)
      lenis.scrollTo(scroll, { immediate: true })
    }

    function onPointerDown(e) {
      start = e.offsetY
    }

    function onPointerUp() {
      start = null
    }

    thumbRef.current?.addEventListener("pointerdown", onPointerDown, false)
    window.addEventListener("pointermove", onPointerMove, false)
    window.addEventListener("pointerup", onPointerUp, false)

    return () => {
      thumbRef.current?.removeEventListener("pointerdown", onPointerDown, false)
      window.removeEventListener("pointermove", onPointerMove, false)
      window.removeEventListener("pointerup", onPointerUp, false)
    }
  }, [lenis, innerHeight, thumbHeight])

  return (
    <div className="scrollbar max-md:hidden">
      <div ref={innerMeasureRef} className="inner">
        <div
          className="thumb"
          ref={(node) => {
            thumbRef.current = node
            thumbMeasureRef(node)
          }}
        />
      </div>
    </div>
  )
}
