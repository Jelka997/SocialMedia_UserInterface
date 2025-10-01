let cancelBtn = document.querySelector("#cancelBtn");
cancelBtn.addEventListener("click", function () {
  window.location.href = "../index.html";
});

let submitBtn = document.querySelector("#submitBtn");
submitBtn.addEventListener("click", function () {
  const form = document.querySelector("#form");
  const formData = new FormData(form);

  const reqBody = {
    name: formData.get("name"),
    dateCreated: new Date().toISOString(),
  };

  const nameErrorMessage = document.querySelector("#nameError");
  nameErrorMessage.textContent = "";

  if (reqBody.name.trim() === "") {
    // Validacije da uneti podaci nisu prazni
    nameErrorMessage.textContent = "Name field is required.";
    return;
  }

  fetch("http://localhost:5014/api/groups", {
    // Pravi POST zahtev da se sačuva grupa
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(reqBody),
  })
    .then((response) => {
      if (!response.ok) {
        // Ako statusni kod nije iz 2xx (npr. 400), kreiramo grešku
        const error = new Error("Request failed. Status: " + response.status);
        error.response = response; // Dodajemo ceo response objekat u grešku
        throw error; // Bacamo grešku
      }
      return response.json();
    })
    .then((data) => {
      window.location.href = "../group/group.html";
    })
    .catch((error) => {
      console.error("Error:", error.message);
      if (error.response && error.response.status === 400) {
        alert("Data is invalid!");
      } else {
        alert("An error occurred while updating the data. Please try again.");
      }
    });
});
