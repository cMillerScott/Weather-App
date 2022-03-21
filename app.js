window.addEventListener("load", () => {


  //  navigation animation

  const navTabs = document.querySelectorAll(".navTab");

  navTabs.forEach((container) => {
    const navContainer = container.querySelector(".navContainer"),
      text = container.querySelector(".text");

    const toggleTab = gsap.timeline({
      reversed: true,
      paused: true,
      defaults: { duration: 1.5, ease: "elastic.out(0.7, 0.3)" },
    });

    toggleTab
      .from(navContainer, { width: "8rem" })
      .from(text, { rotation: "-90deg" }, "<");

    container.addEventListener("mouseenter", () => toggleTab.play());
    container.addEventListener("mouseleave", () => toggleTab.reverse());
    // container.addEventListener("click", () => toggleTab.pause());
  });

  // variables for weather api

  let long;
  let lat;

  let location = document.querySelector(".location-heading");
  let temp = document.querySelector(".temp");
  let wind = document.querySelector(".wind");
  let summary = document.querySelector(".summary");

  // get device location

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      long = position.coords.longitude;
      lat = position.coords.latitude;

      // first weather api call

      const apiLocation = fetch(`https://api.weather.gov/points/${lat},${long}`)
        .then((responseOne) => {
          if (responseOne.status == 200) {
            console.log(responseOne.status)
            return responseOne.json();
          } else if (responseOne.status == 503) {
            location.textContent = `Current Weather Conditions Are Currently Unavailable`;
            return responseOne.json();
          }
        })
        .then((locationData) => {
          
          const { city, state } =
            locationData.properties.relativeLocation.properties;
            location.textContent = `Current Weather Conditions For ${city}, ${state}`;

          // second weather api call

          return fetch(locationData.properties.forecastHourly)
            .then((responseTwo) => {

              if (responseTwo.ok) {
                console.log(responseTwo.status)
                return responseTwo.json();
              } else if (responseTwo.status == 503) {
                location.textContent = `Current Weather Conditions Are Unavailable At This Time`;
              }
            })
            .then((forecastData) => {
              const {
                temperature,
                windSpeed,
                windDirection,
                shortForecast,
              } = forecastData.properties.periods[0];

              temp.textContent = `${temperature} F`;
              wind.textContent = `${windSpeed} from the ${windDirection}`;
              summary.textContent = shortForecast;
            });
        });
    });
  }
});
