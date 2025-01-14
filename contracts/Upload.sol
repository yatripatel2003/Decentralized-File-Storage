// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

contract Upload {
  struct Access {
     address user; 
     bool access; // true or false
  }
  
  mapping(address => string[]) private value;
  mapping(address => mapping(address => bool)) private ownership;
  mapping(address => Access[]) private accessList;
  mapping(address => mapping(address => bool)) private previousData;

  // Adds a new URL to the user's data list
  function add(address _user, string memory url) external {
      value[_user].push(url);
  }

  // Allows access to a specified user
  function allow(address user) external {
      ownership[msg.sender][user] = true;

      if (previousData[msg.sender][user]) {
          for (uint i = 0; i < accessList[msg.sender].length; i++) {
              if (accessList[msg.sender][i].user == user) {
                  accessList[msg.sender][i].access = true;
                  break; // Stop loop once found
              }
          }
      } else {
          accessList[msg.sender].push(Access(user, true));
          previousData[msg.sender][user] = true;
      }
  }

  // Disallows access to a specified user
  function disallow(address user) external {
      ownership[msg.sender][user] = false;

      for (uint i = 0; i < accessList[msg.sender].length; i++) {
          if (accessList[msg.sender][i].user == user) {
              accessList[msg.sender][i].access = false;
              break; // Stop loop once found
          }
      }
  }

  // Displays the data of a specific user if the caller has access
  function display(address _user) external view returns (string[] memory) {
      require(_user == msg.sender || ownership[_user][msg.sender], "You don't have access");
      return value[_user];
  }

  // Returns the access list of the caller
  function shareAccess() external view returns (Access[] memory) {
      return accessList[msg.sender];
  }
}
