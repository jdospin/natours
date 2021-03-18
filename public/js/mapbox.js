// import mapboxgl from 'mapbox-gl';

export function displayMap(locations) {
  mapboxgl.accessToken =
    'pk.eyJ1IjoiamRvc3BpbiIsImEiOiJjanZvM2ZuejMwNnd6NGFvNHUzcTY3a2xuIn0.mHjASieo7rVyFD74p7QFDg';

  const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/jdospin/ckmc958pv4um017s31i5cnska',
    scrollZoom: false,
  });

  const bounds = new mapboxgl.LngLatBounds();
  
  locations.forEach((loc) => {
    // create new element (marker) to add to the map
    const el = document.createElement('div');
    el.className = 'marker';

    // add marker to the map
    new mapboxgl.Marker({
      element: el,
      anchor: 'bottom',
    })
      .setLngLat(loc.coordinates)
      .addTo(map);

    // add popup
    new mapboxgl.Popup({
      offset: 30,
    })
      .setLngLat(loc.coordinates)
      .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
      .addTo(map);

    // extend the map bounds to include the current location
    bounds.extend(loc.coordinates);
  });

  map.fitBounds(bounds, {
    padding: {
      top: 200,
      bottom: 150,
      left: 100,
      right: 100,
    },
  });
}
