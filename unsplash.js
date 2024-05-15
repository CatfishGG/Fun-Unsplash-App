const axios = require('axios');

// Your Unsplash Access Key
const UNSPLASH_ACCESS_KEY = 'YOUR UNSPLASH API KEY HERE';

async function searchRandomPhoto(query) {
    console.log('Searching for:', query);
    try {
        const response = await axios.get(`https://api.unsplash.com/search/photos`, {
            params: {
                query: query,
                page: 1,
                per_page: 1,
                orientation: 'landscape'
            },
            headers: {
                Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`
            }
        });
        
        if (response.data.results.length > 0) {
            return response.data.results[0];
        } else {
            console.log('No photos found for query:', query);
            return null;
        }
    } catch (error) {
        console.error('Error searching for photo:', error);
        return null;
    }
}

module.exports = { searchRandomPhoto };
