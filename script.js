//Text input variable
let searchCity = "London";
let apiKey_weather = "feb541b0203f47c1b4b192748230212";
let cityObject = {};

//Get the mouse position
document.documentElement.style.setProperty('--mouse-x', "50%" );
document.documentElement.style.setProperty('--mouse-y', "50%" );

 let loadData = getWeather(searchCity, apiKey_weather);
 loadData.then((city) => {
     let sentence = convertWeatherToSentence(city);
     typingEffect(city);
   }).catch((error) => {});


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

    
      let sentence = convertWeatherToSentence(cityObject);
      typingEffect(cityObject).then(() => input.disabled = false);
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


  document.addEventListener('mousemove', function(event) {


    const winWidth = window.innerWidth;
    const winHeight = window.innerHeight;

    const mouseX = Math.round((event.pageX/winWidth)*100);
    const mouseY = Math.round((event.pageY/winHeight)*100);

    document.documentElement.style.setProperty('--mouse-x', mouseX.toString()+"%" );
    document.documentElement.style.setProperty('--mouse-y', mouseY.toString()+"%" );




});



async function typingEffect(cityObject) {

  
  //Create array of all span elements in the sequential order
  let textArray = callSpanText();

  //Clear the previous text
  removeText(textArray);

  //Array of text to be inputted into the span elements
  let textContent = createContent(cityObject);

 

  // Assuming textTypingEffect returns a Promise
  typeAllTexts(textArray, textContent);

}


async function typeAllTexts(textArray, textContent) {
  for (let i = 0; i < textArray.length; i++) {
      await textTypingEffect(textArray[i], textContent[i]);
  }
}


function callSpanText() {
  const rowOne = document.querySelector('.row.one');
  const rowOneElements = Array.from(rowOne.children);

  const rowTwo = document.querySelector('.row.two');
  const rowTwoElements = Array.from(rowTwo.children);

  const combinedArray = [...rowOneElements, ...rowTwoElements];
  return combinedArray;
}

function removeText(combinedArray) {
  combinedArray.forEach(element => {
    element.textContent = "";
  });
}

function createContent(cityObject) {
  let txtOutput = new Array(13);

  txtOutput[0] = "The weather in ";
  txtOutput[1] = `${cityObject.city}, ${cityObject.country} `;
  txtOutput[2] = "is ";
  txtOutput[3] = `${cityObject.condition} `;
  txtOutput[4] = "with a temperature of ";
  txtOutput[5] = `${cityObject.temperature} `;
  txtOutput[6] = "\u2103 ";
  txtOutput[7] = ",";
  txtOutput[8] = "wind speed of ";
  txtOutput[9] = cityObject.wind + "mph ";
  txtOutput[10] = ", and";
  txtOutput[11] = `${cityObject.humidity}% `;
  txtOutput[12] = "humidity. ";

  return txtOutput;
}


