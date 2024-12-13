async function getBusinesses(location, search_term, num_results, open) {
    const query = `https://www.apitutor.org/yelp/simple/v3/businesses/search?location=${location}&term=${search_term}&limit=${num_results}&open_now=${open}`;
    const response = await fetch(query);
    const data = await response.json();
    return data;
}

function businessToHTML(businessObj) {
    const htmlRepresentation = `
        <div>
            <h2>${businessObj.name}</h2>
            <img src="${businessObj.image_url}"/>
            <p>${businessObj.display_address}</p>   
            <p><strong>Rating:</strong> ${businessObj.rating}</p>
            <p><strong>Price:</strong> ${businessObj.price || "Not listed"}</p>
            <p><strong># of Reviews:</strong> ${businessObj.review_count}</p>
        </div>
    `;
    return htmlRepresentation;
}

async function showResults() {
    const location = document.querySelector("#location").value;
    const search_term = document.querySelector("#term").value;
    const open = document.querySelector("#open").checked;
    const businesses = await getBusinesses(location, search_term, 10, open);
    document.querySelector("#results").innerHTML = businesses.map(businessToHTML).join("");
    return;
}