/* Global Variables */
// Personal API Key for OpenWeatherMap API
const baseUrl = "http://api.openweathermap.org/data/2.5/forecast?id=";
const apiKey = "&appid=1c7d736884af7244d7a60075ea385b4a&units=imperial";

// Create a new date instance dynamically with JS
let d = new Date();
let newDate = d.getMonth() + 1 + "." + d.getDate() + "." + d.getFullYear();

document.getElementById("generate").addEventListener("click", genMethod);

function genMethod(e) {
  const zip = document.getElementById("zip").value;
  try {
    getWeather(baseUrl, zip, apiKey).then((data) => {
      if (data.cod === "200") {
        const userResp = document.getElementById("feelings").value;
        postData("/add", {
          temp: data.list[0].main.temp,
          feel: userResp,
          date: newDate,
        });
        retrieveDataAndUpdateUI();
      } else {
        console.log(data.message);
      }
    });
  } catch (error) {
    console.log("error", error);
  }
}

const getWeather = async (baseURL, zip, key) => {
  try {
    const res = await fetch(baseURL + zip + key);
    const data = await res.json();
    return data;
  } catch (error) {
    console.log("error", error);
  }
};

const retrieveDataAndUpdateUI = async () => {
  const resp = await fetch("/all");
  try {
    // Transform into JSON
    const allData = await resp.json();
    // Write updated data to DOM elements
    document.getElementById("temp").innerHTML =
      Math.round(allData.temp) + " degrees";
    document.getElementById("content").innerHTML = allData.feel;
    document.getElementById("date").innerHTML = allData.date;
  } catch (error) {
    console.log("error", error);
  }
};

const postData = async (url = "", data = {}) => {
  const response = await fetch(url, {
    method: "POST",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  try {
    const newData = await response.json();
    return newData;
  } catch (error) {
    console.log("error", error);
  }
};
