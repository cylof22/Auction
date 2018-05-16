const debug = require("debug")("ck");
const BigNumber = require("bignumber.js");

var PictureAccessControl = artifacts.require("./PictureAccessControl");
var PictureBase = artifacts.require("./PictureBase");
var PictureOwnership = artifacts.require("./PictureOwnership");
var PictureAuction = artifacts.require("./PictureAuction");
var PictureMinting = artifacts.require("./PictureMinting");
const SaleClockAuction = artifacts.require("./SaleClockAuction.sol");
const util = require("./util.js");
const PictureCore = artifacts.require("./PictureCoreTest.sol");

const NULL_ADDRESS = "0x0000000000000000000000000000000000000000";

const eq = assert.equal.bind(assert);

// test style picture and basic aipicturn information
contract('PictureCore', function(accounts) {
  var ceo = accounts[0];
  var coo = accounts[1];
  var cfo = accounts[2];
  let picture;
  let saleAuctionContact;
  const logEvents = [];
  const pastEvents = [];

  const user1 = accounts[3];
  const user2 = accounts[4];
  const user3 = accounts[5];

  async function deployContract() {
    debug("deploying contract");
    picture = await PictureCore.new();
    // the deployer is the original CEO and can appoint a new one
    await picture.setCEO(ceo);
    await picture.setCOO(coo);
    await picture.setCFO(cfo);

    saleAuctionContact = await SaleClockAuction.new(picture.address, {from : coo});
    await picture.setSaleAuctionAddress(saleAuctionContact.address, {from: ceo});

    await picture.unpause({ from: ceo });
    const eventsWatch = picture.allEvents();
    eventsWatch.watch((err, res) => {
      if (err) return;
      pastEvents.push(res);
      debug(">>", res.event, res.args);
    });

    logEvents.push(eventsWatch);
  }

  after(function() {
    logEvents.forEach(ev => ev.stopWatching());
  });

  describe("Initial state", function() {
    before(deployContract);

    it("should own contract", async function() {
      const cooAddress = await picture.cooAddress();
      assert.equal(cooAddress, coo, "coo address should be set correctly.");

      const nPicutres = await picture.totalSupply();
      assert.equal(nPicutres, 0, "there is only 0 picture initialized");
    });
  });

  describe("picture creation:", function() {
    before(deployContract);

    it("create a promotional pictures", async function() {
      // pictures with arbitrary hash
      await picture.createPromoPicture("Picture 1", NULL_ADDRESS, { from: coo });
      await picture.createPromoPicture("Picture 2", "", { from: coo });
      await picture.createPromoPicture("Picture 3", "0x0", { from: coo });
      await picture.createPromoPicture("Picture 4", user2, { from: coo });

      const nPictures = await picture.totalSupply();
      // 4 created
      assert.equal(nPictures.toNumber(), 4, "there are 4 pictures initialized");

      let owner;
      owner = await picture.pictureIndexToOwner(1);
      assert.equal(owner, coo, "owner should be coo");

      owner = await picture.pictureIndexToOwner(2);
      assert.equal(owner, coo, "owner should be coo");

      owner = await picture.pictureIndexToOwner(3);
      assert.equal(owner, coo, "owner should be coo");

      owner = await picture.pictureIndexToOwner(4);
      assert.equal(owner, user2, "owner should be user2");
    });
  });

  describe("NonFungible, EIP-721", function() {
    let picA, picB, picC, picD;
    before(deployContract);

    it("create a few pictures", async function() {
      // breed 4 Pictures
      await picture.mintPictures("minted", 10, { from: coo });
      picA = 1;
      picB = 2;
      picC = 3;
      picD = 4;
      let total = await picture.totalSupply();
      assert.equal(total.toNumber(), 10, "10 pictures were created.");
    });

    it("approve + transferFrom + ownerOf", async function() {
      await picture.approve(user1, picC, { from: coo });
      let owner;
      owner = await picture.ownerOf(picC);
      assert.equal(owner, coo, "picC's owner should be coo");
      await picture.transferFrom(coo, user1, picC, { from: user1 });
      owner = await picture.ownerOf(picC);
      assert.equal(owner, user1, "now picC's owner should be user1");
    });

    it("balanceOf", async function() {
      assert.equal(await picture.balanceOf(coo), 9, "coo has 9 pictures now");
      assert.equal(await picture.balanceOf(user1), 1, "user1 has 1 picture now");
      assert.equal(await picture.balanceOf(user2), 0, "user2 hasn't picture");
    });
  });

  describe("test auctions", function() {
    before(deployContract);

    it("test auction owner", async function() {
      const ownerAddr = await saleAuctionContact.owner();
      const nftAddr = await saleAuctionContact.nonFungibleContract();
      eq(ownerAddr, coo);
      eq(nftAddr, picture.address);
    });

    it("test fixed price auction", async function() {
      // create 1 Picture
      await picture.mintPictures("minted", 1, { from: coo });
      picA = 1;
      let seller = coo;

      // check seller's balance

      // check seller's remaining tokens
      let count;
      count = await picture.balanceOf(seller);
      assert.equal(count, 1, "seller has 1 pictures");
      let isGoods = false;
      // create 1 fixed price auctions
      await picture.createSaleAuction(picA, 0, 10000, 1000, 1000, seller, 6000, isGoods, {from : seller}); // fixed price/10000/10%/10%

      count = await picture.balanceOf(seller);
      assert.equal(count, 0, "seller has 0 pictures");

      const sellerBal = await web3.eth.getBalance(seller);

      count = await picture.balanceOf(saleAuctionContact.address);
      assert.equal(count, 1, "auction contact has 1 picture");

      owner = await picture.ownerOf(picA);
      assert.equal(owner, saleAuctionContact.address, "picA's owner should be saleAuctionContact.address");

      // check the price of the auctions
      const auctionA = await saleAuctionContact.getAuction(picA);
      assert.equal(auctionA[2], 10000, "PicA's price is 10000 eth");

      const contactBal = await web3.eth.getBalance(saleAuctionContact.address);
      const user1Bal = await web3.eth.getBalance(user1);

      // step 1 : show the intention to buy the token
      // Not transfer picA from coo to user1, waiting for confirming
      await saleAuctionContact.buyItNow(picA, {from:user1, value:10000});
      owner = await picture.ownerOf(picA);
      assert.equal(owner, saleAuctionContact.address, "picA's owner should be contact");

      count = await picture.balanceOf(saleAuctionContact.address);
      assert.equal(count, 1, "auction contact has 1 pictures");

      // step 2 : confirm the buy behavior and then transfer the token to buyer
      await saleAuctionContact.confirmBuy(picA, {from:user1});
      owner = await picture.ownerOf(picA);
      assert.equal(owner, user1, "picA's owner should be user1");

      count = await picture.balanceOf(saleAuctionContact.address);
      assert.equal(count, 0, "auction contact has 0 pictures");

      // seller did not achieve the money? is it for testing?
      const sellerBalLater = await web3.eth.getBalance(seller);
      //assert.equal(sellerBalLater.toNumber()-sellerBal.toNumber(), 10000, "seller sold the token");
      assert(sellerBalLater.gt(sellerBal));

      // check contact's balance, money is in the contact, but not transfer to seller?
      const contactBalLater = await web3.eth.getBalance(saleAuctionContact.address);
      assert.equal(contactBal.toNumber()+1000, contactBalLater.toNumber());
    });

    it("test bid auctions", async function() {
      // create 4 Pictures
      await picture.mintPictures("minted", 1, { from: coo });
      picA = 2;
      let seller = coo;

      let count;
      count = await picture.balanceOf(seller);
      assert.equal(count, 1, "coo has 1 pictures");
      let isGoods = false;
      // create 1 auctions
      await picture.createSaleAuction(picA, 1, 20000, 1000, 1000, seller, 6000, isGoods, {from : seller}); // auction/20000/10%/10%

      count = await picture.balanceOf(seller);
      assert.equal(count, 0, "seller has 0 pictures");

      const sellerBal = await web3.eth.getBalance(seller);

      count = await picture.balanceOf(saleAuctionContact.address);
      assert.equal(count, 1, "auction contact has 1 picture");

      // check the price of the auctions
      const auctionA = await saleAuctionContact.getAuction(picA);
      assert.equal(auctionA[2], 20000, "PicA's price is 10000 eth");

      const contactBal = await web3.eth.getBalance(saleAuctionContact.address);
      const user1Bal = await web3.eth.getBalance(user1);

      // transfer picA from seller to user1
      await saleAuctionContact.bid(picA, {from:user1, value:30000});
      let auction = await saleAuctionContact.getAuction(picA);
      assert.equal(auction[2], 30000, "PicA's price is 30000 eth");
      assert.equal(auction[3], user1, "PicA's bidder is user1 ");

      // not change the owner
      count = await picture.balanceOf(saleAuctionContact.address);
      assert.equal(count, 1, "auction contact has 0 pictures");

      const sellerBalBid1 = await web3.eth.getBalance(seller);
      assert.equal(sellerBalBid1.toNumber(), sellerBal.toNumber(), "after bid 1, seller didnot seld the token, user1 just bid the token.");

      // check contact's balance, money is in the contact
      const contactBalBid1 = await web3.eth.getBalance(saleAuctionContact.address);
      assert.equal(contactBal.toNumber()+30000, contactBalBid1.toNumber(), "after bid 1, money still in contact and with the bid");

      const user1BalBid1 = await web3.eth.getBalance(user1);
      //assert.equal(user1Bal.toNumber(), user1BalBid1.toNumber(), "after bid 1, user1 pay 30000 into the contact and the gas");

      // bid picA with 40000
      const user3Bal = await web3.eth.getBalance(user3);

      await saleAuctionContact.bid(picA, {from:user3, value:40000});
      auction = await saleAuctionContact.getAuction(picA);
      assert.equal(auction[2], 40000, "PicA's price is 40000 eth");
      assert.equal(auction[3], user3, "PicA's bidder is user3 ");

      // not change the owner
      count = await picture.balanceOf(saleAuctionContact.address);
      assert.equal(count, 1, "auction contact has 0 pictures");

      const sellerBalBid2 = await web3.eth.getBalance(seller);
      assert.equal(sellerBalBid1.toNumber(), sellerBalBid2.toNumber(), "after bid 2, seller didnot seld the token, user3 just bid the token.");

      // check contact's balance, money is in the contact
      const contactBalBid2 = await web3.eth.getBalance(saleAuctionContact.address);
      assert.equal(contactBalBid1.toNumber()+10000, contactBalBid2.toNumber(), "after bid 2, the bid price is 10000 more than previous one");

      const user3BalBid2 = await web3.eth.getBalance(user3);
      //assert.equal(user3Bal.toNumber(), user3BalBid2.toNumber(), "after bid 2, user3 pay 40000 into the contact and the gas");
      assert(user3Bal.gt(user3BalBid2));

      // note : revious bidder should draw back the coin, but the bidder will cost some gas at sending transaction
      const user1BalBid2 = await web3.eth.getBalance(user1);
      //assert.equal(user1BalBid2.toNumber() - user1BalBid1.toNumber(), 30000, "after bid 2, user1 pay back 30000");
      assert(user1BalBid2.gt(user1BalBid1));

      /* test confirmBid
      // note : after lifehood of the contact, bidder to finalize bid, otherwise, exception found
      await saleAuctionContact.confirmBid(picA);

      // not change the owner
      count = await picture.balanceOf(saleAuctionContact.address);
      assert.equal(count, 0, "auction contact has 0 pictures");

      //const sellerBalPay = await web3.eth.getBalance(seller);
      //assert.equal(sellerBalPay.toNumber()-sellerBalBid2.toNumber(), 40000, "after confirmation, seller didnot seld the token, user3 just bid the token.");

      // check contact's balance, money is in the contact
      const contactBalPay = await web3.eth.getBalance(saleAuctionContact.address);
      assert.equal(contactBalBid2.toNumber()-contactBalPay.toNumber(), 36000, "after confimation, contact get the commission");  //
      */
    });

  });

  describe("Roles: CEO + CFO", async function() {
    it("COO try to appoint another COO, but cant", async function() {
      // that is the case because we override OZ ownable function
      //await util.expectThrow(picture.setCOO(user2));
    });
    it("CEO can appoint a CFO", async function() {
      //await util.expectThrow(picture.setCFO(cfo));
      await picture.setCFO(cfo, { from: ceo });
    });
    it("CEO can appoint another coo", async function() {
      await picture.setCOO(user1, { from: ceo });
    });
    it("new coo can do things, old coo cant anymore", async function() {
      //await util.expectThrow(picture.mintPictures(10, "from old coo", { from: coo }));
      await picture.mintPictures("from new coo - user1",10, { from: user1 });
    });
    it("CEO can appoint another CEO", async function() {
      //await util.expectThrow(picture.setCEO(user2, { from: coo }));
      await picture.setCEO(user2, { from: ceo });
    });
    it("old CEO cant do anything since they were replaced", async function() {
      //await util.expectThrow(picture.setCEO(user3, { from: ceo }));
      await picture.setCEO(ceo, { from: user2 });
    });
    it("CFO can drain funds", async function() {
      await picture.fundMe({ value: web3.toWei(0.05, "ether") });
      const ctoBalance1 = web3.eth.getBalance(cfo);
      debug("cfo balance was", ctoBalance1);
      await picture.withdrawBalance({ from: cfo });
      const ctoBalance2 = web3.eth.getBalance(cfo);
      debug("cfo balance is ", ctoBalance2);
      assert(ctoBalance2.gt(ctoBalance1));
    });
  });

  describe("Contract Upgrade", function() {

    before(deployContract);

    it("reinitialize the pictures", async function () {
      await picture.mintPictures("first pictures mint", 4, { from: coo });
      await picture.mintPictures("second pictures mint", 2, { from: coo });
      const nPictures = await picture.totalSupply();
      eq(nPictures.toNumber(), 6);
      //await picture.transfer(user1, 5);
    });

    it("user2 fails to pause contract - not coo", async function() {
      //await util.expectThrow(picture.pause({ from: user2 }));
    });

    it("coo can pause the contract", async function() {
      await picture.pause({ from: coo });
      const isPaused = await picture.paused();
      eq(isPaused, true);
    });

    it("can read state of all pictures while paused", async function() {
      const nPictures = await picture.totalSupply();
      eq(nPictures.toNumber(), "6");
      let attr = await picture.getPicture(1);
      eq(attr[0], "first pictures mint");
      eq(attr[2], "");
      eq(attr[3], coo);
      eq(attr[4], coo);
    });

    it("unpause", async function() {
      await picture.unpause({ from: ceo });
      const isPaused = await picture.paused();
      eq(isPaused, false);
    });

    it("set new contract address", async function() {
      const picture2 = await PictureCore.new();
      //await util.expectThrow(picture.setNewAddress(picture2.address));
      await picture.pause({ from: ceo });
      // CEO can appoint a new COO even while paused
      await picture.setCOO(ceo, { from: ceo });
      await picture.setNewAddress(picture2.address, { from: ceo });
      const newAddress = await picture.newContractAddress();
      debug("new contract address is ", newAddress);
      eq(newAddress, picture2.address);
      // cannot unpause if new contract address is set
      //picture.unpause({ from: ceo });
    });
  });
});
