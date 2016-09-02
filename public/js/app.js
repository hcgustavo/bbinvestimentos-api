angular.module("bbInvestimentosAPI", ['ngRoute', 'bbInvestimentosAPI.controllers', 'bbInvestimentosAPI.services'])
.config(function($routeProvider) {
  $routeProvider
  .when("/", {
    templateUrl: "templates/home.html",
    controller: "HomeController"
  })
  .when("/sobre", {
    templateUrl: "templates/sobre.html"
  })
  .when("/documentacao", {
    templateUrl: "templates/documentacao.html"
  })

  .when("/admin", {
    templateUrl: "templates/admin/login.html",
    controller: "LoginController"
  })
  .when("/listagem", {
    templateUrl: "templates/admin/listagem.html",
    controller: "ListagemController",
    resolve: {
      fundos: function(Fundos) {
        return Fundos.getFundos();
      }
    }
  })
  .when("/visualizacao", {
    templateUrl: "templates/admin/visualizacao.html",
    controller: "VisualizacaoController",
  })
  .when("/edicao", {
    templateUrl: "templates/admin/edicao.html",
    controller: "EdicaoController"
  }).
  when("/criacao", {
    templateUrl: "templates/admin/criacao.html",
    controller: "CriacaoController"
  })
  .otherwise({
    redirectTo: "/"
  })
});
