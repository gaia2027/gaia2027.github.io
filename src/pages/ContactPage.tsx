import { PageFrame } from '../components/PageFrame'
import { conference } from '../content/conference'

const assetUrl = (path: string) => `${import.meta.env.BASE_URL}${path}`

export function ContactPage() {
  return (
    <PageFrame
      pageName="CONTACT"
      pageStatement="Questions are welcome. Official contacts will appear here."
      showIntroSections={false}
    >
      <section className="contact-us-panel page-width" data-reveal>
        <p className="section-kicker">CONTACT US</p>
        <div className="contact-us-lines">
          <a href="mailto:zhirenzhu2@um.cityu.edu.hk">
            <ContactGlyph kind="person" />
            <span>Zhiren Zhu</span>
            <strong>zhirenzhu2@um.cityu.edu.hk</strong>
          </a>
          <div>
            <ContactGlyph kind="secretary" />
            <span>Conference Secretary</span>
            <strong>Zhiren Zhu</strong>
          </div>
        </div>
      </section>

      <section className="contact-organizations page-width" data-reveal>
        <div className="contact-logo-panel">
          <div className="logo-group logo-group-organized">
            <p className="section-kicker">SPONSORED BY</p>
            {conference.financialSponsors.map((organization) => (
              <div className="contact-logo-frame" key={organization.name}>
                <img
                  src={assetUrl(organization.logo)}
                  alt={organization.name}
                  loading="lazy"
                />
              </div>
            ))}
          </div>

          <div className="logo-group logo-group-supported">
            <p className="section-kicker">SUPPORTED BY</p>
            <div className="supported-logo-row">
              {[{ name: 'TC105 Geo-Mechanics from Micro to Macro', logo: 'assets/contact/tc105.png' }, { name: 'TC103', logo: 'assets/contact/tc103-logo.png' }, ...conference.financialSponsors].map((organization) => (
                <div className="contact-logo-frame" key={organization.name}>
                  <img
                    src={assetUrl(organization.logo)}
                    alt={organization.name}
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </PageFrame>
  )
}

function ContactGlyph({ kind }: { kind: 'person' | 'secretary' }) {
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
