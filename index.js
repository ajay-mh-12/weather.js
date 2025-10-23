 
const cards = document.querySelector(".cards")

let SPEED = document.getElementById("speed")
let HUMIDITY = document.getElementById("humidity")
let uvindex = document.getElementById("Uv-color")
let AirModerate = document.getElementById("color")
let AirQuality = document.getElementById("airquality")
let uvid = document.getElementById("Uv-num")
let SunRise = document.getElementById("sunrise")
let SunSet = document.getElementById("sunset")
let pressure = document.querySelector("#pressures")
let megam = document.querySelector(".megam")
let today = document.getElementById("today");
let temperature = document.getElementById("Temperature");
let place = document.getElementById("place");
let mintemperature = document.getElementById("mintemp")
let maxtemperature = document.getElementById("maxtemp")

let search = document.getElementById("search")
let button = document.getElementById("clicker")
let city;

function permission(){
   navigator.geolocation.getCurrentPosition(success, error)
   async function success(position){
      console.log(position)
      let lat = position.coords.latitude;
      let lon = position.coords.longitude;
      const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=de753d1bfc9b1dd6a1586c923f3e429a`);
      const data = await res.json();
      mainTemp(data);
      place.textContent = data.name;
      minmaxTemp(data);
      SUN(data);
      Humidity(data);
      Day(latitude,longitude);
      getUvIndex(latitude,longitude);
      city = data.name;
      AirQuality();
      CLOUD(data);

   }
   function error(err){
      alert(`error (${err.code}): ${err.message}`)
   }
   success();
}
permission()


 button.addEventListener("click",() => {
     city = search.value;
      console.log(city)
      weather()
 })

async function weather() {
    const res = await fetch(`http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=de753d1bfc9b1dd6a1586c923f3e429a`)
    const data = await res.json()
    console.log(data);
    mainTemp(data)
    place.textContent = data.name;
    minmaxTemp(data)
    SUN(data)
    Humidity(data)
    let latitudes = data.coord.lat;
    let longitudes = data.coord.lon;
    Day(latitudes,longitudes);
    getUvIndex(latitudes,longitudes);
    Airquality()
    CLOUD(data)
}


function mainTemp(dataa) {
   let temp = dataa.main.temp
    temperature.textContent = `${(temp - 273.15).toFixed(0)}°C`;
}

function minmaxTemp(item){
   let mintemp = item.main.temp_min
   mintemperature.textContent = `Min Temperature-${(mintemp - 273.15).toFixed(0)}°C`;
   let maxtemp = item.main.temp_max
   maxtemperature.textContent = `Max Temperature-${(maxtemp - 273.15).toFixed(0)}°C`;
}

function SUN(items){
    SunRise.textContent = `${new Date( items.sys.sunrise * 1000).toLocaleTimeString([],{hour:'2-digit',minute:'2-digit',hour12: true})}`;
    SunSet.textContent = `${new Date(items.sys.sunset * 1000).toLocaleTimeString([],{hour:'2-digit',minute:'2-digit',hour12: true})}`; 
}

function Humidity(element){
    pressure.textContent = element.main.pressure;
    HUMIDITY.textContent = `${element.main.humidity}%`;
    SPEED.textContent = `${(element.wind.speed).toFixed(1)}km/h`
}


async function Day(lat,long){
      const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&daily=temperature_2m_max,temperature_2m_min&timezone=auto`)
      const data = await res.json()
      console.log(data);
      let getDate = [];
      let getTemp = [];
      data.daily.temperature_2m_max.forEach((temp, index) => {
         getTemp[index] = Math.round(temp)
      })
      console.log(getTemp)
      data.daily.time.forEach((day, index) => {
         let da = new Date(day).toLocaleDateString('en-US', {weekday: 'short'})
         getDate[index] = da
      });
      console.log(getDate)

      let getAll = getDate.map((day, index) => ({
         day:day,
         temp: getTemp[index]
      }));
      console.log(getAll);


         cards.innerHTML = ""
         getAll.forEach((card) => {
         cards.innerHTML += `<div class="card">
            <p>${card.day}</p>
            <img src="./img/cloudy.png" alt="">
            <p>${card.temp}°C</p>
        </div>`
      });
   }



async function getUvIndex(lati,longi){
   const rest = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lati}&longitude=${longi}&daily=uv_index_max&forecast_days=1`)
   const store = await rest.json()
   console.log(store)

   let index = Math.round(store.daily.uv_index_max);
   uvid.textContent = index

   if(index >= 11){
      uvindex.style.color = "red"
      uvindex.textContent = "Extrime"
   }else if(index >= 8){
      uvindex.style.color = "orange"
      uvindex.textContent = "Very High"
   }else if(index >= 6){
      uvindex.style.color = "yellow"
      uvindex.textContent = "High"
   }else if(index >= 3){
      uvindex.style.color = "blue"
      uvindex.textContent = "Moderate"
   }else{
      uvindex.textContent = "Low"
      uvindex.style.color = "green"
   }
  
 }



 async function Airquality(){
   const remort = await fetch(`https://api.api-ninjas.com/v1/airquality?city=${city}`, {
      headers: {
         "X-Api-Key":"6HOrGV0vZn6bLqdihECe1w==uYLyr96jCFmWmz94",
      }
   })
   const data = await remort.json()
   console.log(data)
   let quality =data.overall_aqi;
   AirQuality.textContent = quality; 


   switch(true){
      case(quality <= 50):
      AirModerate.textContent = "Good";
      AirModerate.style.color = "green";
      break;

      case (quality <= 100):
         AirModerate.textContent = "Moderate";
         AirModerate.style.color = "Yellow";
         break;

         case(quality <= 150):
         AirModerate.textContent = "Unhealthy for sensitive Groups";
         AirModerate.style.color = "orange";
         break;

         case(quality <= 200):
         AirModerate.textContent = "Unhealthy";
         AirModerate.style.color = "red";
         break;

         case(quality <= 300):
         AirModerate.textContent = "Very Unhealthy";
         AirModerate.style.color = "purple";
         break;

         default:
            AirModerate.textContent = "Hazardous";
            AirModerate.style.color = "maroon";
            break;

   }

 }


   function CLOUD(wool){
      let condition = wool.weather[0].description;
  

   const cloud = document.querySelector("#megam"); 

   if(condition === "overcast clouds"){
      cloud.src = "./img/windycloud.png"
   } else if(condition === "light rain"){
    cloud.src = "./img/lightrain(day).png"
   } else if(condition === "broken clouds"){
    cloud.src = "./img/f1036de3b82347c8e8c1d8f809d9510814f27(1).png"
   }else if(condition === "clear sky"){
    cloud.src = "./img/Clear(Day).png"
   }else {
    cloud.src = "./img/heavyRain.png"
   }

   }

   function WEEK(){
      const date = new Date()
      const index = date.getDay()
      let days = ["sunday","monday","Tuesday","wednesday","thursday","friday","saturday"]
      today.textContent = days[index]
      console.log(days[index]);
   }
 WEEK()
 nnbvb ghg ghgh gghhgg ghghgggfgf  ggghdf gfgfgf gfgf gghhg gfgfgf ggfg gfgfhh ggg bbgg 
 jghh ghgg gfghhg gfgf gfgfg gfhhgfnv vgfgfgf gfgfgf bbv gfgg gfgfgf gfgfgf gfgfg gfgfh gfggf gfgfgf gfgf gggf gfgf gghgh ghgh hnhgghh 
 ]fvvc gfgf ggff bvbvgfgf fc gfgf gg fdfd   ggggfgf gfgfgf dfdfdf dfdf fdfdff gfgf gggggf gfggfgf gggf gfgfgf gfgfgf  gfgf ghggh ghgh bbg nhghgh ghgh ghgh ghgh gg gfgfgfgf fggfgf gfgfggggf ggf 
 gfgf gfgf gfggf gfgf gfgfhg gh bgfgf bgfgg ggfgf bvbvbbghgh bggh ghghhg hhbnghb hhjhjjj jhjjh hj hjhj bvbv bvbvbv b bbnkjkj ggggg ghgh ghhg ghgh 
 bbv ghghhghghh ghgh hghg hhgh hhgh hhh hhghg ghhghg ghh hg ghghh ghhhghgh h ghgh ghgh ghhg ghghghgh hgh  hhj ghhg ghgh ghgh ghgh ghgh hgghghhgghh ghghgh hghg hh 
 jjf jjf fff ff fff ggfg fgf gff fg fgf gffg fgff fg fggfffffggvvvcvc vcvcvvcvbvvvcvbbgf gfgfg gfgffgfggf fggfgfgf fggf gfgfgf gfg rtrtrtr  rttrbgf trt gf ggfggff 
 fdfdfdfdfdfdfdfdffdfdfdf fdfdfdfdffddffdvdfdf dfdff dfdfdfdf ffddfdf ffdfdfdfd ddf dfdfdfffddf fdfvcvkjjj jjf gjjkjk  jkjgf kjjgfkj  nbnbnbbhjhjhj gggg ghghgh  nhhgjfjg ghgh 78787huibj njjv jbnbn hhnmhjyu nhjh hbgh h hhbhgghgh gh hjh jjuunniuuiokjnjhj  hjh hjhj hhjhj ghtyvtytyyuy hhjhjyyt hhh 
 hjgy

 uyh hjhh bghgh bbbyugh bb bv ghb ghgh gfuyyvyvvyty hhu ghbv gj h gb iuhj  juj ghjgh hbhjbvb h   ju8ubj j h hhg h iuuibb gj gf  bnjbhjh ghgh  ghj  ghfg 
 ghgh k  hjh  hgh yg  g   vbvvb hhghh ju bybyuy njh hu j hhhj jkjkj  jmjnmnm nmh  hgybjkj njkjbnb nmbnm bnbn nmnmnn  bhjh fdgbn  nm nmhjuh ujh hjbjhjh jhjh dffg rf jjv kjuhb kjjbkj kb n jhfjg 
  hjn b hbgrhb nj mj jij ijfiohbjk vbh yyufvbhbhb hf hh hh ghghj   jghjv kj jj h jhg kjn gff kjj f g  g fg gf ghjkfgjkjk jghhjjj  fj jgjkjkj 
  hhjfj jvjjghk mmfndf  hjgjj kjgkj iu89u uggy bvhbhggyug vhhjg hghg hhh gvgh bgfgg ghjg hmg  hghgi  hjhjkh gghj hgygyugyu hghjhhj j jhvhghjty ght d 
  bhbh hh v gjf gjfj kjjhj jhjh jfg jgjjgfjfhjgf gffvbhjhh hjfh jhfjkh jh bhjbf  dfb fbh hf h gf hgf bfb b bbvx   b bbxc c dc  hvb bvb bvb bb bbbb  hjhdf hffdh gg
  b ghvbcv gcgvh  ggu jhbjn bbjhjhbf kghkjjkjb  jnv bhhh hhhvg h  ghh hhd hdh v zbxb b v c  vdhxv bdh b dh g  ghhjfhff hbghfhghjhjdfhj hj hjfhdhhjdfb mmm nnnhhnm