angular.module("bbInvestimentosAPI.services", [])

.service("Token", function() {
  function set(t) {
    document.cookie = "bbinvestapi-token=" + t;
  }
  function get() {
    var allCookies = document.cookie;

    var cookiesArray = allCookies.split(";");
    for(var i = 0; i < cookiesArray.length; i++) {
      c = cookiesArray[i].split("=");
      if(c[0] == "bbinvestapi-token") {
        return c[1];
      }
    }
    return "";
  }

  return {
    set: set,
    get: get
  }
})

.service("FundoAtual", function() {
  var fundoId
  function set(f) {
    fundoId = f;
  }
  function get() {
    return fundoId;
  }

  return {
    set: set,
    get: get
  }
})

.service("Usuario", function($http) {
  this.autenticaUsuario = function(usuario) {
    return $http.post(url + "/api/autenticacao/", usuario).
                then(function(response) {
                  return response;
                }, function(error) {
                  alert("Erro ao autenticar usuário.");
                  return error;
                });
  }
})

.service("Fundos", function($http, Token) {
  // Obtém todos os fundos
  this.getFundos = function() {
    return $http.get(url + "/api/fundos/").
                then(function(response) {
                    return response;
                }, function(error) {
                    alert("Erro ao encontrar fundos.");
                    return error;
                });
  }

  // Obtém um fundo pelo id
  this.getFundo = function(id) {
    return $http.get(url + "/api/fundos/" + id).
                then(function(response) {
                    return response;
                }, function(error) {
                    alert("Erro ao encontrar fundo.");
                    return error;
                });
  }

  // Cria um fundo
  this.createFundo = function(fundo) {
    return $http.post(url + "/api/fundos/criar/", fundo, {headers: {'x-access-token': Token.get()}}).
                then(function(response) {
                  return response;
                }, function(error) {
                  alert("Erro ao criar fundo.");
                  return error;
                });
  }

  // Deleta um fundo pelo id
  this.deleteFundo = function(id) {
    return $http.delete(url + "/api/fundos/" + id, {headers: {'x-access-token': Token.get()}}).
              then(function(response) {
                return response;
              }, function(error) {
                alert("Erro ao deletar fundo.");
                return error;
              });
  }

});
