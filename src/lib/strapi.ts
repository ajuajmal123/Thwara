import qs from "qs";

/**
 * Get full Strapi URL from path
 * @param path Path of the URL
 * @returns Full Strapi URL
 */
export function getStrapiURL(path = "") {
    return `${
        process.env.NEXT_PUBLIC_STRAPI_API_URL || "http://127.0.0.1:1337"
    }${path}`;
}

/**
 * Helper to make GET requests to Strapi API endpoints
 * @param path Path of the API route
 * @param urlParamsObject URL params object, will be stringified using qs
 * @param options Options passed to fetch
 * @returns Parsed API call response
 */
export async function fetchAPI(path: string, urlParamsObject = {}, options = {}) {
    // Merge default options with user options
    const mergedOptions = {
        headers: {
            "Content-Type": "application/json",
            // Include your Strapi API token in your environment variables for authenticated requests
            ...(process.env.STRAPI_API_TOKEN ? { Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}` } : {}),
        },
        ...options,
    };

    // Build request URL
    const queryString = qs.stringify(urlParamsObject, { encodeValuesOnly: true });
    const requestUrl = getStrapiURL(`/api${path}${queryString ? `?${queryString}` : ""}`);

    console.log(`[Strapi API] Fetching: ${requestUrl}`);

    // Trigger API call
    const response = await fetch(requestUrl, mergedOptions);

    // Handle response
    if (!response.ok) {
        console.error(response.statusText);
        throw new Error(`An error occurred please try again: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
}

/**
 * Helper to extract media URL (mainly for Strapi images/assets)
 */
export function getStrapiMedia(url: string | null) {
    if (url == null) {
        return null;
    }

    // Return the full URL if the media is hosted on an external provider
    if (url.startsWith("http") || url.startsWith("//")) {
        return url;
    }

    // Otherwise prepend the Strapi backend URL
    return `${process.env.NEXT_PUBLIC_STRAPI_API_URL || "http://127.0.0.1:1337"}${url}`;
}
