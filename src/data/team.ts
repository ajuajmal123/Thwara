export interface TeamMember {
  id: string;
  slug: string;
  name: string;
  role?: string;
  image: string;
  shortBio: string;
  fullBio: string;
  interests?: string[];
  education?: string;
  location?: string;
}

export const TEAM_MEMBERS: TeamMember[] = [
  {
    id: "1",
    slug: "muhammed-ajmal-kk",
    name: "Muhammed Ajmal KK",
    image: "/Muhammed_ajmal kk.jpeg",
    shortBio: "A Full Stack Developer and independent website designer who built this platform, combining modern frontend technologies with efficient backend content management to deliver a seamless digital experience.",
    fullBio: "Muhammed Ajmal KK is a Full Stack Developer and independent website designer who designed and built this platform to deliver an accessible, seamless, and user-friendly digital experience. Combining modern frontend technologies with efficient backend content management solutions, he collaborates closely with the team to enhance functionality, performance, and overall user engagement. Driven by a passion for technology, his broader research interests also extend to oral studies and tech-driven research.",
    interests: ["Full Stack Development", "Web Design", "Frontend Technologies", "Content Management", "Oral Studies", "Tech-driven Research"],
    location: "Kerala"
  },
  {
    id: "2",
    slug: "athira-bhanu",
    name: "Athira Bhanu",
    image: "/athirabhanu.jpeg",
    shortBio: "A writer and consultant psychologist with a postgraduate degree in Psychology from the Central University of Haryana, exploring emotional landscapes and sociocultural realities.",
    fullBio: "Athira Bhanu is a writer and consultant psychologist with a postgraduate degree in Psychology from the Central University of Haryana. Her interests span literature, psychology, gender studies, politics, cinema, and philosophy. She is drawn to exploring the emotional landscapes of human experience, critically engaging with contemporary social realities, and examining cinema through psychological and sociocultural lenses. Her writing reflects an interest in how social and cultural contexts shape our perceptions, identities, and understanding of the world.",
    interests: ["Psychology", "Gender Studies", "Social Realities", "Cinema & Culture", "Philosophy", "Literature"],
    education: "Postgraduate in Psychology, Central University of Haryana",
    location: "Kerala"
  },
  {
    id: "3",
    slug: "nandana-maya-sachidanandan",
    name: "Nandana Maya Sachidanandan",
    image: "/nandana.jpeg",
    shortBio: "A postgraduate in English Literature, an educator, and an aspiring researcher and writer with a keen interest in exploring the intersections of literature, culture, politics, and society.",
    fullBio: "Nandana Maya Sachidanandan is a postgraduate in English Literature, an educator, and an aspiring researcher and writer with a keen interest in exploring the intersections of literature, culture, politics, and society. Having worked as an Assistant Professor at the collegiate level, she is currently based in Calicut, working as a tutor. Her research interests include Gender Studies, Postcolonialism, Graphic Novels, Political Fiction, and Literary Criticism. Passionate about research and writing, she is drawn to ideas that question established narratives and challenge dominant perspectives. She is also a student of Carnatic music with occasional creative pursuits in painting, music, and writing. Moving between academic inquiry and artistic expression, she finds inspiration in the freedom to think, create, and reimagine.",
    interests: ["Gender Studies", "Postcolonialism", "Graphic Novels", "Political Fiction", "Literary Criticism", "Carnatic Music"],
    education: "Postgraduate in English Literature",
    location: "Calicut, Kerala"
  },
  {
    id: "4",
    slug: "muhammed-munavver",
    name: "Muhammed Munavver",
    image: "/munavver.jpeg",
    shortBio: "A librarian with a Master's degree in Library and Information Science from the Central University of Haryana, currently working at RGMRHSS Noolpuzha.",
    fullBio: "Muhammed Munevver is a librarian who earned his Master's degree in Library and Information Science from the Central University of Haryana and currently works at RGMRHSS Noolpuzha. Driven by a deep curiosity to explore knowledge from diverse spaces, and to express it in forms and the formless, his primary interests lie in the diversity of human knowledge, folklore and oral studies, cinema, and literature.",
    interests: ["Human Knowledge Systems", "Folklore & Oral Studies", "Cinema Studies", "Literature", "Library Science"],
    education: "Master's in Library & Information Science, Central University of Haryana",
    location: "Noolpuzha, Kerala"
  }
];
