import { ELASTIC_URL } from '../constants';

/**
 * Search for the most viewed memes in the last 24 hours
 * @param {number} from The starting position for the search results
 * @param {number} size The number of results to return in the search
 */
export async function searchMostViewedMemes(from, size) {
    const response = await fetch(`${ELASTIC_URL}/memes/_search`, {
        method: 'POST',
        body: JSON.stringify({
            from,
            size,
            query: {
                function_score: {
                    query: {
                        bool: {
                            should: []
                        }
                    },
                    functions: [{
                        filter: {
                            range: {
                                lastViewed: {
                                    gte: 'now-24h'
                                }
                            }
                        },
                        weight: 2
                    }]
                }
            },
            sort: [{
                views: {
                  order: 'desc'
                },
                createdAt: {
                    order: 'desc'
                }
            }]
        }),
        headers: {
            Authorization: 'ApiKey MTF5UkE0VUJOLXFnczBrdExNOE86ajJ3S21rcDdSU1dNRUxHbkVmZk1GUQ==',
            'Content-Type': 'application/json'
        }
    });

    return await response.json();
}

/**
 * Search memes based on the given tag
 * @param {string} tag Tag to search
 * @param {number} from The starting position for the search results
 * @param {number} size The number of results to return in the search
 */
export async function searchMemesWithTag(tag, from, size) {
    const response = await fetch(`${ELASTIC_URL}/memes/_search`, {
        method: 'POST',
        body: JSON.stringify({
            from,
            size,
            query: {
                function_score: {
                    query: {
                        bool: {
                            should: [{
                                match_phrase_prefix: {
                                    tags: {
                                        query: tag,
                                        max_expansions: 10
                                    }
                                }
                            }]
                        }
                    },
                    functions: [{
                        filter: {
                            range: {
                                lastViewed: {
                                    gte: 'now-24h'
                                }
                            }
                        },
                        weight: 2
                    }]
                }
            },
            sort: [{
                views: {
                  order: 'desc'
                },
                createdAt: {
                    order: 'desc'
                }
            }]
        }),
        headers: {
            Authorization: 'ApiKey MTF5UkE0VUJOLXFnczBrdExNOE86ajJ3S21rcDdSU1dNRUxHbkVmZk1GUQ==',
            'Content-Type': 'application/json'
        }
    });

    return await response.json();
}

/**
 * Update the lastViewed and views fields in a document
 * @param {string} id The id of the document to be updated
 */
export async function updateMemeLastViewed(id) {
    const response = await fetch(`${ELASTIC_URL}/memes/_update/${id}`, {
        method: 'POST',
        body: JSON.stringify({
            script: {
            source: 'ctx._source.lastViewed = params.lastViewed; ctx._source.views++;',
                params: {
                    lastViewed: new Date().toISOString()
                }
            }
        }),
        headers: {
            Authorization: 'ApiKey MTF5UkE0VUJOLXFnczBrdExNOE86ajJ3S21rcDdSU1dNRUxHbkVmZk1GUQ==',
            'Content-Type': 'application/json'
        }
    });

    return await response.json();
}