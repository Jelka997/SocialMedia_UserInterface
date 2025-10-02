function initializeForm() {

  let submitBtn = document.querySelector("#submitBtn")
  submitBtn.addEventListener("click", submit)

  let cancelBtn = document.querySelector("#cancelBtn")
  cancelBtn.addEventListener("click", function () {
    window.location.href = '../index.html'
  })

  get()
}

function get() {

  const urlParams = new URLSearchParams(window.location.search)
  const id = urlParams.get('id') // Preuzimamo vrednost id parametra upita

  if (!id) { // Ako ne postoji parametar upita, ne dobavljamo knjigu
    return
  }

  fetch('http://localhost:32307/api/users/' + id)
    .then(response => {
      if (!response.ok) {
        // Ako statusni kod nije iz 2xx (npr. 404), kreiramo grešku
        const error = new Error('Request failed. Status: ' + response.status)
        error.response = response // Dodajemo ceo response objekat u grešku
        throw error  // Bacamo grešku
      }
      return response.json()
    })
    .then(user => { // Ako je zahtev uspešan, popunjavamo polja sa podacima
      document.querySelector('#username').value = user.Username
      document.querySelector('#name').value = user.Name
      document.querySelector('#lastName').value = user.LastName
      document.querySelector('#birthday').value = user.Birthday
    })
    .catch(error => {
      console.error('Error:', error.message)
      if (error.response && error.response.status === 404) {
        alert('User does not exist!')
      } else {
        alert('An error occurred while loading the data. Please try again.')
      }
    })
}

function submit() {
  const form = document.querySelector('#form')
  const formData = new FormData(form)

  const reqBody = {
    Username: formData.get('username'),
    Name: formData.get('name'),
    LastName: formData.get('lastName'),
    Birthday: formData.get('birthday')
  }

  const usernameErrorMessage = document.querySelector('#usernameError')
  usernameErrorMessage.textContent = ''
  const nameErrorMessage = document.querySelector('#nameError')
  nameErrorMessage.textContent = ''
  const lastNameErrorMessage = document.querySelector('#lastNameError')
  lastNameErrorMessage.textContent = ''
  const birthdayErrorMessage = document.querySelector('#birthdayError')
  birthdayErrorMessage.textContent = ''

  if (reqBody.Username.trim() === '') { // Validacije da uneti podaci nisu prazni
    usernameErrorMessage.textContent = 'Name field is required.'
    return
  }
  if (reqBody.Name.trim() === '') { // Validacije da uneti podaci nisu prazni
    nameErrorMessage.textContent = 'Name field is required.'
    return
  }
 if (reqBody.LastName.trim() === '') { // Validacije da uneti podaci nisu prazni
    lastNameErrorMessage.textContent = 'Name field is required.'
    return
  }
  if (reqBody.Birthday.trim() === '') { // Validacije da uneti podaci nisu prazni
    birthdayErrorMessage.textContent = 'Name field is required.'
    return
  }

  let method = 'POST'
  let url = 'http://localhost:32307/api/users'
  // Odluka da li je POST ili PUT spram id-ja
  const urlParams = new URLSearchParams(window.location.search)
  const id = urlParams.get('id')
  if (id) {
    method = 'PUT'
    url = 'http://localhost:32307/api/users/' + id
  }

  fetch(url, {
    method: method,
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(reqBody)
  })
    .then(response => {
      if (!response.ok) {
        // Ako statusni kod nije iz 2xx (npr. 404), kreiramo grešku
        const error = new Error('Request failed. Status: ' + response.status)
        error.response = response // Dodajemo ceo response objekat u grešku
        throw error  // Bacamo grešku
      }
      return response.json()
    })
    .then(data => {
      window.location.href = '../index.html'
    })
    .catch(error => {
      console.error('Error:', error.message)
      // Bitna provera ako je u pitanju ažuriranje knjige
      if (error.response && error.response.status === 404) {
        alert('Book does not exist!')
      }
      else if (error.response && error.response.status === 400) {
        alert('Data is invalid!')
      }
      else {
        alert('An error occurred while updating the data. Please try again.')
      }
    })
}

document.addEventListener('DOMContentLoaded', initializeForm)
