function init() {
  let popup = document.getElementById('popup');
  let searchInput = document.getElementById('search');

  var iconStyle = new ol.style.Style({
    image: new ol.style.Icon({
      src: './img/marker.png',
      scale: 0.2,
      anchor: [0.5, 1]
    })
  });

  var markerRossi = new ol.Feature({
    geometry: new ol.geom.Point(ol.proj.fromLonLat([11.555655151565931, 45.552099360953925])),
    name: 'Itis rossi Vicenza'
  });

  var markerFarmacia = new ol.Feature({
    geometry: new ol.geom.Point(ol.proj.fromLonLat([11.55376417601135, 45.55308496694824])),
    name: 'Farmacia Donadellii S.A.S.'
  });

  var markerLayer = new ol.layer.Vector({
    source: new ol.source.Vector({
      features: [markerRossi, markerFarmacia]
    }),
    style: iconStyle
  });

  var overlay = new ol.Overlay({
    element: popup,
    positioning: 'bottom-center',
    autopan: true,
    autoPanAnimation: {
      duration: 250
    }
  });

  var map = new ol.Map({
    target: "mappa",
    layers: [
      new ol.layer.Tile({
        source: new ol.source.OSM()
      }),
      markerLayer
    ],
    overlays: [overlay],
    view: new ol.View({
      center: ol.proj.fromLonLat([11.555655151565931, 45.552099360953925]),
      zoom: 18
    })
  });

  
  // Aggiungi un listener all'input della barra di ricerca
  searchInput.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
      event.preventDefault();
      // Usa il valore inserito nella barra di ricerca per aggiornare la posizione della mappa
      var address = searchInput.value;
      var url = 'https://nominatim.openstreetmap.org/search/' + encodeURIComponent(address) + '?format=json&addressdetails=1&limit=1&polygon_svg=1';
      fetch(url)
        .then(response => response.json())
        .then(function(data) {
          if (data.length > 0) {
            var lon = parseFloat(data[0].lon);
            var lat = parseFloat(data[0].lat);
            var coords = ol.proj.fromLonLat([lon, lat]);
            overlay.setPosition(coords);
            map.getView().animate({center: coords, zoom: 18});
          } else {
            alert('Indirizzo non trovato');
          }
        })
        .catch(error => console.error(error));
    }
  });

  map.on('click', function(evt) {
    var features = map.getFeaturesAtPixel(evt.pixel);
    if (features) {
        var coordinate = features[0].getGeometry().getCoordinates();
        var name = features[0].get('name');
        content.innerHTML = '<p>' + name + '</p>';
        overlay.setPosition(coordinate);
    } else {
        overlay.setPosition(undefined);
        closer.blur();
    }
})}
