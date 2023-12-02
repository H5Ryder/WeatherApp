//Text input variable
let searchCity = "London";
let apiKey_weather = "feb541b0203f47c1b4b192748230212";
let cityObject = {};
// Call the getWeather function with searchCity and apiKey_weather
let loadData = getWeather(searchCity, apiKey_weather);
loadData
  .then((city) => {
    let sentence = convertWeatherToSentence(city);
    textTypingEffect(document.querySelector(".update"), sentence);
  })
  .catch((error) => {});


// Get the form and input element
const form = document.querySelector("form");
const input = document.querySelector('input[name="search"]');

//Event listener for input
input.addEventListener("input", function () {
  this.setCustomValidity("");
});

// Add event listener to form submission
form.addEventListener("submit", (event) => {
  event.preventDefault(); // Prevent form submission
  input.disabled = true;

  searchCity = input.value;

  cityObject = getWeather(searchCity, apiKey_weather);

  cityObject
    .then((cityObject) => {
      console.log(`Success ${cityObject.country}`);

      let updateText = document.querySelector(".update");
        updateText.textContent = "";

      let sentence = convertWeatherToSentence(cityObject);

      textTypingEffect(updateText, sentence).then(() => {
        input.disabled = false;
        console.log("done");
      });
    })
    .catch((error) => {
      console.error(`Error: ${error}`);
      input.disabled = false;
      input.setCustomValidity("No city found.");
    });
});

async function getWeather(city, apiKey) {
  const call = `http://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=1&aqi=no&alerts=no`;
  console.log(call);
  try {
    const response = await fetch(call, { mode: "cors" });

    if (response.status !== 200) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const weatherData = await response.json();


    console.log(weatherData);
    const temperature = weatherData.forecast.forecastday[0].day.avgtemp_c;
    const country = weatherData.location.country;
    const city = weatherData.location.name;
    const wind = weatherData.forecast.forecastday[0].day.maxwind_mph;
    const humidity = weatherData.forecast.forecastday[0].day.avghumidity;
    const condition = weatherData.forecast.forecastday[0].day.condition.text;

    console.log(temperature, country, city, wind, humidity, condition);

    const weatherObject = {
      temperature,
      country,
      city,
      wind,
      humidity,
      condition,
    };

    return weatherObject;
  } catch (error) {
    console.log(error);
  }
}

function convertWeatherToSentence(cityObject) {
  let weatherSentence = `The weather in ${cityObject.city} is ${cityObject.condition} with a temperature of ${cityObject.temperature} degrees Fahrenheit, wind speed of ${cityObject.wind} mph, and humidity of ${cityObject.humidity}%.`;
  return weatherSentence;
}



function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

async function textTypingEffect(element, text) {
    let i = 0;
  
    while (i < text.length - 1) {
      element.textContent += text[i];
      i++;
      
      // Introduce a 20-second delay before the next iteration
      await delay(20);
    }
  }