/// @title Auction Core
/// @dev Contains models, variables, and internal methods for the auction.
/// @notice We omit a fallback function to prevent accidental sends to this contract.

pragma solidity ^0.4.16;

import "./ERC721.sol";

contract ClockAuctionBase {

    // Represents an auction on an NFT
    struct Auction {
        // Current owner of NFT
        address seller;
        uint128 auctionType;

        // current price set by the bidder
        uint128 price;
        address bidder;

        // pay money when dealling to platform
        // Values 0-10,000 map to 0%-100%
        uint128 commission;

        // the fee to the 3rd party which providing the specific style picture or style
        // Values 0-10,000 map to 0%-100%
        uint128 brokerage;
        address styleOwner;

        // Duration (in seconds) of auction
        uint64 duration;
        // Time when auction started
        // NOTE: 0 if this auction has been concluded
        uint64 startedAt;
    }

    // Reference to contract tracking NFT ownership
    ERC721 public nonFungibleContract;

    // Map from token ID to their corresponding auction.
    mapping (uint256 => Auction) tokenIdToAuction;

    event AuctionCreated(uint256 tokenId, uint256 price, uint256 duration, address styleOwner, uint256 brokerage);
    event ConfirmAuction(uint256 tokenId, uint256 totalPrice, address winner, address styleOwner, uint256 brokerage);
    event Bid(uint256 tokenId, uint256 newPrice, address bidder);
    event PayBack(uint256 tokenId, uint256 prePrice, address preBidder);
    event WantoToBuy(uint256 tokenId, uint256 price, address buyer);
    event Buy(uint256 tokenId, uint256 price, address buyer, address styleOwner, uint256 brokerage);
    event AuctionCancelled(uint256 tokenId);

    /// @dev Returns true if the claimant owns the token.
    /// @param _claimant - Address claiming to own the token.
    /// @param _tokenId - ID of token whose ownership to verify.
    function _owns(address _claimant, uint256 _tokenId) internal view returns (bool) {
        return (nonFungibleContract.ownerOf(_tokenId) == _claimant);
    }

    /// @dev Escrows the NFT, assigning ownership to this contract.
    /// Throws if the escrow fails.
    /// @param _owner - Current owner address of token to escrow.
    /// @param _tokenId - ID of token whose approval to verify.
    function _escrow(address _owner, uint256 _tokenId) internal {
        // it will throw if transfer fails
        nonFungibleContract.transferFrom(_owner, this, _tokenId);
    }

    /// @dev Transfers an NFT owned by this contract to another address.
    /// Returns true if the transfer succeeds.
    /// @param _receiver - Address to transfer NFT to.
    /// @param _tokenId - ID of token to transfer.
    function _transfer(address _receiver, uint256 _tokenId) internal {
        // it will throw if transfer fails
        nonFungibleContract.transfer(_receiver, _tokenId);
    }

    /// @dev Adds an auction to the list of open auctions. Also fires the
    ///  AuctionCreated event.
    /// @param _tokenId The ID of the token to be put on auction.
    /// @param _auction Auction to add.
    function _addAuction(uint256 _tokenId, Auction _auction) internal {
        // Require that all auctions have a duration of
        // at least one minute. (Keeps our math from getting hairy!)
        require(_auction.duration >= 1 minutes);

        tokenIdToAuction[_tokenId] = _auction;

        AuctionCreated(
            uint256(_tokenId),
            uint256(_auction.price),
            uint256(_auction.duration),
            _auction.styleOwner,
            uint256(_auction.brokerage)
        );
    }

    /// @dev Cancels an auction unconditionally.
    function _cancelAuction(uint256 _tokenId) internal {
        Auction storage auction = tokenIdToAuction[_tokenId];
        address seller = auction.seller;
        address bidder = auction.bidder;
        uint128 price = auction.price;
        _removeAuction(_tokenId);
        _transfer(seller, _tokenId);
        if (bidder != address(0)) {
            bidder.transfer(price);
        }
        AuctionCancelled(_tokenId);
    }

    function _buyItNow(uint256 _tokenId) internal returns(uint256) {
        // Get a reference to the auction struct
        Auction storage auction = tokenIdToAuction[_tokenId];

        // Explicitly check that this auction is currently live.
        // (Because of how Ethereum mappings work, we can't just count
        // on the lookup above failing. An invalid _tokenId will just
        // return an auction object that is all zeros.)
        require(_isOnAuction(auction));
        require(auction.bidder == address(0));   // only one buyer is allow to buy this token
        auction.bidder = msg.sender;             // change the bidder for this token

        // Check that the bid is greater than or equal to the current price
        uint128 price = _currentPrice(auction);

        // Tell the world!
        WantoToBuy(_tokenId, price, msg.sender);

        return price;
    }

    function _confirmBuy(uint256 _tokenId) internal returns(uint256) {
        // Get a reference to the auction struct
        Auction storage auction = tokenIdToAuction[_tokenId];

        // Explicitly check that this auction is currently live.
        // (Because of how Ethereum mappings work, we can't just count
        // on the lookup above failing. An invalid _tokenId will just
        // return an auction object that is all zeros.)
        require(_isOnAuction(auction));
        require(auction.bidder == msg.sender);    // only the buyer can confirm the deal

        // Check that the bid is greater than or equal to the current price
        uint128 price = _currentPrice(auction);

        uint128 commission = auction.commission;
        require(commission <= 10000);

        // Grab a reference to the seller before the auction struct
        // gets deleted.
        address seller = auction.seller;

        // pay money to the style owner
        address styleOwner = auction.styleOwner;
        uint128 brokerage = auction.brokerage;
        require(brokerage <= 10000);


        // The bid is good! Remove the auction before sending the fees
        // to the sender so we can't have a reentrancy attack.
        _removeAuction(_tokenId);

        // Transfer proceeds to seller and style owner if have
        if (price > 0) {
            _doPayment(seller, price, commission, brokerage, styleOwner);
        }

        // Tell the world!
        Buy(_tokenId, price, msg.sender, styleOwner, brokerage);

        return price;
    }

    /// @dev Replace the bidder and new price and transfer the money to the pre-bidder back.
    /// Does NOT transfer ownership of token.
    function _bid(uint256 _tokenId, uint256 _bidAmount)
        internal
        returns (uint256)
    {
        // Get a reference to the auction struct
        Auction storage auction = tokenIdToAuction[_tokenId];
        require(_bidAmount == uint256(uint128(_bidAmount)));

        // Explicitly check that this auction is currently live.
        // (Because of how Ethereum mappings work, we can't just count
        // on the lookup above failing. An invalid _tokenId will just
        // return an auction object that is all zeros.)
        require(_isOnAuction(auction));

        // Check that the bid is greater than the current price
        uint128 prePrice = _currentPrice(auction);

        address preBidder = auction.bidder;
        require(preBidder != msg.sender);

        // Transfer proceeds to seller and style owner if have
        if (_bidAmount > prePrice) {
            auction.bidder = msg.sender;
            auction.price = uint128(_bidAmount);

            if (prePrice > 0 && preBidder != address(0))
            {
                preBidder.transfer(prePrice);
                PayBack(_tokenId, prePrice, preBidder);
            }
        }

        // Tell the world the new bidder and the price
        Bid(_tokenId, _bidAmount, msg.sender);

        return _bidAmount;
    }

    function _confirmBid(uint256 _tokenId) internal returns(uint256) {
        // Get a reference to the auction struct
        Auction storage auction = tokenIdToAuction[_tokenId];

        // Explicitly check that this auction is currently live.
        // (Because of how Ethereum mappings work, we can't just count
        // on the lookup above failing. An invalid _tokenId will just
        // return an auction object that is all zeros.)
        //require(_isOnAuction(auction));
        require(_isAuctionFinished(auction));

        // Check that the bid is greater than or equal to the current price
        uint128 price = _currentPrice(auction);
        address bidder = auction.bidder;
        // has bidder to pay the price for the token
        require(bidder != 0);

        uint128 commission = auction.commission;
        require(commission <= 10000);

        // Grab a reference to the seller before the auction struct
        // gets deleted.
        address seller = auction.seller;

        // pay money to the style owner
        address styleOwner = auction.styleOwner;
        uint128 brokerage = auction.brokerage;
        require(brokerage <= 10000);

        // The bid is good! Remove the auction before sending the fees
        // to the sender so we can't have a reentrancy attack.
        _removeAuction(_tokenId);

        // Transfer proceeds to seller and style owner if have
        if (price > 0) {
            _doPayment(seller, price, commission, brokerage, styleOwner);
        }

        // Tell the world!
        ConfirmAuction(_tokenId, price, msg.sender, styleOwner, brokerage);

        return price;
    }

    /// @dev Removes an auction from the list of open auctions.
    /// @param _tokenId - ID of NFT on auction.
    function _removeAuction(uint256 _tokenId) internal {
        delete tokenIdToAuction[_tokenId];
    }

    /// @dev Returns true if the NFT is on auction.
    /// @param _auction - Auction to check.
    function _isOnAuction(Auction storage _auction) internal view returns (bool) {
        return (_auction.startedAt > 0 && uint64(now) < _auction.startedAt + _auction.duration);
    }

    function _isAuctionFinished(Auction storage _auction) internal view returns(bool) {
        return (uint64(now) >= _auction.startedAt + _auction.duration);
    }

    function _isActiveAuction(Auction storage _auction) internal view returns(bool) {
        return (_auction.startedAt > 0);
    }

    function _doPayment(address seller, uint128 _totalPrice, uint128 _commission, uint128 _brokerage, address _styleOwner) internal {
        // the cut includes the fee to platform and to 3rd party style owner
        uint256 auctioneerCut = _totalPrice - _totalPrice * _commission / 10000 - _totalPrice * _brokerage / 10000;

        // NOTE: Doing a transfer() in the middle of a complex
        // method like this is generally discouraged because of
        // reentrancy attacks and DoS attacks if the seller is
        // a contract with an invalid fallback function. We explicitly
        // guard against reentrancy attacks by removing the auction
        // before calling transfer(), and the only thing the seller
        // can DoS is the sale of their own asset! (And if it's an
        // accident, they can call cancelAuction(). )
        seller.transfer(auctioneerCut);

        // do transfer to style owner
        if (_brokerage > 0) {
            uint256 fee2StyleOwner = _brokerage * _totalPrice / 10000;
            _styleOwner.transfer(fee2StyleOwner);
        }
    }

    /// @dev Returns current price of an NFT on auction. Broken into two
    ///  functions (this one, that computes the duration from the auction
    ///  structure, and the other that does the price computation) so we
    ///  can easily test that the price computation works correctly.
    function _currentPrice(Auction storage _auction)
        internal
        view
        returns (uint128)
    {
        return _auction.price;
    }
}
