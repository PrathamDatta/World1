// All factual content is taken from https://caliberassurance.com (crawled 2026-10-23).
// `src` keys reference the original page for later verification.

export const SITE = {
  name: 'Caliber Assurance Services',
  short: 'Caliber',
  origin: 'https://caliberassurance.com',
  tagline: 'Globally compliant engineering and quality solutions',
  address: ['# 3499, 14th Main Road', 'HAL II Stage, Indiranagar', 'Bangalore', 'India – 560 008'],
  emails: ['operations@caliberassurance.com', 'namitha.c@caliberassurance.com', 'anu.h@caliberassurance.com'],
  phones: [
    { label: '080 25283196', href: 'tel:+918025283196' },
    { label: '+91 9845715040', href: 'tel:+919845715040' },
    { label: '+91 8494945509', href: 'tel:+918494945509' },
  ],
  hours: [
    ['Monday – Saturday', '08:00 – 20:00'],
    ['Sunday and holidays', 'Closed'],
  ],
  mapUrl: 'https://www.google.com/maps/search/?api=1&query=3499+14th+Main+Road+HAL+II+Stage+Indiranagar+Bangalore+560008',
}

// src: /index.html, /overview.html
export const CERT = 'ISO 13485 / ISO 9001 Certified Design Consulting Firm'

// src: /services.html — verbatim service table
export const PILLARS = [
  {
    id: 'design',
    title: 'Design & Engineering',
    code: 'D',
    services: [
      { id: 'system-design', name: 'System Design' },
      { id: 'embedded', name: 'Embedded Programming' },
      { id: 'hw-mech', name: 'Electronic Hardware / Mechanical Design' },
      { id: 'jigs', name: 'Test Jigs and Fixtures Development' },
      { id: 'vave', name: 'Value Analysis and Value Engineering' },
    ],
  },
  {
    id: 'assurance',
    title: 'Verification & Validation / Assurance',
    code: 'A',
    services: [
      { id: 'rct', name: 'Regulatory Compliance Testing' },
      { id: 'sw-val', name: 'Software Validation' },
      { id: 'risk', name: 'Risk Management and Hazard Analysis' },
      { id: 'reliability', name: 'Reliability Assurance' },
      { id: 'rca', name: 'RCA / CAPA' },
    ],
  },
  {
    id: 'consulting',
    title: 'Consulting',
    code: 'C',
    services: [
      { id: 'mii', name: 'Make In India' },
      { id: 'homolog', name: 'Product Homologation' },
      { id: 'onsite', name: 'On-site representation' },
      { id: 'assured', name: 'Assured Design' },
      { id: 'training', name: 'Training' },
      { id: 'qsr', name: 'Quality Systems Remediation' },
    ],
  },
]

export const INDUSTRIES = [
  {
    id: 'medical',
    slug: 'medical-devices',
    seoTitle: 'Medical Device Engineering & Regulatory Services',
    name: 'Medical Devices',
    short: 'Medical',
    lede: 'Medical device R&D outsourcing is increasing — and the design must be regulation-ready from the start.',
    intro:
      'Medical Device R&D outsourcing is increasing owing to a handful of factors. A further point is designing products around specific customer requirements — to solve an existing problem, or to serve a niche segment — with new designs emerging quickly from customer feedback and reviews. Caliber believes it has a role to play in this complex world of R&D services.',
    drivers: ['Globalisation', 'Increasing speed to market', 'Developing products for emerging economy', 'Cost', 'Adaptation of technology'],
    segments: ['Vital Monitoring', 'Medical Imaging', 'Surgical Technologies'],
    servicesTitle: 'Services for Medical Device OEMs',
    services: [
      'Hardware and Embedded Design',
      'Renesas, PIC, Freescale ARM-based controller design',
      'Embedded C, C++',
      'Graphical LCD interface design',
      'I2C, SPI, RS232, RS485, CAN interfaces',
      'Mechanical Engineering Services',
      'System Integration',
      'Design Qualification and Verification Services',
      'QMS Consulting per 21 CFR Part 820, ISO 13485, IEC 62304, ISO 14971, IEC 62366',
      'Product Compliance testing per IEC 60601-1',
      'Design Change and concurrent Engineering',
      'Post Marketing Surveillance',
      'RCA / CAPA',
    ],
    standards: ['21 CFR Part 820', 'ISO 13485', 'IEC 62304', 'ISO 14971', 'IEC 62366', 'IEC 60601-1'],
    src: '/medicals.html',
  },
  {
    id: 'life',
    slug: 'life-sciences',
    seoTitle: 'Life Sciences GxP, Qualification & Validation',
    name: 'Life Sciences',
    short: 'Life Sciences',
    lede: 'Qualification, validation and remediation services for the pharma industry.',
    intro: 'Caliber provides the following services to the Pharma industry.',
    servicesTitle: 'Services to the Pharma Industry',
    services: ['GxP Compliance Services', 'Qualification and Validation Services', 'Remediation Services'],
    standards: ['GxP'],
    src: '/life.html',
  },
  {
    id: 'aero',
    slug: 'aerospace-defence',
    seoTitle: 'Aerospace & Defence Engineering, System Safety',
    name: 'Aerospace & Defence Engineering',
    short: 'Aerospace & Defence',
    lede: 'R&D, regulatory compliance and system safety for avionics, defence and automotive systems.',
    intro: 'Caliber provides the following services to the Avionics, Defence and Automotive industries.',
    servicesTitle: 'Services to Avionics, Defence and Automotive',
    services: ['R&D Services', 'Regulatory Compliance Services', 'System Safety Solutions', 'Qualification and Validation Services'],
    standards: ['FAA', 'ISO', 'IEC'],
    src: '/hitech.html',
  },
]

// Edges service -> industry. `why` quotes/paraphrases the industry page that lists it.
// Interpretation note: the services table and the industry pages use different wording, so
// each link below is the closest documented match and carries the page that supports it.
export const LINKS = [
  { s: 'system-design', i: 'medical', why: 'Medical Devices page lists System Integration and Design Qualification and Verification.' },
  { s: 'embedded', i: 'medical', why: 'Medical Devices page lists Hardware and Embedded Design, Embedded C/C++ and controller design.' },
  { s: 'hw-mech', i: 'medical', why: 'Medical Devices page lists Hardware and Embedded Design and Mechanical Engineering Services.' },
  { s: 'rct', i: 'medical', why: 'Medical Devices page lists product compliance testing per IEC 60601-1.' },
  { s: 'rct', i: 'aero', why: 'Aerospace & Defence page lists Regulatory Compliance Services.' },
  { s: 'sw-val', i: 'life', why: 'Life Sciences page lists Qualification and Validation Services.' },
  { s: 'sw-val', i: 'aero', why: 'Aerospace & Defence page lists Qualification and Validation Services.' },
  { s: 'risk', i: 'medical', why: 'Medical Devices page cites ISO 14971 (risk management).' },
  { s: 'risk', i: 'aero', why: 'Aerospace & Defence page lists System Safety Solutions.' },
  { s: 'rca', i: 'medical', why: 'Medical Devices page lists RCA / CAPA.' },
  { s: 'qsr', i: 'life', why: 'Life Sciences page lists Remediation Services.' },
  { s: 'qsr', i: 'medical', why: 'Medical Devices page lists QMS Consulting.' },
  { s: 'homolog', i: 'medical', why: 'Home page: “product homologation services” for medical devices.' },
]

// Lifecycle stages — each tied to services/phrases documented on /overview.html, /services.html,
// /medicals.html and the Case Study 1 diagram.
export const STAGES = [
  {
    id: 'concept',
    n: '01',
    name: 'Concept & architecture',
    line: 'Regulation shapes the design from the first decision.',
    body: 'Caliber is involved in every phase of the product development lifecycle — from conceptualisation and architecting. Requirements are engineered with regulatory needs treated as critical to quality.',
    services: ['System Design', 'Assured Design'],
  },
  {
    id: 'design',
    n: '02',
    name: 'Design & prototyping',
    line: 'Hardware, firmware, mechanical and system — developed concurrently.',
    body: 'Design implementation, prototyping and integration across electronics, embedded software and mechanical engineering, worked in tandem with the customer’s own team.',
    services: ['Embedded Programming', 'Electronic Hardware / Mechanical Design', 'Value Analysis and Value Engineering'],
  },
  {
    id: 'verify',
    n: '03',
    name: 'Verification',
    line: 'Independent verification testing against the requirements.',
    body: 'Design qualification and verification services, with test jigs and fixtures built to support repeatable testing.',
    services: ['Test Jigs and Fixtures Development', 'Software Validation', 'Reliability Assurance'],
  },
  {
    id: 'validate',
    n: '04',
    name: 'Validation & usability',
    line: 'Design validation and usability engineering.',
    body: 'Design validation and usability engineering confirm the device works for the people and conditions it is built for, with hazards analysed throughout.',
    services: ['Risk Management and Hazard Analysis', 'Software Validation'],
  },
  {
    id: 'comply',
    n: '05',
    name: 'Compliance & certification',
    line: 'Regulatory compliance testing and product homologation.',
    body: 'Compliance testing and certification across the global regulatory landscape for medical devices, avionics and defence — so one design can reach several markets together.',
    services: ['Regulatory Compliance Testing', 'Product Homologation', 'Make In India'],
  },
  {
    id: 'life',
    n: '06',
    name: 'Lifecycle support',
    line: 'Maintenance and post-market surveillance feed back into design.',
    body: 'Maintenance, value engineering and post-market surveillance, with root cause analysis and corrective action — closing the loop back to design.',
    services: ['RCA / CAPA', 'Quality Systems Remediation', 'On-site representation'],
  },
]

// src: /casestudy1.html (image NCS1.png), /casestudy2.html, /casestudy3.html
export const CASES = [
  {
    slug: 'end-to-end-product-consultancy',
    n: '01',
    seoTitle: 'Case study: end-to-end product consultancy',
    title: 'End-to-end product consultancy for a medical devices start-up',
    kicker: 'Medical devices · Start-up',
    kind: 'loop',
    summary: 'Caliber’s full product loop, from design services through regulatory assurance.',
    loop: [
      { t: 'Design Services', s: 'Hardware, firmware, mechanical, system' },
      { t: 'Independent Verification Testing' },
      { t: 'Design Validation / Usability Engineering' },
      { t: 'Market Research' },
      { t: 'Marketing, Sales' },
      { t: 'Regulatory Assurance' },
    ],
    note: 'The published case study presents this engagement as a single diagram; no further challenge or outcome text is given on the original site.',
  },
  {
    slug: 'vital-monitoring-hardware-design',
    n: '02',
    seoTitle: 'Case study: wireless vital monitoring device',
    title: 'Hardware design of a vital monitoring device',
    kicker: 'Medical devices · Vital monitoring',
    kind: 'ecg',
    summary: 'A tiny wireless device replacing a bulky ECG monitor.',
    challenges: ['Cumbersome Holter monitoring process', 'Time-consuming vital monitoring operation', 'Patient uneasiness'],
    solutions: ['Stratify user requirements', 'System design', 'Hardware design based on ADAS1000-4 analog front end', 'BT connectivity'],
    benefits: ['Increase in patient throughput', 'Bulky ECG monitor replaced by a tiny, wireless device', 'Remote patient care'],
  },
  {
    slug: 'pft-device-design-engineering',
    n: '03',
    seoTitle: 'Case study: forced-oscillation PFT device',
    title: 'Design and engineering activities for a PFT device',
    kicker: 'Medical devices · Pulmonary function',
    kind: 'fot',
    summary: 'Forced Oscillation Technique for a patient-friendly lung function test.',
    challenges: ['The current method of PFT requires hard respiratory breathing', 'Patient uneasiness', 'Paediatric cases not covered'],
    solutions: ['Use Forced Oscillation Technique (FOT) for accurate measurement of lung function test', 'Smaller footprint design'],
    benefits: ['Accurate measurement', 'Patient-friendly breathing technique', 'Paediatric configurable design'],
  },
]

export const WHY = [
  {
    t: 'Design for Global Regulatory Compliance',
    d: 'Solutions that help customers launch their products for the global market simultaneously. Caliber engages your technical team to design and develop products with regulatory requirements as critical to quality.',
  },
  {
    t: 'Leverage Knowledge Base',
    d: 'With 100+ years of expertise in healthcare and the life science market, Caliber shares a global mindset with its customers. Its consultants have worked for decades in top manufacturing and consulting firms across design, engineering and assurance functions.',
  },
  {
    t: 'Concurrent Development',
    d: 'Caliber works in tandem with customers, ensuring continuous, ongoing and quick turn-around of the solutions.',
  },
]

export const EDGE = [
  {
    t: 'A wealth of experience',
    d: 'Consultants with global experience in product design and engineering, combined with deep domain knowledge — developing products and solutions for the global market.',
  },
  {
    t: 'Total ownership',
    d: 'Turnkey solutions covering product concept, design, engineering, prototyping, validation, compliance testing, certifications, maintenance, value engineering / value analysis and post-market surveillance. Part of a global eco-system of best-in-class services.',
  },
  {
    t: 'Regulatory compliance',
    d: 'An understanding of the global regulatory landscape across Medical Devices, Avionics and Defence — so customers can introduce regulatory-compliant products and solutions.',
  },
]

export const TEAM = [
  {
    name: 'Jay Kamath',
    role: 'Founder and Senior Principal Consultant',
    photo: '/images/jay-kamath.jpg',
    linkedin: 'https://www.linkedin.com/in/jayavanth-kamath-12782b3',
    bio: 'Electrical engineer with over 24 years of system engineering, quality and regulatory assurance services. Exposure to customers globally and an understanding of geography-specific product requirements in Medical Devices, Avionics and Industrial Devices. Specialises in ISO, FDA, FAA and IEC requirements, is a Certified Lead Auditor and has presented several papers at industry forums. Has worked at Larsen & Toubro Ltd, GE Healthcare and Wipro Technologies, handling transformational assignments in product engineering, system design, supply chain and post-marketing functions for multinational organisations based in the US, Europe and Japan.',
  },
  { name: 'Namitha Bahubali', role: 'Program Director', linkedin: 'https://www.linkedin.com/in/namitha-bahubali-3711a215' },
  { name: 'Sandhya L S', role: 'Delivery Head' },
  { name: 'Sreenivasa Chary', role: 'RnD Services Head' },
  { name: 'Sadanand Shenoy', role: 'Operations Head' },
  { name: 'Annapurna H', role: 'Head – Human Resources', linkedin: 'https://www.linkedin.com/in/anu-hiremath-a7601522' },
]

// src: /blog.html — dated 25 August 2015, by Jayavanth Kamath
export const POST = {
  seoDescription: 'A MedTech program team needed fast-track regulatory approval for South East Asia. How Caliber changed the design and passed design qualification.',
  slug: 'are-you-wasting-your-time-handling-regulatory-issues',
  title: 'Are you wasting your time handling regulatory issues?',
  date: '2015-08-25',
  dateLabel: 'August 25, 2015',
  author: 'Jayavanth Kamath',
  category: 'News',
  body: [
    'Recently there was an urgent call from an Engineering Program Manager based in Jacksonville. They are one of the top 10 MedTech companies planning to introduce their new product in the South East Asia region.',
    'I asked him: “You have a separate Regulatory and Quality group handling the Asian market. Why can’t you go through your own people?”',
    'Here comes the cryptic reply: “Yes, it takes a long time to get through our own internal processes. It would be easier to work with the partners for the timely execution.”',
    'This customer saw an immediate opportunity in this region and was looking for someone to help them put the regulatory approval process on a fast track. “The product design should also be modified to meet the country-specific user requirements.”',
    'We were on board quickly, started understanding the current design, executed engineering changes to meet the additional requirements, got through the design qualification process and — this customer is now ready to launch the product.',
    'We understand the product domain and have knowledge of the regulatory requirements of any region, which would be the key drivers for the success of your program.',
  ],
}

export const SYSTEM_SAFETY = {
  title: 'System Safety 2.0',
  p1: 'The old model of Quality and System Safety is obsolete. For an organisation to truly excel in complex product engineering, system safety cannot be viewed in isolation. Systems have become necessities for modern living, and it is a challenge to make sure their failure modes are addressed early in the design cycle to mitigate possible catastrophe.',
  p2: 'Caliber believes in transforming your engineering process into a robust, proactive system that runs throughout your product lifecycle — cradle to grave.',
  serves: ['Avionics', 'Defence', 'Life Science', 'Medical Devices'],
}

export const CAREER = {
  title: 'Design Quality and Regulatory Leader',
  location: 'Bengaluru',
  reqs: [
    'Around 8–15 years of experience in Software Quality Assurance',
    'Experience as senior software / hardware engineer, module leader or technical leader',
    'Working experience in quality assurance and regulatory assurance',
    'Preferably experience in all areas of the software development life cycle',
  ],
  qual: 'Diploma / graduate / post-graduate in Electronics Engineering or Software Engineering with 8–15 years of experience',
}

// Question-and-answer pairs for the About page. Every answer restates facts published on caliberassurance.com.
export const FAQ = [
  {
    q: 'What is Caliber Assurance Services?',
    a: 'Caliber Assurance Services is an ISO 13485 / ISO 9001 certified design consulting firm based in Bengaluru, India. It offers Design & Engineering Solutions, Assurance Solutions and Consulting, with a strong focus on regulatory compliance for Medical Devices, Avionics and related industries.',
  },
  {
    q: 'Which industries does Caliber serve?',
    a: 'Medical devices, life sciences (the pharma industry), and aerospace & defence engineering — which covers avionics, defence and automotive systems.',
  },
  {
    q: 'What services does Caliber provide?',
    a: 'Design & Engineering (system design, embedded programming, electronic hardware and mechanical design, test jigs and fixtures, value analysis and value engineering); Verification & Validation / Assurance (regulatory compliance testing, software validation, risk management and hazard analysis, reliability assurance, RCA / CAPA); and Consulting (Make In India, product homologation, on-site representation, assured design, training, quality systems remediation).',
  },
  {
    q: 'Which standards and regulations does Caliber work with?',
    a: 'For medical devices: 21 CFR Part 820, ISO 13485, IEC 62304, ISO 14971, IEC 62366 and IEC 60601-1. For the pharma industry: GxP. Its founder specialises in ISO, FDA, FAA and IEC requirements.',
  },
  {
    q: 'Can Caliber help launch a product in several markets at once?',
    a: 'Yes. Caliber designs solutions to help customers launch products for the global market simultaneously, treating regulatory requirements as critical to quality from the start of design.',
  },
  {
    q: 'Who leads Caliber?',
    a: 'Jay Kamath is the Founder and Senior Principal Consultant — an electrical engineer with over 24 years of system engineering, quality and regulatory assurance experience and a Certified Lead Auditor. He previously worked at Larsen & Toubro, GE Healthcare and Wipro Technologies.',
  },
  {
    q: 'Where is Caliber located and how can I contact it?',
    a: 'Caliber is at # 3499, 14th Main Road, HAL II Stage, Indiranagar, Bangalore, India – 560 008. Phone: 080 25283196. Email: operations@caliberassurance.com. The office works Monday to Saturday, 08:00 – 20:00, and is closed on Sundays and holidays.',
  },
]
