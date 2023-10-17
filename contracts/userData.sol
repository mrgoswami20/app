// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract PatientDataStore {
    address public owner;
    
    // Mapping to store patient data, where the key is the patient's Ethereum address
    mapping(address => string) private patientData;

    constructor() {
        owner = msg.sender;
    }

    // Modifier to restrict access to only the owner
    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can call this function");
        _;
    }

    // Function for the owner to insert patient data
    function insertPatientData(address patientAddress, string memory data) public onlyOwner {
        patientData[patientAddress] = data;
    }

    // Function for patients to retrieve their own data
    function getPatientData() public view returns (string memory) {
        return patientData[msg.sender];
    }

    // Function to check if a patient has data stored
    function hasPatientData(address patientAddress) public view returns (bool) {
        return bytes(patientData[patientAddress]).length > 0;
    }
}
