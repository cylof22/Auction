/// @title Handles creating auctions for sale and siring of kitties.
///  This wrapper of ReverseAuction exists only so that users can create
///  auctions with only one transaction.
pragma solidity ^0.4.16;
import "./PictureOwnership.sol";

contract PictureAuction is PictureOwnership {

    // @notice The auction contract variables are defined in KittyBase to allow
    //  us to refer to them in KittyOwnership to prevent accidental transfers.
    // `saleAuction` refers to the auction for gen0 and p2p sale of kitties.
    // `siringAuction` refers to the auction for siring rights of kitties.

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
    function createSaleAuction(uint256 _pictureId, uint256 _auctionType, uint256 _Price, uint256 _commission, uint256 _brokerage, address _styleOwner, uint256 _duration) external whenNotPaused {
        // Auction contract checks input sizes
        // If kitty is already on any auction, this will throw
        // because it will be owned by the auction contract.
        require(_owns(msg.sender, _pictureId));

        _approve(_pictureId, saleAuction);
        // Sale auction throws if inputs are invalid and clears
        // transfer and sire approval after escrowing the kitty.
        saleAuction.createAuction(
            _pictureId,
            _auctionType,
            _Price,
            _commission,
            _brokerage,
            _styleOwner,
            _duration,
            msg.sender
        );
    }
}
