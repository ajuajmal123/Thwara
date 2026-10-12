// Thwara Platform Data Models

export interface Article {
  coverImage: string;
  title: string;
  authorName: string;
  domain: "Literature" | "Library" | "Psychology" | "History" | "Politics" | "Culture" | "Fashion" | "Photo story" | "Travelogue" | "Memoir";
  date: string;
  subheading: string;
  additionalImages: string[];
  authorPhoto: string;
  authorDescription: string;
  reference: string;
}

export interface Folklore {
  coverImage: string;
  title: string;
  narratorName: string;
  date: string;
  subheading: string;
  additionalImages: string[];
  narratorPhoto: string;
  narratorDescription: string;
  category: "Oral Histories" | "Folk Practices" | "Folk Literature" | "Myths" | "Legends" | "Field notes";
  reference: string;
  spotifyUrl?: string; // Add optional Spotify embed URL
}

export interface Fiction {
  coverImage: string;
  title: string;
  authorName: string;
  genre: "Story" | "Poem" | "Cartoon";
  date: string;
  subheading: string;
  additionalImages: string[];
  authorPhoto: string;
  authorDescription: string;
  notes: string; // Notes / glossary
}

export interface Webzine {
  title?: string;
  webzineName?: string;
  issueNumber?: string;
  coverImage?: any;
  workName?: string;
  domain?: string;
  date?: string;
  excerpt?: string;
  description?: string;
  authorName?: string;
  additionalImages?: any[];
  // Curated group of existing works inside this issue:
  articles?: any;
  fictions?: any;
  folklores?: any;
  tellings?: any;
}

export interface Submission {
  authorName?: string;
  email?: string;
  title?: string;
  googleDriveLink?: string;
  document?: any;
  agreedToPrivacy: boolean;
  status?: "Pending" | "Under Review" | "Accepted" | "Rejected";
}

export interface Author {
  name: string;
  photo: string;
  description: string;
}

export interface Tellings {
  title: string;
  coverImage?: string;
  category: "Stories" | "Interview" | "Podcast";
  spotifyUrl?: string; // Add optional Spotify embed URL
  // include other properties as required e.g., audioUrl, date, author
}

// Strapi Response Wrappers
export interface StrapiEntity<T> {
  id: number;
  attributes: T;
}

export interface StrapiCollectionResponse<T> {
  data: StrapiEntity<T>[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export interface StrapiSingleResponse<T> {
  data: StrapiEntity<T>;
}
