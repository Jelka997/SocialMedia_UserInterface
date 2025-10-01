function get() {

    const urlParams = new URLSearchParams(window.location.search)
    const id = urlParams.get('id') // Preuzimamo vrednost id parametra upita

    if (!id) { // Ako ne postoji parametar upita, ne dobavljamo knjigu
        return
    }

    fetch('http://localhost:5014/api/groups/'+ id + '/users')
        .then(response => {
            if (!response.ok) {
                // Ako statusni kod nije iz 2xx (npr. 404), kreiramo grešku
                const error = new Error('Request failed. Status: ' + response.status)
                error.response = response // Dodajemo ceo response objekat u grešku
                throw error  // Bacamo grešku
            }
            return response.json()
        })
        .then(users => {
            renderData(users)
        })
        .catch(error => {
            console.error('Error:', error.message)
            if (error.response && error.response.status === 404) {
                alert('Book does not exist!')
            } else {
                alert('An error occurred while loading the data. Please try again.')
            }
        })
    
}
function renderData(data){
    let table = document.querySelector("table tbody");
    // Ispraznimo tabelu pre nego što dodamo nove podatke
    table.innerHTML = "";

    let tableHeader = document.querySelector("table thead"); // Zaglavlje tabele
    let noDataMessage = document.querySelector("#no-data-message");

    // Ako lista podataka (data) je prazna
    if (data.length === 0) {
        // Sakrij zaglavlje tabele
        tableHeader.classList.add("hidden");

        // Prikaži poruku da nema podataka za prikazivanje
        noDataMessage.classList.remove("hidden");
    } else {
        // Ukloniti poruku da nema podataka za prikazivanje
        noDataMessage.classList.add("hidden");

        // Prikazivanje zaglavlja tabele
        tableHeader.classList.remove("hidden");

        // Za svaku knjigu dodajemo red u tabeli koji ima dve ćelije (naziv i autor)
            data.forEach((user) => {
            let newRow = document.createElement("tr");

            let cell1 = document.createElement("td");
            cell1.textContent = user["id"];
            newRow.appendChild(cell1);

            let cell2 = document.createElement("td");
            cell2.textContent = user["username"];
            newRow.appendChild(cell2);

            let cell3 = document.createElement("td");
            cell3.textContent = user["name"];
            newRow.appendChild(cell3);

            let cell4 = document.createElement("td");
            cell4.textContent = user["lastName"];
            newRow.appendChild(cell4);

            let cell5 = document.createElement("td");
            let date = new Date(user["birthday"]);

            // Formatiramo u dd.mm.yyyy
            let formattedDate = date.toLocaleDateString("sr-RS", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
            });

            cell5.textContent = formattedDate;
            newRow.appendChild(cell5);

            table.appendChild(newRow);
        });
    }
}
document.addEventListener("DOMContentLoaded", get);