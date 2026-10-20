import type { ConferenceContent } from '../types/conference'

export const conference: ConferenceContent = {
  identity: {
    shortName: 'GAIA',
    year: '2027',
    edition: '3rd',
    fullName: 'International Workshop of Geomechanics Alliance In Asia',
    theme: 'Advances in Micro–Macro Geomechanics',
    location: 'Hong Kong, China',
    dates: 'May 2027',
  },
  navigation: [
    { label: 'HOME', path: '/' },
    { label: 'ABOUT', path: '/about' },
    { label: 'WORKSHOP', path: '/workshop' },
    { label: 'SUBMISSION', path: '/submission' },
    { label: 'REGISTRATION', path: '/registration' },
    { label: 'PROGRAM', path: '/program' },
    { label: 'CONTACT', path: '/contact' },
    { label: 'ACCOUNT', path: '/account' },
  ],
  schoolSlides: [
    {
      id: 'hong-kong-harbour',
      image: 'assets/carousel/hong-kong-harbour.webp',
      alt: 'Hong Kong harbour skyline',
      objectPosition: 'center center',
    },
    {
      id: 'cityu-campus',
      image: 'assets/carousel/cityu-campus-main.webp',
      alt: 'City University of Hong Kong campus view',
      objectPosition: 'center center',
      objectFit: 'contain',
      background: '#f8fbff',
    },
    {
      id: 'geomechanics-structure',
      image: 'assets/carousel/geomechanics-structure-3.webp',
      alt: 'Geomechanics research visualization',
      objectPosition: 'center center',
      objectFit: 'contain',
      background: '#f7fbff',
    },
    {
      id: 'numerical-simulation',
      image: 'assets/carousel/numerical-simulation-geotechnics-2.webp',
      alt: 'Numerical simulation in geotechnics',
      objectPosition: 'center center',
      objectFit: 'contain',
      background: '#f8fbff',
    },
    {
      id: 'ace-department',
      image: 'assets/carousel/ace-department-full.webp',
      alt: 'Department of Architecture and Civil Engineering at CityUHK',
      objectPosition: 'center center',
      objectFit: 'contain',
      background: '#f8fbff',
    },
  ],
  highlights: [
    {
      label: 'Edition',
      value: '03',
      detail: 'The third annual GAIA workshop',
    },
    {
      label: 'Format',
      value: 'In person',
      detail: 'Lectures, discussion and poster exchange',
    },
    {
      label: 'Working language',
      value: 'English',
      detail: 'An international academic programme',
    },
    {
      label: 'Capacity',
      value: '150',
      detail: 'Registration is limited to approximately 150 participants',
    },
  ],
  timeline: [
    {
      date: '01/12/2026',
      title: 'Online registration opens.',
      description: 'GAIA 2027 online registration is planned to open.',
      status: 'pending',
    },
    {
      date: '28/02/2027',
      title: 'Early-bird registration closes.',
      description: 'Early-bird registration is planned to close.',
      status: 'pending',
    },
    {
      date: '30/04/2027',
      title: 'Final registration closes.',
      description: 'Final online registration will close before workshop preparation.',
      status: 'pending',
    },
    {
      date: '14/05/2027',
      title: 'Workshop on-site registration starts',
      description: 'Participants arrive in Hong Kong and collect materials.',
      status: 'pending',
    },
    {
      date: '15/05/2027',
      title: 'GAIA 2027 officially starts',
      description: 'The third GAIA workshop begins at City University of Hong Kong.',
      status: 'pending',
    },
  ],
  homeFeatures: [
    {
      kicker: 'ABOUT THE ALLIANCE',
      title: 'GAIA: Geomechanics Alliance In Asia',
      body: 'GAIA, the Geomechanics Alliance in Asia, is proposed as a platform for Asian students and young researchers in geomechanics to exchange knowledge and ideas, fostering the development of a lasting research network.',
      linkLabel: 'More about GAIA',
      linkTo: '/about',
    },
    {
      kicker: 'PREVIOUS WORKSHOP',
      title: 'GAIA 2027',
      body: 'The 3rd GAIA Workshop is scheduled from 14 to 16 May 2027 in Hong Kong, China.',
      linkLabel: 'More about the workshop',
      linkTo: '/workshop',
    },
  ],
  homeOrganizingCommittee: [
    'Chairman: Prof. Jeff Wang (ACE, City University of Hong Kong)',
    'Vice-Chairman: Dr. Fiona Kwok (ACE, City University of Hong Kong)',
    'Secretary: Dr. Zhiren Zhu (ACE, City University of Hong Kong)',
  ],
    homeInternationalScientificCommittee: [
    'Cino Viggiani (Université Grenoble Alpes & Shandong University, FRANCE)',
    'Jidong Zhao (HKUST, Hong Kong, CHINA)',
    'Takashi Matsushima (University of Tsukuba, JAPAN)',
    'Jipeng Wang (Shandong University, CHINA)',
  ],
  financialSponsors: [
    {
      label: 'Financial Sponsored',
      name: 'The Hong Kong Institution of Engineers',
      logo: 'assets/contact/hkie.jpg',
    },
    {
      label: 'Financial Sponsored',
      name: 'Department of Architecture and Civil Engineering in City University of Hong Kong (ACE, CityU HK)',
      logo: 'assets/contact/ace-logo.png',
    },
  ],
  submissionTopics: [
    'Advanced characterization of geomaterials using X-ray microtomography (CT), X-ray diffraction (XRD), 3D laser scanning, particle image velocimetry (PIV) and other non-destructive optical and imaging techniques',
    'Latest development of numerical modelling methods (e.g., DEM, FEM, FDM, MPM, CFD, LBM, SPH) for multiphase geomaterials, granular instability and granular flow problems',
    'New development and application of machine learning and deep learning methods in geotechnical engineering',
    'Physics-informed, data-driven constitutive modelling of geomaterials',
    'Intelligent characterization, modelling and simulation in geotechnical engineering using data-driven approaches',
    'Geotechnical infrastructure monitoring using novel remoting sensing techniques',
  ],
  about: {
    whatIsGaia: [
      'GAIA (Geomechanics Alliance in Asia) is a proposed pan-Asian initiative that aims to build a vibrant, interconnected platform for students, young researchers, and professionals in geomechanics, geotechnical engineering, and related earth-science disciplines. By promoting regular knowledge exchange, collaborative research, and professional networking, GAIA seeks to establish a durable research community that tackles both regional and global challenges in geomechanics and related fields.',
      "Similar initiatives exist elsewhere — for example, ALERT Geomaterials, founded in 1989, has sustained a close European network in research on geomaterials for decades. ALERT leverages Europe's compact geography to run annual thematic sessions and doctoral schools (frequently in France), which have been instrumental in fostering strong scientific ties and training successive generations of researchers.",
      "Recognizing Asia's much larger geographic scale and greater cultural and institutional diversity, GAIA will adopt a rotating host-country model to maximize accessibility and ensure broad regional representation. By connecting talent, facilities, and industry needs, GAIA will help form resilient, cross-border networks that accelerate innovation, strengthen capacity, and contribute to the sustainable development and safety of infrastructure throughout the region.",
    ],
    scientificHighlights: [
      {
        title: 'Experimental investigations',
        text: 'Experimental investigations on soils and granular materials, addressing key aspects such as particle-scale effects, partial saturation, time-dependent behaviour, and coupled physical processes.',
      },
      {
        title: 'Modeling approaches',
        text: 'Modeling approaches spanning both discrete and continuum perspectives, aiming to better capture material behaviour across multiple scales and under complex conditions.',
      },
      {
        title: 'Academic exchange',
        text: 'This event will bring together professors, experts, and students, offering a unique platform for in-depth discussions and knowledge exchange in this rapidly evolving field.',
      },
    ],
  },
  workshop: {
    overview: [
      'Geomechanics Alliance in Asia (GAIA) aims to provide a platform for young researchers and graduate students in geomechanics and geotechnical engineering across Asia to exchange ideas and foster collaboration. The annual GAIA Workshop serves as the main channel for communication and interaction.',
      'The 3rd GAIA Workshop, GAIA 2027, will be hosted by City University of Hong Kong and is scheduled to take place from 14 to 16 May 2027 in Hong Kong, China. The main theme is Advances in Micro–Macro Geomechanics, covering key topics in geotechnical engineering such as particle-scale behavior and mechanisms, micro–macro constitutive relationships, multi-scale, multi-phase and multi-physics coupling and numerical modelling methods, and experimental and monitoring techniques.',
      'To ensure high-quality discussions and interactions, the workshop will be limited to approximately 150 participants.',
    ],
    topics: [
      'Advanced characterization of geomaterials using X-ray microtomography (CT), X-ray diffraction (XRD), 3D laser scanning, particle image velocimetry (PIV), and other non-destructive optical and imaging techniques',
      'Latest development of numerical modelling methods including DEM, FEM, FDM, MPM, CFD, LBM, and SPH for multiphase geomaterials, granular instability, and granular flow problems',
      'New development and application of machine learning and deep learning methods in geotechnical engineering',
      'Physics-informed, data-driven constitutive modelling of geomaterials',
      'Intelligent characterization, modelling, and simulation in geotechnical engineering using data-driven approaches',
      'Geotechnical infrastructure monitoring using novel remote sensing techniques',
    ],
    speakers: Array.from({ length: 6 }, (_, index) => ({
      name: `Keynote speaker ${String(index + 1).padStart(2, '0')}`,
      affiliation: 'To be announced',
      topic: 'Profile, portrait and lecture title will be added after confirmation.',
    })),
    invitedSpeakers: Array.from({ length: 6 }, (_, index) => ({
      name: `Invited speaker ${String(index + 1).padStart(2, '0')}`,
      affiliation: 'To be announced',
      topic: 'Profile, portrait and lecture title will be added after confirmation.',
    })),
    venue: [
      {
        label: 'Host',
        value: 'CityUHK',
        detail: 'City University of Hong Kong will host GAIA 2027.',
      },
      {
        label: 'City',
        value: 'Hong Kong',
        detail: 'Travel and local access guidance will be updated later.',
      },
      {
        label: 'Capacity',
        value: '150',
        detail: 'Registration is limited to approximately 150 participants.',
      },
    ],
    dates: [
      {
        date: 'May 20, 2027',
        title: 'Workshop on-site registration starts',
      },
      {
        date: 'May 21, 2027',
        title: 'First official workshop day',
        detail: 'Gala dinner and poster session are planned.',
      },
      {
        date: 'May 22, 2027',
        title: 'Second official workshop day',
        detail: 'Award ceremony and academic sessions are planned.',
      },
      {
        date: 'May 25, 2027',
        title: 'Construction site visit',
        detail: 'Optional activity, subject to final arrangements.',
      },
    ],
    framework: [
      {
        label: 'Maximum participants',
        value: '150',
        detail:
          'registration is limited to 150 participants. Once this number is reached, registration will be closed',
      },
      {
        label: 'Language',
        value: 'English',
        detail: '',
      },
      {
        label: 'Presentation',
        value: 'Including keynote and invited talks from distinguished senior, mid-career and early-career professors, researchers and students',
        detail: '',
      },
      {
        label: 'Presentation Time',
        value: '30 min (including Q&A) for each keynote speaker; 20 min (including Q&A) for each invited speaker.',
        detail: '',
      },
    ],
    posterSessions: [
      'Please refer to the workshop schedule for the detailed conference timetable. Participants are required to prepare an electronic file of their academic poster in a 1:2 aspect ratio, clearly presenting the research topic, main content, and key findings.',
      "The presenters need to print their posters by themselves according to the 'Poster Instructions'. The electronic poster file should be sent to the conference email address by 15 April 2027. Before the poster session begins, on-site staff will contact participants and guide them to the designated location.",
      "If poster submissions exceed the venue's capacity, the organizing committee may screen submitted materials based on academic innovation and thematic relevance. Participants affected by this process will be informed by email.",
      'We look forward to your wonderful presentations.',
    ],
    registrationCta: {
      kicker: 'REGISTRATION',
      title: 'Online registration will officially start on 1 December 2026',
      body: 'Registration details, participation guidance, and modification instructions will be updated on the Registration page.',
      linkLabel: 'Go to Registration',
      linkTo: '/registration',
    },
    timetableNote:
      'This tentative timetable may change depending on follow-up arrangements for the workshop. A detailed programme table will be added later.',
  },
  registration: {
    status: 'REGISTRATION IS OPEN NOW',
    message:
      'The items you need to input for the registration are listed as follows:',
    steps: [
      'Personal information (Your name, email and living address, phone number, your status and affiliation).',
      'Accommodation request (from which to which date you will stay, room type, roommate names, dietary restriction).',
      'Oral/poster presentation request (you are required to provide relevant research information).',
      'Some questionnaires on GAIA.',
    ],
    note:
      'Note: After signing in, participants can update their personal information and submission from the Account page.',
    actions: [
      {
        label: 'Online Registration',
        href: '/login?mode=register',
      },
    ],
    fees: [
      {
        category: 'Regular Participants',
        early: 'HKD 4,000 per person',
        regular: 'HKD 5,000 per person',
      },
      {
        category: 'Student Participants',
        early: 'HKD 3,000 per person',
        regular: 'HKD 4,000 per person',
      },
    ],
    policies: [
      'If you need to modify submitted registration details, use the View/Edit/Cancel function after entering your personal registration ID.',
      'The personal registration ID is generated after successful initial registration and should be saved locally by each participant.',
      'Registration capacity is limited to approximately 150 participants.',
      'Final payment and cancellation policies will be confirmed by the organizing committee.',
    ],
    timeline: [
      {
        date: '01/12/2026',
        title: 'Online registration opens.',
        description: 'Online registration is planned to open.',
        status: 'pending',
      },
      {
        date: '28/02/2027',
        title: 'Early-bird registration closes.',
        description: 'Early-bird registration is planned to close.',
        status: 'pending',
      },
      {
        date: '30/04/2027',
        title: 'Final registration closes.',
        description: 'The closing date remains subject to official confirmation.',
        status: 'pending',
      },
      {
        date: '14/05/2027',
        title: 'Workshop on-site registration starts',
        description: 'Participants arrive and collect workshop materials.',
        status: 'pending',
      },
      {
        date: '15/05/2027',
        title: 'GAIA 2027 officially starts',
        description: 'The first official workshop day begins.',
        status: 'pending',
      },
    ],
    feeNote:
      'The registration fee covers the following items: Conference manual and programme; lunches, dinners, and coffee-break snacks and drinks during the conference dates; participation certificates and award certificates; conference accessories; and relevant facilities and materials for oral presentations and poster sessions.',
  },
  program: [
    {
      date: '01/12/2026',
      label: 'Online registration opens',
    },
    {
      date: '28/02/2027',
      label: 'Early-bird registration closes',
    },
    {
      date: '14/05/2027',
      label: 'Final registration closes',
    },
    {
      date: '14/05/2027',
      label: 'Workshop on-site registration starts',
    },
    {
      date: '15/05/2027',
      label: 'GAIA 2027 officially starts',
    },
  ],
  previousEvents: [
    {
      year: '2026',
      edition: 'Second Workshop',
      title: 'GAIA 2026 Jinan, Shandong, China | Mar. 27-30, 2026',
      location: 'Jinan, Shandong, China',
      dates: '27-30 March 2026',
      theme: 'Advances in Micro–Macro Geomechanics',
      href: 'https://gaia2026.hi97.cn/',
      images: [
        {
          src: 'assets/previous/gaia-2026-group.webp',
          alt: 'GAIA 2026 workshop participants',
          variant: 'wide',
        },
        {
          src: 'assets/previous/gaia-2026-shandong.webp',
          alt: 'Shandong venue and city view for GAIA 2026',
          variant: 'wide',
        },
        {
          src: 'assets/previous/gaia-2026-shandong-extra.webp',
          alt: 'GAIA 2026 workshop scene in Shandong',
          variant: 'wide',
        },
      ],
    },
    {
      year: '2025',
      edition: 'First Workshop',
      title: 'GAIA 2025 Atami, Shizuoka, Japan | Feb. 22-24, 2025',
      location: 'Atami, Shizuoka, Japan',
      dates: '22-24 February 2025',
      theme: 'The beginning of the GAIA research network',
      href: 'https://www.kz.tsukuba.ac.jp/~tmatsu/GAIA_homepage/',
      images: [
        {
          src: 'assets/previous/gaia-2025-main.webp',
          alt: 'GAIA 2025 workshop group photo',
          variant: 'wide',
        },
        {
          src: 'assets/previous/gaia-2025-1-3.webp',
          alt: 'GAIA 2025 workshop moment',
          variant: 'small',
        },
        {
          src: 'assets/previous/gaia-2025-1-4.webp',
          alt: 'GAIA 2025 academic exchange',
          variant: 'small',
        },
        {
          src: 'assets/previous/gaia-2025-1-1.webp',
          alt: 'GAIA 2025 participants',
          variant: 'small',
        },
        {
          src: 'assets/previous/gaia-2025-1-2.webp',
          alt: 'GAIA 2025 venue scene',
          variant: 'small',
        },
      ],
    },
  ],
  contacts: [
    {
      role: 'Chairman',
      name: 'Jianfeng Wang',
      email: 'jefwang@cityu.edu.hk',
    },
    {
      role: 'Organizing committee',
      name: 'GAIA 2027',
      email: 'gaia_2027@outlook.com',
    },
  ],
  committee: [
    {
      role: 'Chairman',
      name: 'Prof. Jeff Wang',
      profileUrl: 'https://scholars.cityu.edu.hk/en/persons/jefwang/',
      photo: 'assets/contact/wang-jianfeng.webp',
      biography:
        'An internationally recognized scholar in micro-macro mechanics of granular materials, X-ray CT characterization, DEM simulation and data-driven analysis of geomaterials.',
    },
    {
      role: 'Vice-chairman',
      name: 'Dr. Fiona Kwok',
      profileUrl: 'https://scholars.cityu.edu.hk/en/persons/fionkwok/',
      photo: 'assets/contact/kwok-fiona.webp',
    },
    {
      role: 'Secretary',
      name: 'Dr. Zhiren Zhu',
      profileUrl: 'https://scholars.cityu.edu.hk/en/persons/zhirenzhu2/',
      photo: 'assets/contact/zhu-zhiren.png',
    },
  ],
  contactChannels: [
    {
      kind: 'person',
      label: 'Jianfeng Wang',
      email: 'jefwang@cityu.edu.hk',
    },
    {
      kind: 'committee',
      label: 'Organizing Committee',
      email: 'gaia_2027@outlook.com',
    },
  ],
  organizedBy: [
    {
      label: 'Organized by',
      name: 'City University of Hong Kong',
      logo: 'assets/contact/cityu-logo.webp',
    },
  ],
  supportedBy: [
    {
      label: 'Supported by',
      name: 'SIMSG',
      logo: 'assets/contact/simsg.png',
    },
    {
      label: 'Supported by',
      name: 'TC105 Geo-Mechanics from Micro to Macro',
      logo: 'assets/contact/tc105.png',
    },
    {
      label: 'Supported by',
      name: 'CISMGE-CCES',
      logo: 'assets/contact/cismge.png',
    },
  ],
  organizations: [
    { role: 'Organized by', name: 'City University of Hong Kong' },
    { role: 'Supported by', name: 'SIMSG' },
    { role: 'Supported by', name: 'CISMGE-CCES' },
  ],
}
