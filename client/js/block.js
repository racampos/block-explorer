const axios = require('axios');
const simpleDatatables = require('simple-datatables');
window.addEventListener('DOMContentLoaded', event => {

    const ALCHEMY_URL = "https://eth-mainnet.alchemyapi.io/v2/eACTT4QCrNgGFcL1tK2wsa--6BxjD485";
    const INFURA_URL = "https://mainnet.infura.io/v3/c0a29833f77b4afa8ad9c53ebfbd7f8e";
    const RPC_URL = INFURA_URL;
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const blockNumber = urlParams.get("height") || "latest";

    let table = document.createElement('table');
    let thead = document.createElement('thead');
    let tbody = document.createElement('tbody');

    let hParam = document.createElement('th');
    hParam.innerHTML = "Parameter";
    let hDescription = document.createElement('th');
    hDescription.innerHTML = "Description";

    let hRow = document.createElement('tr');
    hRow.appendChild(hParam);
    hRow.appendChild(hDescription);

    thead.appendChild(hRow);

    async function getBlock(block) {
        let response = await axios.post(RPC_URL, {
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

    function insertRow(param, description) {
        let row = tbody.insertRow(0);
        row.insertCell(0).innerHTML = param;
        row.insertCell(1).innerHTML = description;
    }
    
    async function populateTable() {
        let block = await getBlock(blockNumber);
        insertRow("Block Hash", block.hash);
        insertRow("Size", parseInt(block.size, 16) + " bytes");
        insertRow("Total Difficulty", parseInt(block.totalDifficulty, 16));
        insertRow("Difficulty", parseInt(block.difficulty, 16));
        insertRow("Gas Limit", parseInt(block.gasLimit, 16));
        insertRow("Gas Used", parseInt(block.gasUsed, 16));
        insertRow("Mined by", block.miner);
        insertRow("Transactions", `<a href="transactions.html?block=${block.number}">${block.transactions.length} transactions in this block</a>`)
        insertRow("Timestamp", new Date(block.timestamp * 1000));
        insertRow("Block Height", parseInt(blockNumber, 16));

        table.appendChild(thead);
        table.appendChild(tbody);
        new simpleDatatables.DataTable(table);
        document.getElementById('numTxs').innerHTML = `Showing block #${parseInt(block.number, 16)}.`;
        $( ".dataTable-top" ).hide();
        $( ".dataTable-bottom" ).hide();
    }
    populateTable();
    document.getElementById('table-container').appendChild(table);
    document.getElementById('numTxs').innerHTML = `Retrieving transactions. Please wait...`;

});

