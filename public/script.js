// SIDEBAR DROPDOWN
const allDropdown = document.querySelectorAll("#sidebar .side-dropdown");
const sidebar = document.getElementById("sidebar");

allDropdown.forEach((item) => {
  const a = item.parentElement.querySelector("a:first-child");
  a.addEventListener("click", function (e) {
    e.preventDefault();

    if (!this.classList.contains("active")) {
      allDropdown.forEach((i) => {
        const aLink = i.parentElement.querySelector("a:first-child");

        aLink.classList.remove("active");
        i.classList.remove("show");
      });
    }

    this.classList.toggle("active");
    item.classList.toggle("show");
  });
});

// SIDEBAR COLLAPSE
const toggleSidebar = document.querySelector("nav .toggle-sidebar");
const allSideDivider = document.querySelectorAll("#sidebar .divider");

if (sidebar.classList.contains("hide")) {
  allSideDivider.forEach((item) => {
    item.textContent = "-";
  });
  allDropdown.forEach((item) => {
    const a = item.parentElement.querySelector("a:first-child");
    a.classList.remove("active");
    item.classList.remove("show");
  });
} else {
  allSideDivider.forEach((item) => {
    item.textContent = item.dataset.text;
  });
}

toggleSidebar.addEventListener("click", function () {
  sidebar.classList.toggle("hide");

  if (sidebar.classList.contains("hide")) {
    allSideDivider.forEach((item) => {
      item.textContent = "-";
    });

    allDropdown.forEach((item) => {
      const a = item.parentElement.querySelector("a:first-child");
      a.classList.remove("active");
      item.classList.remove("show");
    });
  } else {
    allSideDivider.forEach((item) => {
      item.textContent = item.dataset.text;
    });
  }
});

sidebar.addEventListener("mouseleave", function () {
  if (this.classList.contains("hide")) {
    allDropdown.forEach((item) => {
      const a = item.parentElement.querySelector("a:first-child");
      a.classList.remove("active");
      item.classList.remove("show");
    });
    allSideDivider.forEach((item) => {
      item.textContent = "-";
    });
  }
});

sidebar.addEventListener("mouseenter", function () {
  if (this.classList.contains("hide")) {
    allDropdown.forEach((item) => {
      const a = item.parentElement.querySelector("a:first-child");
      a.classList.remove("active");
      item.classList.remove("show");
    });
    allSideDivider.forEach((item) => {
      item.textContent = item.dataset.text;
    });
  }
});

// PROFILE DROPDOWN
const profile = document.querySelector("nav .profile");
const imgProfile = profile.querySelector("img");
const dropdownProfile = profile.querySelector(".profile-link");

imgProfile.addEventListener("click", function () {
  dropdownProfile.classList.toggle("show");
});

// MENU
const allMenu = document.querySelectorAll("main .content-data .head .menu");

allMenu.forEach((item) => {
  const icon = item.querySelector(".icon");
  const menuLink = item.querySelector(".menu-link");

  icon.addEventListener("click", function () {
    menuLink.classList.toggle("show");
  });
});

window.addEventListener("click", function (e) {
  if (e.target !== imgProfile) {
    if (e.target !== dropdownProfile) {
      if (dropdownProfile.classList.contains("show")) {
        dropdownProfile.classList.remove("show");
      }
    }
  }

  allMenu.forEach((item) => {
    const icon = item.querySelector(".icon");
    const menuLink = item.querySelector(".menu-link");

    if (e.target !== icon) {
      if (e.target !== menuLink) {
        if (menuLink.classList.contains("show")) {
          menuLink.classList.remove("show");
        }
      }
    }
  });
});

// PROGRESSBAR
const allProgress = document.querySelectorAll("main .card .progress");

allProgress.forEach((item) => {
  item.style.setProperty("--value", item.dataset.value);
});

// //update live data on the  page
const temp = document.getElementById("live-temp");
const turb = document.getElementById("live-turb");
const water_lvl = document.getElementById("live-lvl");
const temp_1 = document.getElementById("temp-1");
const turb_1 = document.getElementById("turb-1");
const water_lvl_1 = document.getElementById("water-lvl-1");
const pumpInButton = document.getElementById("pumpIn");
const pumpOutButton = document.getElementById("pumpOut");
const downloadData = document.getElementById("report");
const button_1 = document.getElementById("charts_link");
// handle the pump buttons click
//pump in button
pumpInButton.addEventListener("click", (event) => {
  console.log(event);
  if (event.target.innerText == "Activate intlet pump") {
    if (pumpOutButton.innerText == "Deactivate outlet pump") {
      pumpOutButton.innerText = "Activate outlet pump";
      fetch("/deactivate-outlet", { method: "POST" })
        .then((response) => {
          console.log(response);
        })
        .catch((error) => {
          console.error(error);
        });
    }
    pumpInButton.innerText = "Deactivate inlet pump";
    fetch("/activate-inlet", { method: "POST" })
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.error(error);
      });
  } else {
    pumpInButton.innerText = "Activate intlet pump";
    fetch("/deactivate-inlet", { method: "POST" })
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
    if (pumpInButton.innerText == "Deactivate inlet pump") {
      pumpInButton.innerText = "Activate inlet pump";
      fetch("/deactivate-inlet", { method: "POST" })
        .then((response) => {
          console.log(response);
        })
        .catch((error) => {
          console.error(error);
        });
    }
    pumpOutButton.innerText = "Deactivate outlet pump";
    fetch("/activate-outlet", { method: "POST" })
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.error(error);
      });
  } else {
    pumpOutButton.innerText = "Activate outlet pump";
    fetch("/deactivate-outlet", { method: "POST" })
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.error(error);
      });
  }
});

// get canvas element
const turbidityCanvas = document.getElementById("turbChart").getContext("2d");
const tempCanvas = document.getElementById("tempChart").getContext("2d");

// initialize temp chart options
const tempChartOptions = {
  type: "line",
  height: 800,
  data: {
    labels: [],
    datasets: [
      {
        label: "Temperature(C)",
        data: [],
        borderColor: "red",
        fill: false,
      },
    ],
  },
  options: {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "Temperature",
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Time",
        },
      },
      y: {
        beginAtZero: false,
        title: {
          display: true,
          text: "Value",
        },
      },
    },
  },
};

// initialize Turbiditychart options
const turbidityChartOptions = {
  type: "line",
  data: {
    labels: [],
    datasets: [
      {
        label: "Turbidity(NTU)",
        data: [],
        borderColor: "blue",
        fill: false,
      },
    ],
  },
  options: {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "Turbidity",
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Time",
        },
      },
      y: {
        beginAtZero: false,
        title: {
          display: true,
          text: "Value",
        },
      },
    },
  },
};

// initialize chart
const chartTurb = new Chart(turbidityCanvas, turbidityChartOptions);
const chartTemp = new Chart(tempCanvas, tempChartOptions);

// update chart data from server every 4 seconds
function updateCharts() {
  fetch("/data")
    .then((response) => response.json())
    .then((data) => {
      // add new data to chart

      chartTemp.data.datasets[0].data.push(
        data.temperature[data.temperature.length - 1]
      );
      chartTurb.data.datasets[0].data.push(
        data.turbidity[data.turbidity.length - 1]
      );
      chartTemp.data.labels.push(data.time);
      chartTurb.data.labels.push(data.time);

      if (chartTemp.data.datasets[0].data.length > 20) {
        chartTemp.data.datasets[0].data.shift();
        chartTurb.data.datasets[0].data.shift();
        chartTemp.data.labels.shift();
        chartTurb.data.labels.shift();
      }
      // update chart
      chartTemp.update();
      chartTurb.update();
    })
    .catch((error) => console.error(error));
}

// update chart every 4 seconds
setInterval(updateCharts, 4000);

function updatedata() {
  fetch("/data")
    .then((response) => response.json())
    .then((data) => {
      const temp_data = data.temperature[data.temperature.length - 1];
      temp.innerText = temp_data;
      const turb_data = data.turbidity[data.turbidity.length - 1];
      turb.innerText = turb_data;
      const water_lvl_data = data.waterLevel;
      water_lvl.innerText = water_lvl_data;

      if (temp_data < 32 && temp_data > 24) {
        temp_1.innerText = "optimum";
        temp_1.style.backgroundColor = "#E3FFCB";
        temp_1.style.color = "#81D43A";
      } else {
        temp_1.innerText = "Suboptimal";
        temp_1.style.backgroundColor = "#FFD9E0";
        temp_1.style.color = "#FC3B56";
      }

      if (turb_data < 25) {
        turb_1.innerText = "optimum";
        turb_1.style.backgroundColor = "#E3FFCB";
        turb_1.style.color = "#81D43A";
      } else {
        turb_1.innerText = "Suboptimal";
        turb_1.style.backgroundColor = "#FFD9E0";
        turb_1.style.color = "#FC3B56";
      }
      if (water_lvl_data > 370) {
        water_lvl_1.innerText = "Overflow";
        water_lvl_1.style.backgroundColor = "#f3f7062c";
        water_lvl_1.style.color = "#ffee00";
      } else if (water_lvl_data > 200 && water_lvl_data < 370) {
        water_lvl_1.innerText = "optimum";
        water_lvl_1.style.backgroundColor = "#E3FFCB";
        water_lvl_1.style.color = "#81D43A";
      } else if (water_lvl_data < 200) {
        water_lvl_1.innerText = "Low";
        water_lvl_1.style.backgroundColor = "#FFD9E0";
        water_lvl_1.style.color = "#FC3B56";
      }
    })
    .catch((error) => console.error(error));
}

// Update the charts every 2 seconds

setInterval(updatedata, 1000);

// Get the table element
var tableBody = document.getElementById("t-body");



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


