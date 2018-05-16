/// @title all functions related to creating kittens
pragma solidity ^0.4.16;

import "./PictureAuction.sol";

contract PictureMinting is PictureAuction {

    // Limits the number of pictures the contract owner can ever create.
    uint256 public constant PROMO_CREATION_LIMIT = 5000;
    uint256 public constant GEN0_CREATION_LIMIT = 45000;

    // Constants for gen0 auctions.
    uint256 public constant GEN0_STARTING_PRICE = 10 finney;
    uint256 public constant GEN0_AUCTION_DURATION = 1 days;

    // Counts the number of cats the contract owner has created.
    uint256 public promoCreatedCount;
    uint256 public gen0CreatedCount;

    /// @dev we can create promo pictures, up to a limit. Only callable by COO
    /// @param _hash the encoded hash of the picture to be created, any value is accepted
    /// @param _owner the future owner of the created kittens. Default to contract COO
    function createPromoPicture(string _hash, address _owner) external onlyCOO {
        address pictureOwner = _owner;
        if (pictureOwner == address(0)) {
            pictureOwner = cooAddress;
        }
        require(promoCreatedCount < PROMO_CREATION_LIMIT);

        promoCreatedCount++;
        _createPictureWithArtist(_hash, pictureOwner, pictureOwner);
    }

    /// @dev Creates a new gen0 picture with the given genes and
    ///  creates an auction for it.
    function createGen0Auction(string _hash) external onlyCOO {
        require(gen0CreatedCount < GEN0_CREATION_LIMIT);

        uint256 pictureId = _createPictureWithArtist(_hash, address(this), address(this));
        _approve(pictureId, saleAuction);

        saleAuction.createAuction(
            pictureId,
            0,            // by default the auction is fixed price
            _computeNextGen0Price(),
            1000,
            0,
            address(this),
            GEN0_AUCTION_DURATION,
            address(this),
            false
        );

        gen0CreatedCount++;
    }

    /// @dev Computes the next gen0 auction starting price, given
    ///  the average of the past 5 prices + 50%.
    function _computeNextGen0Price() internal view returns (uint256) {
        uint256 avePrice = saleAuction.averageGen0SalePrice();

        // Sanity check to ensure we don't overflow arithmetic
        require(avePrice == uint256(uint128(avePrice)));

        uint256 nextPrice = avePrice + (avePrice / 2);

        // We never auction for less than starting price
        if (nextPrice < GEN0_STARTING_PRICE) {
            nextPrice = GEN0_STARTING_PRICE;
        }

        return nextPrice;
    }
}
