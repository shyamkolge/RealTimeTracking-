const socket = io();

// Getig live location
if (navigator.geolocation) {
  navigator.geolocation.watchPosition(
    (position) => {
      const { longitude, latitude } = position.coords;
      socket.emit("send-location", { latitude, longitude });
    },
    (error) => {
      (error) => {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            alert("Location access denied. Please allow location permission.");
            break;
          case error.POSITION_UNAVAILABLE:
            alert("Location unavailable. Try again later.");
            break;
          case error.TIMEOUT:
            alert("Location request timed out. Try again.");
            break;
          default:
            alert("An unknown error occurred.");
        }
        console.error("Geolocation error:", error);
      };
    },
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
    }
  );
}

const map = L.map("map").setView([0, 0], 16);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution:
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

const markers = {};

socket.on("live-location", function (data) {
  const { id, longitude, latitude } = data;
  map.setView([latitude, longitude], 16);

  if (markers[id]) {
    markers[id].setLatLng([latitude, longitude]);
  } else {
    markers[id] = L.marker([latitude, longitude]).addTo(map);
  }
});

socket.on("user-disconnect", ({ id }) => {
  if (markers[id]) {
    map.removeLayer(markers[id]);
    delete markers[id];
  }
});
