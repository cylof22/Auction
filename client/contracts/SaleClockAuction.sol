/// @title Clock auction modified for sale of kitties
/// @notice We omit a fallback function to prevent accidental sends to this contract.
pragma solidity ^0.4.16;

import "./ClockAuction.sol";

contract SaleClockAuction is ClockAuction {

    // @dev Sanity check that allows us to ensure that we are pointing to the
    //  right auction in our setSaleAuctionAddress() call.
    bool public isSaleClockAuction = true;

    // Tracks last 5 sale price of gen0 picture sales
    uint256 public gen0SaleCount;
    uint256[5] public lastGen0SalePrices;

    // Delegate constructor
    function SaleClockAuction(address _nftAddr) public
        ClockAuction(_nftAddr) {}

    /// @dev Creates and begins a new auction.
    /// @param _tokenId - ID of token to auction, sender must be owner.
    /// @param _price - Price of item (in wei) at beginning of auction.
    /// @param _duration - Length of auction (in seconds).
    /// @param _seller - Seller, if not the message sender
    function createAuction(
        uint256 _tokenId,
        uint256 _auctionType,
        uint256 _price,
        uint256 _commission,
        uint256 _brokerage,
        address _styleOwner,
        uint256 _duration,
        address _seller,
        bool    _isGoods
    )
        external
    {
        // Sanity check that no inputs overflow how many bits we've allocated
        // to store them in the auction struct.
        require(_price == uint256(uint128(_price)));
        require(_commission == uint256(uint128(_commission)));
        require(_brokerage == uint256(uint128(_brokerage)));
        require(_duration == uint256(uint64(_duration)));

        require(msg.sender == address(nonFungibleContract));

        _escrow(_seller, _tokenId);

        Auction memory auction = Auction(
            _seller,
            uint128(_auctionType),
            uint128(_price),
            address(0),
            uint128(_commission),
            uint128(_brokerage),
            _styleOwner,
            uint64(_duration),
            uint64(now),
            _isGoods,
            0
        );

        _addAuction(_tokenId, auction);
    }

    /// @dev Updates lastSalePrice if seller is the nft contract
    /// Otherwise, works the same as default bid method.
    function confirmBid(uint256 _tokenId)
        external
        payable
    {
        // _bid verifies token ID size
        address seller = tokenIdToAuction[_tokenId].seller;
        _confirmBid(_tokenId);
        _transfer(msg.sender, _tokenId);
    }

    /// @dev Updates lastSalePrice if seller is the nft contract
    /// Otherwise, works the same as default bid method.
    function bid(uint256 _tokenId)
        external
        payable
    {
        // transfer the bidder and price and pay money back to the pre-bidder
        _bid(_tokenId, msg.value);
    }

    /// @dev Updates lastSalePrice if seller is the nft contract
    /// Otherwise, works the same as default bid method.
    function confirmBuy(uint256 _tokenId)
        external
        payable
    {
        // _bid verifies token ID size
        address seller = tokenIdToAuction[_tokenId].seller;
        _confirmBuy(_tokenId);
        _transfer(msg.sender, _tokenId);
    }

    /// @dev Updates lastSalePrice if seller is the nft contract
    /// Otherwise, works the same as default bid method.
    function buyItNow(uint256 _tokenId)
        external
        payable
    {
        // transfer the bidder and price and pay money back to the pre-bidder
        _buyItNow(_tokenId);
    }

    function averageGen0SalePrice() external view returns (uint256) {
        uint256 sum = 0;
        for (uint256 i = 0; i < 5; i++) {
            sum += lastGen0SalePrices[i];
        }
        return sum / 5;
    }

}
