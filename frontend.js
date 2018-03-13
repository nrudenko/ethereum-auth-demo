"use strict";

var ethUtil = require('ethereumjs-util')
var $ = require('jquery');
var Web3 = require('web3');

var signTextPrivate = function (from, text, next) {
  var msg = ethUtil.bufferToHex(new Buffer(text, 'utf8'));
  var params = [msg, from];
  var method = 'personal_sign';
  return web3
    .currentProvider
    .sendAsync({
      method,
      params,
      from
    }, function (err, result) {
      if (err) 
        next(result, err);
      if (result.error) 
        next(result, result.error);
      const msgParams = {
        data: msg,
        sig: result.result
      }
      next(msgParams, null);
    });
};

var authenticate = function (data) {
  console.log('PERSONAL SIGNED:' + JSON.stringify(data));
  $.ajax({
    type: "POST",
    url: 'http://localhost:8000/api/auth',
    data: JSON.stringify(data),
    success: saveToken,
    dataType: 'json'
  });
}

var saveToken = function (result) {
  console.log(result);
}

window.addEventListener('load', function () {

  window.web3 = new Web3(web3.currentProvider);

  $('#button').click(function (event) {
    var text = 'Welcome to the EtherApp!'
    web3
      .eth
      .getAccounts()
      .then(accounts => {
        signTextPrivate(accounts[0], text, authenticate);
      });

  });
})
