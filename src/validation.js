//import axios from "axios";
function validTravel(result) {
  if (result.tripID > 0) {
    return result.tripID;
  }
  if (result.tripID == -1) {
    return document.querySelector('#errorOfVehicle').textContent = 'Vehicle number not found!';
  }
  if (result.tripID == -2) {
    return document.querySelector('#errorOfUser').textContent = 'Username or Email not found!';
  }
  if (result.tripID == -3) {
    return document.querySelector('#errorOfShip').textContent = 'Driver not registered in this vehicle';
  }

}


async function sendDetailsOfTravel(details) {
  try {
    const resp = await fetch("http://localhost:3000/addTravel", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(details),
    });
    const data = await resp.json();
    return data;
  } catch (err) {
    console.error(err);
  }
}

document.querySelector('#but').addEventListener('click', function () {
  const usernameEmail = document.querySelector('#username-or-email').value;
  const vehicleNumber = document.querySelector('#vehicle-number').value;
  document.querySelector('#errorOfVehicle').textContent = '';
  document.querySelector('#errorOfUser').textContent = '';
  document.querySelector('#errorOfShip').textContent = '';

  // validate the inputs here
  if (usernameEmail === '') {
    document.querySelector('#errorOfUser').textContent = 'Username or Email is required';
  } else if (vehicleNumber === '') {
    document.querySelector('#errorOfVehicle').textContent = 'Vehicle number is required';
  } else {

    const details = {
      userNameOrEmail: usernameEmail,
      numVehicle: vehicleNumber
    };
    sendDetailsOfTravel(details).then(res => {
      console.log(validTravel(res));


    });

  }
});




