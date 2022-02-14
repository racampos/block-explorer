const axios = require('axios');
const simpleDatatables = require('simple-datatables');
window.addEventListener('DOMContentLoaded', event => {

    const ALCHEMY_URL = "https://eth-mainnet.alchemyapi.io/v2/eACTT4QCrNgGFcL1tK2wsa--6BxjD485";
    const INFURA_URL = "https://mainnet.infura.io/v3/c0a29833f77b4afa8ad9c53ebfbd7f8e";
    const RPC_URL = INFURA_URL;
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const address = urlParams.get("address");

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

    async function getBalance(tx) {
        let response = await axios.post(RPC_URL, {
            jsonrpc: "2.0",
            id: 1,
            method: "eth_getBalance",
            params: [
                address,
                "latest"
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
        let balance = await getBalance(address);
        console.log(balance);
        insertRow("Balance", parseInt(balance, 16)/10**18 + " Ether");

        table.appendChild(thead);
        table.appendChild(tbody);
        new simpleDatatables.DataTable(table);
        document.getElementById('addressHeader').innerHTML = `Showing balance for account ${address}`;
        $( ".dataTable-top" ).hide();
        $( ".dataTable-bottom" ).hide();
    }
    populateTable();
    document.getElementById('table-container').appendChild(table);
    document.getElementById('addressHeader').innerHTML = `Retrieving balance. Please wait...`;

});

