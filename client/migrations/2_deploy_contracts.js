var ConvertLib = artifacts.require("./ConvertLib.sol");
var MetaCoin = artifacts.require("./MetaCoin.sol");
var PictureAccessControl = artifacts.require("./PictureAccessControl");
var PictureBase = artifacts.require("./PictureBase");
var PictureOwnership = artifacts.require("./PictureOwnership");
var PictureAuction = artifacts.require("./PictureAuction");
var PictureMinting = artifacts.require("./PictureMinting");
var PictureCore = artifacts.require("./PictureCore");

module.exports = function(deployer) {
  deployer.deploy(ConvertLib);
  deployer.link(ConvertLib, MetaCoin);
  deployer.deploy(MetaCoin);


  deployer.deploy(PictureAccessControl).then(() => {
    return deployer.deploy(PictureBase)
  }).then(() => {
    return deployer.deploy(PictureOwnership)
  }).then(() => {
    return deployer.deploy(PictureAuction)
  }).then(() => {
    return deployer.deploy(PictureMinting)
  }).then(() => {
    return deployer.deploy(PictureCore)
  });
};
