const path = require('path')
const assert = require('assert')
const Web3 = require('web3')
const ganache = require('ganache-cli')
const web3 = new Web3(ganache.provider())
// 引入合约的json
const CourseList = require(path.resolve(__dirname, '../src/compiled/IMOOC-Course.json'))
const Course = require(path.resolve(__dirname, '../src/compiled/IMOOC-CourseList.json'))

// 定义几个全局变量，所有测试都需要
let accounts
// 实例
let courseList
let course

// beforeEach(async () => {
//   // 测试前数据初始化
//   accounts = await web3.eth.getAccounts()
//   course = await new web3.eth.Contract(Course.abi)
//     .deploy({ data: '0x' + Course.evm.bytecode.object })
//     .send({
//       from: accounts[9],
//       gas: '5000000',
//     }, (e, x) => {
//       console.log(e)
//       console.log(x)
//     })
// })

describe('测试课程的智能', () => {

  before(async () => {
    // 测试前数据初始化
    accounts = await web3.eth.getAccounts()
    course = await new web3.eth.Contract(Course.abi)
      .deploy({ data: '0x' + Course.evm.bytecode.object })
      .send({
        from: accounts[9],
        gas: '5000000',
      }, (e, x) => {
        console.log(e)
        console.log(x)
      })
  })

  it('测试新增课程', async () => {
    // const name = course.methods.courseName().call()
    // console.log(name)
    return console.log(1111);
  })
})
