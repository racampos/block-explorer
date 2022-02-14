const axios = require('axios');
const simpleDatatables = require('simple-datatables');
window.addEventListener('DOMContentLoaded', event => {

    const ALCHEMY_URL = "https://eth-mainnet.alchemyapi.io/v2/eACTT4QCrNgGFcL1tK2wsa--6BxjD485";
    const INFURA_URL = "https://mainnet.infura.io/v3/c0a29833f77b4afa8ad9c53ebfbd7f8e";
    const RPC_URL = INFURA_URL;
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const blockNumber = urlParams.get("block") || "latest";

    let table = document.createElement('table');
    let thead = document.createElement('thead');
    let tbody = document.createElement('tbody');

    let hHash = document.createElement('th');
    hHash.innerHTML = "Txs Hash";
    let hMethod = document.createElement('th');
    hMethod.innerHTML = "Method";
    let hBlock = document.createElement('th');
    hBlock.innerHTML = "Block";
    let hAge = document.createElement('th');
    hAge.innerHTML = "Age";
    let hFrom = document.createElement('th');
    hFrom.innerHTML = "From";
    let hTo = document.createElement('th');
    hTo.innerHTML = "To";
    let hValue = document.createElement('th');
    hValue.innerHTML = "Value";

    let hRow = document.createElement('tr');
    hRow.appendChild(hHash);
    hRow.appendChild(hMethod);
    hRow.appendChild(hBlock);
    hRow.appendChild(hAge);
    hRow.appendChild(hFrom);
    hRow.appendChild(hTo);
    hRow.appendChild(hValue);

    thead.appendChild(hRow);

    async function getBlock(block) {
        response = await axios.post(RPC_URL, {
            jsonrpc: "2.0",
            id: 1,
            method: "eth_getBlockByNumber",
            params: [
                block,
                true
            ]
        })
        return response.data.result;
    }

    function insertRow() {
        let row = tbody.insertRow(0);
        let hash = row.insertCell(0);
        let method = row.insertCell(1);
        let block = row.insertCell(2);
        let age = row.insertCell(3);
        let from = row.insertCell(4);
        let to = row.insertCell(5);
        let value = row.insertCell(6);
        return {hash, method, block, age, from, to, value}
    }

    function addTxToTable(tx, block) {
        let row = insertRow();
        row.hash.innerHTML = `<a href="transaction.html?hash=${tx.hash}">${tx.hash}</a>`;
        let method = "Eth Transfer";
        if (tx.input != "0x") {
            method = tx.input.substring(0, 10);
        }
        row.method.innerHTML = method;
        row.block.innerHTML = `<a href="block.html?height=${block.number}">${parseInt(block.number, 16)}</a>`
        row.age.innerHTML = Math.floor(Math.abs(parseInt(block.timestamp, 16) - (Date.now() / 1000))) + " seconds ago";
        row.from.innerHTML = `<a href="account.html?address=${tx.from}">${tx.from}</a>`;
        row.to.innerHTML = `<a href="account.html?address=${tx.to}">${tx.to}</a>`;
        row.value.innerHTML = Math.round(parseInt(tx.value, 16)/10**9)/10**9 + " Ether";
        return row
    }
    
    async function populateTable() {
        let block = await getBlock(blockNumber);
        for (let tx of block.transactions) {
            addTxToTable(tx, block);
        }
        table.appendChild(thead);
        table.appendChild(tbody);
        new simpleDatatables.DataTable(table);
        if (blockNumber != "latest") {
            document.getElementById('numTxs').innerHTML = `Showing transactions for block #${parseInt(block.number, 16)}`;
        } else {
            document.getElementById('numTxs').innerHTML = `Showing transactions for the latest block`;
        }  
        $(function () {
            $('[data-toggle="tooltip"]').tooltip()
          })      
    }
    populateTable();
    document.getElementById('table-container').appendChild(table);
    document.getElementById('numTxs').innerHTML = `Retrieving transactions. Please wait...`;

});

