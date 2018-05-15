pragma solidity ^0.4.16;

import "./PictureAccessControl.sol";
import "./SaleClockAuction.sol";

/// @title Base contract for PictureChain. Holds all common structs, events and base variables.
/// @author Mason Wong
/// @dev See the PictureCore contract documentation to understand how the various contract facets are arranged.
contract PictureBase is PictureAccessControl {
    /*** EVENTS ***/

    /// @dev The Birth event is fired whenever a new picture comes into existence. This obviously
    ///  includes any time a picture is created through the giveBirth method, but it is also called
    ///  when a new gen0 cat is created.
    event CreatePictureWithStyle(address owner, string hashValue, string styleHash, address styleOwner);

    /// @dev The Birth event is fired whenever a new picture comes into existence. This obviously
    ///  includes any time a picture is created through the giveBirth method, but it is also called
    ///  when a new gen0 cat is created.
    event CreatePictureWithArtist(address owner, string hashValue, address styleOwner);

    /// @dev The Birth event is fired whenever a new picture comes into existence. This obviously
    ///  includes any time a picture is created through the giveBirth method, but it is also called
    ///  when a new gen0 cat is created.
    event CreatePicture(address owner, string hashValue);

    /// @dev Transfer event as defined in current draft of ERC721. Emitted every time a picture
    ///  ownership is assigned, including births.
    event Transfer(address from, address to, uint256 tokenId);

    /*** DATA TYPES ***/

    /// @dev The main Picture struct. Every picture in PictureChain is represented by a copy
    ///  of this structure, so great care was taken to ensure that it fits neatly into
    ///  exactly two 256-bit words. Note that the order of the members in this structure
    ///  is important because of the byte-packing rules used by Ethereum.
    struct Picture {
        // The Picture's hash value is packed into these 256-bits, the format is
        // sooper-sekret! A picture's hash value never change.
        string hashValue;

        // The timestamp from the block when this picture came into existence.
        uint64 birthTime;

        // style id to find the style owner, therefore we can inform it that his style picture was used.
        string styleHash;

        // artist is diff with maker. maker is the first owner.
        // artist is the style of the picture used during creating in the platform
        address styleOwner;

        // the first owner of the picture, which will not been changed for ever.
        address maker;
    }

    // An approximation of currently how many seconds are in between blocks.
    uint256 public secondsPerBlock = 15;

    /*** STORAGE ***/

    /// @dev An array containing the Picture struct for all Pictures in existence. The ID
    ///  of each cat is actually an index into this array. Note that ID 0 is a negacat,
    ///  the unKitty, the mythical beast that is the parent of all gen0 cats. A bizarre
    ///  creature that is both matron and sire... to itself! Has an invalid genetic code.
    ///  In other words, cat ID 0 is invalid... ;-)
    Picture[] pictures;

    /// @dev A mapping from cat IDs to the address that owns them. All pictures have
    ///  some valid owner address, even gen0 cats are created with a non-zero owner.
    mapping (uint256 => address) public pictureIndexToOwner;

    // @dev A mapping from owner address to count of tokens that address owns.
    //  Used internally inside balanceOf() to resolve ownership count.
    mapping (address => uint256) public ownershipTokenCount;

    /// @dev A mapping from PictureIDs to an address that has been approved to call
    ///  transferFrom(). Each Picture can only have one approved address for transfer
    ///  at any time. A zero value means no approval is outstanding.
    mapping (uint256 => address) public pictureIndexToApproved;

    /// @dev The address of the ClockAuction contract that handles sales of Pictures. This
    ///  same contract handles both peer-to-peer sales as well as the gen0 sales which are
    ///  initiated every 15 minutes.
    SaleClockAuction public saleAuction;

    /// @dev Assigns ownership of a specific Picture to an address.
    function _transfer(address _from, address _to, uint256 _tokenId) internal {
        // Since the number of picture is capped to 2^32 we can't overflow this
        ownershipTokenCount[_to]++;
        // transfer ownership
        pictureIndexToOwner[_tokenId] = _to;
        // When creating new picture _from is 0x0, but we can't account that address.
        if (_from != address(0)) {
            ownershipTokenCount[_from]--;
            // clear any previously approved ownership exchange
            delete pictureIndexToApproved[_tokenId];
        }
        // Emit the transfer event.
        Transfer(_from, _to, _tokenId);
    }

    /// @dev An internal method that creates a new picture and stores it. This
    ///  method doesn't do any checking and should only be called when the
    ///  input data is known to be valid. Will generate both a CreatePictureWithStyle event
    ///  and a Transfer event.
    /// @param _hashValue The new picture's hash value which identify the picture in the platform
    /// @param _styleHash The style picture's hash value, could be nil
    /// @param _styleOwnerAdd The style picture's owner, should be stored previously since its owner could be changed.
    /// @param _owner The inital owner of this picture, must be non-zero (except for the unKitty, ID 0)
    function _createPictureWithStyle(
        string _hashValue,
        string _styleHash,
        address _styleOwnerAdd,
        address _owner
    )
        internal
        returns (uint)
    {
        // These requires are not strictly necessary, our calling code should make
        // sure that these conditions are never broken. However! _createPicture() is already
        // an expensive call (for storage), and it doesn't hurt to be especially careful
        // to ensure our data structures are always valid.

        Picture memory _picture = Picture({
            hashValue: _hashValue,
            birthTime: uint64(now),
            styleHash: _styleHash,
            styleOwner: _styleOwnerAdd,
            maker:_owner
        });
        uint256 newPictureId = pictures.push(_picture) - 1;

        // It's probably never going to happen, 4 billion cats is A LOT, but
        // let's just be 100% sure we never let this happen.
        require(newPictureId == uint256(uint32(newPictureId)));

        // emit the make event
        CreatePictureWithStyle(
            _owner,
            _hashValue,
            _styleHash,
            _styleOwnerAdd
        );

        // This will assign ownership, and also emit the Transfer event as
        // per ERC721 draft
        _transfer(0, _owner, newPictureId);

        return newPictureId;
    }

    /// @dev An internal method that creates a new picture and stores it. This
    ///  method doesn't do any checking and should only be called when the
    ///  input data is known to be valid. Will generate both a Make event
    ///  and a Transfer event.
    /// @param _hashValue The picture's hash value.
    /// @param _styleOwner The style model's owner - artist.
    /// @param _owner The inital owner of this picture, must be non-zero (except for the unKitty, ID 0)
    function _createPictureWithArtist(
        string _hashValue,
        address  _styleOwner,
        address _owner
    )
        internal
        returns (uint)
    {
        // style picture is not needed, but we need style
        Picture memory _picture = Picture({
            hashValue: _hashValue,
            birthTime: uint64(now),
            styleHash: "",
            styleOwner: _styleOwner,
            maker:_owner
        });
        uint256 newPictureId = pictures.push(_picture) - 1;

        // It's probably never going to happen, 4 billion cats is A LOT, but
        // let's just be 100% sure we never let this happen.
        require(newPictureId == uint256(uint32(newPictureId)));

        // emit the make event
        CreatePictureWithArtist(
            _owner,
            _hashValue,
            _styleOwner
        );

        // This will assign ownership, and also emit the Transfer event as
        // per ERC721 draft
        _transfer(0, _owner, newPictureId);

        return newPictureId;
    }

    /// @dev An internal method that creates a new picture and stores it. This
    ///  method doesn't do any checking and should only be called when the
    ///  input data is known to be valid. Will generate both a Make event
    ///  and a Transfer event.
    /// @param _hashValue The picture's hash value.
    /// @param _owner The inital owner of this picture, must be non-zero (except for the unKitty, ID 0)
    function _createPicture(
        string _hashValue,
        address _owner
    )
        internal
        returns (uint)
    {
        // style picture is not needed, but we need style
        Picture memory _picture = Picture({
            hashValue: _hashValue,
            birthTime: uint64(now),
            styleHash: "",
            styleOwner: address(0),
            maker:_owner
        });
        uint256 newPictureId = pictures.push(_picture) - 1;

        // It's probably never going to happen, 4 billion cats is A LOT, but
        // let's just be 100% sure we never let this happen.
        require(newPictureId == uint256(uint32(newPictureId)));

        // emit the make event
        CreatePicture(
            _owner,
            _hashValue
        );

        // This will assign ownership, and also emit the Transfer event as
        // per ERC721 draft
        _transfer(0, _owner, newPictureId);

        return newPictureId;
    }

    // Any C-level can fix how many seconds per blocks are currently observed.
    function setSecondsPerBlock(uint256 secs) external onlyCLevel {
        //require(secs < cooldowns[0]);
        secondsPerBlock = secs;
    }
}
