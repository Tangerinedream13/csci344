const getBusinesses = async (location, term, limit, openNow) => {
    const rootURL =  ('https://www.apitutor.org/yelp/simple/v3/businesses/search?location=Asheville,%20NC&term=breakfast&limit=3&open_now=true');
    const endpoint = `${rootURL}?location=${location}&term=${term}&limit=${limit}&openNow=${openNow}`;
    const response = await fetch(endpoint);
    const jsonData = await response.json();
    console.log(`Matches for ${term}:`, jsonData);
    return jsonData.businesses;
 };
        

function businessToHTML(businessObj) {
    const htmlRepresentation = `
        <div>
            <h2>${businessObj.name}</h2>
            <img src="${businessObj.image_url}"/>
            <p>${businessObj.display_address}</p>   
            <p><strong>Rating:</strong> ${businessObj.rating}</p>
            <p><strong>Price:</strong> ${businessObj.price || "Price not displayed."}</p>
            <p><strong># of Reviews:</strong> ${businessObj.review_count}</p>
        </div>
    `;
    return htmlRepresentation;
}

async function showResults() {
    const location = document.querySelector("#location").value;
    const search_term = document.querySelector("#term").value;
    const openNow = document.querySelector("#openNow").checked;
    const businesses = await getBusinesses(location, search_term, 10, openNow);
    const results = document.querySelector("#results"); 


    results.innerHTML = businesses.map(businessToHTML).join("");
// I still wasn't able to get the button to work and display the restaurant to look like
// it does in the instructions. 
}
  




      