const {ethers } = require('hardhat');
const {expect} = require('chai');

const tokens = (n) => {
   return ethers.utils.parseUnits(n.toString() , 'ether')
}

describe ('Exchange' , ()=> {
	let exchange , accounts , deployer , feeAccount , token1 , token2 , user1 , user2
	
   const feePercent = 10

	beforeEach( async () => {
      const Token = await ethers.getContractFactory('Token')
      token1 = await Token.deploy('Dapp University' , 'DAPP' , '1000000')

     accounts = await ethers.getSigners()
     deployer = accounts[0]
     feeAccount = accounts[1]
     user1 = accounts[2]
     user2 = accounts[3]

     let transaction = await token1.connect(deployer).transfer(user1.address , tokens(100))
     await transaction.wait()


     const Exchange = await ethers.getContractFactory('Exchange')
	  exchange = await Exchange.deploy(feeAccount.address , feePercent)

	  
	})

	describe ('Deployment' , () =>{

		it('tracks the feeAccount' , async () => {
       expect(await exchange.feeAccount()).to.equal(feeAccount.address)
	 }) 

      it('tracks the feePercent' , async() =>{
         expect(await exchange.feePercent()).to.equal(feePercent);
      })    
	})

   describe('Depositing tokens' , () =>{
      let transation , result
      let amount = tokens(10)

      
      describe('success' , () =>{
         beforeEach(async() =>{
         // approve tokens
         transation = await token1.connect(user1).approve(exchange.address , amount)
         result = await transation.wait()
         // deposit tokens
         transation = await exchange.connect(user1).depositToken(token1.address , amount)
         result = await transation.wait()
          
          }) 


         it ('tracks the token deposit' , async() =>{
            expect(await token1.balanceOf(exchange.address)).to.equal(amount)
            expect (await exchange.tokens(token1.address , user1.address)).to.equal(amount)
            expect(await exchange.balanceOf(token1.address , user1.address)).to.equal(amount)
         })

         it ('emits a deposit event' , async () =>{
            const event = result.events[1] // 2 events are emitted  
            expect(event.event).to.equal('Deposit')

            const args = event.args
            expect(args.token).to.equal(token1.address)
            expect(args.user).to.equal(user1.address)
            expect(args.amount).to.equal(amount)
            expect(args.balance).to.equal(amount)
       
         })
      })
      describe('failure' , () =>{
         it('fails when no tokens are approved' , async() =>{
            // try depositing tokens without approving them first
            await expect(exchange.connect(user1).depositToken(token1.address , amount)).to.be.reverted

         })

      })
   })
   describe('withdrawing tokens ' , () =>{
      let transation , result
      let amount = tokens(10)

      describe('Success' , () =>{
         beforeEach(async () => {
        //Deposit before Withdrawing
         // approve tokens
         transaction = await token1.connect(user1).approve(exchange.address , amount)
         result = await transaction.wait()
         // deposit tokens  
         transaction = await exchange.connect(user1).depositToken(token1.address , amount)
         result = transaction.wait()
         // now withdraw tokens
         transaction = await exchange.connect(user1).withdrawToken(token1.address , amount)
         result = await transaction.wait()
         })

         it ('withdraws token funds' , async() =>{
            expect(await token1.balanceOf(exchange.address)).to.equal(0)
            expect(await exchange.tokens(token1.address , user1.address)).to.equal(0)
            expect(await exchange.balanceOf(token1.address , user1.address)).to.equal(0)
         })

         it('emits a withdraw event', async () =>{
            const event = result.events[1]
            expect (event.event).to.equal('Withdraw')

            const args = event.args
            expect(args.token).to.equal(token1.address)
            expect(args.user).to.equal(user1.address)
            expect(args.amount).to.equal(amount)
            expect(args.balance).to.equal(0)
         })

      })
      describe('Failure' , () =>{
         it('fails for insufficient balances' , async() =>{
            // attempt to withdraw without depositing
            await expect(exchange.connect(user1).withdrawToken(token1.address , amount)).to.be.reverted
         })

      })
   })

   describe ('checking balances' , () =>{
      let transation , result
      let amount = tokens(1)

      beforeEach(async () =>{
         // approve tokens
         transation = await token1.connect(user1).approve(exchange.address , amount)
         result = await transation.wait()
         // deposit tokens
         transation = await exchange.connect(user1).depositToken(token1.address , amount)
         result = await transation.wait()
      })
       it ('returns user balance' , async() =>{
         expect(await exchange.balanceOf(token1.address , user1.address)).to.equal(amount)
       })
   })
})
