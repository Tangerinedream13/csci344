const getMeteors = async (startDate, endDate) => {
    const rootURL = "https://api.nasa.gov/neo/rest/v1/feed";
    const apiKey = "Nkm2F2D17dlqJlgMgpodpiFiL0rNgecSNa6cZKYu";
    const endpoint = `${rootURL}?api_key=${apiKey}&start_date${startDate}&end_date=${endDate}`;
    const response = await fetch(endpoint);
    const jsonData = await response.json();

    return jsonData; 

    // meteors
    async function printMeteors() {
        const data = await getMeteors("2024-10-08", "2024-10-09");
    console.log(data);
    }

   printMeteors();

}