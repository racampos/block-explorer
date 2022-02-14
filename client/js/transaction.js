const axios = require('axios');
const simpleDatatables = require('simple-datatables');
window.addEventListener('DOMContentLoaded', event => {

    const ALCHEMY_URL = "https://eth-mainnet.alchemyapi.io/v2/eACTT4QCrNgGFcL1tK2wsa--6BxjD485";
    const INFURA_URL = "https://mainnet.infura.io/v3/c0a29833f77b4afa8ad9c53ebfbd7f8e";
    const RPC_URL = INFURA_URL;
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const txHash = urlParams.get("hash") || "latest";

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

    async function getTx(tx) {
        let response = await axios.post(RPC_URL, {
            jsonrpc: "2.0",
            id: 1,
            method: "eth_getTransactionByHash",
            params: [
                tx
            ]
        })
        return response.data.result;
    }

    async function getBlock(block) {
        let response = await axios.post(RPC_URL, {
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

    function insertRow(param, description) {
        let row = tbody.insertRow(0);
        row.insertCell(0).innerHTML = param;
        row.insertCell(1).innerHTML = description;
    }
    
    async function populateTable() {
        let tx = await getTx(txHash);
        let block = await getBlock(tx.blockNumber);
        console.log(tx);
        insertRow("Gas Price", parseInt(tx.gasPrice, 16)/10**9 + " Gwei");
        // insertRow("Transaction Fee", parseInt(tx.gas, 16) * parseInt(tx.gasPrice, 16));
        insertRow("Value", parseInt(tx.value, 16)/10**18 + " Ether");
        insertRow("To", `<a href="account.html?address=${tx.to}">${tx.to}</a>`);
        insertRow("From", `<a href="account.html?address=${tx.from}">${tx.from}</a>`)
        insertRow("Timestamp", new Date(block.timestamp * 1000));
        insertRow("Block", `<a href="block.html?height=${tx.blockNumber}">${parseInt(tx.blockNumber, 16)}</a>`)
        // insertRow("Status", tx.status);
        insertRow("Transaction Hash", tx.hash);

        table.appendChild(thead);
        table.appendChild(tbody);
        new simpleDatatables.DataTable(table);
        document.getElementById('numTxs').innerHTML = `Showing transaction #${txHash}`;
        $( ".dataTable-top" ).hide();
        $( ".dataTable-bottom" ).hide();
    }
    populateTable();
    document.getElementById('table-container').appendChild(table);
    document.getElementById('numTxs').innerHTML = `Retrieving transactions. Please wait...`;

});

