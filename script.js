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
