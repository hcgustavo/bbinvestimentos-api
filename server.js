/********** get the packages we need **********/
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');

var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config = require('./config'); // get our config file
var Usuario = require('./app/models/usuario'); // get our mongoose model
var Fundo = require('./app/models/fundo');



/********** configuration **********/
var port = process.env.PORT || 8080;
mongoose.connect(config.database); // connect to database
app.set('superSecret', config.secret); // secret variable

// use body parser so we can get info from POST and/or URL parameters
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(express.static(__dirname + "/public"));

// use morgan to log requests to the console
app.use(morgan('dev'));




/********** routes **********/

// get an instance of the router for api routes
var apiRoutes = express.Router();

// route para retornar todos os fundos (GET http://localhost:8080/api/fundos)
apiRoutes.get('/fundos', function(req, res) {
  Fundo.find({}).select('id codigo nome').exec(function(err, fundos) {
    if(err) throw err;

    var length = fundos.length;
    var resArray = new Array();
    for(i = 0; i < length; i++) {
      var fundo = {id: fundos[i].id, codigo: fundos[i].codigo, nome: fundos[i].nome};
      resArray.push(fundo);
    }
    var obj = {total: length, resultados: resArray};

    res.status(200).json(obj);
  });

});

// route para retornar um fundo pelo id ou código (GET http://localhost:8080/api/fundos/:{id or codigo})
apiRoutes.get('/fundos/:p', function(req, res) {
  if(isNaN(req.params.p)) {
    Fundo.findOne({codigo: req.params.p}, function(err, fundo) {
      if(err) throw err;

      res.status(200).json(fundo);
    });
  }
  else {
    Fundo.findOne({id: req.params.p}, function(err, fundo) {
      if(err) throw err;

      res.status(200).json(fundo);
    });
  }
});

// route para autenticar um usuário (POST http://localhost:8080/api/autenticacao)
apiRoutes.post('/autenticacao', function(req, res) {
  Usuario.findOne({
    email: req.body.email
  }, function(err, usuario) {
    if(err) throw err;

    if(!usuario) {
      res.json({success: false, message: 'Autenticação falhou. Usuário não encontrado.'});
    } else if(usuario) {
      // check if password matches
      if(usuario.password != req.body.password) {
        res.json({success: false, message: 'Autenticação falhou. Senha errada.'});
      } else {
        // if user is found and password is right
        // create token
        var token = jwt.sign(usuario, app.get('superSecret'), {
          expiresIn: 86400 // expires in 24 hours
        });

        // return the information including token as json
        res.json({
          success: true,
          message: 'Enjoy your token!',
          token: token
        });
      }
    }
  });
});

// route middleware to verify a token
apiRoutes.use(function(req, res, next) {
  // check header or url parameters or post parameters for token
  var token = req.body.token || req.query.token || req.headers['x-access-token'];

  // decode token
  if(token) {
    // verifies secret and checks exp
    jwt.verify(token, app.get('superSecret'), function(err, decoded) {
      if(err) {
        return res.json({success: false, message: 'Failed to authenticate token.'});
      } else {
        // if everything is good, save request for use in other routes
        req.decoded = decoded;
        next();
      }
    });
  } else {
    // if there is no token
    // return an error
    return res.status(403).send({
      success: false,
      message: 'No token provided.'
    });
  }
});


// route para atualizar um fundo pelo id (PUT http://localhost:8080/api/fundos/id)
apiRoutes.put('/fundos/:id', function(req, res) {
  var fundo = req.body;

  Fundo.update({id: req.params.id}, fundo, function(err, raw) {
    if(err) throw err;

    if(raw.ok == 1) {
      res.status(200).json({success: true});
    }else {
      res.json({success: false});
    }

  });

});

// route para criar um fundo (POST http://localhost:8080/api/fundos/criar)
apiRoutes.post('/fundos/criar', function(req, res) {
  var fundo = new Fundo(req.body);

  fundo.save(function(err) {
    if(err) throw err;

    console.log('Fundo criado com sucesso.');
    res.status(200).json({success: true});
  });
});

// route para deleter um fundo pelo id (DELETE http://localhost:8080/apu/fundos/id)
apiRoutes.delete('/fundos/:id', function(req, res) {
  Fundo.remove({id: req.params.id}, function(err) {
    if(err) throw err;

    res.status(200).json({success: true});
  });
});

// apply the routes to our application with the prefix /api
app.use('/api', apiRoutes);




/********** start the server **********/
app.listen(port);
console.log('App running at http://localhost:' + port);
