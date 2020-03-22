App = {
  web3Provider: null,
  contracts: {},
  names: new Array(),
  url: 'http://127.0.0.1:7545',
  chairPerson:null,
  currentAccount:null,
  init: async function() {
    $.getJSON('../candidate.json', function(data) {
      var proposalRow = $('#proposalRow');
      var proposalTemplate = $('#proposalTemplate');

      for (i = 0; i < data.length; i ++) {
        proposalTemplate.find('.panel-title').text(data[i].nomination);
        proposalTemplate.find('img').attr('src', data[i].picture);
        proposalTemplate.find('.candidate_name').text(data[i].Name);
        proposalTemplate.find('.candidate_location').text(data[i].Nationality);
        proposalTemplate.find('.btn-vote').attr('data-id', data[i].id);
        proposalTemplate.find('.btn-totalvote').attr('data-id', data[i].id);
        proposalTemplate.find('.btn-downvote').attr('data-id', data[i].id);

        proposalRow.append(proposalTemplate.html());
        App.names.push(data[i].Name);
      }
    });
    return await App.initWeb3();
  },

  initWeb3: async function() {
        // Is there is an injected web3 instance?
        if (typeof web3 !== 'undefined') {
          App.web3Provider = web3.currentProvider;
        } else {
      // If no injected web3 instance is detected, fallback to the TestRPC
      App.web3Provider = new Web3.providers.HttpProvider(App.url);
    }
    web3 = new Web3(App.web3Provider);

    ethereum.enable();

    App.populateAddress();
    return App.initContract();
  },

  initContract: function() {
    $.getJSON('WorldBankElection.json', function(data) {
    // Get the necessary contract artifact file and instantiate it with truffle-contract
    var voteArtifact = data;
    App.contracts.WorldBankElection = TruffleContract(voteArtifact);

    // Set the provider for our contract
    App.contracts.WorldBankElection.setProvider(App.web3Provider);
    
    App.getChairperson();
    return App.bindEvents();
  });
  },

  bindEvents: function() {
    $(document).on('click', '.btn-vote', App.handleVote);
    $(document).on('click', '.btn-totalvote', App.handleVoteCount);
    $(document).on('click', '.btn-downvote', App.handleDownCount);
    $(document).on('click', '#change-state', App.handleState);
    $(document).on('click', '#declare-winner', App.handleWinner);
    $(document).on('click', '#chairperson', App.printChairperson);  
    $(document).on('click', '#register', function(){ var ad = $('#enter_address').val(); var voter_type= $( "#voter_type option:selected" ).val(); App.handleRegister(ad,voter_type); });
  },

  populateAddress : function(){
    new Web3(new Web3.providers.HttpProvider(App.url)).eth.getAccounts((err, accounts) => {
      jQuery.each(accounts,function(i){
        if(web3.eth.coinbase != accounts[i]){
          var optionElement = '<option value="'+accounts[i]+'">'+accounts[i]+'</option';
          jQuery('#enter_address').append(optionElement); 
        }
      });
    });
  },

  printChairperson: function(){
    App.contracts.WorldBankElection.deployed().then(function(instance) {
      return instance;
    }).then(function(result) {
      alert(web3.eth.coinbase);
    })
  },

  getChairperson : function(){
    App.contracts.WorldBankElection.deployed().then(function(instance) {
      return instance;
    }).then(function(result) {
      App.chairPerson = result.constructor.currentProvider.selectedAddress.toString();
      App.currentAccount = web3.eth.coinbase;
    })
  },

  handleState:function(){
    var e = document.getElementById("status_type");
    var state_type = e.options[e.selectedIndex].value;
    var voteInstance;
    web3.eth.getAccounts(function(error, accounts) {
      var account = accounts[0];
      App.contracts.WorldBankElection.deployed().then(function(instance) {
        voteInstance = instance;
        return voteInstance.changeState(state_type, {from: web3.eth.coinbase});
      }).then(function(result, err){
        if(result){
          if(parseInt(result.receipt.status) == 1)
            alert(state_type + " state changed successfully")
          else
            alert(state_type + " state change is not successfull due to revert")
        } else {
          alert(state_type + " state change failed")
        }   
      });
    });
  },

  handleRegister: function(addr, v_type){
    var voteInstance;
    App.contracts.WorldBankElection.deployed().then(function(instance) {
      voteInstance = instance;
      return voteInstance.register(addr, v_type);
    }).then(function(result, err){
      if(result){
        if(parseInt(result.receipt.status) == 1)
          alert(addr + " registration done successfully")
        else
          alert(addr + " registration not done successfully due to revert")
      } else {
        alert(addr + " registration failed")
      }   
    });
  },

  handleVote: function(event) {
    event.preventDefault();
    var candidateId = parseInt($(event.target).data('id'));
    var voteInstance;

    web3.eth.getAccounts(function(error, accounts) {
      var account = accounts[0];

      App.contracts.WorldBankElection.deployed().then(function(instance) {
        voteInstance = instance;

        return voteInstance.vote(candidateId, {from: account});
      }).then(function(result, err){
        if(result){

          if(parseInt(result.receipt.status) == 1)
            alert(account + " voting done successfully")
          else
            alert(account + " voting not done successfully due to revert")
        } else {
          alert(account + " voting failed")
        }   
      });
    });
  },
  handleDownCount: function(event) {
    event.preventDefault();
    var candidateId = parseInt($(event.target).data('id'));
    var voteInstance;

    web3.eth.getAccounts(function(error, accounts) {
      var account = accounts[0];

      App.contracts.WorldBankElection.deployed().then(function(instance) {
        voteInstance = instance;

        return voteInstance.Downvote(candidateId, {from: account});
      }).then(function(result, err){
        if(result){

          if(parseInt(result.receipt.status) == 1)
            alert(account + " down vote done successfully")
          else
            alert(account + " down vote not done successfully due to revert")
        } else {
          alert(account + " down vote failed")
        }   
      });
    });
  },
  handleVoteCount: function(event) {
    event.preventDefault();
    var candidateId = parseInt($(event.target).data('id'));
    var voteInstance;
    App.contracts.WorldBankElection.deployed().then(function(instance) {
      voteInstance = instance;
      return voteInstance.voteCount(candidateId);
    }).then(function(result, err){
      if(result){
        alert(" The vote count is " + result.c[0]);
      } 
    });
  },
  handleWinner : function() {
    var voteInstance;
    App.contracts.WorldBankElection.deployed().then(function(instance) {
      voteInstance = instance;
      return voteInstance.reqWinner();
    }).then(function(res){
      alert(App.names[res] + "is the winner ! :)");
    }).catch(function(err){
      console.log(err.message);
    })
  }
};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
