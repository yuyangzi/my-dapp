const fs = require('fs');
const path = require('path');
const util = require('util');
const solc = require('solc');
// 智能合约文件地址
const contractPath = path.resolve(__dirname, '../contracts/IMOOC.sol');

// 获取智能合约内容
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

readFile(contractPath, 'utf-8')
    .then(fileData => {
        const input = {
            language: 'Solidity',
            sources: {
                'IMOOC.sol': {
                    content: fileData
                }
            },
            settings: {
                outputSelection: {
                    '*': {
                        '*': ['*']
                    }
                }
            }
        };
        const output = JSON.parse(solc.compile(JSON.stringify(input)));
        return output.contracts;
    })
    .then(contracts => {
        Object.keys(contracts).forEach(contractName => {
            const fileName = contractName.split('.')[0];
            writeFile(path.resolve(__dirname, `../src/compiled/${fileName}.json`), JSON.stringify(contracts[contractName]))
                .then(console.log)
        })
    });

