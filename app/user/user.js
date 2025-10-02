function getAll() {
  fetch("http://localhost:32307/api/users") // Pravi GET zahtev da dobavi sve grupe sa servera
    .then((response) => {
      if (!response.ok) {
        // Ako se vrati statusni kod koji nije iz 2xx, tretiraj kao grešku
        throw new Error("Request failed. Status: " + response.status);
      }
      return response.json();
    })
    .then((users) => renderData(users)) // Ako su podaci ispravni, prikaži ih u HTMLu
    .catch((error) => {
      // Ako podaci nisu ispravni, sakrij tabelu i prikaži poruku o grešci
      console.error("Error:", error.message);
      // Sakrij tabelu
      let table = document.querySelector("table");
      if (table) {
        table.style.display = "none";
      }
      // Prikaži poruku o grešci
      alert("An error occurred while loading the data. Please try again.");
    });
}

function renderData(data) {
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
      // Kreiranje ćelije za dugme "Edit"
      let cell6 = document.createElement('td')
      let editButton = document.createElement('button')
      editButton.textContent = 'Edit'
      editButton.addEventListener('click', function () {
        window.location.href = '../userForm/userForm.html?id=' + user['id']
      })
      cell6.appendChild(editButton)
      newRow.appendChild(cell6)

      table.appendChild(newRow);
    });
  }
}

document.addEventListener("DOMContentLoaded", getAll);