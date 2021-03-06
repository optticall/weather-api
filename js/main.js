var clima = {"Clear": "Ensolarado", "Clouds": "Nublado", "Rain": "Chuvoso", "Snow": "Nevando",}


//Funcao getData gera conteúdo de acordo com a cidade passada por parametro
function getData(city){

  //variavel background retorna url de imagem de acordo com tempo
  var background = {"clear": "img/clear.jpg", "clouds": "img/cloudy.jgp", "rain": "img/rain.jpg", "snow": "img/snow.jpg"}

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
      $(".desc").text(clima[e.list[0].weather[0].main]);
      $(".icon").removeClass("hidden").addClass("hidden");
      $("." + e.list[0].weather[0].main.toLowerCase() ).removeClass("hidden");
      $(".humidity").text(Math.floor(e.list[0].humidity) + " %");
      $(".min-temp").text(Math.floor(e.list[0].temp.min));
      $(".max-temp").text(Math.floor(e.list[0].temp.max));
      $(".wind-speed").text(Math.floor(e.list[0].speed) + " Km/h");
      $(".eventos").attr("href", "https://www.eventbrite.com.br/d/brazil--" + e.city.name +"/events/")
      generateChart(e);

      console.log(e);
    }
  });
}

//gerar o tabela dos proximos Dias
function generateChart(d){
  var tempMin = Math.floor(d.list[0].temp.min);
  var tempMax = Math.floor(d.list[0].temp.max);;
  var days = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"];
  var data = new Date();
  var hoje = data.getDay();
  var html = "";

  for(var i=0; i<d.list.length; i++){
    html += "<tr><td>" + days[hoje] + "</td>";
    html += "<td>" + clima[d.list[i].weather[0].main] + "</td>";
    html += "<td class='minTemp'>" + Math.floor(d.list[i].temp.min) + " °C </td>";
    html += "<td class='maxTemp'>" + Math.floor(d.list[i].temp.max) + " °C </td>";
    html += "</tr>"

    //verifica qual menor e maior temperatura da semana
    tempMinAtual = Math.floor(d.list[i].temp.min);
    if(tempMinAtual < tempMin){
      tempMin = Math.floor(d.list[i].temp.min);
    }

    tempMaxAtual = Math.floor(d.list[i].temp.max);
    if(tempMaxAtual > tempMax){
      tempMax = Math.floor(d.list[i].temp.max);
    }

    //verifica se chegou no ultimo dia da semana e retorna ao domingo
    hoje++;
    if(hoje == 7){
      hoje = 0;
    }
  }
  $(".maxPrevista").text(tempMax + " °C");
  $(".minPrevista").text(tempMin + " °C");
  $(".semana").html(html);

}

//setar um cookie no navegador
function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

//pegar o cookie do navegador
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

  //seta o cookie com a cidade favorita
  $(".city").on("click", "a.favorito", function(e){
    var cidade = $(".city").text().trim();
    setCookie("cidade", cidade, 30);
    e.preventDefault();
  });

  //Carrega estados
  $("#changeCity").on("shown.bs.modal", function(){
    $.getJSON("js/estados-cidades.json", function(json){
      var options = "<option selected='selected'>Estados</option>";
      for (var i = 0; i < Object(json.estados).length; i++) {
  			options += '<option class="estado-opcao" value="' + json.estados[i].nome + '">' + json.estados[i].nome + '</option>';
  		}
      $(".estado-opcao").empty();
      $(".estados").html(options);
    });
  });

  //autocomplete cidades
  $("body").on("change", "select", function(){
    var estado = $(this).val();
    var cidades = [];
    $.getJSON("js/estados-cidades.json", function(json){
      for (var i = 0; i < Object(json.estados).length; i++) {
        if(estado == json.estados[i].nome){
          for(var j=0; j<json.estados[i].cidades.length; j++){
            cidades.push(json.estados[i].cidades[j]);
          }
        }
  		}
    });
    $("#cidades").autocomplete({
      source: cidades,
      width:'auto',
      defaultText:'+',
      minChars: 2,
      maxChars : 50,
      placeholderColor : '#666666',
    });
  });

  //muda a cidade
  $(".new-city").on("click", function(){
    var cidade = $("#cidades").val();
    if(cidade != ""){
      getData(cidade);
      $("#cidades").val('');
      $('#changeCity').modal('toggle')
    } else {
      alert("Nenhuma cidade selecionada!");
    }
  });


});
