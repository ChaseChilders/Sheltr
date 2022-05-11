const cities = document.querySelector("#cities");

cities.addEventListener("change", () => {
  console.log("yay");
  const dc = { lat: 38.9072, lng: -77.0369 };
  const marker = new google.maps.Marker({
    position: dc,
    map: map,
  });
});

function initMap() {
  // The map, centered at DC
  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 4,
    center: { lat: 48.394103, lng: -125.297251 },
  });
  window.map = map;
  centerMap([
    { lat: 48.394103, lng: -125.297251 },
    { lat: 25.202134, lng: -66.086843 },
  ]);
}

window.initMap = initMap;

function centerMap(locations) {
  const bounds = new google.maps.LatLngBounds();

  for (i = 0; i < locations.length; i++) {
    //extend the bounds to include each marker's position
    // bounds.extend(new google.maps.LatLng(location.lat, location.lng));
    bounds.extend(locations[i]);
  }

  //now fit the map to the newly inclusive bounds
  map.fitBounds(bounds);
}
const selectCity = document.querySelector(".cities");

selectCity.addEventListener("change", (e) => {
  if (e.target.value == "district-of-columbia") {
    document.querySelector(".shelter-list").innerHTML = " ";
    fetch(
      "https://maps2.dcgis.dc.gov/dcgis/rest/services/DCGIS_DATA/Public_Service_WebMercator/MapServer/25/query?where=1%3D1&outFields=PROVIDER,ADDRESS,CITY,STATE,LATITUDE,LONGITUDE,TYPE,SUBTYPE,STATUS,NUMBER_OF_BEDS,DGS_CONFIRMED,DHS_CONFIRMED,LAST_UPDATED_BY_DHS,AGES_SERVED,HOW_TO_ACCESS,XCOORD,YCOORD,NAME,ZIPCODE,WEB_URL&outSR=4326&f=json"
    )
      .then((res) => res.json())
      .then((data) => {
        const dcInfo = data.features;
        for (let i of dcInfo) {
          const list = document.querySelector(".shelter-list");
          const name = i.attributes.NAME;
          const prov = i.attributes.PROVIDER;
          const location = `${i.attributes.ADDRESS}, ${i.attributes.CITY}, ${i.attributes.STATE}, ${i.attributes.ZIPCODE}`;
          const status = i.attributes.STATUS;
          const url = i.attributes.WEB_URL;
          const type = i.attributes.TYPE;
          const age = i.attributes.AGES_SERVED;
          const sex = i.attributes.SUBTYPE;
          const access = i.attributes.HOW_TO_ACCESS;
          const lat = i.attributes.LATITUDE;
          const long = i.attributes.LONGITUDE;
          html = `
        <div class="name" style="font-size: 20px">${name}</div>
        <div class="provider" style="font-size: 18px">${prov}</div>
        <div class="address" style="font-size: 14px">${location}</div>
        <div class="access" style="font-size: 14px">${access}</div>
        <div class="other" style="font-size: 12px">${age} · ${sex} · ${type} · ${status} · <a href="${url}">Website</a></div>
        `;
          let list2 = document.createElement("div");
          list2.classList.add("list-item");
          list2.innerHTML = html;
          list.append(list2);
        }
      });
  }
});

selectCity.addEventListener("change", (e) => {
  if (e.target.value == "los-angeles") {
    document.querySelector(".shelter-list").innerHTML = " ";
    fetch(
      "https://public.gis.lacounty.gov/public/rest/services/LACounty_Dynamic/LMS_Data_Public/MapServer/158/query?where=1%3D1&outFields=*&outSR=4326&f=json"
    )
      .then((res) => res.json())
      .then((data) => {
        const laInfo = data.features;
        for (let i of laInfo) {
          const list = document.querySelector(".shelter-list");
          const name = i.attributes.Name;
          const location = `${i.attributes.addrln1}, ${i.attributes.city}, ${i.attributes.state}, ${i.attributes.zip}`;
          const phone = i.attributes.phones;
          const hours = i.attributes.hours;
          const description = i.attributes.description;
          const url = i.attributes.url;
          html = `
        <div class="name" style="font-size: 20px">${name}</div>
        <div class="address" style="font-size: 18px">${location}</div>
        <div class="hours" style="font-size: 14px">${hours}</div>
        `;
          let laList = document.createElement("div");
          laList.classList.add("list-item");
          laList.innerHTML = html;
          list.append(laList);
        }
      });
  }
});

selectCity.addEventListener("change", (e) => {
  if (e.target.value == "baltimore") {
    document.querySelector(".shelter-list").innerHTML = " ";
    fetch(
      "https://opendata.baltimorecity.gov/egis/rest/services/Hosted/Homeless_Shelter/FeatureServer/0/query?where=1%3D1&outFields=*&outSR=4326&f=json"
    )
      .then((res) => res.json())
      .then((data) => {
        const btInfo = data.features;
        for (let i of btInfo) {
          const list = document.querySelector(".shelter-list");
          const name = i.attributes.name;
          const location = `${i.attributes.address}, ${i.attributes.city}, ${i.attributes.state}, ${i.attributes.zipcode}`;
          const type = i.attributes.subtype;
          const sex = i.attributes.pop_type;
          html = `
        <div class="name" style="font-size: 20px">${name}</div>
        <div class="address" style="font-size: 14px">${location}</div>
        <div class="other" style="font-size: 12px">${sex} · ${type}</div>
        `;
          let list2 = document.createElement("div");
          list2.classList.add("list-item");
          list2.innerHTML = html;
          list.append(list2);
        }
      });
  }
});
