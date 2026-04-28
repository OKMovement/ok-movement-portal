export type CouncilMember = {
  role: string;
  name: string;
  phone: string;
};

export type StateCoordinator = {
  state: string;
  coordinator: string;
  phone: string;
};

export type Zone = {
  id: string;
  name: string;
  region: string;
  zonalCoordinator: string;
  zonalPhone: string;
  states: StateCoordinator[];
};

export type Pillar = {
  title: string;
  body: string;
};

export const ourMovementHero = {
  eyebrowParts: [
    "The structures are set.",
    "The vision is clear.",
    "The movement is here.",
  ],
  title: "Together, we will make Nigeria OK.",
  lead:
    "The Obi\u2013Kwankwaso (OK) Movement is a coordinated, nationwide engine for systemic reform and national rebirth — uniting Nigerians around character, competence, and the courage to demand better.",
};

export const aboutMovement = {
  eyebrow: "About the OK Movement",
  heading: "A coordinated, nationwide engine for national rebirth.",
  body: [
    "Nigeria stands at a defining crossroads. Today, as our people endure the weight of unprecedented economic hardship, the soaring cost of living, and the persistent shadow of insecurity, the Obi\u2013Kwankwaso (OK) Movement formally announces the unveiling of its national and state structures.",
    "This is more than a political milestone; it is the birth of a coordinated, nationwide engine for systemic reform and national rebirth.",
  ],
};

export const nationInNeed = {
  eyebrow: "A Nation in Need of Healing",
  heading: "We recognise the exhaustion felt in every Nigerian household.",
  body: [
    "From the farmer unable to harvest in safety to the entrepreneur stifled by a volatile economy, the struggle is real. Yet, in this moment of darkness, the OK Movement stands as a beacon of resolute hope.",
    "Our mission is anchored in a singular, unwavering conviction: Nigeria will be OK. We do not offer mere rhetoric; we offer a structured, disciplined pathway towards a country that works, not for the few, but for every citizen.",
  ],
};

export const unityOverDivision = {
  eyebrow: "Unity Over Division",
  heading: "A home for all well-meaning Nigerians.",
  body: [
    "The OK Movement rejects the tired politics of tribalism, regionalism, and religious sentiment that have long been used to keep our people divided while the nation falters.",
    "Our strength lies in our diversity, and our progress depends on our unity. We are mobilising from the grassroots to the capital, fostering a shared identity built on integrity, competence, and the collective responsibility to rescue our future.",
  ],
};

export const sacredMandate = {
  eyebrow: "Our Sacred Mandate",
  intro:
    "Our vision is deeply rooted in the highest aspirations of our land. We are guided by the profound prayer found in the third stanza of our National Anthem:",
  quote:
    "Oh God of all creation, grant this our one request. Help us to build a nation where no man is oppressed, and so, with peace and plenty, Nigeria may be blessed.",
  attribution: "Third stanza, Nigerian National Anthem",
  closing:
    "This is not merely a lyric; it is our blueprint. We seek to build a Nigeria where justice is a right, not a privilege, a nation where \u201Cplenty\u201D is shared through economic stability, and \u201Cpeace\u201D is secured through decisive leadership.",
};

export const roadAhead = {
  eyebrow: "The Road Ahead",
  heading: "Our current reality need not be our final destiny.",
  body: [
    "In the coming weeks, the official inauguration of our state chapters will commence across the federation.",
    "This is an open invitation to every Nigerian who believes that, through solidarity, purposeful leadership, and the courage to demand better, we will prevail.",
  ],
};

export const mandateVisionValues: { mandate: Pillar; vision: Pillar; values: Pillar } = {
  mandate: {
    title: "Our Mandate",
    body: "To build a Nigeria where justice is a right, not a privilege; where \u201Cplenty\u201D is shared through economic stability, and \u201Cpeace\u201D is secured through decisive, accountable leadership.",
  },
  vision: {
    title: "Our Vision",
    body: "A united, prosperous Nigeria where no citizen is oppressed — guided by the synergy of the Obidient and Kwankwasiya movements under the proven leadership of HE Peter Obi and HE Alhaji Rabiu Kwankwaso.",
  },
  values: {
    title: "Our Values",
    body: "Integrity, unity, courage and service. We organise across every state and the FCT around the 5 C\u2019s of OK leadership: Character, Competence, Compassion, Capacity and Commitment.",
  },
};

export const fiveCs = [
  {
    letter: "C",
    word: "Character",
    description: "Leaders whose private conduct matches their public promises.",
  },
  {
    letter: "C",
    word: "Competence",
    description: "Demonstrated ability to govern and to deliver real outcomes.",
  },
  {
    letter: "C",
    word: "Compassion",
    description: "A leadership rooted in empathy for ordinary Nigerians.",
  },
  {
    letter: "C",
    word: "Capacity",
    description: "The institutional muscle to convert vision into policy.",
  },
  {
    letter: "C",
    word: "Commitment",
    description: "A long-term obligation to country, not to political seasons.",
  },
];

export const movementStats = [
  { value: "36", label: "States organised" },
  { value: "+1", label: "Federal Capital Territory" },
  { value: "6", label: "Geopolitical zones" },
  { value: "120+", label: "Active local coordinators" },
];

export const executiveCouncil: CouncilMember[] = [
  { role: "Director General", name: "Hon. John Ozyl Ughulu", phone: "09099999362" },
  { role: "Deputy DG (North)", name: "Amb. Muhammad Auwal Musa", phone: "07064771347" },
  { role: "Deputy DG (South)", name: "Onabanjo Olusola", phone: "08182375926" },
  { role: "National Secretary", name: "Hajiya Amina Kuta", phone: "09032450092" },
  { role: "Legal Adviser", name: "Barr. Kingdom Okere", phone: "08036288528" },
  { role: "Media & Publicity Secretary", name: "Justin Ijeh", phone: "08023053854" },
  { role: "National Treasury", name: "Telma Iheme", phone: "08136903416" },
];

export const zones: Zone[] = [
  {
    id: "north-central",
    name: "North Central",
    region: "Middle Belt",
    zonalCoordinator: "Ogwuche Richard Enemona (CSP Rtd)",
    zonalPhone: "08037906078",
    states: [
      { state: "Kogi", coordinator: "Samson Mayaki Sokojinwa", phone: "07016599603" },
      { state: "Plateau", coordinator: "Tokji Mandim", phone: "08034126541" },
      { state: "Nasarawa", coordinator: "Yusuf Abdullahi Ahmed", phone: "08162625153" },
      { state: "Benue", coordinator: "Hon. Aliyu Ukechia Tershaku", phone: "08063624068" },
      { state: "Niger", coordinator: "Awwal Muhammad Goma", phone: "08129774767" },
      { state: "FCT Abuja", coordinator: "Ibrahim Jabir", phone: "08033200430" },
      { state: "Kwara", coordinator: "Hon. Kazeem Ademola Olawuyi", phone: "08129197251" },
    ],
  },
  {
    id: "north-west",
    name: "North West",
    region: "Sahel & Sudan belt",
    zonalCoordinator: "Hon. Hashimu Dungurawa",
    zonalPhone: "08033009555",
    states: [
      { state: "Kaduna", coordinator: "Yusuf Bala Ahmad", phone: "07012029188" },
      { state: "Sokoto", coordinator: "Umar A. Umar", phone: "08034054626" },
      { state: "Kano", coordinator: "Muhyideen Mustapha", phone: "08033905618" },
      { state: "Zamfara", coordinator: "Hon. Usman Muhammad Sani", phone: "08067311998" },
      { state: "Jigawa", coordinator: "Abubakar Abdullahi", phone: "07044445444" },
      { state: "Kebbi", coordinator: "Hanafi Mujeli", phone: "07037781505" },
      { state: "Katsina", coordinator: "Munawwar Abdussamad", phone: "09010000215" },
    ],
  },
  {
    id: "north-east",
    name: "North East",
    region: "Lake Chad basin",
    zonalCoordinator: "Amadu Babadidi Gwambe",
    zonalPhone: "09022914542",
    states: [
      { state: "Adamawa", coordinator: "Hon. Abubakar Na'ibi Bala", phone: "07032122399" },
      { state: "Gombe", coordinator: "Dr. Aminu Muhammad Makko", phone: "08033671115" },
      { state: "Taraba", coordinator: "Hon. Abdulmalik Abubakar", phone: "08130423390" },
      { state: "Bauchi", coordinator: "Hon. Ahmad Balewa", phone: "08032449720" },
      { state: "Yobe", coordinator: "Barr. Ibrahim Muhammad", phone: "08103332531" },
      { state: "Borno", coordinator: "Amina Bello Suleiman", phone: "09039187441" },
    ],
  },
  {
    id: "south-west",
    name: "South West",
    region: "Yorubaland & Atlantic coast",
    zonalCoordinator: "Dr. Adebayo Adefolaseye",
    zonalPhone: "08142354951",
    states: [
      { state: "Osun", coordinator: "Otunba Segun Odekunle", phone: "09035350000" },
      { state: "Oyo", coordinator: "Bababowale Olagbenro", phone: "07032936044" },
      { state: "Ekiti", coordinator: "Hon. Animasaun Sunday Diamond", phone: "07034455578" },
      { state: "Ogun", coordinator: "Omotayo Samson Adejobi", phone: "08067504326" },
      { state: "Lagos", coordinator: "Pastor Ibironke Ogboro", phone: "07087793011" },
      { state: "Ondo", coordinator: "Ibrahim Shuibu", phone: "08065431304" },
    ],
  },
  {
    id: "south-south",
    name: "South South",
    region: "Niger Delta",
    zonalCoordinator: "Amb. Christopher Ighodara",
    zonalPhone: "07035004159",
    states: [
      { state: "Cross River", coordinator: "Hon. Egwu Arong", phone: "08064038788" },
      { state: "Akwa Ibom", coordinator: "Elijah Noah", phone: "08136624951" },
      { state: "Edo", coordinator: "Eromosele Peter Jatto", phone: "08061666664" },
      { state: "Delta", coordinator: "Emerure Favour", phone: "08075036683" },
      { state: "Bayelsa", coordinator: "Mr. Freedom Akene", phone: "08036740025" },
      { state: "Rivers", coordinator: "Dr. Princess Jane Peters", phone: "07039959274" },
    ],
  },
  {
    id: "south-east",
    name: "South East",
    region: "Igboland",
    zonalCoordinator: "El-shaddai Ikeh Esq.",
    zonalPhone: "07079214619",
    states: [
      { state: "Imo", coordinator: "Nwanebu Christian Onyinyechi", phone: "08034549033" },
      { state: "Anambra", coordinator: "Chukwudi Onyejekwe Esq.", phone: "08063460908" },
      { state: "Ebonyi", coordinator: "Onya Emeka Mekadise", phone: "08038373359" },
      { state: "Enugu", coordinator: "Hon. Victor Onyia", phone: "08035201306" },
      { state: "Abia", coordinator: "Professor Zulu Ofoelue", phone: "08032620750" },
    ],
  },
];

export function formatPhone(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (digits.length === 11) {
    return `${digits.slice(0, 4)} ${digits.slice(4, 7)} ${digits.slice(7)}`;
  }
  return raw;
}
