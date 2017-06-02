//(function() {




class getData {

    constructor(url) {

    }
    getJSON(url) {

        const xhr = new XMLHttpRequest();

        let data = null;

        xhr.open("GET", url, false);
        //xhr.setRequestHeader("Content-Type", "application/javascript");

        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4 && xhr.status >= 200 && xhr.status < 300) {
                data = JSON.parse(xhr.response);
                pushDataArr(data, dataArr);

                serwisName(url);

            }

        };
        xhr.onerror = function() {
            console.log(new Error(" Błąd ładowania "));
        }




        xhr.send(null);





    }
    getJSONforCityName(url) {
        const xhr = new XMLHttpRequest();

        let data = null;

        xhr.open("GET", url, false);

        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4 && xhr.status >= 200 && xhr.status < 300) {
                data = JSON.parse(xhr.response);
                getCityLocation(data);



            }

        };
        xhr.onerror = function() {
            console.log(new Error(" Błąd ładowania "));
        }




        xhr.send(null);
    }



};


////////////////////////////////////////////////
/* Funkcje Wyciągajace info o mieście  */
///////////////////////////////////////////////
function getCityData(arr) {

    if (arr) {
        let cityData = {};

        for (let obj of arr) {

            console.log(obj);

            /* Dane dla api openweathermap */
            if (obj.name) {



                let {
                    name: cityName,
                    coord: {
                        lat,
                        lon
                    },
                    main: {
                        pressure,
                        temp,
                        temp_max: tempMax,
                        temp_min: tempMin
                    }
                } = obj;

                temp = Math.round(temp - 273.15);
                tempMax = Math.round(tempMax - 273.15);
                tempMin = Math.round(tempMin - 273.15)

                cityData = ({
                    cityName,
                    lat,
                    lon,
                    pressure,
                    temp,
                    tempMax,
                    tempMin
                });


                createNodeBox(cityData);

                cityData = {};

                /* Dane lokalizacji dla api wunderground */
            } else if (obj.current_observation) {

                let { current_observation } = obj;
                let {
                    display_location,
                    temp_c: temp,
                    pressure_mb: pressure
                } = current_observation;
                let {
                    city: cityName,
                    latitude: lat,
                    longitude: lon,


                } = display_location;

                cityData = ({
                    cityName,
                    lat,
                    lon,
                    pressure,
                    temp
                });
                createNodeBox(cityData);
                cityData = {};

                /* Dane pogodowe dla api wunderground */
            } else if (obj.response) {

            } else console.log("ten obiekt nie posiada lokalizacji")






        }

    }

};


////////////////////////////////////////////////
/* Dodawanie danych do tablicy  */
///////////////////////////////////////////////
function pushDataArr(data, arr) {

    let obj = data,
        dataArr = arr;

    if (obj != "undefine") {
        arr.push(obj);
    }

    return arr;



}

////////////////////////////////////////////////
/* Dodawanie danych na strone  */
///////////////////////////////////////////////
let nodeElem = [],
    createNodeBoxCounter = 0;


function createNodeBox(elem) {
    if (elem) {
        let element = document.createDocumentFragment(),
            box = document.createElement("div"),
            output = document.querySelector(".container"),
            h2 = document.createElement("h2"),
            h4 = document.createElement("h4"),

            {
                cityName,
                lat,
                lon,
                pressure,
                temp,
                tempMax,
                tempMin
            } = elem; // zapisywanie danych przeslanych z getJSON


        box.classList.add("box");



        //------------------------------------------------------------------------//
        // <--- Dodawanie nazwy serwisu

        let serwisName = document.createElement("span");
        serwisName.classList.add("serwis--name");
        try {
            serwisName.innerHTML = `Pogoda z serwisu: ${(serwis[createNodeBoxCounter]).toUpperCase()}`;
        } catch (e) {
            console.log(e);
        }

        box.appendChild(serwisName);


        //------------------------------------------------------------------------//
        // <--- Dodawanie H2 z nazwą miasta
        h2.innerText = cityName;
        box.appendChild(h2);

        //------------------------------------------------------------------------//
        //<--- Dodawanie H4 ze wspolrzednymi
        h4.innerHTML = `współrzędne <br> ${parseFloat(lat).toFixed(3)} x ${parseFloat(lon).toFixed(3)}`;
        box.appendChild(h4);

        //------------------------------------------------------------------------//
        //<--- Dodawanie danych o temperaturze
        let tempWrapper = document.createElement("div"),
            currTemp = document.createElement("p"),
            tempMaxMin = document.createElement("p");

        tempWrapper.classList.add("temp--wrapper");
        currTemp.classList.add("temp--curr");

        if (temp > "29") {
            currTemp.classList.add("temp--hot");
        }
        if (temp <= "29" && temp > "20") {
            currTemp.classList.add("temp--heat");
        }
        if (temp <= "20" && temp > "0") {
            currTemp.classList.add("temp--normal");
        }
        if (temp <= "0") {
            currTemp.classList.add("temp--cold");
        }
        currTemp.innerText = `${temp}C`;
        tempWrapper.appendChild(currTemp);
        if (tempMax && tempMax != tempMin) {
            tempMaxMin.classList.add("temp--min-max");
            tempMaxMin.innerHTML = `min temp: ${tempMin}C - max temp: ${tempMax}C`;
            tempWrapper.appendChild(tempMaxMin);
        }
        box.appendChild(tempWrapper);

        //------------------------------------------------------------------------//
        //<--- Dodawanie danych o cisnieniu
        let press = document.createElement("p");
        press.classList.add("pressure");
        press.innerText = `Ciśnienie: ${pressure} hPa`;

        box.appendChild(press);

        //------------------------------------------------------------------------//
        element.appendChild(box); //<--- Dodanie gotwego boxa 

        addNodeBox(element, output); //<--- Wyslanie gotowego boxa na strone



    } //else throw new Error("Nie podano elementu ");
    createNodeBoxCounter++;
}

function addNodeBox(elem, place) {
    place.appendChild(elem);


}


////////////////////////////////////////////////
/* Wyciąganie nazwy serwisu z URL  */
///////////////////////////////////////////////
function serwisName(url) {
    var hostname;
    //find & remove protocol (http, ftp, etc.) and get hostname

    if (url.indexOf("://") > -1) {
        hostname = url.split('/')[2];
        hostname = hostname.split('.')[1]
    } else {
        hostname = url.split('/')[0];
        hostname = hostname.split('.')[1]
    }

    //find & remove port number
    hostname = hostname.split(':')[0];
    //find & remove "?"
    hostname = hostname.split('?')[0];
    serwis.push(hostname);
    return hostname;
}




////////////////////////////////////////////////
/* Pobieranie z nazwy miasta jego wspolrzednych   */
///////////////////////////////////////////////
function getCityLocation(data) {
    if (data) {
        let { results: res } = data;
        let { 0: obj } = res;
        let city = obj.address_components[0].long_name;
        let location = obj.geometry.location;
        let { lat, lng: lon } = location;
        lat = parseFloat(lat).toFixed(3);
        lon = parseFloat(lon).toFixed(3);
        APIrqs(lat, lon, city);

    }

};

////////////////////////////////////////////////
/* Usuwanie polskich znakow   */
///////////////////////////////////////////////
function findLatin(string) {
    let reg = /[ęóąśłżźćń]/ig;
    string = string.toLowerCase();
    let stringArr = [...string],
        newString = "";


    for (let w of stringArr) {
        w = w.replace(reg, replaceLatin(w));

        newString += w;
    }
    if (newString) {
        return newString;
    }


};

function replaceLatin(w) {

    if (w) {

        if (w === "ę") return "e";
        if (w === "ó") return "o";
        if (w === "ą") return "a";
        if (w === "ś") return "s";
        if (w === "ł") return "l";
        if (w === "ż") return "z";
        if (w === "ź") return "z";
        if (w === "ć") return "c";
        if (w === "ń") return "n";
    } else {

    }

};













////////////////////////////////////////////



function createCitiesArr(city, country) {
    let cityCode = encodeURI(city),
        locationData = new getData(),
        cityLocat = locationData.getJSONforCityName(`https://maps.googleapis.com/maps/api/geocode/json?address=${cityCode}&key=AIzaSyBOcdzymZk4GJtOABc4LSKl-Ks7ny2HMuk`);

}

function APIrqs(lat, lon, city) {
    let locationData = new getData();

    let cityCode = encodeURI(city);
    let cityNoLatinCode = encodeURI(findLatin(city));
    let allDataURL = [`http://api.openweathermap.org/data/2.5/weather?q=${cityCode}&appid=b6beecbfb5b41605c6ed8a089fa7b0a4`,
        `http://api.wunderground.com/api/4480b6203d6939a1/conditions/q/PL/${cityNoLatinCode}.json`,
        `https://api.apixu.com/v1/current.json?key=212fb62a1a164a11a20125949170106&q=${cityCode}`,
        `http://dataservice.accuweather.com/locations/v1/cities/search?apikey=7HBJlwnqyzNQfqmL77apovYXF42AFLxW&q=${cityCode}&language=pl-pl&details=true`


    ];


    for (url of allDataURL) {

        locationData.getJSON(url);
    }

}



let serwis = []; // <--- trzymanie naze serwisow wycietych z url api
let dataArr = []; //<-- trzymanie danych zwracanych z serwisow





////////////////////////////////////////////////
/* Formularz szukający miasta  */
///////////////////////////////////////////////
let input = document.querySelector("#inputCity"),
    btn = document.querySelector("#city-btn");

btn.addEventListener("click", getCity, false);

function getCity() {
    event.preventDefault();
    let output = document.querySelector(".container");
    output.innerHTML = ""; // Czyszczenia poprzednio wyszukanych danych po ponownym kliknieciu szukaj
    let city = input.value;
    if (city.trim() != "" && !(parseInt(city))) {
        createCitiesArr(city, "pl"); // <--- wysylanie zapytanie do google api o dane podanego miasta
        getCityData(dataArr); // <--- informacje i pogodzie w miescie i dodawanie ich do DOM

    } else {
        alert("Podaj poprawną nazwę miasta");
    }

    input.value = ""; // <--- Czyszczenie pola input po kliknieciu szukaj
    dataArr = []; // <--- Czyszczenie tablicy z danymi miast, zeby przy kolejnym wyszukiwaniu nie pokazywalo wczesniejej szukanych miast


}




//})();