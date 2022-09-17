const {ethers } = require('hardhat');
const {expect} = require('chai');

const tokens = (n) => {
   return ethers.utils.parseUnits(n.toString() , 'ether')
}

describe ('Token' , ()=> {
	let token , accounts, deployer, receiver , exchange
	

	beforeEach( async () => {
     const Token = await ethers.getContractFactory('Token')
	  token = await Token.deploy('Dapp University' , 'DAPP' , '1000000' );

	  accounts = await ethers.getSigners()
	  deployer = accounts[0]
	  receiver = accounts[1]
	  exchange = accounts[2]
	})

	describe ('Deployment' , () =>{
		const name = 'Dapp University'
		const symbol = 'DAPP'
		const decimals = '18'
		const totalSupply = tokens(1000000)

	 it('has correct name' , async () => {
       expect(await token.name()).to.equal(name)

	 })
    it('has correct symbol' , async () => {
    	expect(await token.symbol()).to.equal(symbol)
    })

    it('has correct decimals' , async () =>{
       expect(await token.decimals()).to.equal(decimals)
    })

    it ('has correct totalSupply' ,  async () => {
    	expect(await token.totalSupply()).to.equal(totalSupply)
    })

    it('assigns totalSupply to deployer' , async() =>{
    	expect(await token.balanceOf(deployer.address)).to.equal(totalSupply)
    })

	})

	describe('sending tokens' , () => {
     let amount , transaction , result 

      describe('success' , () =>{
      	beforeEach( async () => {
       //transfer tokens
		 amount = tokens(100)
       transaction = await token.connect(deployer).transfer(receiver.address , amount)
       result = await transaction.wait()
     })

		it ('tranfers token balances' , async() => {
      // Ensure that tokens were transfered(balance changed)
       expect(await token.balanceOf(deployer.address)).to.equal(tokens(999900))
       expect(await token.balanceOf(receiver.address)).to.equal(amount)
		}) 

		it ('emits a Tranfer event ' , async() => {
       const event = result.events[0]
       expect(event.event).to.equal('Transfer')

       const args = event.args
       expect(args.from).to.equal(deployer.address)
       expect(args.to).to.equal(receiver.address)
       expect(args.value).to.equal(amount)

		})
 })

     describe('failure' , () =>{
     	 it('rejects insufficient balances' , async () =>{
     	 	//transfer more tokens than deployer has _ 100M
     	 	const invalidAmount = tokens(100000000) 
     	 	await expect(token.connect(deployer).transfer(receiver.address , invalidAmount )).to.be.reverted
     	 })
     	 it ('rejects invalid recipent ' , async() =>{
     	 	await expect(token.connect(deployer).transfer('0x0000000000000000000000000000000000000000' , amount)).to.be.reverted
     	 })
     })    
	})

	 describe ('Approving Tokens' , () =>{
      let amount , transaction , result

	 	beforeEach(async () =>{
	 		amount = tokens(100)
	 		transaction = await token.connect(deployer).approve(exchange.address , amount)
	 		result = await transaction.wait()
	 	})
	 	describe ('success' , () => {
	 		it('allocates an allowance for delegated token spending ' , async() => {
	 			expect(await token.allowance(deployer.address , exchange.address)).to.equal(amount)
	 		})

	 		it('emits an Approval event' , async() =>{
	 			const event = result.events[0]
	 			expect(event.event).to.equal('Approval')

	 			const args = event.args
	 			expect(args.owner).to.equal(deployer.address)
	 			expect(args.spender).to.equal(exchange.address)
	 			expect(args.value).to.equal(amount)
	 		})

	 	})
	 	describe('failure' , () => {
        it('rejects invalid spender' , async () =>{
           await expect(token.connect(deployer).approve('0x0000000000000000000000000000000000000000' , amount)).to.be.reverted
        })
	 	})
	 })

	  describe('delegated token transfers' , () =>{
	  	let transaction , result , amount 

        beforeEach (async() =>{
        	amount = tokens(100)
         transaction = await token.connect(deployer).approve(exchange.address , amount)
         result = await transaction.wait()
        })

        describe('success' , () =>{
          beforeEach ( async() =>{
          	transaction = await token.connect(exchange).transferFrom(deployer.address , receiver.address , amount)
          	result = await transaction.wait()
          })

          it('transfers Token balances' , async() =>{
          	expect(await token.balanceOf(deployer.address)).to.equal(tokens(999900))
          	expect(await token.balanceOf(receiver.address)).to.equal(amount)
          })

          it('resets the allowance' , async()=>{
          	expect(await token.allowance(deployer.address , exchange.address)).to.equal(0)
          })

          it ('emits a Tranfer event ' , async() => {
          const event = result.events[0]
          expect(event.event).to.equal('Transfer')

          const args = event.args
          expect(args.from).to.equal(deployer.address)
          expect(args.to).to.equal(receiver.address)
          expect(args.value).to.equal(amount)
		})
        })

        describe('failure' , () => {
        	const invalidAmount = tokens(100000000)

           it('Rejects insufficient amounts' , async ()=>{
           	await expect(token.connect(exchange).transferFrom(deployer.address , receiver.address , invalidAmount)).to.be.reverted
           })
        })
	  })
})
