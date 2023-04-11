function init() {
  let popup = document.getElementById('popup');
  let closer = document.getElementById('popup-closer');
  let searchInput = document.getElementById('search');

  var iconStyle = new ol.style.Style({
    image: new ol.style.Icon({
      src: './img/marker.png',
      scale: 0.2,
      anchor: [0.5, 1]
    })
  });

  var markerLayer = new ol.layer.Vector({
    source: new ol.source.Vector({
      features: []
    }),
    style: iconStyle
  });

  var overlay = new ol.Overlay({
    element: popup,
    positioning: 'bottom-center',
    autoPan: true,
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

  searchInput.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
      event.preventDefault();

      var address = searchInput.value;
      var url = 'https://nominatim.openstreetmap.org/search/' + encodeURIComponent(address) + '?format=json&addressdetails=1&limit=1&polygon_svg=1';

      fetch(url)
        .then(risposta => risposta.json())
        .then(function(data) {
          if (data.length > 0) {
            var lon = parseFloat(data[0].lon);
            var lat = parseFloat(data[0].lat);
            var coords = ol.proj.fromLonLat([lon, lat]);
            overlay.setPosition(coords);
            map.getView().animate({center: coords, zoom: 18});

            var marker = new ol.Feature({
              geometry: new ol.geom.Point(coords)
            });

            markerLayer.getSource().addFeature(marker);
          } else {
            alert('Indirizzo non trovato');
          }
        })
        .catch(error => console.error(error));
    }
  });

  map.on('click', function(evt) {
    var features = map.getFeaturesAtPixel(evt.pixel);
  
    if (features && features.length > 0) {
      var coordinate = features[0].getGeometry().getCoordinates();
      var nome = features[0].get('name'); 
      popup.innerHTML = `name: ${nome}`;; 
      overlay.setPosition(coordinate);
    } else {
      overlay.setPosition(undefined);
    }
  });
}


