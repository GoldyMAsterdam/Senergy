document.addEventListener('DOMContentLoaded', function() {
    function updateTime() {
        const now = new Date();
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        const month = months[now.getMonth()];
        const day = now.getDate();
        const year = now.getFullYear();
        
        let hours = now.getHours();
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : ' AM';
        
        hours = hours % 12;
        hours = hours ? hours : 12;
        
        const formattedTime = `${month} ${day}, ${year} at ${hours}:${minutes}${ampm}`;
        
        const timeElement = document.getElementById('current-time');
        if (timeElement) {
            timeElement.textContent = formattedTime;
        }
        
        const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const dayOfWeek = daysOfWeek[now.getDay()];
        const dayElement = document.getElementById('location-day');
        if (dayElement) {
            dayElement.textContent = dayOfWeek;
        }
    }
    
    updateTime();
    
    setInterval(updateTime, 1000);
    
    const tempUnitToggle = document.getElementById('temp-unit-toggle');
    const tempUnitDropdown = document.getElementById('temp-unit-dropdown');
    let currentUnit = 'celsius'; 
    
    if (tempUnitToggle) {
        tempUnitToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            tempUnitDropdown.classList.toggle('show');
        });
    }
    
    if (tempUnitDropdown) {
        const unitOptions = tempUnitDropdown.querySelectorAll('a');
        unitOptions.forEach(option => {
            option.addEventListener('click', function(e) {
                e.preventDefault();
                const selectedUnit = this.getAttribute('data-unit');
                currentUnit = selectedUnit;
                tempUnitDropdown.classList.remove('show');
                
                updateTemperatureDisplay(currentUnit);
            });
        });
    }
    
    document.addEventListener('click', function(e) {
        if (tempUnitDropdown && tempUnitDropdown.classList.contains('show')) {
            if (!tempUnitToggle.contains(e.target) && !tempUnitDropdown.contains(e.target)) {
                tempUnitDropdown.classList.remove('show');
            }
        }
    });
    
    function updateTemperatureDisplay(unit) {
        const temperatureElement = document.querySelector('main h3');
        const feelsLikeElement = document.querySelector('main h4');
        
        if (temperatureElement && feelsLikeElement && weatherData) {
            let tempValue, feelsLikeValue, unitSymbol;
            
            if (unit === 'celsius') {
                tempValue = Math.round(weatherData.current.temp_c);
                feelsLikeValue = Math.round(weatherData.current.feelslike_c);
                unitSymbol = '°C';
            } else {
                tempValue = Math.round(weatherData.current.temp_f);
                feelsLikeValue = Math.round(weatherData.current.feelslike_f);
                unitSymbol = '°F';
            }
            
            temperatureElement.textContent = `${tempValue}${unitSymbol}`;
            feelsLikeElement.textContent = `Feels like ${feelsLikeValue}${unitSymbol}`;
        }
    }
    
    const apiKey = '601eeb12fe614d3ca94162605250503';
    const city = 'Amsterdam';
    const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}&aqi=no`;
    
    let weatherData = null;
    
    fetch(url)
    .then(response => response.json())
    .then(data => {
        console.log('Full Weather Data:', data);
        weatherData = data;
        
        const temperatureElement = document.querySelector('main h3');
        const feelsLikeElement = document.querySelector('main h4');
        const conditionElement = document.getElementById('weather-condition');
        const weatherIconElement = document.querySelector('main img[alt="Weather Icon"]');
        
        if (temperatureElement && feelsLikeElement) {
            const temperature = Math.round(data.current.temp_c);
            const feelsLike = Math.round(data.current.feelslike_c);
            const condition = data.current.condition.text;
            
            temperatureElement.textContent = `${temperature}°C`;
            feelsLikeElement.textContent = `Feels like ${feelsLike}°C`;
            
            if (conditionElement) {
                conditionElement.textContent = condition;
            }
            
            if (weatherIconElement) {
                let iconName = "sun.png";
                
                const conditionLower = condition.toLowerCase();
                
                if (conditionLower.includes("sunny") || conditionLower.includes("clear")) {
                    iconName = "sun.png";
                } else if (conditionLower.includes("cloud")) {
                    iconName = "cloudy.png";
                } else if (conditionLower.includes("rain") || conditionLower.includes("drizzle")) {
                    iconName = "rain.png";
                } else if (conditionLower.includes("snow")) {
                    iconName = "snowy.png";
                } else if (conditionLower.includes("thunder") || conditionLower.includes("storm")) {
                    iconName = "thunder.png";
                } else if (conditionLower.includes("fog") || conditionLower.includes("mist")) {
                    iconName = "foggy.png";
                }
                
                weatherIconElement.src = `IMG/${iconName}`;
            }
        }
    })
    .catch(error => {
        console.error('Error fetching temperature:', error);
    });
});
