export interface CreativeWork {
  id: string;
  title: string;
  slug: string;
  language: "English" | "മലയാളം";
  type: "Poetry" | "Fiction" | "Personal Narrative" | "Visual Art" | "Experimental";
  author: string;
  date: string;
  coverImage?: string;
  excerpt: string;
  content: string;
}

export const CREATIVE_WORKS: CreativeWork[] = [
  {
    id: "1",
    title: "After the Rain",
    slug: "after-the-rain",
    language: "English",
    type: "Poetry",
    author: "Leena Mathew",
    date: "Sep 12, 2026",
    coverImage: "/mock-2.svg",
    excerpt: "When the sky broke its prolonged silence over the tin roofs, we remembered the scent of rusted iron and drowned earth.",
    content: "Full poetry content."
  },
  {
    id: "2",
    title: "Letters Never Sent",
    slug: "letters-never-sent",
    language: "English",
    type: "Fiction",
    author: "Meera Menon",
    date: "Aug 30, 2026",
    coverImage: "/mock-1.svg",
    excerpt: "He found a stack of unopened envelopes in the attic. None had addresses, but all were sealed with a peculiar red wax.",
    content: "Full fiction content."
  },
  {
    id: "3",
    title: "കടലിന്റെ ഓർമ്മ",
    slug: "kadalinte-orma",
    language: "മലയാളം",
    type: "Personal Narrative",
    author: "Rajeev N",
    date: "Aug 15, 2026",
    coverImage: "/mock-2.svg",
    excerpt: "തീരത്തുനിന്ന് എത്ര ദൂരേക്ക് മാറിയാലും, ഉറങ്ങാൻ കിടക്കുമ്പോൾ തിരമാലകളുടെ ഇരമ്പൽ കേൾക്കാറുണ്ടായിരുന്നു.",
    content: "Full narrative content."
  },
  {
    id: "4",
    title: "The House That Stayed",
    slug: "house-that-stayed",
    language: "English",
    type: "Fiction",
    author: "Arjun Narayanan",
    date: "Jul 22, 2026",
    excerpt: "While the rest of the neighborhood crumbled into dust and glass towers, the wooden colonial structure stubbornly rooted deeper into the soil.",
    content: "Full fiction content."
  },
  {
    id: "5",
    title: "ഒരു ജനലിന്റെ ആത്മകഥ",
    slug: "oru-janalinte-athmakatha",
    language: "മലയാളം",
    type: "Poetry",
    author: "Devika S.",
    date: "Jul 10, 2026",
    excerpt: "അടച്ചിട്ട മുറിയിലെ ഏക ജനൽ നോക്കിക്കണ്ട പുറംലോക കാഴ്ചകൾ.",
    content: "Full poem."
  },
  {
    id: "6",
    title: "Maps of Leaving",
    slug: "maps-of-leaving",
    language: "English",
    type: "Visual Art",
    author: "Nikhil Varma",
    date: "Jun 18, 2026",
    coverImage: "/mock-1.svg",
    excerpt: "A visual exploration of migration routes overlaid on decaying urban textures.",
    content: "Art collection details."
  },
  {
    id: "7",
    title: "Night Bus",
    slug: "night-bus",
    language: "English",
    type: "Personal Narrative",
    author: "Rahul Krishnan",
    date: "Jun 05, 2026",
    excerpt: "The 2:00 AM interstate bus is a vessel of transient ghosts, moving collectively in isolation.",
    content: "Narrative."
  },
  {
    id: "8",
    title: "വെള്ളത്തിന്റെയും ഓർമ്മയുടെയും ഇടയിൽ",
    slug: "vellathinteyum-ormayudeyum-idayil",
    language: "മലയാളം",
    type: "Experimental",
    author: "Devika S.",
    date: "May 20, 2026",
    coverImage: "/mock-2.svg",
    excerpt: "ജലവും ജീവനും തമ്മിലുള്ള അഭേദ്യമായ ബന്ധത്തിന്റെ താളാത്മകമായ വിവരണം.",
    content: "Experimental prose poetry."
  },
  {
    id: "9",
    title: "Rooms We Carry",
    slug: "rooms-we-carry",
    language: "English",
    type: "Fiction",
    author: "Meera Menon",
    date: "May 02, 2026",
    excerpt: "You never truly leave a room you have loved. You pack it up, fold it down, and recreate its corners everywhere you go.",
    content: "Fiction."
  },
  {
    id: "10",
    title: "മഴയ്ക്ക് ശേഷം",
    slug: "mazhakku-shesham",
    language: "മലയാളം",
    type: "Poetry",
    author: "Leena Mathew",
    date: "Apr 14, 2026",
    excerpt: "മഴ തോർന്നാലും മരങ്ങളിൽ പെയ്തുകൊണ്ടിരിക്കുന്ന ഓർമ്മകൾ.",
    content: "Poetry."
  },
  {
    id: "11",
    title: "Silent Metronomes",
    slug: "silent-metronomes",
    language: "English",
    type: "Experimental",
    author: "Arjun Narayanan",
    date: "Mar 30, 2026",
    coverImage: "/mock-1.svg",
    excerpt: "A typographic experiment measuring the exact speed of grief.",
    content: "Experimental markup."
  },
  {
    id: "12",
    title: "Broken Cartography",
    slug: "broken-cartography",
    language: "English",
    type: "Visual Art",
    author: "Nikhil Varma",
    date: "Feb 12, 2026",
    coverImage: "/mock-2.svg",
    excerpt: "Re-drawing the state boundaries based purely on botanical distribution.",
    content: "Art showcase details."
  }
];
