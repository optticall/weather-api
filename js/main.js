
//Funcao getData gera conteúdo de acordo com a cidade passada por parametro
function getData(city){

  //variavel background retorna url de imagem de acordo com tempo
  var background = {
    "clear": "img/clear.jpg",
    "clouds": "img/cloudy.jgp",
    "rain": "img/rain.jpg",
    "snow": "img/snow.jpg",
  }

  $.ajax({
    url: "http://api.openweathermap.org/data/2.5/forecast/daily?q="+city+"&units=metric&cnt=7&appid=79c3bbf6a5f2924c4dbb66e59ad616b4",
    type: "GET",
    dataType: "jsonp",
    success: function(e){
      $("body").css("background", 'url('+ background[e.list[0].weather[0].main.toLowerCase()] +') no-repeat center center fixed');
      $("body").css("background-size", "cover");
      $(".city").html(e.city.name +
        '<a href="" class="favorito" data-toggle="tooltip" data-placement="right" title="Adicionar como favorito">'+
        '<span class="glyphicon glyphicon-star" aria-hidden="true"></span>'+
        '</a>');
      $(".temp").text(Math.floor(e.list[0].temp.day) + "°C");
      $(".desc").text(e.list[0].weather[0].description);
      $(".icon").removeClass("hidden").addClass("hidden");
      $("." + e.list[0].weather[0].main.toLowerCase() ).removeClass("hidden");
      $(".humidity").text(Math.floor(e.list[0].humidity) + " %");
      $(".min-temp").text(Math.floor(e.list[0].temp.min));
      $(".max-temp").text(Math.floor(e.list[0].temp.max));
      $(".wind-speed").text(Math.floor(e.list[0].speed) + " Km/h");
      console.log(e);
    }
  });
}

//function para setar um cookie no navegador
function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

//funcao para pegar o cookie do navegador
function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

$(document).ready(function(){

  //Verifica se existe alguma cidade favorita e exibe
  var city = getCookie("cidade");

  if(city != ""){
    getData(city);
  } else{
    getData("Blumenau");
  }

  //getData("Londres");

  //seta o cookie com a cidade favorita
  $(".city").on("click", "a.favorito", function(e){
    var cidade = $(".city").text().trim();

    setCookie("cidade", cidade, 30);

    e.preventDefault();
  });

});
