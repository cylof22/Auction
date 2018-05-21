/// @title Handles creating auctions for sale of pictures.
///  This wrapper of ReverseAuction exists only so that users can create
///  auctions with only one transaction.
pragma solidity ^0.4.16;
import "./PictureOwnership.sol";

contract PictureAuction is PictureOwnership {

    // @notice The auction contract variables are defined in PictureBase to allow
    //  us to refer to them in PictureOwnership to prevent accidental transfers.
    // `saleAuction` refers to the auction for gen0 and p2p sale of pictures.

    /// @dev Sets the reference to the sale auction.
    /// @param _address - Address of sale contract.
    function setSaleAuctionAddress(address _address) external onlyCEO {
        SaleClockAuction candidateContract = SaleClockAuction(_address);

        // NOTE: verify that a contract is what we expect - https://github.com/Lunyr/crowdsale-contracts/blob/cfadd15986c30521d8ba7d5b6f57b4fefcc7ac38/contracts/LunyrToken.sol#L117
        require(candidateContract.isSaleClockAuction());

        // Set the new contract address
        saleAuction = candidateContract;
    }

    /// @dev Put a picture up for auction.
    ///  Does some ownership trickery to create auctions in one tx.
    function createSaleAuction(
        uint256 _pictureId,
        uint256 _auctionType,
        uint256 _Price,
        uint256 _commission,
        uint256 _brokerage,
        address _styleOwner,
        uint256 _duration,
        bool _isGoods
        ) external whenNotPaused {
        // Auction contract checks input sizes
        // If picture is already on any auction, this will throw
        // because it will be owned by the auction contract.
        require(_owns(msg.sender, _pictureId));

        _approve(_pictureId, saleAuction);
        // Sale auction throws if inputs are invalid and clears
        // transfer and sire approval after escrowing the picture.
        saleAuction.createAuction(
            _pictureId,
            _auctionType,
            _Price,
            _commission,
            _brokerage,
            _styleOwner,
            _duration,
            msg.sender,
            _isGoods
        );
    }

    // upload the picture of owner, not handle with AI from platform
    function uploadPicture(string _hashValue, address _owner) external whenUploadNotPaused returns(uint256 tokenId)
    {
        return _createPicture(_hashValue, _owner);
    }

    // upload the picture of owner, handled with AI artist mode from platform
    function uploadPictureWithArtist(string _hashValue, address _styleOwner, address _owner) external whenUploadNotPaused returns(uint256 tokenId)
    {
        return _createPictureWithArtist(_hashValue, _styleOwner, _owner);
    }

    // upload the picture of owner, handled with AI style picture mode from platform
    function uploadPictureWithArtist(string _hashValue, string _styleHash,address _styleOwner, address _owner) external whenUploadNotPaused returns(uint256 tokenId)
    {
        return _createPictureWithStyle(_hashValue, _styleHash, _styleOwner, _owner);
    }
}
