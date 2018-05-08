pragma solidity ^0.4.18;

import "./PictureCore.sol";


/// @title Kitty core with extra test fn and overrides
contract PictureCoreTest is PictureCore {
    // https://ethereum.stackexchange.com/questions/16318/inherited-constructors
    function PictureCoreTest() public {
    }

    /*** ALL TEST FUNCTIONS GO HERE: ***/

    /// @dev Contract owner can create kittens at will (test-only)
    /// @param _hash the actual genetic load of kittens
    /// @param _cloneCount how many are being created
    function mintPictures(string _hash, uint32 _cloneCount) public onlyCOO whenNotPaused {
        // NOTE: this method should be removed after ETHWaterloo
        // require(_hash > 0);
        require(_cloneCount > 0);

        for (uint256 i = 0; i < _cloneCount; i++) {
            _createPictureWithArtist(_hash, msg.sender, msg.sender);
        }
    }

    /// @dev for tests we can easily fund the contract
    function fundMe() public payable returns (bool) {
        return true;
    }

    function timeNow() public constant returns (uint256) {
        return now;
    }
}
