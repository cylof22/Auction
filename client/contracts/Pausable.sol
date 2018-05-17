/**
 * @title Pausable
 * @dev Base contract which allows children to implement an emergency stop mechanism.
 */

pragma solidity ^0.4.16;

import "./Ownable.sol";

contract Pausable is Ownable {
  event Pause();
  event Unpause();
  event PauseBid();
  event UnpauseBid();
  event PauseUpload();
  event UnpauseUpload();

  bool public paused = false;
  bool public bidPaused = false;
  bool public uploadPaused = false;


  /**
   * @dev modifier to allow actions only when the contract IS paused
   */
  modifier whenNotPaused() {
    require(!paused);
    _;
  }

  /**
   * @dev modifier to allow actions only when the contract IS NOT paused
   */
  modifier whenPaused {
    require(paused);
    _;
  }

  /**
   * @dev called by the owner to pause, triggers stopped state
   */
  function pause() public onlyOwner whenNotPaused returns (bool) {
    paused = true;
    bidPaused = true;
    uploadPaused = true;
    Pause();
    return true;
  }

  /**
   * @dev called by the owner to unpause, returns to normal state
   */
  function unpause() public onlyOwner whenPaused returns (bool) {
    paused = false;
    bidPaused = false;
    uploadPaused = false;
    Unpause();
    return true;
  }


  /**
   * @dev modifier to allow bid actions only when the contract IS paused
   */
  modifier whenBidNotPaused() {
    require(!bidPaused);
    _;
  }

  /**
   * @dev modifier to allow bid actions only when the contract IS NOT paused
   */
  modifier whenBidPaused {
    require(bidPaused);
    _;
  }

  /**
   * @dev called by the owner to pause bid, triggers stopped state
   */
  function pauseBid() public onlyOwner whenNotPaused whenBidNotPaused returns (bool) {
    bidPaused = true;
    PauseBid();
    return true;
  }

  /**
   * @dev called by the owner to unpause bid, returns to normal state
   */
  function unpauseBid() public onlyOwner whenNotPaused whenBidPaused returns (bool) {
    bidPaused = false;
    UnpauseBid();
    return true;
  }


  /**
   * @dev modifier to allow bid actions only when the contract IS paused
   */
  modifier whenUploadNotPaused() {
    require(!uploadPaused);
    _;
  }

  /**
   * @dev modifier to allow upload actions only when the contract IS NOT paused
   */
  modifier whenUploadPaused {
    require(uploadPaused);
    _;
  }

  /**
   * @dev called by the owner to pause upload, triggers stopped state
   */
  function pauseUpload() public onlyOwner whenNotPaused whenUploadNotPaused returns (bool) {
    uploadPaused = true;
    PauseUpload();
    return true;
  }

  /**
   * @dev called by the owner to unpause upload, returns to normal state
   */
  function unpauseUpload() public onlyOwner whenNotPaused whenUploadPaused returns (bool) {
    uploadPaused = false;
    UnpauseUpload();
    return true;
  }
}
