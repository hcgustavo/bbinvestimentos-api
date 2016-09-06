angular.module("bbInvestimentosAPI.controllers", [])
.controller("HomeController", function($scope, $http) {
  $scope.enviar = function() {
    $scope.result = "Requisição enviada. Aguardando resposta...";
    $http.get(url + "/api/" + $scope.route)
    .then(function(response) {
      if(response.data != null) {
        $scope.result = angular.toJson(response.data);
      }else {
        $scope.result = "";
      }
    },
    function(error){
      $scope.result = "Erro ao fazer requisição.";
    });
  };
})

.controller("LoginController", function($scope, $location, Usuario, Token) {
  if(Token.get() == "") {
    $location.path('/admin');
  }else {
    $location.path('/listagem');
  }

  $scope.autenticar = function(usuario) {
    Usuario.autenticaUsuario(usuario).then(function(doc) {
      if(doc.data.success == false) {
        // Erro ao autenticar usuário
        alert(doc.data.message);
      }else {
        // Autenticação feita com sucesso. Salva token de acesso
        Token.set(doc.data.token);
        // Redireciona para listagem dos fundos
        $location.path("/listagem");
      }
    }, function(error) {
      alert("Erro ao autenticar usuário.");
    });
  };
})

.controller("ListagemController", function($scope, $location, $route, FundoAtual, fundos, Fundos, Token) {
  // Verifica se usuário tem token válido para acessar essa página
  if(Token.get() == "") {
    $location.path('/login');
  }

  // Obtém lista de todos os fundos
  $scope.fundos = fundos.data.resultados;

  // Implementa funções dos botões de Visualizar, Editar, Excluir e Criar um fundo
  $scope.visualizarFundo = function(id) {
    FundoAtual.set(id);
    $location.path("/visualizacao");
  };

  $scope.editarFundo = function(id) {
    FundoAtual.set(id);
    $location.path("/edicao");
  };

  $scope.criarFundo = function() {
    $location.path("/criacao");
  };

  $scope.excluirFundo = function(id) {
    Fundos.deleteFundo(id);
    $route.reload();
  };

})

.controller("VisualizacaoController", function($scope, $location, FundoAtual, Fundos, Token) {
  // Verifica se usuário tem token válido para acessar essa página
  if(Token.get() == "") {
    $location.path('/login');
  }

  var id = FundoAtual.get();
  Fundos.getFundo(id).then(function(doc) {
    $scope.fundo = doc.data;
  }, function(error) {
  });
})

.controller("EdicaoController", function($scope, $http, $location, FundoAtual, Fundos, Token) {
  // Verifica se usuário tem token válido para acessar essa página
  if(Token.get() == "") {
    $location.path('/login');
  }

  var id = FundoAtual.get();
  Fundos.getFundo(id).then(function(doc) {
    $scope.fundo = doc.data;
  }, function(error) {
  });

// Implementa funções de ATUALIZAR, ATUALIZAR E VOLTAR e CANCELAR
$scope.atualizar = function() {
  atualizaFundo();
};

$scope.atualizarEVoltar = function(){
  atualizaFundo();
  $location.path("/listagem");
};

$scope.cancelar = function(){
  $location.path("/listagem");
};

// Implementa função para adicionar uma nova cota (data e valor) no histórico de cotas
$scope.adicionarCota = function() {
  var tabela= document.getElementById("historicoCotacaoTable");
  var row = tabela.insertRow(2);

  var dataInput = document.createElement("input");
  dataInput.type = "text";
  dataInput.className = "form-control";

  var valorInput = document.createElement("input");
  valorInput.type = "text";
  valorInput.className = "form-control";

  var cell1 = row.insertCell(0);
  cell1.appendChild(dataInput);
  var cell2 = row.insertCell(1);
  cell2.appendChild(valorInput);
};

// Função para atualizar array de cotas do fundo
var atualizarHistoricoCotas = function() {
  var tabela= document.getElementById("historicoCotacaoTable");
  var cotas = new Array();

  for(i = 2; i < tabela.rows.length; i++) {
    //console.log(tabela.rows[i].cells[0].children[0].value + " " + tabela.rows[i].cells[1].children[0].value);
    var cota = {data: tabela.rows[i].cells[0].children[0].value, valor: tabela.rows[i].cells[1].children[0].value};
    cotas.push(cota);
  }
  $scope.fundo.historicoCotacao = cotas;

};

// Função para atualizar fundo no BD
var atualizaFundo = function() {
  atualizarHistoricoCotas();
  $http.put(url + "/api/fundos/" + $scope.fundo.id, $scope.fundo, {headers: {'x-access-token': Token.get()}})
  .then(function(response) {
    if(response.data.success == true) {
      alert("Fundo atualizado com sucesso.");
    }else {
      alert("Não foi possível atualizar o fundo.");
    }
  }, function(error) {
    alert("Não foi possível atualizar o fundo.");
  });
}

})

.controller("CriacaoController", function($scope, $location, Fundos, Token) {
  // Verifica se usuário tem token válido para acessar essa página
  if(Token.get() == "") {
    $location.path('/login');
  }

  // Implementa botão para adicionar novo fundo
  $scope.adicionar = function() {
    var tabela= document.getElementById("historicoCotacaoTable");
    var cotas = new Array();
    for(i = 2; i < tabela.rows.length; i++) {
      //console.log(tabela.rows[i].cells[0].children[0].value + " " + tabela.rows[i].cells[1].children[0].value);
      var cota = {data: tabela.rows[i].cells[0].children[0].value, valor: tabela.rows[i].cells[1].children[0].value};
      cotas.push(cota);
    }
    $scope.fundo.historicoCotacao = cotas;

    Fundos.createFundo($scope.fundo).then(function(doc) {
      if(doc.data.success == true) {
        alert("Fundo criado com sucesso.");
      }else {
        alert("Não foi possível criar o fundo.");
      }

    }, function(error) {
      alert("Não foi possível criar o fundo.");
    });
  };

  // Implementa botão para cancelar criação de novo fundo
  $scope.cancelar = function() {
    $location.path('/listagem');
  };

  // Implementa função para adicionar uma nova cota (data e valor) no histórico de cotas
  $scope.adicionarCota = function() {
    var tabela= document.getElementById("historicoCotacaoTable");
    var row = tabela.insertRow(2);

    var dataInput = document.createElement("input");
    dataInput.type = "text";
    dataInput.className = "form-control";

    var valorInput = document.createElement("input");
    valorInput.type = "text";
    valorInput.className = "form-control";

    var cell1 = row.insertCell(0);
    cell1.appendChild(dataInput);
    var cell2 = row.insertCell(1);
    cell2.appendChild(valorInput);
  };

});
