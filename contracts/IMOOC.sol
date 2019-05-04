pragma solidity ^0.5.7;

contract CourseList {
    address payable public CEO;

    Course[] public courses;

    constructor() public {
        CEO = msg.sender;
    }

    function createCourse(string memory courseName, string memory content,
        uint target, uint fundingPrice, uint price, string memory imgHash) public {
        Course newCourse = new Course(CEO, msg.sender, courseName, content, target, fundingPrice, price, imgHash);
        courses.push(newCourse);
    }

    // 获取课程地址
    function getCourse() public view returns (Course[] memory) {
        return courses;
    }

    // 删除课程
    function removeCourse(uint _index) public {
        // 只有CEO能删除课程
        require(msg.sender == CEO);

        // 根据索引删除
        require(_index < courses.length);

        uint len = courses.length;
        for (uint i = _index; i < len - 1; i++) {
            courses[i] = courses[i + 1];
        }

        delete courses[len - 1];
        courses.length--;
    }

    function isCEO() public view returns (bool) {
        return msg.sender == CEO;
    }
}

contract Course {

    address payable public CEO;

    address payable public owner;

    // 课程名称
    string public courseName;

    // 课程介绍
    string public content;

    // 众筹目标
    uint public target;

    // 众筹价格
    uint public fundingPrice;

    // 课程价格
    uint public price;

    // 课程图片在IPFS上的hash
    string public imgHash;

    // 视频在IPFS上的hash
    string public videoHash;

    bool public isOnline;

    // 众筹的人数
    uint public count;

    // 用户购买信息
    mapping(address => uint) users;

    constructor(address payable _CEO, address payable _owner, string memory _courseName, string memory _content,
        uint _target, uint _fundingPrice, uint _price, string memory _imgHash) public {
        CEO = _CEO;
        owner = _owner;
        courseName = _courseName;
        content = _content;
        target = _target;
        fundingPrice = _fundingPrice;
        price = _price;
        imgHash = _imgHash;
        courseName = _courseName;
        videoHash = '';
        isOnline = false;
        count = 0;
    }

    // 众筹或购买
    function buy() public payable {
        // 1. 用户没有购买过
        require(users[msg.sender] == 0);

        if (isOnline) {
            // 如果上线了, 必须用上线价格购买
            require(price == msg.value);
        } else {
            // 如果没有上线, 则用众筹价格购买
            require(fundingPrice == msg.value);
        }

        users[msg.sender] = msg.value;

        count += 1;

        // 如果众筹的钱超过目标值
        if (target <= count * fundingPrice) {

            if (isOnline) {
                // 上线之后的购买
                uint value = msg.value;
                // 分成
                CEO.transfer(value / 10);
                owner.transfer(value - value / 10);
            } else {
                // 上线之前, 第一次超出

                // 上线
                isOnline = true;

                // 转账 -上线之前的钱都在合约内部, 众筹者是拿不到的
                owner.transfer(count * fundingPrice);
            }

        }
    }

    // 获取详情
    function getDetail() public view returns (string memory, string memory, uint, uint, uint, string memory, string memory, bool, uint, uint) {
        // 权限
        uint role;
        if (owner == msg.sender) {
            // 课程创建者
            role = 0;

        } else if (users[msg.sender] > 0) {
            // 已购买
            role = 1;
        } else {
            // 未购买
            role = 2;
        }
        return (
        courseName,
        content,
        target,
        fundingPrice,
        price,
        imgHash,
        videoHash,
        isOnline,
        count,
        role
        );
    }


}
