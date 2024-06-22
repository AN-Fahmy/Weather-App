let inputSearch = document.getElementById('searchInput'),
    btnSearch = document.getElementById('btnSearch'),
    errMsg = document.getElementById('errMsg')
    nameCity = []
    currentData = []
    forecast = []
    forecastTomorrow =[]
    forecastAfterTomorrow =[]
    lastWeatherDay =[]
    daysNames = ["Sunday", "Monday", "Tuesday" ,"Wednesday","Thursday","Friday","Saturday"]

/* Start User Location Weather */
window.addEventListener('load', function(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(success, error)
    }
    async function success(position){
        let lat = position.coords.latitude
        let long = position.coords.longitude
        let getAPI = await fetch(`https://api-bdc.net/data/reverse-geocode?latitude=${lat}&longitude=${long}&localityLanguage=en&key=bdc_bbffa0f9f2004cd5a48a97bda0bdefea`)
        let response = await getAPI.json()
        let currentCity = response.city
        inputSearch.value = currentCity
        btnSearch.click()
        inputSearch.value = ''
        loadingCurrentCity()
    }   
    function error(err){
        alert('Your geolocation has been denied')
        loadingCurrentCity()
    }
})
/* End User Location Weather */

/* Start Btn To Search Fron Country And Show Weather */
btnSearch.addEventListener('click',function(){
    if(validationInput){
        if(inputSearch.value){
            getWeather(inputSearch.value)
            inputSearch.value = ''
            inputSearch.classList.remove("is-valid")
        } else {
            errMsg.innerHTML = 'Please Enter The City Name'
            inputSearch.classList.add("is-invalid")
            inputSearch.classList.remove("is-valid")
            errMsg.classList.add('animate__rubberBand')
            errMsg.classList.remove('d-none')
            setTimeout(function(){
                errMsg.classList.add('d-none')
                inputSearch.classList.remove("is-invalid")
            },5000)
        }
    }
})
inputSearch.addEventListener('keyup', (e)=>{
    if(e.key === 'Enter'){
        btnSearch.click()
    }
})
/* Start Btn To Search Fron Country And Show Weather */

/* Start Weather Today */
async function getWeather(city){
    try {
        let response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=1c67aade343d42f59f5124501241406&q=${city}`);
        let data = await response.json()
        nameCity = data.location.name
        currentData = data.current
        forecast = data.forecast.forecastday
        displayWeather()
        weatherTomorrow(nameCity)
        weatherAfterTomorrow(nameCity)
        lastWeather(nameCity)
        if(forecast[0].day.condition.text == 'Sunny'){
            document.body.style.cssText = `
                background-image: url('../image/0093830f1dd6e42c6137ee1eb8e3286b_w200.gif');
                background-size: cover;
                background-position: center center;
            `
        }else if(forecast[0].day.condition.text == 'Heavy rain'){
            document.body.style.cssText = `
                background-image: url('../image/rain.gif');
                background-size: cover;
                background-position: center center;
            `
        } else if(forecast[0].day.condition.text == 'Patchy rain nearby' || forecast[0].day.condition.text == 'Moderate rain' || forecast[0].day.condition.text == 'Light drizzle'){
            document.body.style.cssText = `
            background-image: url('../image/Light drizzle.gif');
            background-size: cover;
            background-position: center center;
            `
        } else if(forecast[0].day.condition.text == 'Partly Cloudy' || forecast[0].day.condition.text == 'Mist' || forecast[0].day.condition.text == 'Overcast'){
            document.body.style.cssText = `
                background-image: url('../image/nav-bg.gif');
                background-size: cover;
                background-position: center center;
            `
        } else if(forecast[0].day.condition.text == 'Snowy' || forecast[0].day.condition.text == 'Snow'){
            document.body.style.cssText = `
            background-image: url('../image/snowy.gif');
            background-size: cover;
            background-position: center center;
            `
        } else{
            document.body.style.cssText = `
                background-image: url('../image/nav-bg.gif');
                background-size: cover;
                background-position: center center;
            `
        }
    } catch (error) {
        console.log('Check Error Here')
    }
}
function displayWeather(){
    let cartona = ``,
        d = new Date(),
        dayName = d.getDay()
    for (let i = 0; i < forecast.length; i++) {
        cartona =`
                <div class="col-12">
                    <div class="countryName text-center">
                        <h1 class='display-1'>${nameCity}</h1>
                        <h3 class='fw-normal'>${daysNames[dayName]} <span>${forecast[i].date}</span></h3>
                    </div>
                    <div class="row gy-3 my-3">
                        <div class="col-sm-6 col-lg-3 col-12">
                            <div class="temps text-center py-2 h-100 d-flex justify-content-center align-items-center">
                                <p><i class="fa-solid fa-temperature-high"></i> Max-Temp : ${forecast[i].day.maxtemp_c}<sup>o</sup> <br> <i class="fa-solid fa-temperature-low"></i> Min-Temp : ${forecast[i].day.mintemp_c}<sup>o</sup></p>
                            </div>
                        </div>
                        <div class="col-sm-6 col-lg-3 col-12">
                            <div class="wind text-center py-2 h-100 d-flex justify-content-center align-items-center">
                                <p class='m-0'><i class="fa-solid fa-wind"></i> Wind-kph : ${currentData.wind_kph}kph</p>
                            </div>
                        </div>
                        <div class="col-sm-6 col-lg-3 col-12">
                            <div class="sunrise text-center py-2 h-100 d-flex justify-content-center align-items-center">
                                <p>Sunrise : ${forecast[i].astro.sunrise} <br> Sunset : ${forecast[i].astro.sunset}</p>
                            </div>
                        </div>
                        <div class="col-sm-6 col-lg-3 col-12">
                            <div class="condition d-flex gap-2 justify-content-center align-items-center py-2 h-100 d-flex justify-content-center align-items-center">
                                <p>${forecast[i].day.condition.text}</p>
                                <img src="${forecast[i].day.condition.icon}" alt="${forecast[i].day.condition.text}">
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-12">
                    <div class='current-temp d-flex flex-column justify-content-center align-items-center text-center'>
                        <h1 class='display-1 fw-bold'>${currentData.temp_c}<sup>o</sup>C</h1>
                        <h3 class='m-0'>${currentData.condition.text}</h3>
                        <img style="width:120px;" src="${currentData.condition.icon}" alt="${currentData.condition.text}">
                    </div>
                </div>
                <div class="col-12">
                    <div class="weatherHour d-flex flex-nowrap gap-4 overflow-auto text-center">
                        <div>
                            <h5>00:00 AM</h5>
                            <p>${forecast[i].hour[0].temp_c}<sup>o</sup></p>
                            <div class="rain d-flex flex-column">
                                <p class='m-0'>${forecast[i].hour[0].condition.text}</p>
                                <img class='translate' src="${forecast[i].hour[0].condition.icon}" alt="${forecast[i].hour[0].condition.text}">
                            </div>
                        </div>
                        <div>
                            <h5>1:00 AM</h5>
                            <p>${forecast[i].hour[1].temp_c}<sup>o</sup></p>
                            <div class="rain d-flex flex-column">
                                <p class='m-0'>${forecast[i].hour[1].condition.text}</p>
                                <img class='translate' src="${forecast[i].hour[1].condition.icon}" alt="${forecast[i].hour[1].condition.text}">
                            </div>
                        </div>
                        <div>
                            <h5>2:00 AM</h5>
                            <p>${forecast[i].hour[2].temp_c}<sup>o</sup></p>
                            <div class="rain d-flex flex-column">
                                <p class='m-0'>${forecast[i].hour[2].condition.text}</p>
                                <img class='translate' src="${forecast[i].hour[2].condition.icon}" alt="${forecast[i].hour[2].condition.text}">
                            </div>
                        </div>
                        <div>
                            <h5>3:00 AM</h5>
                            <p>${forecast[i].hour[3].temp_c}<sup>o</sup></p>
                            <div class="rain d-flex flex-column">
                                <p class='m-0'>${forecast[i].hour[3].condition.text}</p>
                                <img class='translate' src="${forecast[i].hour[3].condition.icon}" alt="${forecast[i].hour[3].condition.text}">
                            </div>
                        </div>
                        <div>
                            <h5>4:00 AM</h5>
                            <p>${forecast[i].hour[4].temp_c}<sup>o</sup></p>
                            <div class="rain d-flex flex-column">
                                <p class='m-0'>${forecast[i].hour[4].condition.text}</p>
                                <img class='translate' src="${forecast[i].hour[4].condition.icon}" alt="${forecast[i].hour[4].condition.text}">
                            </div>
                        </div>
                        <div>
                            <h5>5:00 AM</h5>
                            <p>${forecast[i].hour[5].temp_c}<sup>o</sup></p>
                            <div class="rain d-flex flex-column">
                                <p class='m-0'>${forecast[i].hour[5].condition.text}</p>
                                <img class='translate' src="${forecast[i].hour[5].condition.icon}" alt="${forecast[i].hour[5].condition.text}">
                            </div>
                        </div>
                        <div>
                            <h5>6:00 AM</h5>
                            <p>${forecast[i].hour[6].temp_c}<sup>o</sup></p>
                            <div class="rain d-flex flex-column">
                                <p class='m-0'>${forecast[i].hour[6].condition.text}</p>
                                <img class='translate' src="${forecast[i].hour[6].condition.icon}" alt="${forecast[i].hour[6].condition.text}">
                            </div>
                        </div>
                        <div>
                            <h5>7:00 AM</h5>
                            <p>${forecast[i].hour[7].temp_c}<sup>o</sup></p>
                            <div class="rain d-flex flex-column">
                                <p class='m-0'>${forecast[i].hour[7].condition.text}</p>
                                <img class='translate' src="${forecast[i].hour[7].condition.icon}" alt="${forecast[i].hour[7].condition.text}">
                            </div>
                        </div>
                        <div>
                            <h5>8:00 AM</h5>
                            <p>${forecast[i].hour[8].temp_c}<sup>o</sup></p>
                            <div class="rain d-flex flex-column">
                                <p class='m-0'>${forecast[i].hour[8].condition.text}</p>
                                <img class='translate' src="${forecast[i].hour[8].condition.icon}" alt="${forecast[i].hour[8].condition.text}">
                            </div>
                        </div>
                        <div>
                            <h5>9:00 AM</h5>
                            <p>${forecast[i].hour[9].temp_c}<sup>o</sup></p>
                            <div class="rain d-flex flex-column">
                                <p class='m-0'>${forecast[i].hour[9].condition.text}</p>
                                <img class='translate' src="${forecast[i].hour[9].condition.icon}" alt="${forecast[i].hour[9].condition.text}">
                            </div>
                        </div>
                        <div>
                            <h5>10:00 AM</h5>
                            <p>${forecast[i].hour[10].temp_c}<sup>o</sup></p>
                            <div class="rain d-flex flex-column">
                                <p class='m-0'>${forecast[i].hour[10].condition.text}</p>
                                <img class='translate' src="${forecast[i].hour[10].condition.icon}" alt="${forecast[i].hour[10].condition.text}">
                            </div>
                        </div>
                        <div>
                            <h5>11:00 AM</h5>
                            <p>${forecast[i].hour[11].temp_c}<sup>o</sup></p>
                            <div class="rain d-flex flex-column">
                                <p class='m-0'>${forecast[i].hour[11].condition.text}</p>
                                <img class='translate' src="${forecast[i].hour[11].condition.icon}" alt="${forecast[i].hour[11].condition.text}">
                            </div>
                        </div>
                        <div>
                            <h5>12:00 PM</h5>
                            <p>${forecast[i].hour[12].temp_c}<sup>o</sup></p>
                            <div class="rain d-flex flex-column">
                                <p class='m-0'>${forecast[i].hour[12].condition.text}</p>
                                <img class='translate' src="${forecast[i].hour[12].condition.icon}" alt="${forecast[i].hour[12].condition.text}">
                            </div>
                        </div>
                        <div>
                            <h5>1:00 PM</h5>
                            <p>${forecast[i].hour[13].temp_c}<sup>o</sup></p>
                            <div class="rain d-flex flex-column">
                                <p class='m-0'>${forecast[i].hour[13].condition.text}</p>
                                <img class='translate' src="${forecast[i].hour[13].condition.icon}" alt="${forecast[i].hour[13].condition.text}">
                            </div>
                        </div>
                        <div>
                            <h5>2:00 PM</h5>
                            <p>${forecast[i].hour[14].temp_c}<sup>o</sup></p>
                            <div class="rain d-flex flex-column">
                                <p class='m-0'>${forecast[i].hour[14].condition.text}</p>
                                <img class='translate' src="${forecast[i].hour[14].condition.icon}" alt="${forecast[i].hour[14].condition.text}">
                            </div>
                        </div>
                        <div>
                            <h5>3:00 PM</h5>
                            <p>${forecast[i].hour[15].temp_c}<sup>o</sup></p>
                            <div class="rain d-flex flex-column">
                                <p class='m-0'>${forecast[i].hour[15].condition.text}</p>
                                <img class='translate' src="${forecast[i].hour[15].condition.icon}" alt="${forecast[i].hour[15].condition.text}">
                            </div>
                        </div>
                        <div>
                            <h5>4:00 PM</h5>
                            <p>${forecast[i].hour[16].temp_c}<sup>o</sup></p>
                            <div class="rain d-flex flex-column">
                                <p class='m-0'>${forecast[i].hour[16].condition.text}</p>
                                <img class='translate' src="${forecast[i].hour[16].condition.icon}" alt="${forecast[i].hour[16].condition.text}">
                            </div>
                        </div>
                        <div>
                            <h5>5:00 PM</h5>
                            <p>${forecast[i].hour[17].temp_c}<sup>o</sup></p>
                            <div class="rain d-flex flex-column">
                                <p class='m-0'>${forecast[i].hour[17].condition.text}</p>
                                <img class='translate' src="${forecast[i].hour[17].condition.icon}" alt="${forecast[i].hour[17].condition.text}">
                            </div>
                        </div>
                        <div>
                            <h5>6:00 PM</h5>
                            <p>${forecast[i].hour[18].temp_c}<sup>o</sup></p>
                            <div class="rain d-flex flex-column">
                                <p class='m-0'>${forecast[i].hour[18].condition.text}</p>
                                <img class='translate' src="${forecast[i].hour[18].condition.icon}" alt="${forecast[i].hour[18].condition.text}">
                            </div>
                        </div>
                        <div>
                            <h5>7:00 PM</h5>
                            <p>${forecast[i].hour[19].temp_c}<sup>o</sup></p>
                            <div class="rain d-flex flex-column">
                                <p class='m-0'>${forecast[i].hour[19].condition.text}</p>
                                <img class='translate' src="${forecast[i].hour[19].condition.icon}" alt="${forecast[i].hour[19].condition.text}">
                            </div>
                        </div>
                        <div>
                            <h5>8:00 PM</h5>
                            <p>${forecast[i].hour[20].temp_c}<sup>o</sup></p>
                            <div class="rain d-flex flex-column">
                                <p class='m-0'>${forecast[i].hour[20].condition.text}</p>
                                <img class='translate' src="${forecast[i].hour[20].condition.icon}" alt="${forecast[i].hour[20].condition.text}">
                            </div>
                        </div>
                        <div>
                            <h5>9:00 PM</h5>
                            <p>${forecast[i].hour[21].temp_c}<sup>o</sup></p>
                            <div class="rain d-flex flex-column">
                                <p class='m-0'>${forecast[i].hour[21].condition.text}</p>
                                <img class='translate' src="${forecast[i].hour[21].condition.icon}" alt="${forecast[i].hour[21].condition.text}">
                            </div>
                        </div>
                        <div>
                            <h5>10:00 PM</h5>
                            <p>${forecast[i].hour[22].temp_c}<sup>o</sup></p>
                            <div class="rain d-flex flex-column">
                                <p class='m-0'>${forecast[i].hour[22].condition.text}</p>
                                <img class='translate' src="${forecast[i].hour[22].condition.icon}" alt="${forecast[i].hour[22].condition.text}">
                            </div>
                        </div>
                        <div>
                            <h5>11:00 PM</h5>
                            <p>${forecast[i].hour[23].temp_c}<sup>o</sup></p>
                            <div class="rain d-flex flex-column">
                                <p class='m-0'>${forecast[i].hour[23].condition.text}</p>
                                <img class='translate' src="${forecast[i].hour[23].condition.icon}" alt="${forecast[i].hour[23].condition.text}">
                            </div>
                        </div>
                    </div>
                </div>
        `
    }
    document.getElementById('rowData').innerHTML = cartona
}
/* End Weather Today */

/* Start Weather Tomorrow */
async function weatherTomorrow(city){
    try {
        let response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=1c67aade343d42f59f5124501241406&q=${city}&days=2`);
        let data = await response.json()
        forecastTomorrow = data.forecast.forecastday
        displayWeatherTomorrow()
    } catch (error) {
        console.log('Check Error Here')
    }
}
function displayWeatherTomorrow(){
    let box = ``,
        d = new Date(),
        dayName = d.getDay()
    for (let i = 0; i < forecastTomorrow.length; i++) {
        box =`
            <div class="col-12">
                <div class="next-day text-center position-relative rounded-2">
                    <div class="head-day p-3">
                        <h3>${daysNames[(dayName + 1) % 7]}</h3>
                    </div>
                    <div class="day-info p-5">
                        <div class="dgree d-flex flex-column gap-2">
                            <h2><i class="fa-solid fa-temperature-high"></i> ${forecastTomorrow[i].day.maxtemp_c}<sup>o</sup></h2>
                            <h5><i class="fa-solid fa-temperature-low"></i> ${forecastTomorrow[i].day.mintemp_c}<sup>o</sup></h5>
                        </div>
                        <div class="rain">
                            <img src="${forecastTomorrow[i].day.condition.icon}" alt="${forecastTomorrow[i].day.condition.text}">
                            <p>${forecastTomorrow[i].day.condition.text}</p>
                        </div>
                    </div>
                </div>
            </div>
        `
    }
    document.getElementById('rowTomorrow').innerHTML = box
}
/* End Weather Tomorrow */

/* Start Weather After Tomorrow */
async function weatherAfterTomorrow(city){
    try {
        let response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=1c67aade343d42f59f5124501241406&q=${city}&days=3`);
        let data = await response.json()
        forecastAfterTomorrow = data.forecast.forecastday
        displayWeatherAfterTomorrow()
    } catch (error) {
        console.log('Check Error Here')
    }
}
function displayWeatherAfterTomorrow(){
    let box = ``,
        d = new Date(),
        dayName = d.getDay();
        for (let i = 0; i < forecastAfterTomorrow.length; i++) {
            box =`
                <div class="col-12">
                    <div class="after-next-day text-center position-relative rounded-2">
                        <div class="head-day p-3">
                            <h3>${daysNames[(dayName + 2) % 7]}</h3>
                        </div>
                        <div class="day-info p-5">
                            <div class="dgree d-flex flex-column gap-2">
                                <h2><i class="fa-solid fa-temperature-high"></i> ${forecastAfterTomorrow[i].day.maxtemp_c}<sup>o</sup></h2>
                                <h5><i class="fa-solid fa-temperature-low"></i> ${forecastAfterTomorrow[i].day.mintemp_c}<sup>o</sup></h5>
                            </div>
                            <div class="rain">
                                <img src="${forecastAfterTomorrow[i].day.condition.icon}" alt="${forecastAfterTomorrow[i].day.condition.text}">
                                <p>${forecastAfterTomorrow[i].day.condition.text}</p>
                            </div>
                        </div>
                    </div>
                </div>
            `
        }
        
    document.getElementById('rowAFterTomorrow').innerHTML = box
}
/* End Weather After Tomorrow */

/* Start Weather Last Weather Day */
async function lastWeather(city){
    try {
        let response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=1c67aade343d42f59f5124501241406&q=${city}&days=4`);
        let data = await response.json()
        lastWeatherDay  = data.forecast.forecastday
        displayLastWeather()
    } catch (error) {
        console.log('Check Error Here')
    }
}
function displayLastWeather(){
    let box = ``,
        d = new Date(),
        dayName = d.getDay();
        for (let i = 0; i < lastWeatherDay .length; i++) {
            box =`
                <div class="col-12">
                    <div class="last-day text-center position-relative rounded-2">
                        <div class="head-day p-3">
                            <h3>${daysNames[(dayName + 3) % 7]}</h3>
                        </div>
                        <div class="day-info p-5">
                            <div class="dgree d-flex flex-column gap-2">
                                <h2><i class="fa-solid fa-temperature-high"></i> ${lastWeatherDay [i].day.maxtemp_c}<sup>o</sup></h2>
                                <h5><i class="fa-solid fa-temperature-low"></i> ${lastWeatherDay [i].day.mintemp_c}<sup>o</sup></h5>
                            </div>
                            <div class="rain">
                                <img src="${lastWeatherDay [i].day.condition.icon}" alt="${lastWeatherDay [i].day.condition.text}">
                                <p>${lastWeatherDay [i].day.condition.text}</p>
                            </div>
                        </div>
                    </div>
                </div>
            `
        }
        
    document.getElementById('rowLastWeather').innerHTML = box
}
/* End Weather Last Weather Day */

/* Start Validation Input */
inputSearch.addEventListener('input',function(){
    validationInput()
})
function validationInput(){
    let inputValue = inputSearch.value,
        regex = /^[A-Za-z].{2,}$/;
    if(regex.test(inputValue)){
        inputSearch.classList.add("is-valid")
        inputSearch.classList.remove("is-invalid")
        errMsg.classList.add('d-none')
    } else{
        inputSearch.classList.add("is-invalid")
        inputSearch.classList.remove("is-valid")
        errMsg.classList.add('animate__rubberBand')
        errMsg.classList.remove('d-none')
        setTimeout(function(){
            errMsg.classList.add('d-none')
        },5000)
    }

}
/* End Validation Input */

/* Loading Intro */
let loading = document.getElementById('loading');
function loadingCurrentCity(){
    inputSearch.classList.add('animate__animated','animate__zoomIn')
    btnSearch.classList.add('animate__animated','animate__zoomIn')
    loading.classList.add('animate__animated','animate__fadeOutDown')
    loading.style.cssText= `
        translate: transformX(-100%)
    `
    document.querySelector('nav').classList.add('animate__fadeInUp')
    document.querySelector('.stage').classList.add('animate__fadeInDown')
    document.querySelector('.navbar-brand i').classList.add('animate__fadeInLeft')
    document.querySelector('.navbar-brand span').classList.add('animate__fadeInRight')
}
/* Loading Intro */


window.addEventListener('scroll', function(){
    if(document.documentElement.scrollTop > 500){
        document.querySelector('.next-day').classList.add('animate__animated','animate__fadeInLeft')
        document.querySelector('.after-next-day').classList.add('animate__animated','animate__fadeInDown')
        document.querySelector('.last-day').classList.add('animate__animated','animate__fadeInRight')
    }
})