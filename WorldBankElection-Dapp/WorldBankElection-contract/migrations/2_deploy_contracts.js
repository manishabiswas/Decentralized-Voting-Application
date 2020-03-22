var WorldBankElection = artifacts.require("WorldBankElection");
 
module.exports = function(deployer) {
  deployer.deploy(WorldBankElection,4);
};
