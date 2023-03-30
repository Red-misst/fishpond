//update live data on the  page
const temp = document.getElementById("live-temp");
const turb = document.getElementById("live-turb");
const water_lvl = document.getElementById("live-lvl");
const tableBody = document.getElementById("t-body");
const pumpInButton = document.getElementById("pumpIn");
const pumpOutButton = document.getElementById("pumpOut");
const downloadData = document.getElementById("report");

// handle the pump buttons click
//pump in button
pumpInButton.addEventListener("click", (event) => {
  console.log(event);
  if (event.target.innerText == "Activate intlet pump") {
    if( pumpOutButton.innerText == "Deactivate outlet pump"){
      pumpOutButton.innerText = "Activate outlet pump";
      fetch("/deactivate-outlet",{method: "POST"})
        .then((response) => {
          console.log(response);
        })
        .catch((error) => {
          console.error(error);
        });
    }
    pumpInButton.innerText = "Deactivate inlet pump";
    fetch("/activate-inlet",{method: "POST"})
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.error(error);
      });
  } else {
    pumpInButton.innerText = "Activate intlet pump";
    fetch("/deactivate-inlet",{method: "POST"})
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.error(error);
      });
  }
});

// pump out button
pumpOutButton.addEventListener("click", (event) => {
  console.log(event);
  if (event.target.innerText == "Activate outlet pump") {
    if( pumpInButton.innerText == "Deactivate inlet pump"){
      pumpInButton.innerText = "Activate inlet pump";
      fetch("/deactivate-inlet",{method: "POST"})
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.error(error);
      });
    }
    pumpOutButton.innerText = "Deactivate outlet pump";
    fetch("/activate-outlet",{method: "POST"})
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.error(error);
      });
  } else {
    pumpOutButton.innerText = "Activate outlet pump";
    fetch("/deactivate-outlet",{method: "POST"})
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.error(error);
      });
  }
});

// //automatically update the button
// setInterval(() => {
//   fetch("/data", {
//     method: "POST",
//   })
//     .then((response) => {
//       console.log(response);
//     })
//     .then((data) => {
//       var pumpActivated = data.pumpActivated;
//       var currentTxt = pumpInButton.innerText;
//       if (!pumpActivated && currentTxt == "Deactivate pump") {
//         pumpButton.innerText = "Deactivate pump";
//       } else if (pumpActivated && currentTxt == "Activate pump") {
//         pumpButton.innerText = "Deactivate pump";
//       }
//     })
//     .catch((error) => {
//       console.error(error);
//     });
// }, 1000);
// graph part
const temperatureChartCtx = document
  .getElementById("temperatureChart")
  .getContext("2d");
const temperatureChart = new Chart(temperatureChartCtx, {
  type: "line",
  data: {
    labels: [],
    datasets: [
      {
        label: "Temperature (°C)",
        data: [],
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
    ],
  },
  options: {
    responsive: true,
    scales: {
      y: {
        beginAtZero: false,
      },
    },
  },
});

const turbidityChartCtx = document
  .getElementById("turbidityChart")
  .getContext("2d");
const turbidityChart = new Chart(turbidityChartCtx, {
  type: "line",
  data: {
    labels: [],
    datasets: [
      {
        label: "Turbidity (NTU)",
        data: [],
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
    ],
  },
  options: {
    responsive: true,
    scales: {
      y: {
        beginAtZero: false,
      },
    },
  },
});

//Updates charts and the readings and the button text
function updateCharts() {
  fetch("/data")
    .then((response) => response.json())
    .then((data) => {
      //extracts the readings
      var temp_live = data.temperature[data.temperature.length - 1];
      var turbidity_live = data.turbidity[data.turbidity.length - 1];
      var water_lvl_live = data.waterLevel;

      // Add the latest data to the chart datasets
      temperatureChart.data.labels.push(data.time);
      temperatureChart.data.datasets[0].data.push(
        data.temperature[data.temperature.length - 1]
      );
      turbidityChart.data.labels.push(data.time);
      turbidityChart.data.datasets[0].data.push(
        data.turbidity[data.turbidity.length - 1]
      );

      // Remove the oldest data from the chart datasets if they exceed 20 points
      if (temperatureChart.data.labels.length > 20) {
        temperatureChart.data.labels.shift();
        temperatureChart.data.datasets[0].data.shift();
        turbidityChart.data.labels.shift();
        turbidityChart.data.datasets[0].data.shift();
      }

      // Update the charts
      temperatureChart.update();
      turbidityChart.update();

      //update the data
      water_lvl.innerHTML = water_lvl_live;
      temp.innerHTML = temp_live + "&deg;C";
      turb.innerHTML = turbidity_live;
    })
    .catch((error) => console.error(error));
}
setInterval(updateCharts, 4000);

function updateTable() {
  fetch("/data")
    .then((response) => response.json())
    .then((data) => {
      // Create a new table row element
      const tr = document.createElement("tr");

      // Add a cell for each data property
      const td1 = document.createElement("td");
      td1.innerText = data.time;
      const td2 = document.createElement("td");
      td2.innerHTML = data.temperature[data.temperature.length - 1] + "&deg;C";
      const td3 = document.createElement("td");
      td3.innerText = data.turbidity[data.turbidity.length - 1];
      const td4 = document.createElement("td");
      td4.innerText = data.waterLevel;

      // Add the cells to the row
      tr.appendChild(td1);
      tr.appendChild(td2);
      tr.appendChild(td3);
      tr.appendChild(td4);

      // Add the new row to the top of the table body
      tableBody.insertBefore(tr, tableBody.firstChild);

      // If there are more than f rows in the table body, remove the last row
      while (tableBody.children.length > 4) {
        tableBody.removeChild(tableBody.lastChild);
      }
    })
    .catch((error) => console.error(error));
}

// Update the charts every 2 seconds

setInterval(updateTable, 60000);
