# decentralized cryptocurrency exchange

## Technology Stack & Tools

- Solidity (Writing Smart Contract)
- Javascript (React & Testing)
- [Hardhat](https://hardhat.org/) (Development Framework)
- [Ethers.js](https://docs.ethers.io/v5/) (Blockchain Interaction)
- [React.js](https://reactjs.org/) (Frontend Framework)
- [Redux](https://redux.js.org/) (State Management)

## Requirements For Initial Setup
- Install [NodeJS](https://nodejs.org/en/)
- Install [Hardhat](https://hardhat.org/)

## Setting Up
### 1. Clone/Download the Repository

### 2. Install Dependencies:
```
$ npm install
```
### 3. Boot up local development blockchain
```
$ npx hardhat node
```
### 4. Run deployment script
`npx hardhat run scripts/1_deploy.js --network localhost`

### 5. Run seeding script
`npx hardhat run scripts/2_seed-exchange.js --network localhost`

### 6. Run Tests
`$ npx hardhat test`

### 7. Launch Frontend
`$ npm run start`
