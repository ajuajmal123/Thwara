export interface Contributor {
  id: string;
  name: string;
  slug: string;
  role: string;
  bio: string;
  imageUrl: string;
  articlesCount: number;
}

export const CONTRIBUTORS: Contributor[] = [
  {
    id: "1",
    name: "Dr. Sarah Thomas",
    slug: "sarah-thomas",
    role: "Researcher & Historian",
    bio: "Sarah Thomas is a researcher focusing on South Asian political history and collective memory. She teaches at the University of Kerala and writes frequently on the intersection of urban space and social identity.",
    imageUrl: "/portrait.svg",
    articlesCount: 14,
  },
  {
    id: "2",
    name: "Rajeev N",
    slug: "rajeev-n",
    role: "Cultural Critic",
    bio: "Rajeev N is a cultural critic and essayist writing extensively on modern Malayalam literature, cinematic syntax, and changing social paradigms in Kerala.",
    imageUrl: "/portrait.svg",
    articlesCount: 8,
  },
  {
    id: "3",
    name: "Meera Menon",
    slug: "meera-menon",
    role: "Poet & Fiction Writer",
    bio: "Meera Menon is an award-winning poet and fiction writer whose work explores themes of identity, language, and modern alienation across spatial borders.",
    imageUrl: "/portrait.svg",
    articlesCount: 22,
  },
  {
    id: "c4",
    name: "Ananya Menon",
    slug: "ananya-menon",
    role: "Writer & Researcher",
    bio: "Ananya Menon writes about urban memory, public spaces and the cultural histories embedded in everyday landscapes.",
    imageUrl: "/portrait.svg",
    articlesCount: 6,
  },
  {
    id: "c5",
    name: "Muhammad Riyas",
    slug: "muhammad-riyas",
    role: "Researcher & Essayist",
    bio: "Muhammad Riyas explores archival theory and the socio-historical impacts of lost documentation in Indian post-colonial landscapes.",
    imageUrl: "/portrait.svg",
    articlesCount: 4,
  },
  {
    id: "c6",
    name: "Devika S.",
    slug: "devika-s",
    role: "Poet & Translator",
    bio: "Devika S. bridges linguistic divides through deep existential poetry and active translation of regional folklore.",
    imageUrl: "/portrait.svg",
    articlesCount: 9,
  },
  {
    id: "c7",
    name: "Nikhil Varma",
    slug: "nikhil-varma",
    role: "Visual Artist",
    bio: "Nikhil Varma constructs mixed-media digital collages that interpret traditional Indian motifs through cybernetic frameworks.",
    imageUrl: "/portrait.svg",
    articlesCount: 2,
  },
  {
    id: "c8",
    name: "Meera Joseph",
    slug: "meera-joseph",
    role: "Cultural Researcher",
    bio: "Investigating the slow erosion of coastal traditions, Meera Joseph documents marginalized narratives via deep ethnographic studies.",
    imageUrl: "/portrait.svg",
    articlesCount: 5,
  },
  {
    id: "c9",
    name: "Arjun Narayanan",
    slug: "arjun-narayanan",
    role: "Writer",
    bio: "Arjun Narayanan is a sharp commentator on the digital revolution and its subtle erosion of communal spatial realities.",
    imageUrl: "/portrait.svg",
    articlesCount: 12,
  },
  {
    id: "c10",
    name: "Fathima N.",
    slug: "fathima-n",
    role: "Researcher",
    bio: "Focused on linguistic hegemony and dialect survival, Fathima maps the quiet transformations of the vernacular.",
    imageUrl: "/portrait.svg",
    articlesCount: 3,
  },
  {
    id: "c11",
    name: "Rahul Krishnan",
    slug: "rahul-krishnan",
    role: "Photographer & Writer",
    bio: "Capturing the architectural decay of once-thriving industrial towns, Rahul merges stark photography with prose.",
    imageUrl: "/portrait.svg",
    articlesCount: 8,
  },
  {
    id: "c12",
    name: "Leena Mathew",
    slug: "leena-mathew",
    role: "Poet",
    bio: "Leena's poetry seeks the geometry in nature, utilizing sparse structuring to echo the emotional weight of absences.",
    imageUrl: "/portrait.svg",
    articlesCount: 15,
  }
];
