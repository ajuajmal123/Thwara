export interface WebzineProject {
  id: string;
  title: string;
  slug: string;
  language: "English" | "മലയാളം" | "Bilingual";
  type: string;
  contributors: string[];
  date: string;
  coverImage: string;
  excerpt: string;
  content: string; // Used strictly for routing structure simulation
}

export const WEBZINE_PROJECTS: WebzineProject[] = [
  {
    id: "1",
    title: "Monsoon Notes",
    slug: "monsoon-notes",
    language: "English",
    type: "Visual Essay",
    contributors: ["Rahul Krishnan", "Leena Mathew"],
    date: "Oct 2026",
    coverImage: "/mock-1.svg",
    excerpt: "An episodic visual and textual exploration of how heavy rains architect psychological interiority along the Malabar Coast.",
    content: "Structured data sequence representing 01-Rain, 02-Waiting, 03-Memory etc."
  },
  {
    id: "2",
    title: "A City in Fragments",
    slug: "city-in-fragments",
    language: "Bilingual",
    type: "Digital Storytelling",
    contributors: ["Ananya Menon", "Rajeev N"],
    date: "Sep 2026",
    coverImage: "/mock-2.svg",
    excerpt: "Collecting the discarded auditory artifacts and broken neon vernaculars of Trivandrum's dying industrial sectors.",
    content: "Structured multimedia snippets."
  },
  {
    id: "3",
    title: "Listening to the Coast",
    slug: "listening-to-coast",
    language: "English",
    type: "Experimental Archive",
    contributors: ["Meera Joseph", "Fathima N."],
    date: "Aug 2026",
    coverImage: "/mock-1.svg",
    excerpt: "An auditory history project translating the wave frequencies of a disappearing shoreline into typographically dense long-scroll narratives.",
    content: "Data sequence"
  },
  {
    id: "4",
    title: "Between Two Languages",
    slug: "between-two-languages",
    language: "Bilingual",
    type: "Interactive Essay",
    contributors: ["Meera Menon", "Devika S."],
    date: "Jul 2026",
    coverImage: "/mock-2.svg",
    excerpt: "An investigation into those untranslatable thoughts that exist purely in the friction between Malayalam structural grammar and standard English syntax.",
    content: "Data sequence"
  },
  {
    id: "5",
    title: "The Unfinished Archive",
    slug: "unfinished-archive",
    language: "English",
    type: "Image + Text",
    contributors: ["Muhammad Riyas", "Nikhil Varma"],
    date: "May 2026",
    coverImage: "/mock-1.svg",
    excerpt: "Exposing the deliberate erasures in a state library's regional newspaper collection spanning the turbulent late 80s.",
    content: "Data sequence"
  },
  {
    id: "6",
    title: "Letters From Elsewhere",
    slug: "letters-from-elsewhere",
    language: "Bilingual",
    type: "Collaborative Fiction",
    contributors: ["Arjun Narayanan", "Anjali S"],
    date: "Mar 2026",
    coverImage: "/mock-2.svg",
    excerpt: "A digital postcard exchange between two fictitious characters inhabiting parallel socio-political realities in the same physical city.",
    content: "Data sequence"
  }
];
