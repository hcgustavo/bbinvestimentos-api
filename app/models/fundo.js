// get an instace of mongoose and mongoose.Schema
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('Fundo', new Schema({
  id: Number,
  codigo: String,
  nome: String,
  prazoCarteira: String,
  categoria: String,
  rentabilidade: {
    dia: Number,
    mes: Number,
    mesAnterior: Number,
    ano: Number,
    meses12: Number,
    meses24: Number,
    meses36: Number
  },
  plMedio12Meses: Number,
  taxaAdm: Number,
  historicoCotacao: [{data: String, valor: Number}],
  info: {
    descricao: String,
    aplicacaoInicial: Number,
    aplicacoesSubsequentes: Number,
    resgate: Number,
    saldoMinimo: Number,
    cotaAplicacao: String,
    cotaResgate: String,
    creditoContaCorrente: String,
    horarioLimiteMovimentacao: String,
    aplicacaoResgateProgramado: Boolean,
    opcaoResgateAutomatico: Boolean,
    grauRisco: String,
    dataInicioFuncionamento: String,
    taxaSaida: Number,
    taxaPerformance: Number,
    categoriaANBIMA: String
  }
}, {timestamps: true}));
