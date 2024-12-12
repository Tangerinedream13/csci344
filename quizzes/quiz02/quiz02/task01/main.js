// 1. Create your getBusinesses function here:

async function getBusinesses(search_term, location, num_results) {
    console.log("Search Term:", search_term);
    console.log("Location:", location);
    console.log("Number of Results:", num_results);

    const endpoint = "https://www.apitutor.org/yelp/simple/v3/businesses/search";
    const url = `${endpoint}?term=${encodeURIComponent(search_term)}&location=${encodeURIComponent(location)}&limit=${num_results}`;

    const response = await fetch(url);

    const data = await response.json();

    return data;
}
        
// 2. When you're done, uncomment the test code below and preview index.html in your browser:


console.log(
    "Should display 3 pizza restaurants in Asheville:",
    getBusinesses("Asheville, NC", "pizza", 3)
);
console.log(
    "Should display 10 thai restaurants in San Francisco:",
    getBusinesses("San Francisco, CS", "thai", 10)
);

