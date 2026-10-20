import { useEffect, useState } from 'react'
import type { Speaker } from '../types/conference'
import { DockSurface } from './DockSurface'
import { SpotlightCard } from './SpotlightCard'

const keynoteNumbers = Array.from({ length: 6 }, (_, index) => index + 1)

export function KeynoteCarousel({ speakers, invited = false }: { speakers: Speaker[]; invited?: boolean }) {
  const [index, setIndex] = useState(0)
  const groupCount = invited ? Math.ceil(speakers.length / 3) : keynoteNumbers.length
  const groupNumbers = invited ? Array.from({ length: groupCount }, (_, index) => index + 1) : keynoteNumbers
  const label = invited ? 'Invited Speakers' : 'Keynote'

  useEffect(() => {
    const timer = window.setInterval(
      () => setIndex((current) => (current + 1) % groupCount),
      2800,
    )
    return () => window.clearInterval(timer)
  }, [groupCount])

  return (
    <div className="keynote-carousel" aria-label={invited ? 'Invited speaker groups' : 'Keynote speaker groups'}>
      <div className="keynote-carousel-viewport">
        <div
          className="keynote-carousel-track"
          style={{ transform: `translate3d(-${index * 100}%, 0, 0)` }}
        >
          {groupNumbers.map((keynoteNumber, groupIndex) => (
            <section
              className="keynote-carousel-slide"
              key={keynoteNumber}
              aria-hidden={groupIndex !== index}
            >
              <h3 className="keynote-carousel-title">{label} {keynoteNumber}</h3>
              <DockSurface className="speaker-grid speaker-grid-six">
                {(invited ? speakers.slice(groupIndex * 3, groupIndex * 3 + 3) : speakers).map((speaker) => (
                  <SpotlightCard key={`${keynoteNumber}-${speaker.name}`} data-dock-item>
                    <div className="speaker-portrait speaker-placeholder" aria-hidden="true" />
                    <p className="card-label">{invited ? 'INVITED / TBA' : 'KEYNOTE / TBA'}</p>
                    <h3>{speaker.name}</h3>
                    <p>{speaker.affiliation}</p>
                    <p className="speaker-topic">{speaker.topic}</p>
                  </SpotlightCard>
                ))}
              </DockSurface>
            </section>
          ))}
        </div>
      </div>

      <div className="keynote-carousel-controls">
        <button type="button" onClick={() => setIndex((current) => Math.max(0, current - 1))} disabled={index === 0} aria-label={invited ? 'Previous invited speakers' : 'Previous keynote'}>
          ←
        </button>
        <div className="keynote-carousel-dots" aria-label={invited ? 'Choose invited speakers' : 'Choose keynote'}>
          {groupNumbers.map((keynoteNumber, dotIndex) => (
            <button
              type="button"
              key={keynoteNumber}
              className={dotIndex === index ? 'is-active' : ''}
              onClick={() => setIndex(dotIndex)}
              aria-label={`Show ${label} ${keynoteNumber}`}
              aria-current={dotIndex === index ? 'true' : undefined}
            />
          ))}
        </div>
        <span>{String(index + 1).padStart(2, '0')} / {String(groupCount).padStart(2, '0')}</span>
        <button type="button" onClick={() => setIndex((current) => Math.min(groupCount - 1, current + 1))} disabled={index === groupCount - 1} aria-label={invited ? 'Next invited speakers' : 'Next keynote'}>
          →
        </button>
      </div>
    </div>
  )
}
