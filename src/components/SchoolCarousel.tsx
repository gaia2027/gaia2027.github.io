import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent,
} from 'react'
import { conference } from '../content/conference'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { BorderGlow } from './BorderGlow'

const assetUrl = (path: string) => `${import.meta.env.BASE_URL}${path}`

function ArrowIcon({ reverse = false }: { reverse?: boolean }) {
  return (
    <svg
      viewBox="0 0 32 20"
      aria-hidden="true"
      className={reverse ? 'is-reversed' : ''}
    >
      <path className="arrow-line" d="M4 10h22" />
      <path className="arrow-head" d="M20 4l6 6-6 6" />
    </svg>
  )
}

export function SchoolCarousel({ wide = false }: { wide?: boolean }) {
  const slides = conference.schoolSlides
  const { identity } = conference
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const dragStart = useRef<number | null>(null)
  const dragCurrent = useRef(0)
  const reducedMotion = useReducedMotion()

  const goTo = useCallback(
    (next: number) => {
      setIndex((next + slides.length) % slides.length)
    },
    [slides.length],
  )

  useEffect(() => {
    if (paused || reducedMotion) return
    const timer = window.setInterval(
      () => setIndex((current) => (current + 1) % slides.length),
      2300,
    )
    return () => window.clearInterval(timer)
  }, [paused, reducedMotion, slides.length])

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    dragStart.current = event.clientX
    dragCurrent.current = event.clientX
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (dragStart.current === null) return
    dragCurrent.current = event.clientX
  }

  const handlePointerUp = (event: PointerEvent<HTMLDivElement>) => {
    if (dragStart.current === null) return
    const distance = dragCurrent.current - dragStart.current
    if (Math.abs(distance) > 48) {
      goTo(index + (distance < 0 ? 1 : -1))
    }
    dragStart.current = null
    event.currentTarget.releasePointerCapture(event.pointerId)
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'ArrowRight') {
      event.preventDefault()
      goTo(index + 1)
    }
    if (event.key === 'ArrowLeft') {
      event.preventDefault()
      goTo(index - 1)
    }
  }

  return (
    <section
      className={`school-showcase${wide ? ' school-showcase-home' : ''}`}
      aria-labelledby="school-showcase-title"
      onPointerDownCapture={() => setPaused(false)}
      onFocusCapture={(event) => {
        if (event.target.matches(':focus-visible')) setPaused(true)
      }}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setPaused(false)
      }}
    >
      <div className="carousel-heading carousel-theme-strip page-width">
        <div id="school-showcase-title" className="carousel-theme-copy">
          <p>{identity.theme}</p>
          <span>
            {identity.location}, {identity.dates}
          </span>
        </div>
      </div>

      <BorderGlow
        className="carousel-glow-shell"
        animated
        edgeSensitivity={18}
        glowRadius={28}
        glowIntensity={0.95}
        backgroundColor="rgba(248, 251, 252, 0.9)"
      >
        <div
          className="carousel-viewport"
          role="region"
          aria-roledescription="carousel"
          aria-label="GAIA 2027 image carousel"
          tabIndex={0}
          onKeyDown={handleKeyDown}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={() => {
            dragStart.current = null
          }}
        >
          <div
            className="carousel-track"
            style={{ transform: `translate3d(-${index * 100}%, 0, 0)` }}
          >
            {slides.map((slide, slideIndex) => (
              <article
                className="school-slide"
                key={slide.id}
                aria-hidden={slideIndex !== index}
                aria-label={`${slideIndex + 1} of ${slides.length}: ${slide.alt}`}
              >
                <img
                  className="school-slide-image"
                  src={assetUrl(slide.image)}
                  alt={slide.alt}
                  loading="eager"
                  draggable={false}
                  style={{
                    background: slide.background,
                    objectFit: slide.objectFit ?? 'cover',
                    objectPosition: slide.objectPosition ?? 'center',
                  }}
                />
              </article>
            ))}
          </div>
        </div>
      </BorderGlow>

      <div className="carousel-controls page-width">
        <div className="carousel-progress" aria-hidden="true">
          {slides.map((slide, dotIndex) => (
            <span
              key={slide.id}
              className={dotIndex === index ? 'is-active' : ''}
            />
          ))}
        </div>
        <div className="carousel-buttons">
          <button
            type="button"
            aria-label="Previous slide"
            onClick={() => goTo(index - 1)}
          >
            <ArrowIcon reverse />
          </button>
          <button
            type="button"
            aria-label="Next slide"
            onClick={() => goTo(index + 1)}
          >
            <ArrowIcon />
          </button>
        </div>
      </div>

      <div className="carousel-dot-buttons">
        {slides.map((slide, dotIndex) => (
          <button
            key={slide.id}
            type="button"
            aria-label={`Go to slide ${dotIndex + 1}`}
            aria-current={dotIndex === index ? 'true' : undefined}
            onClick={() => goTo(dotIndex)}
          />
        ))}
      </div>
    </section>
  )
}
