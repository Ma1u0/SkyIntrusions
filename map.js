document.addEventListener('DOMContentLoaded', () => {
  // ------------------------
  // 1️⃣ Initialize map
  // ------------------------
  const map = L.map('map', { zoomControl: false }).setView([20, 0], 2);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(map);
  L.control.zoom({ position: 'bottomleft' }).addTo(map);

  // ------------------------
  // 2️⃣ MarkerCluster group
  // ------------------------
  const markerCluster = L.markerClusterGroup();
  map.addLayer(markerCluster);

  // ------------------------
  // 3️⃣ Icons
  // ------------------------
  const icons = {
    droneRed: L.icon({ iconUrl: 'icons/red_drone.png', iconSize: [28,28] }),
    droneOrange: L.icon({ iconUrl: 'icons/orange_drone.png', iconSize: [28,28] }),
    droneYellow: L.icon({ iconUrl: 'icons/yellow_drone.png', iconSize: [28,28] }),
    droneGreen: L.icon({ iconUrl: 'icons/green_drone.png', iconSize: [28,28] }),
    droneBlue: L.icon({ iconUrl: 'icons/blue_drone.png', iconSize: [28,28] }),
    jetRed: L.icon({ iconUrl: 'icons/red_jet.png', iconSize: [28,28] }),
    jetOrange: L.icon({ iconUrl: 'icons/orange_jet.png', iconSize: [28,28] }),
    jetYellow: L.icon({ iconUrl: 'icons/yellow_jet.png', iconSize: [28,28] }),
    jetGreen: L.icon({ iconUrl: 'icons/green_jet.png', iconSize: [28,28] }),
    jetBlue: L.icon({ iconUrl: 'icons/blue_jet.png', iconSize: [28,28] }),
    balloonRed: L.icon({ iconUrl: 'icons/red_balloon.png', iconSize: [28,28] }),
    balloonOrange: L.icon({ iconUrl: 'icons/orange_balloon.png', iconSize: [28,28] }),
    balloonYellow: L.icon({ iconUrl: 'icons/yellow_balloon.png', iconSize: [28,28] }),
    balloonGreen: L.icon({ iconUrl: 'icons/green_balloon.png', iconSize: [28,28] }),
    balloonBlue: L.icon({ iconUrl: 'icons/blue_balloon.png', iconSize: [28,28] }),
    borderRed: L.icon({ iconUrl: 'icons/red_soldier.png', iconSize: [28,28] }),
    borderOrange: L.icon({ iconUrl: 'icons/orange_soldier.png', iconSize: [28,28] }),
    borderYellow: L.icon({ iconUrl: 'icons/yellow_soldier.png', iconSize: [28,28] }),
    borderGreen: L.icon({ iconUrl: 'icons/green_soldier.png', iconSize: [28,28] }),
    borderBlue: L.icon({ iconUrl: 'icons/blue_soldier.png', iconSize: [28,28] }),
  };

  // ------------------------
  // 4️⃣ Markers array
  // ------------------------
  const markers = [];

  // ------------------------
  // 5️⃣ Your incidents go here
  // ------------------------
  const incidents = [
    {
      lat: 40.04769,
      lng: 27.96799,
      icon: icons.droneYellow,
      type: 'drone',
      risk: 'yellow',
      place: 'others',
      year: '2025',
      month: '12',
      popupType: 'Drone incursion / crash site',
      date: 'Found 10 Dec in the evening, reported 20 Dec 2025',
      details: "A crashed, unidentified UAV was found by citizens in the Balıkesir’s Manyas district in an uninhabited field. <br> The drone is a Russian Merlin VR drone, which is used for reconnaissance and has a range of ~600km",
      link: "https://www.hurriyet.com.tr/gundem/balikesirde-insansiz-hava-araci-dustu-inceleme-icin-ankaraya-gonderildi-43060797",
      country: "Manyas, Turkey 🇹🇷"
    },
    {
      lat: 50.23922,
      lng: 5.50552,
      icon: icons.droneOrange,
      type: 'drone',
      risk: 'orange',
      place: 'militarybases',
      year: '2025',
      month: '10',
      country: "Marche-en-Famenne Air Base, Belgium 🇧🇪",
      note: "The Belgian security service considers the drones in Belgium to be Russian",
      noteLink: "https://www.vrt.be/vrtnws/en/2025/11/05/belgian-security-services-convinced-russia-is-behind-the-drone-i/",
      incidents: [
        {
          popupType: 'Drone sighting',
          date: '25 Oct 2025, evening',
          details: "Four to five drones, flying above critical areas of the base, were reported by soldiers",
          link: "https://www.vrt.be/vrtnws/en/2025/10/29/drones-spotted-above-belgian-military-base/"
        },
        {
          popupType: 'Drone sighting',
          date: '28 Oct 2025',
          details: "Several drones have been spotted over the air base",
          link: "https://www.vrt.be/vrtnws/en/2025/10/29/drones-spotted-above-belgian-military-base/"
        }
      ]
    }
  ];

  // ------------------------
  // 6️⃣ Add markers to cluster (handles multi-incidents)
  // ------------------------
  incidents.forEach(i => {
    let popupHtml = `<b>${i.link ? `<a href="${i.link}" target="_blank">${i.country}</a>` : i.country}</b><br>`;
    
    if(i.note) {
      popupHtml += `<em>${i.note}</em>`;
      if(i.noteLink) popupHtml += ` <a href="${i.noteLink}" target="_blank">Source</a>`;
      popupHtml += '<br><br>';
    }

    if(Array.isArray(i.incidents)) {
      i.incidents.forEach((inc, idx) => {
        popupHtml += `<b>Incident ${idx + 1}</b><br>
                      <b>Type:</b> ${inc.popupType}<br>
                      <b>Date:</b> ${inc.date}<br>
                      <b>Details:</b> ${inc.details}<br>
                      ${inc.link ? `<a href="${inc.link}" target="_blank">Source</a>` : ''}
                      <hr>`;
      });
    } else {
      popupHtml += `<b>Type:</b> ${i.popupType}<br>
                    <b>Date:</b> ${i.date}<br>
                    <b>Details:</b> ${i.details}<br>
                    ${i.link ? `<a href="${i.link}" target="_blank">Source</a>` : ''}`;
    }

    const marker = L.marker([i.lat, i.lng], { icon: i.icon }).bindPopup(popupHtml, {
      maxHeight: 300,
      autoPan: true
    });

    marker.meta = i;
    markers.push(marker);
    markerCluster.addLayer(marker);
  });

  // ------------------------
  // 7️⃣ Filter logic
  // ------------------------
  function applyFilters() {
    markerCluster.clearLayers();

    const fActor = document.getElementById('f-actor').value;
    const fType = document.getElementById('f-type').value;
    const fLocation = document.getElementById('f-location').value;
    const fMonth = document.getElementById('f-month').value;
    const fYear = document.getElementById('f-year').value;

    const visible = markers.filter(m => {
      const { risk, type, place, month, year } = m.meta;

      const matchActor = fActor === 'any' || risk === fActor;
      const matchType = fType === 'any' || type === fType;
      const matchPlace = fLocation === 'any' || place === fLocation;
      const matchMonth = fMonth === 'any' || month === fMonth.padStart(2,'0');
      const matchYear = fYear === 'any' || year === fYear;

      return matchActor && matchType && matchPlace && matchMonth && matchYear;
    });

    markerCluster.addLayers(visible);
  }

  // ------------------------
  // 8️⃣ Attach event listeners to filters
  // ------------------------
  document.querySelectorAll('#filters select').forEach(sel => {
    sel.addEventListener('change', applyFilters);
  });
});
