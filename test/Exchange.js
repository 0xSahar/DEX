const {ethers } = require('hardhat');
const {expect} = require('chai');

const tokens = (n) => {
   return ethers.utils.parseUnits(n.toString() , 'ether')
}

describe ('Exchange' , ()=> {
	let exchange , accounts , deployer , feeAccount , token1 , token2 , user1 , user2
	
   const feePercent = 10

	beforeEach( async () => {
      const Exchange = await ethers.getContractFactory('Exchange')
      const Token = await ethers.getContractFactory('Token')

      token1 = await Token.deploy('Elephant' , 'ele' , '1000000')
      token2 = await Token.deploy('Mock Dai' , 'mDAI' , '1000000')

     accounts = await ethers.getSigners()
     deployer = accounts[0]
     feeAccount = accounts[1]
     user1 = accounts[2]
     user2 = accounts[3]

     let transaction = await token1.connect(deployer).transfer(user1.address , tokens(100))
     await transaction.wait()


     
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

     describe('making orders' , () =>{
      let transaction , result
      let amount = tokens(1)

      describe ('success' , () =>{
         beforeEach(async() =>{
            //Deposit before making an order
         // approve tokens
         transaction = await token1.connect(user1).approve(exchange.address , amount)
         result = await transaction.wait()
         // deposit tokens  
         transaction = await exchange.connect(user1).depositToken(token1.address , amount)
         result = transaction.wait()
         //make an order
         transaction = await exchange.connect(user1).makeOrder(token2.address ,amount , token1.address ,amount) 
         result = await transaction.wait()     
         })
         it('tracks the newly created order' , async() =>{
            expect(await exchange.ordersCount()).to.equal(1)
         })

          it('emits an order event', async () =>{
            const event = result.events[0]
            expect (event.event).to.equal('Order')

            const args = event.args
            expect(args.id).to.equal(1)
            expect(args.user).to.equal(user1.address)
            expect(args.tokenGet).to.equal(token2.address)
            expect(args.amountGet).to.equal(amount)
            expect(args.tokenGive).to.equal(token1.address)
            expect(args.amountGive).to.equal(amount)
            expect(args.timestamp).to.at.least(1)
         })

      })
      describe ('failure' , () =>{
         it('rejects with no balance' , async() =>{
            await expect(exchange.connect(user1).makeOrder(token2.address ,amount , token1.address ,amount)).to.be.reverted
         })
      })
     })
     describe('order actions' , () =>{
      let transaction , result
      let amount = tokens(1)

      beforeEach(async() =>{
         //Deposit before making an order
         // user1 approve tokens
         transaction = await token1.connect(user1).approve(exchange.address , amount)
         result = await transaction.wait()
         // user1 deposit tokens  
         transaction = await exchange.connect(user1).depositToken(token1.address , amount)
         result = transaction.wait()

         // give tokens to user2
         transaction = await token2.connect(deployer).transfer(user2.address , tokens(100))
         result = await transaction.wait()

         // user2 approve tokens
         transaction = await token2.connect(user2).approve(exchange.address , tokens(2))
         result = await transaction.wait()
         // user2 deposit tokens  
         transaction = await exchange.connect(user2).depositToken(token2.address ,tokens(2))
         result = transaction.wait()

         //make an order
         transaction = await exchange.connect(user1).makeOrder(token2.address ,amount , token1.address ,amount) 
         result = await transaction.wait()     
      })

      describe('cancelling orders' , () =>{
         describe('success' , () =>{
            beforeEach(async() =>{
               transaction = await exchange.connect(user1).cancelOrder(1)
               result = await transaction.wait()
            })

            it('updates cancelled orders' , async() =>{
               expect(await exchange.orderCancelled(1)).to.equal(true)
            })

            it('emits a cancel event', async () =>{
             const event = result.events[0]
             expect (event.event).to.equal('Cancel')

             const args = event.args
             expect(args.id).to.equal(1)
             expect(args.user).to.equal(user1.address)
             expect(args.tokenGet).to.equal(token2.address)
             expect(args.amountGet).to.equal(amount)
             expect(args.tokenGive).to.equal(token1.address)
             expect(args.amountGive).to.equal(amount)
             expect(args.timestamp).to.at.least(1)
         })
      })


         
         describe('failure' , () =>{
            beforeEach(async() =>{
         // approve tokens
            transaction = await token1.connect(user1).approve(exchange.address , amount)
            result = await transaction.wait()
         // deposit tokens  
            transaction = await exchange.connect(user1).depositToken(token1.address , amount)
            result = transaction.wait()
         //make an order
            transaction = await exchange.connect(user1).makeOrder(token2.address ,amount , token1.address ,amount) 
            result = await transaction.wait()    
         })

            it('rejects invalid order ids' , async() =>{
              const invaidOrderId = 99999
              await expect(exchange.connect(user1).cancelOrder(invaidOrderId)).to.be.reverted 

            })

            it ('rejects unauthorized cancelations' , async () =>{
               await expect(exchange.connect(user2).cancelOrder(1)).to.be.reverted
            })
         })
      })

         describe('filling orders' , () =>{
          describe('success' , () =>{
            beforeEach(async () =>{
            // user2 filles the order
            transaction = await exchange.connect(user2).fillOrder('1')
            result = await transaction.wait()

         })
         it('executes the trade and charge fees' , async() =>{
            //token give
            expect(await exchange.balanceOf(token1.address , user1.address)).to.equal(tokens(0))
            expect(await exchange.balanceOf(token1.address , user2.address)).to.equal(tokens(1))
            expect(await exchange.balanceOf(token1.address , feeAccount.address)).to.equal(tokens(0))

            // token get
            expect(await exchange.balanceOf(token2.address , user1.address)).to.equal(tokens(1))
            expect(await exchange.balanceOf(token2.address , user2.address)).to.equal(tokens(0.9))
            expect(await exchange.balanceOf(token2.address , feeAccount.address)).to.equal(tokens(0.1))
        })

         it('updates filled orders' , async() =>{
            expect(await exchange.orderFilled(1)).to.equal(true)
         })
          
         it('emits a Trade event', async () =>{
             const event = result.events[0]
             expect (event.event).to.equal('Trade')

             const args = event.args
             expect(args.id).to.equal(1)
             expect(args.user).to.equal(user2.address)
             expect(args.tokenGet).to.equal(token2.address)
             expect(args.amountGet).to.equal(amount)
             expect(args.tokenGive).to.equal(token1.address)
             expect(args.amountGive).to.equal(amount)
             expect(args.creator).to.equal(user1.address)
             expect(args.timestamp).to.at.least(1)
            })
          })

         describe('failure' , () =>{
            invalidOrderId = 99999
            it('rejects ivalid order ids' , async() =>{
               await expect(exchange.connect(user2).fillOrder(invalidOrderId)).to.be.reverted
            })
            it('rejects already filled orders' , async() =>{
               transaction = await exchange.connect(user2).fillOrder(1)
                result = await transaction.wait()

                await expect(exchange.connect(user2).fillOrder(1)).to.be.reverted

            })

            it ('rejects cancelled orders' , async () =>{
               transaction = await exchange.connect(user1).cancelOrder(1)
               result = await transaction.wait()

               await expect(exchange.connect(user2).fillOrder(1)).to.be.reverted
            })
         })
      })
    })
})           
