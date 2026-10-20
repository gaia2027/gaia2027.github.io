import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { conference } from '../content/conference'
import { BlurText } from './BlurText'
import { DockSurface } from './DockSurface'
import { Navigation } from './Navigation'
import { SchoolCarousel } from './SchoolCarousel'
import { WeatherBadge } from './WeatherBadge'

type PageFrameProps = {
  pageName: string
  pageStatement: string
  children: ReactNode
  showIntroSections?: boolean
  showSchoolCarousel?: boolean
}

const assetUrl = (path: string) => `${import.meta.env.BASE_URL}${path}`

export function PageFrame({
  children,
  showIntroSections = true,
  showSchoolCarousel = true,
}: PageFrameProps) {
  const { identity } = conference

  return (
    <>
      <Navigation />
      <main id="main-content">
        {showSchoolCarousel ? <SchoolCarousel wide /> : null}

        {showIntroSections ? (
          <section className="conference-identity page-width" data-reveal>
            <div className="identity-meta">
              <WeatherBadge />
            </div>
            <BlurText
              as="h1"
              className="conference-title"
              text={`${identity.shortName} ${identity.year}`}
            />
            <p className="conference-full-name">
              The {identity.edition} Geomechanics Alliance in Asia
            </p>
          </section>
        ) : null}

        {children}
      </main>
      <Footer />
    </>
  )
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="page-width footer-main">
        <div className="footer-left">
          <div className="footer-brand">
            <p className="footer-wordmark">GAIA</p>
            <p className="footer-edition">May / 2027</p>
          </div>

          <div className="footer-contact-card" aria-label="Contact us">
            <p className="section-kicker">CONTACT US</p>
            <a href="mailto:zhirenzhu2@um.cityu.edu.hk" className="footer-contact-line">
              <ContactIcon kind="person" />
              <span>Zhiren Zhu</span>
              <strong>zhirenzhu2@um.cityu.edu.hk</strong>
            </a>
            <div className="footer-contact-line">
              <ContactIcon kind="secretary" />
              <span>Conference Secretary</span>
              <strong>Zhiren Zhu</strong>
            </div>
          </div>
        </div>

        <div className="footer-organizations" aria-label="Sponsored and supported by">
          <div className="footer-logo-group">
            <p className="section-kicker">SPONSORED BY</p>
            <div className="footer-logo-row">
              {conference.financialSponsors.map((item) => (
                <img
                  key={item.name}
                  src={assetUrl(item.logo)}
                  alt={item.name}
                  loading="lazy"
                />
              ))}
            </div>
          </div>
          <div className="footer-logo-group footer-supported-group">
            <p className="section-kicker">SUPPORTED BY</p>
            <div className="footer-logo-row" style={{ gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' }}>
              {[{ name: 'TC103', logo: 'assets/contact/tc103.png' }, { name: 'TC105 Geo-Mechanics from Micro to Macro', logo: 'assets/contact/tc105.png' }, ...conference.financialSponsors].map((item) => (
                <img
                  key={item.name}
                  src={assetUrl(item.logo)}
                  alt={item.name}
                  loading="lazy"
                />
              ))}
            </div>
          </div>
        </div>

        <DockSurface
          as="nav"
          className="footer-links"
          aria-label="Footer navigation"
          distance={155}
          magnification={1.045}
          lift={5}
        >
          {conference.navigation.map((item) => (
            <Link key={item.path} to={item.path} data-dock-item>
              <span>{item.label}</span>
            </Link>
          ))}
        </DockSurface>
      </div>
      <div className="page-width footer-bottom">
        <p>© 2027 GAIA ORGANIZING COMMITTEE</p>
        <p>INFORMATION SUBJECT TO CONFIRMATION</p>
      </div>
    </footer>
  )
}

function ContactIcon({ kind }: { kind: 'person' | 'secretary' }) {
  if (kind === 'secretary') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M8 4h8v3H8zM8 5H5v16h14V5h-3M8 12h8M8 16h6" />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 8v-1.4c0-3.1 3.1-5.6 7-5.6s7 2.5 7 5.6V20" />
    </svg>
  )
}
