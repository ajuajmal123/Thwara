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
 * Webzine (Curated issues grouping Articles, Fiction, Folklore, Tellings)
 */
export async function getWebzines(): Promise<StrapiCollectionResponse<Webzine>> {
    return fetchAPI("/webzines", {
        populate: {
            coverImage: "*",
            articles: { populate: "*" },
            fictions: { populate: "*" },
            folklores: { populate: "*" },
            tellings: { populate: "*" }
        },
        sort: ["date:desc"]
    });
}

export async function getWebzineById(id: string | number): Promise<StrapiSingleResponse<Webzine> | null> {
    return fetchAPI(`/webzines/${id}`, {
        populate: {
            coverImage: "*",
            articles: { populate: "*" },
            fictions: { populate: "*" },
            folklores: { populate: "*" },
            tellings: { populate: "*" }
        }
    });
}

/**
 * Authors
 */
export async function getAuthors(): Promise<StrapiCollectionResponse<Author>> {
    return fetchAPI("/authors", { populate: "*" });
}

/**
 * Submissions (POST Request to send user uploads securely to Strapi)
 * Accepts either a FormData instance (for file uploads) or a JSON payload.
 */
export async function postSubmission(submissionData: FormData | any) {
    if (typeof FormData !== "undefined" && submissionData instanceof FormData) {
        return fetchAPI("/submissions", {}, {
            method: "POST",
            body: submissionData
        });
    }

    return fetchAPI("/submissions", {}, {
        method: "POST",
        body: JSON.stringify({ data: submissionData })
    });
}
