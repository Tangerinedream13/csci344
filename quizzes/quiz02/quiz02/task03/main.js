// your code here:




function businessToHTML(business) {
    return `
        <div class="business">
            <h2>${business.name}</h2>
            <img src="${business.image_url || 'https://via.placeholder.com/150'}" alt="${business.name}">
            <p><strong>Address:</strong> ${business.location?.display_address?.join(', ') || 'No address'}</p>
            <p><strong>Rating:</strong> ${business.rating || 'N/A'} stars</p>
            <p><strong>Price:</strong> ${business.price || 'N/A'}</p>
            <p><strong>Reviews:</strong> ${business.review_count || 0}</p>
        </div>
    `;