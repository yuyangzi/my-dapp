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
        if (output.contracts) {
            return output.contracts;
        } else {
            throw output.errors;
        }
    })
    .then(contracts => {
        Object.keys(contracts).forEach(contractName => {
            const fileName = contractName.split('.')[0];
            const compiledPath = path.resolve(__dirname, `../src/compiled/${fileName}.json`);
            writeFile(compiledPath, JSON.stringify(contracts[contractName]))
                .then(() => console.log(`${fileName}.json: 写入成功`))
                .catch(error => console.log(`${fileName}: 写入失败`, error))
        })
    }, error => {
        console.log(`--------------error Start--------------`);
        error.forEach(errorObj => console.log(`${errorObj.type}: ${errorObj.formattedMessage}`));
        console.log(`--------------error End--------------`);
    });


