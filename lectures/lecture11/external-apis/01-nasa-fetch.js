const showMeteors = async (startDate, endDate) => {
    const rootURL = "https://api.nasa.gov/neo/rest/v1/feed";
    const apiKey = "Nkm2F2D17dlqJlgMgpodpiFiL0rNgecSNa6cZKYu";
    const endpoint = `${rootURL}?api_key=${apiKey}&start_date${startDate}&end_date=${endDate}`;
    const response = await fetch(endpoint);
    const jsonData = await response.json();
    console.log(
        `Meteors between ${startDate} and ${endDate}:`,
        JSON.stringify(jsonData.near_earth_objects, null, "  ")
    );
};

// note that the thai restaurants might
// get printed before the pizza restaurants
showMeteors("2024-10-08", "2024-10-15");
showMeteors("2024-10-12", "2024-10-14");
