export type NavItem = {
  label: string
  path: string
}

export type SchoolSlide = {
  id: string
  image: string
  alt: string
  objectPosition?: string
  objectFit?: 'cover' | 'contain'
  background?: string
}

export type Highlight = {
  label: string
  value: string
  detail: string
}

export type TimelineItem = {
  date: string
  title: string
  description: string
  status: 'confirmed' | 'pending' | 'closed'
}

export type Speaker = {
  name: string
  affiliation: string
  topic: string
}

export type ProgramDay = {
  date: string
  label: string
  items?: Array<{
    time: string
    title: string
    detail: string
  }>
}

export type PreviousEvent = {
  year: string
  edition: string
  location: string
  dates: string
  theme: string
  href: string
  title?: string
  images?: Array<{
    src: string
    alt: string
    variant?: 'wide' | 'small'
  }>
}

export type InfoBlock = {
  kicker?: string
  title: string
  body: string | string[]
  linkLabel?: string
  linkTo?: string
}

export type WorkshopDate = {
  date: string
  title: string
  detail?: string
}

export type ContactItem = {
  role: string
  name: string
  email: string
}

export type CommitteeMember = {
  role: string
  name: string
  profileUrl: string
  photo: string
  biography?: string
}

export type ContactChannel = {
  label: string
  email: string
  kind: 'person' | 'committee'
}

export type OrganizationLogo = {
  label: string
  name: string
  logo: string
}

export type ConferenceContent = {
  identity: {
    shortName: string
    year: string
    edition: string
    fullName: string
    theme: string
    location: string
    dates: string
  }
  navigation: NavItem[]
  schoolSlides: SchoolSlide[]
  highlights: Highlight[]
  timeline: TimelineItem[]
  homeFeatures: InfoBlock[]
  homeOrganizingCommittee: string[]
  homeInternationalScientificCommittee: string[]
  financialSponsors: OrganizationLogo[]
  submissionTopics: string[]
  about: {
    whatIsGaia: string[]
    scientificHighlights: Array<{
      title: string
      text: string
    }>
  }
  workshop: {
    overview: string[]
    topics: string[]
    speakers: Speaker[]
    invitedSpeakers: Speaker[]
    venue: Highlight[]
    dates: WorkshopDate[]
    framework: Highlight[]
    posterSessions: string[]
    registrationCta: InfoBlock
    timetableNote: string
  }
  registration: {
    status: string
    message: string
    steps: string[]
    note: string
    actions: Array<{
      label: string
      href: string
    }>
    fees: Array<{ category: string; early: string; regular: string }>
    policies: string[]
    timeline: TimelineItem[]
    feeNote: string
  }
  program: ProgramDay[]
  previousEvents: PreviousEvent[]
  contacts: ContactItem[]
  committee: CommitteeMember[]
  contactChannels: ContactChannel[]
  organizedBy: OrganizationLogo[]
  supportedBy: OrganizationLogo[]
  organizations: Array<{ role: string; name: string }>
}
