const loader = document.querySelector(".loader");
const header = document.querySelector("header");
const logo = document.querySelector(".logo");
const logoIcon = logo.querySelector(".icon");
const report = document.querySelector(".reportWrapper");
const errorMsg = document.querySelector(".errMsg");
const errPoster = document.querySelector(".errPoster");
const message = document.querySelector(".msg");
const searchIcon = document.querySelector(".search");
const searchForm = document.querySelector(".searchForm");
let searchKey = document.getElementById("searchKey");
const animation = document.querySelector(".weatherAnimation");
const API_KEY = "1bd9d99c41a87dd60a14cf24c90be04e";
const GEO_API = "dfe46633243e4b50b632c4483936d5a5";

const unitToggle = document.querySelector(".switch__input");

logo.addEventListener("mouseover", () => {
  logoIcon.querySelector("img").src = `./assets/icons/misc/day.svg`;
});
logo.addEventListener("mouseleave", () => {
  logoIcon.querySelector("img").src = `./assets/icons/day(static).svg`;
});

// Data Manpulation

const getAnimation = (weather) => {
  if (weather == "Clear") {
    animation.src = `./assets/icons/misc/day.svg`;
  } else if (weather == "Clouds") {
    animation.src = `./assets/icons/cloudy/cloudy.svg`;
  } else if (weather == "Rainy") {
    animation.src = `./assets/icons/rainy/rainy-7.svg`;
  } else if (weather == "Thunder") {
    animation.src = `./assets/icons/misc/thunder.svg`;
  } else if (weather == "Snow") {
    animation.src = `./assets/icons/snowy/snowy-6.svg`;
  } else {
    console.log("no data found");
  }
};
const loaderAnimation = () => {
  loader.style.display = "flex";
  setTimeout(() => {
    loader.style.display = "none";
  }, 4000);
};

const unitConversion = (data) => {
  return (data * 9) / 5 + 32;
};

const unitMode = async (data) => {
  unitToggle.addEventListener("click", (e) => {
    if (unitToggle.value == "C") {
      document.querySelector(".switch__slider").setAttribute("data-value", "F");
      unitToggle.value = "F";
      document.querySelector(".feels").innerHTML = `${Math.round(
        unitConversion(data.main.feels_like)
      )}°F`;
      document.querySelector(".mainTemp").innerHTML =
        Math.round(unitConversion(data.main.temp)) + "°F";
      document.querySelector(".min").innerHTML = `${Math.floor(
        unitConversion(data.main.temp_min)
      )}°F`;
      document.querySelector(".max").innerHTML = `${Math.ceil(
        unitConversion(data.main.temp_max)
      )}°F`;
    } else {
      unitToggle.value = "C";
      document.querySelector(".switch__slider").setAttribute("data-value", "C");
      document.querySelector(".feels").innerHTML = `${Math.round(
        data.main.feels_like
      )}°C`;
      document.querySelector(".mainTemp").innerHTML =
        Math.round(data.main.temp) + "°C";
      document.querySelector(".min").innerHTML = `${Math.floor(
        data.main.temp_min
      )}°C`;
      document.querySelector(".max").innerHTML = `${Math.ceil(
        data.main.temp_max
      )}°C`;
    }
  });
};
const getWeather = (data) => {
  loaderAnimation();
  errorMsg.style.display = "none";
  report.style.display = "block";
  document.querySelector(".location").innerHTML = `
    ${data.name} (${data.sys.country})`;
  getAnimation(data.weather[0].main);
  unitToggle.value = "C";
  document.querySelector(".feels").innerHTML = `${Math.round(
    data.main.feels_like
  )}°C`;
  document.querySelector(".mainTemp").innerHTML =
    Math.round(data.main.temp) + "°C";
  document.querySelector(".min").innerHTML = `${Math.floor(
    data.main.temp_min
  )}°C`;
  document.querySelector(".max").innerHTML = `${Math.ceil(
    data.main.temp_max
  )}°C`;
  unitMode(data);
  document.querySelector(".weather").innerHTML = data.weather[0].main;
  document.querySelector(".humidity").innerHTML = `${data.main.humidity}%`;
  document.querySelector(".pressure").innerHTML = `${data.main.pressure} bar`;
  document.querySelector(".wind").innerHTML = `${data.wind.speed} km/h`;
};
const accessDenied = () => {
  loaderAnimation();
  errorMsg.style.display = "flex";
  report.style.display = "none";
  header.classList.add("expand");
  searchForm.classList.add("open");
};
const accessGranted = () => {
  loaderAnimation();
  errorMsg.style.display = "none";
  report.style.display = "block";
  header.classList.remove("expand");
  searchForm.classList.remove("open");
};
const getLocation = async (position) => {
  const { latitude, longitude } = position.coords;
  await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${API_KEY}`
  )
    .then((res) => res.json())
    .then((data) => {
      loaderAnimation();
      getWeather(data);
    });
};
const notFound = () => {
  loaderAnimation();
  errorMsg.style.display = "flex";
  report.style.display = "none";
  errPoster.src = `./assets/icons/exclamation.svg`;
  message.innerHTML = `Invalid Location .. No Match Found`;
};
window.addEventListener("load", async (e) => {
  if (GeolocationPositionError.PERMISSION_DENIED) {
    accessDenied();
  }
  if (navigator.geolocation) {
    accessGranted();
    navigator.geolocation.getCurrentPosition(getLocation, console.log);
  }
});

//Event Handling

searchIcon.addEventListener("click", (e) => {
  header.classList.toggle("expand");
  searchForm.classList.toggle("open");
});
searchForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const searchKey = document.getElementById("searchKey");
  if (!searchKey.value) {
    return;
  } else {
    await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${searchKey.value}&units=metric&appid=${API_KEY}`
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.cod == "404") {
          notFound();
        } else {
          getWeather(data);
        }
      });
    searchKey.value = "";
    header.classList.remove("expand");
    searchForm.classList.remove("open");
  }
});
