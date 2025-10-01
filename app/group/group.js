function getAll() {
  fetch("http://localhost:5014/api/groups") // Pravi GET zahtev da dobavi sve grupe sa servera
    .then((response) => {
      if (!response.ok) {
        // Ako se vrati statusni kod koji nije iz 2xx, tretiraj kao grešku
        throw new Error("Request failed. Status: " + response.status);
      }
      return response.json();
    })
    .then((groups) => renderData(groups)) // Ako su podaci ispravni, prikaži ih u HTMLu
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
    data.forEach((group) => {
      let newRow = document.createElement("tr");

      let cell1 = document.createElement("td");
      cell1.textContent = group["id"];
      newRow.appendChild(cell1);

      let cell2 = document.createElement("td");
      cell2.textContent = group["name"];
      newRow.appendChild(cell2);

      let cell3 = document.createElement("td");
      let date = new Date(group["dateCreated"]);

      // Formatiramo u dd.mm.yyyy
      let formattedDate = date.toLocaleDateString("sr-RS", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });

      cell3.textContent = formattedDate;
      newRow.appendChild(cell3);

      // Kreiranje ćelije za dugme "Delete"
      let cell4 = document.createElement("td");
      let deleteButton = document.createElement("button");
      deleteButton.textContent = "Obrisi";
      deleteButton.addEventListener("click", function () {
        fetch("http://localhost:5014/api/groups/" + group["id"], {
          method: "DELETE",
        })
          .then((response) => {
            if (!response.ok) {
              // Ako statusni kod nije iz 2xx (npr. 404), kreiramo grešku
              const error = new Error(
                "Request failed. Status: " + response.status
              );
              error.response = response; // Dodajemo ceo response objekat u grešku
              throw error; // Bacamo grešku
            }
            getAll(); // Ponovo učitaj podatke nakon brisanja
          })
          .catch((error) => {
            console.error("Error:", error.message);
            if (error.response && error.response.status === 404) {
              alert("Group does not exist!");
            } else {
              alert(
                "An error occurred while deleting the group. Please try again."
              );
            }
          });
      });
      cell4.appendChild(deleteButton);
      newRow.appendChild(cell4);

      table.appendChild(newRow);
    });
  }
}

document.addEventListener("DOMContentLoaded", getAll);
