const username = prompt("Enter your name:") || "Anonymous";

const socket = io();

// Map initialization
const map = L.map("map").setView([20.5937, 78.9629], 5); // Default to India

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution:
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

const markers = {};

// Get live location
if (navigator.geolocation) {
  navigator.geolocation.watchPosition(
    (position) => {
      const { longitude, latitude } = position.coords;
      console.log("Emitting location:", latitude, longitude);
      socket.emit("send-location", { latitude, longitude, username });
    },
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
    },
    {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 0,
    }
  );
}

socket.on("live-location", function (data) {
  const { id, latitude, longitude, username } = data;

  // Sanity check
  if (
    typeof latitude === "number" &&
    typeof longitude === "number" &&
    !isNaN(latitude) &&
    !isNaN(longitude)
  ) {
    if (id === socket.id) {
      map.setView([latitude, longitude], 16);
    }

    if (markers[id]) {
      markers[id].setLatLng([latitude, longitude]);
    } else {
      markers[id] = L.marker([latitude, longitude])
        .addTo(map)
        .bindPopup(`<b>${username || "User"}</b>`)
        .openPopup();
    }
  } else {
    console.warn("Invalid coordinates received:", latitude, longitude);
  }
});

socket.on("user-disconnect", ({ id }) => {
  if (markers[id]) {
    map.removeLayer(markers[id]);
    delete markers[id];
  }
});
