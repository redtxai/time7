$('.clockpicker').clockpicker( {
    donetext: "Confirmar"
  }
);

var map
var map2
var bounds
var infowindow
var infowindow2
var marker
var marker2
var markerMeetingPoint
var markerMeetingPoint2
var markerToGoLocation
var markerToGoLocation2
var autocompleteAddressHereSearch
var autocompleteAddressHereSearch2
var autocompleteAddressToGoSearch
var geolocation
var positionGlobal
var latitude = -30.028465
var longitude = -51.199238

var Renter = {
  ready: 0,
  name: 'John Wick',
  age: 28,
  meetingLocation: null,
  toGoLocation: null,
  location: null,
  goToLocationFlag: false,
  carModel: 'Fork Ka',
  carAge: 2015,
  carColor: 'White',
  commitHour: '18:00'
}

function readyToRent() {
  if ($('#home-tab').parent().hasClass('active')) {
    Renter.goToLocationFlag = true
    Renter.commitHour = $("#commit-hour").val()
  } else {
    Renter.goToLocationFlag = false
    Renter.commitHour = $("#commit-hour2").val()
  }
  Renter.ready = 1
  $(".form-rent").fadeOut( "fast", function() {
    $('#id_loader2').fadeIn('slow')
    $('.form-rent-loader').fadeIn('slow')
    $('.cancel-renter').fadeIn('slow')
  })
}

function cancelRenter() {
  Renter.ready = 0
  $('#id_loader2').fadeOut( "fast", function() {
    $('.cancel-renter').fadeOut('fast')
    $('.form-rent-loader').fadeOut('fast')
    $(".form-rent").fadeIn('slow')
  })
}

function initMap() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      geolocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      positionGlobal = position
      latitude = position.coords.latitude
      longitude = position.coords.longitude
    })
  }
  bounds = new google.maps.LatLngBounds();

  initMap2()

  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: latitude, lng: longitude},
    zoom: 16,
    streetViewControl: false,
    fullscreenControl: false,
    mapTypeControl: false
  })

  autocompleteAddressHereSearch = new google.maps.places.Autocomplete(document.getElementById('addressHereSearch'))
  autocompleteAddressToGoSearch = new google.maps.places.Autocomplete(document.getElementById('addressToGoSearch'))
  autocompleteAddressHereSearch2 = new google.maps.places.Autocomplete(document.getElementById('addressHereSearch2'))

  autocompleteAddressHereSearch.addListener('place_changed', function() {
    Renter.meetingLocation = autocompleteAddressHereSearch.getPlace()
    var latMarker = this.getPlace().geometry.location.lat()
    var lngMarker = this.getPlace().geometry.location.lng()
    markerMeetingPoint = new google.maps.Marker({
      position: {
        lat: latMarker,
        lng: lngMarker
      },
      map: map
    })
    bounds.extend(markerMeetingPoint.position)
    if (markerToGoLocation != null && markerToGoLocation.getMap() == null) {
      markerToGoLocation.setMap(map)
      bounds.extend(markerToGoLocation.position)
      map.fitBounds(bounds)
    }
  })
  autocompleteAddressToGoSearch.addListener('place_changed', function() {
    Renter.toGoLocation = autocompleteAddressToGoSearch.getPlace()
    var latMarker = this.getPlace().geometry.location.lat()
    var lngMarker = this.getPlace().geometry.location.lng()
    markerToGoLocation = new google.maps.Marker({
      position: {
        lat: latMarker,
        lng: lngMarker
      }
    })
    if (markerMeetingPoint != null && markerMeetingPoint.getMap() != null) {
      markerToGoLocation.setMap(map)
      bounds.extend(markerToGoLocation.position)
      map.fitBounds(bounds)
    }
    
  })
  autocompleteAddressHereSearch2.addListener('place_changed', function() {
    Renter.location = autocompleteAddressHereSearch2.getPlace()
    map.setCenter(this.getPlace().geometry.location)
    var latMarker = this.getPlace().geometry.location.lat()
    var lngMarker = this.getPlace().geometry.location.lng()
    marker = new google.maps.Marker({
      position: {
        lat: latMarker,
        lng: lngMarker
      },
      map: map
    });
  })
}

function geolocate() {
  var circle = new google.maps.Circle({
    center: geolocation,
    radius: positionGlobal.coords.accuracy
  });
  var circleBounds = circle.getBounds()

  autocompleteAddressHereSearch.setBounds(circleBounds);
  autocompleteAddressToGoSearch.setBounds(circleBounds);
  autocompleteAddressHereSearch2.setBounds(circleBounds);
}

setTimeout(function(){
  $("#home-tab").trigger("click")
}, 400)

function initMap2() {
  map2 = new google.maps.Map(document.getElementById('map2'), {
    center: {lat: latitude, lng: longitude},
      zoom: 16,
      streetViewControl: false,
      fullscreenControl: false,
      mapTypeControl: false
  });
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(browserHasGeolocation ?
    'Error: The Geolocation service failed.' :
    'Error: Your browser doesn\'t support geolocation.');
}

function carregar() {
  $(".car-search").fadeOut( "fast", function() {
    asyncCall()
    $('#id_loader').fadeIn('slow');
  });

}


async function waitRenter(callback) {
  var intervalo = setInterval(function() {
    if (Renter.ready) {
      clearInterval(intervalo)
      callback()
    }
  }, 1000)
}

function cancelRent() {
  if (Renter.goToLocationFlag) {
    infowindow.close()
    infowindow2.close()
    markerMeetingPoint2.setMap(null)
    markerToGoLocation2.setMap(null)
  } else {
    infowindow.close()
    marker2.setMap(null)
  }
  $('#form-rent-container').fadeIn('fast')
  $('.car-search').fadeIn('slow')
}

async function asyncCall() {
  waitRenter(function() {
    document.getElementById("id_loader").style.display = "none";
    document.getElementById("form-rent-container").style.display = "none";

    if (Renter.goToLocationFlag) {
      map2.fitBounds(bounds)
      
      markerMeetingPoint2 = new google.maps.Marker({
        position: {
          lat: Renter.meetingLocation.geometry.location.lat(),
          lng: Renter.meetingLocation.geometry.location.lng()
        },
        map: map2
      });
      markerToGoLocation2 = new google.maps.Marker({
        position: {
          lat: Renter.toGoLocation.geometry.location.lat(),
          lng: Renter.toGoLocation.geometry.location.lng()
        },
        map: map2
      });
    } else {
      map2.setCenter(Renter.location.geometry.location)

      marker2 = new google.maps.Marker({
        position: {
          lat: Renter.location.geometry.location.lat(),
          lng: Renter.location.geometry.location.lng()
        },
        map: map2
      });
    }

    if (Renter.goToLocationFlag) {
      var contentString = '<form>'+
      '<div class="form-group text-center label-car-found">'+
        '<label class="form-control">Encontramos um carro disponivel!</label>'+
      '</div>'+
      '<div class="form-group label-car-found">'+
        '<label class="form-control">Nome: ' + Renter.name + '</label>'+
      '</div>'+
      '<div class="form-group label-car-found">'+
        '<label class="form-control">Carro: ' + Renter.carModel + '</label>'+
      '</div>'+
      '<div class="form-group label-car-found">'+
        '<label class="form-control">Info: ' + Renter.carColor + ' - ' + Renter.carAge + '</label>'+
      '</div>'+
      '<div class="form-group label-car-found">'+
      '<label class="form-control">Destino final: ' + Renter.toGoLocation.formatted_address + '</label>'+
      '</div>'+
      '<div class="form-group label-car-found"><label class="form-control">Horário de entrega: ' + Renter.commitHour + '</label></div>'+
      '<div class="form-group label-car-found">'+
        '<button type="button" class="btn btn-success" onclick="" value="Aceitar">Aceitar</button>&nbsp;&nbsp;&nbsp;'+
        '<button type="button" class="btn btn-danger" value="Cancelar" onclick="cancelRent()" id="fecharPopUp">Cancelar</button>'+
      '</div>'+
      '</form>'
      
      var contentString2 = '<form>'+
      '<div class="form-group label-car-found"><label class="form-control">Ponto de encontro: ' + Renter.meetingLocation.formatted_address + '</label>'+
      '</div></form>'
      
      
      infowindow = new google.maps.InfoWindow({
        content: contentString
      });
      infowindow.open(map, markerToGoLocation2);
      
      infowindow2 = new google.maps.InfoWindow({
        content: contentString2
      });
      infowindow2.open(map, markerMeetingPoint2);
    } else {
      var contentString = '<form>'+
        '<div class="form-group text-center label-car-found">'+
          '<label class="form-control">Encontramos um carro disponivel!</label>'+
        '</div>'+
        '<div class="form-group label-car-found">'+
          '<label class="form-control">Nome: ' + Renter.name + '</label>'+
        '</div>'+
        '<div class="form-group label-car-found">'+
          '<label class="form-control">Carro: ' + Renter.carModel + '</label>'+
        '</div>'+
        '<div class="form-group label-car-found">'+
          '<label class="form-control">Info: ' + Renter.carColor + ' - ' + Renter.carAge + '</label>'+
        '</div>'+
        '<div class="form-group label-car-found"><label class="form-control">Localização:' + Renter.location.formatted_address + '</label>' +
        '</div>'+
        '<div class="form-group label-car-found"><label class="form-control">Horário de entrega: ' + Renter.commitHour + '</label></div>'+
        '<div class="form-group label-car-found">'+
          '<button type="button" class="btn btn-success" onclick="" value="Aceitar">Aceitar</button>'+
          '<button type="button" class="btn btn-danger" value="Cancelar" onclick="cancelRent()" id="fecharPopUp">Cancelar</button>'+
        '</div>'+
      '</form>'

      infowindow = new google.maps.InfoWindow({
        content: contentString
      });
      infowindow.open(map, marker2);
    }
  })
}