import { Link } from 'react-router-dom'
import { KeynoteCarousel } from '../components/KeynoteCarousel'
import { PageFrame } from '../components/PageFrame'
import { TimelinePanel } from '../components/TimelinePanel'
import { conference } from '../content/conference'

export function WorkshopPage() {
  return (
    <PageFrame
      pageName="WORKSHOP"
      pageStatement="Focused talks, serious questions and time to think together."
    >
      <section className="workshop-overview page-width" data-reveal>
        <h2>The 3rd GAIA Workshop (GAIA 2027)</h2>
        <div className="workshop-overview-copy">
          {conference.workshop.overview.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </section>

      <section className="speakers-section page-width">
        <div className="section-heading-row">
          <div>
            <h2>Invited Speakers</h2>
          </div>
        </div>
        <KeynoteCarousel speakers={conference.workshop.invitedSpeakers} invited />
      </section>

      <section className="speakers-section page-width">
        <div className="section-heading-row">
          <div>
            <h2>Keynote Speakers</h2>
          </div>
        </div>
        <KeynoteCarousel speakers={conference.workshop.speakers} />
      </section>

      <TimelinePanel
        title="Update Timeline"
        items={conference.timeline}
        className="workshop-dates"
      />

      <section className="venue-section page-width">
        <div className="section-heading-row">
          <div>
            <h2>Workshop Framework</h2>
          </div>
        </div>
        <ul className="framework-list">
          {conference.workshop.framework.map((item) => (
            <li key={item.label}>
              <p>
                <strong>{item.label}:</strong> {item.value}
                {item.detail ? (
                  <span className="framework-detail"> ({item.detail})</span>
                ) : null}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section className="poster-section page-width" data-reveal>
        <div className="poster-copy">
          <h2>Poster Sessions</h2>
          <div>
            {conference.workshop.posterSessions.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
      </section>

      <section className="workshop-registration-cta page-width" data-reveal>
        <h2>{conference.workshop.registrationCta.title}</h2>
        <Link
          className="pill-action-link workshop-registration-link"
          to={conference.workshop.registrationCta.linkTo ?? '/registration'}
        >
          <span className="pill-link-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24">
              <path d="M7 17 17 7M9 7h8v8" />
            </svg>
          </span>
          <strong>{conference.workshop.registrationCta.linkLabel}</strong>
        </Link>
      </section>

    </PageFrame>
  )
}
