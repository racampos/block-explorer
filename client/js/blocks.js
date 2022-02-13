const axios = require('axios');
const simpleDatatables = require('simple-datatables');
window.addEventListener('DOMContentLoaded', event => {

    const ALCHEMY_URL = "https://eth-mainnet.alchemyapi.io/v2/eACTT4QCrNgGFcL1tK2wsa--6BxjD485";
    const INFURA_URL = "https://mainnet.infura.io/v3/c0a29833f77b4afa8ad9c53ebfbd7f8e";
    const RPC_URL = INFURA_URL;
    const numBlocks = 20;
    let showingBlocks = numBlocks;

    let table = document.createElement('table');
    let thead = document.createElement('thead');
    let tbody = document.createElement('tbody');

    let hBlock = document.createElement('th');
    hBlock.innerHTML = "Block";
    let hAge = document.createElement('th');
    hAge.innerHTML = "Age";
    let hTxs = document.createElement('th');
    hTxs.innerHTML = "Number of Txs";
    let hMiner = document.createElement('th');
    hMiner.innerHTML = "Miner";
    let hGas = document.createElement('th');
    hGas.innerHTML = "Gas Used";
    let hReward = document.createElement('th');
    hReward.innerHTML = "Reward";

    let hRow = document.createElement('tr');
    hRow.appendChild(hBlock);
    hRow.appendChild(hAge);
    hRow.appendChild(hTxs);
    hRow.appendChild(hMiner);
    hRow.appendChild(hGas);
    hRow.appendChild(hReward);

    thead.appendChild(hRow);

    async function getBlock(block) {
        response = await axios.post(RPC_URL, {
            jsonrpc: "2.0",
            id: 1,
            method: "eth_getBlockByNumber",
            params: [
                block,
                false
            ]
        })
        return response.data.result;
    }

    function insertRow() {
        let row = tbody.insertRow(0);
        let blockNumber = row.insertCell(0);
        let age = row.insertCell(1);
        let tx = row.insertCell(2);
        let miner = row.insertCell(3);
        let gasUsed = row.insertCell(4);
        let reward = row.insertCell(5);
        return {blockNumber, age, tx, miner, gasUsed, reward}
    }

    function addBlockToTable(block) {
        let row = insertRow();
        row.blockNumber.innerHTML = parseInt(block.number, 16);
        row.age.innerHTML = Math.floor(Math.abs(parseInt(block.timestamp, 16) - (Date.now() / 1000))) + " seconds ago";
        row.tx.innerHTML = `<a href="transactions.html?block=${block.number}">${block.transactions.length}</a>`;
        row.miner.innerHTML = block.miner;
        row.gasUsed.innerHTML = parseInt(block.gasUsed, 16);
        row.reward.innerHTML = "---"
        return row
    }
    
    async function populateTable() {
        latestBlock = await getBlock("latest");
        let number = parseInt(latestBlock.number) - numBlocks + 1;
        for (let i=0; i<numBlocks; i++) {
            let block = await getBlock("0x"+number.toString(16));
            addBlockToTable(block);
            number++;
        }
        table.appendChild(thead);
        table.appendChild(tbody);
        new simpleDatatables.DataTable(table);
        document.getElementById('numBlocks').innerHTML = `Showing latest ${showingBlocks} blocks from the Ethereum blockchain.`;
        setTimeout(pollData, 500);
    }
    populateTable();
    document.getElementById('table-container').appendChild(table);
    document.getElementById('numBlocks').innerHTML = `Retrieving latest ${numBlocks} blocks. Please wait...`;
    
    async function pollData() {
        let newBlock = await getBlock("latest");
        if (newBlock.number > latestBlock.number) {
            console.log("New block!")
            addBlockToTable(newBlock);
            latestBlock = newBlock;
            showingBlocks++;
            document.getElementById('numBlocks').innerHTML = `Showing latest ${showingBlocks} blocks from the Ethereum blockchain.`;
            document.getElementById('toast-text').innerHTML = `Block #${parseInt(newBlock.number, 16)} has just been mined.`;
            $(".toast").toast("show");
        }
        setTimeout(pollData, 500);
    }

    $(document).ready(function(){
        $(".toast").toast({
            autohide: true,
            animation: true,
            delay: 3000
        });
    });
    

});

