// MAP CENTER FUNCTION:
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

// EVENT LISTENERS FOR DATA CARDS:
const selectCity = document.querySelector(".cities");
const urls = {
  "district-of-columbia" : "https://maps2.dcgis.dc.gov/dcgis/rest/services/DCGIS_DATA/Public_Service_WebMercator/MapServer/25/query?where=1%3D1&outFields=PROVIDER,ADDRESS,CITY,STATE,LATITUDE,LONGITUDE,TYPE,SUBTYPE,STATUS,NUMBER_OF_BEDS,DGS_CONFIRMED,DHS_CONFIRMED,LAST_UPDATED_BY_DHS,AGES_SERVED,HOW_TO_ACCESS,XCOORD,YCOORD,NAME,ZIPCODE,WEB_URL&outSR=4326&f=json", 
  "los-angeles" : "https://public.gis.lacounty.gov/public/rest/services/LACounty_Dynamic/LMS_Data_Public/MapServer/158/query?where=1%3D1&outFields=*&outSR=4326&f=json",
  "baltimore" : "https://opendata.baltimorecity.gov/egis/rest/services/Hosted/Homeless_Shelter/FeatureServer/0/query?where=1%3D1&outFields=*&outSR=4326&f=json"
}
selectCity.addEventListener("change", (e) => {
    document.querySelector(".shelter-list").innerHTML = " ";
    fetch(urls[e.target.value])
      .then((res) => res.json())
      .then((data) => {
        let locations = []
        if( e.target.value == "district-of-columbia"){
          locations = transformDcData(data.features)
        } else if (e.target.value == "los-angeles"){
          locations = transformLaData(data.features)
        } else if (e.target.value == "baltimore"){
          locations = transformBaData(data.features)
        }
        let markers = []
        for(let location of locations){
          if (!location.location.lat) {
            continue
          }
          const locationDiv = renderLocation(location)
          const marker = renderPin(location) 
          markers.push(location.location)
          marker.addListener('click', (e) =>{
            console.log(location)
            locationDiv.classList.add("bg-secondary")
            locationDiv.scrollIntoView({behavior:"smooth"})
          })
        }
        centerMap(markers)
      });
});


// selectCity.addEventListener("change", (e) => {
//   if (e.target.value == "baltimore") {
//     document.querySelector(".shelter-list").innerHTML = " ";
//     fetch(
//       "https://opendata.baltimorecity.gov/egis/rest/services/Hosted/Homeless_Shelter/FeatureServer/0/query?where=1%3D1&outFields=*&outSR=4326&f=json"
//     )
//       .then((res) => res.json())
//       .then((data) => {
//         console.log(data)
//         const btInfo = data.features;
//         for (let i of btInfo) {
//           const list = document.querySelector(".shelter-list");
//           const name = i.attributes.name;
//           const location = `${i.attributes.address}, ${i.attributes.city}, ${i.attributes.state}, ${i.attributes.zipcode}`;
//           const type = i.attributes.subtype;
//           const sex = i.attributes.pop_type;
//           html = `
//         <div class="name" style="font-size: 20px">${name}</div>
//         <div class="address" style="font-size: 14px">${location}</div>
//         <div class="other" style="font-size: 12px">${sex} · ${type}</div>
//         `;
//           let list2 = document.createElement("div");
//           list2.classList.add("list-item");
//           list2.innerHTML = html;
//           list.append(list2);
//         }
//       });
//   }
// });

function transformLaData(results){
  return results.map((result) => {
    return {
      id : result.attributes.OBJECTID,
      name : result.attributes.Name,
      prov: "",
      address: `${result.attributes.addrln1}, ${result.attributes.city}, ${result.attributes.state}, ${result.attributes.zip}`,
      attributes: `${result.attributes.hours}`, 
      hours: result.attributes.hours,
      status: "",
      url: result.attributes.url,
      type: "",
      age: "",
      sex: "",
      description: result.attributes.description,
      access: "",
      location: {
        lat: result.attributes.latitude,
        lng: result.attributes.longitude
      }

    }
  })
}

function transformDcData(results){
  return results.map((result) => {
    return {
      name : result.attributes.NAME,
      prov: result.attributes.PROVIDER,
      address: `${result.attributes.ADDRESS}, ${result.attributes.CITY}, ${result.attributes.STATE}, ${result.attributes.ZIPCODE}`,
      attributes: `${result.attributes.AGES_SERVED} · ${location.sex} · ${location.type} · ${location.status}`,
      status: result.attributes.STATUS,
      url: result.attributes.WEB_URL,
      type: result.attributes.TYPE,
      age: result.attributes.AGES_SERVED,
      sex: result.attributes.SUBTYPE,
      access: result.attributes.HOW_TO_ACCESS,
      location: {
        lat: result.geometry.y,
        lng: result.geometry.x
      }

    }
  })
}

function transformBaData(results){
  return results.map((result) => {
    return {
      name : result.attributes.name,
      prov: "",
      address: `${result.attributes.address}, ${result.attributes.city}, ${result.attributes.state}, ${result.attributes.zipcode}`,
      attributes: "",
      status: "",
      url: "",
      type: result.attributes.subtype,
      age:"",
      sex: "",
      access: "",
      location: {
        lat: result.geometry?.y,
        lng: result.geometry?.x
      }

    }
  })
}

function renderLocation(location){
  const html = `
  <div class="name" style="font-size: 20px">${location.name}</div>
  <div class="provider" style="font-size: 18px">${location.prov}</div>
  <div class="address" style="font-size: 14px">${location.address}</div>
  <div class="access" style="font-size: 14px">${location.access}</div>
  <div class="other" style="font-size: 12px">${location.attributes}<a href="${location.url}">Website</a></div>
  `;
  // <div class="other" style="font-size: 12px">${location.age} · ${location.sex} · ${location.type} · ${location.status} · <a href="${location.url}">Website</a></div>
  const list = document.querySelector(".shelter-list");
    let list2 = document.createElement("div");
    list2.classList.add("list-item");
    list2.innerHTML = html;
    list.append(list2);
    return list2
}

function renderPin(location){
  return new google.maps.Marker({
    position : location.location,
    map : map
  })
}