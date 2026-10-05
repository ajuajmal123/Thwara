import { fetchAPI } from "@/lib/strapi";
import { Article, Folklore, Fiction, Webzine, Author, Tellings, StrapiCollectionResponse, StrapiSingleResponse } from "@/types/schema";

/**
 * Fetches all Articles
 */
export async function getArticles(page = 1, pageSize = 10): Promise<StrapiCollectionResponse<Article>> {
    return fetchAPI("/articles", { populate: "*", pagination: { page, pageSize }, sort: ["date:desc"] });
}

export async function getArticleBySlug(slug: string): Promise<StrapiSingleResponse<Article> | null> {
    const data = await fetchAPI("/articles", { filters: { slug: { $eq: slug } }, populate: "*" });
    return data?.data?.[0] || null;
}

/**
 * Tellings (Audio) - retained if needed
 */
export async function getTellingsByCategory(category: "Stories" | "Podcast" | "Interview"): Promise<StrapiCollectionResponse<Tellings>> {
    return fetchAPI("/tellings", { filters: { category: { $eq: category } }, populate: ["thumbnail"], sort: ["publishedAt:desc"] });
}

/**
 * Fiction
 */
export async function getFictions(page = 1, pageSize = 10): Promise<StrapiCollectionResponse<Fiction>> {
    return fetchAPI("/fictions", { populate: "*", pagination: { page, pageSize }, sort: ["date:desc"] });
}

/**
 * Folklore
 */
export async function getFolklore(page = 1, pageSize = 10): Promise<StrapiCollectionResponse<Folklore>> {
    return fetchAPI("/folklores", { populate: "*", pagination: { page, pageSize }, sort: ["date:desc"] });
}

/**
 * Webzine
 */
export async function getWebzines(): Promise<StrapiCollectionResponse<Webzine>> {
    return fetchAPI("/webzines", { populate: "*", sort: ["date:desc"] });
}

/**
 * Authors
 */
export async function getAuthors(): Promise<StrapiCollectionResponse<Author>> {
    return fetchAPI("/authors", { populate: "*" });
}

/**
 * Submissions (POST Request to send user uploads securely to Strapi)
 */
export async function postSubmission(submissionData: any) {
    // Note: To accept File uploads (PDFs, DOCX), you might use FormData instead of JSON,
    // but here is a standard representation of calling a Strapi create endpoint.
    return fetchAPI("/submissions", {}, {
        method: "POST",
        body: JSON.stringify({ data: submissionData })
    });
}
