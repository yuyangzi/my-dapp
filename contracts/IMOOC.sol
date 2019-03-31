pragma solidity ^0.5.7;

contract CourseList {
    address public CEO;

    constructor() public {
        CEO = msg.sender;
    }
}
