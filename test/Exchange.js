const {ethers } = require('hardhat');
const {expect} = require('chai');

const tokens = (n) => {
   return ethers.utils.parseUnits(n.toString() , 'ether')
}

describe ('Exchange' , ()=> {
	let exchange , accounts , deployer , feeAccount
	
   const feePercent = 10

	beforeEach( async () => {
     accounts = await ethers.getSigners()
     deployer = accounts[0]
     feeAccount = accounts[1]

     const Exchange = await ethers.getContractFactory('Exchange')
	  exchange = await Exchange.deploy(feeAccount.address , feePercent);

	  
	})

	describe ('Deployment' , () =>{

		it('tracks the feeAccount' , async () => {
       expect(await exchange.feeAccount()).to.equal(feeAccount.address)
	 }) 

      it('tracks the feePercent' , async() =>{
         expect(await exchange.feePercent()).to.equal(feePercent);
      })    
	})
})