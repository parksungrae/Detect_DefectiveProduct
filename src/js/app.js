App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',

  init: function() {
    return App.initWeb3();
  },
  /*web3.js is a javascript library that allows our client-side application to talk to the blockchain */
  initWeb3: async function() {
    if (typeof web3 != 'undefined'){
      //If a web3 instance is already provided by Meta Mask.
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    }else{
      // Specify default instance if no web3 instance provided
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
      web3 = new Web3(App.web3Provider);
    }
    return App.initContract();
  },

  initContract: function() {
    
    $.getJSON("Factory.json", function(Factory){
        App.contracts.Factory = TruffleContract(Factory);

        App.contracts.Factory.setProvider(App.web3Provider);

        return App.render();
    })
    

  },


  render: function(){
    var FactoryInstance;
    //var electionInstance;
    var loader = $("#loader");
    var content = $("#content");

    loader.hide();
    content.show();
    //Load account data
    web3.eth.getCoinbase(function(err, account){
      if (err == null){
        App.account = account;
        $("#accountAddress").html("Your Account: " + account);
      }
    });

    //Load contract data
    App.contracts.Factory.deployed().then(function(instance){
      
      FactoryInstance = instance;
      console.log(FactoryInstance.ProductCount());
      return FactoryInstance.ProductCount();
    }).then(function(ProductCount){
      var ProductResults = $("#ProductResults");
      ProductResults.empty();

      var ProductSelect = $("#ProductSelect");
      ProductSelect.empty();
      console.log(ProductCount);

      for(var i=1; i<=ProductCount; i++){
        FactoryInstance.Defective_Products(i).then(function(Product){
          var id = Product[0];
          var name = Product[1];
          var Defect_type = Product[2];

          // Render candidate Result
          var ProductTemplate = "<tr><th>" + id + "</th><td>" + name + "</td><td>" + Defect_type + "</td></tr>"
          ProductResults.append(ProductTemplate);

          // Render candidate ballot option
          var ProductOption = "<option value='"+id+"' >" + name + "</option>"
          ProductSelect.append(ProductOption);
        });
      }
      return FactoryInstance.true;
    });

  },

  addProduct: function(){
    var FactoryId = ProductCount;
    App.contracts.Factory.deployed().then(function(instance){
      return instance.addDefectiveProduct(FactoryId, "a", {from: App.account});
    });
  },

};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
