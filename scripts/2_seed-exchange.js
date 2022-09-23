const config = require('../src/config.json')


const tokens = (n) => {
   return ethers.utils.parseUnits(n.toString() , 'ether')
}

const wait = (seconds) =>{
    const milliseconds = seconds * 1000
    return new Promise(resolve => setTimeout(resolve , milliseconds))
}

async function main() {

  // fetch accounts from wallet - these are unlocked
  const accounts = await ethers.getSigners()

  // fetch network
  const { chainId } = await ethers.provider.getNetwork()
  console.log("using chainId:" , chainId)

  // fetch deployed tokens
   const DApp = await ethers.getContractAt('Token' , config[chainId].DApp.address)
   console.log(`DApp token fetched : ${DApp.address}\n`)

   const mETH = await ethers.getContractAt('Token' , config[chainId].mETH.address)
   console.log(`mEth token fetched : ${mETH.address}\n`)

   const mDAI = await ethers.getContractAt('Token' , config[chainId].mDAI.address)
   console.log(`mDAI token fetched : ${mDAI.address}\n`)

   // fetch the deployed exchange
    const exchange = await ethers.getContractAt('Exchange' ,config[chainId].exchange.address)
    console.log(`exchange fetched : ${exchange.address}\n`)

    const sender = accounts[0]
    const receiver = accounts[1]
    let amount = tokens(10000)

    // user1 (deployer) transfers 10000 mETH to user2
    let transaction , result
    transaction = await mETH.connect(sender).transfer(receiver.address , amount)
    console.log(`Transferred ${amount} tokens from ${sender.address} to ${receiver.address}\n`)

    // set up exchange users 
     const user1 = accounts[0]
     const user2 = accounts[1]
     

     // user 1 approves 10000 DApp tokens
     transaction = await DApp.connect(user1).approve(exchange.address , amount)
     await transaction.wait()
     console.log(`approved ${amount} DApp tokens from ${user1.address}\n`)
     // user1 deposits 10000 DApp tokens to the exchange
     transaction = await exchange.connect(user1).depositToken(DApp.address , amount)
     await transaction.wait()
     console.log(`deposited ${amount} DApp tokens from${user1.address}\n`)

     // user 2 approves 10000 mETH tokens
     transaction = await mETH.connect(user2).approve(exchange.address , amount)
     await transaction.wait()
     console.log(`approved ${amount} mETH tokens from ${user2.address}\n`)
     // user2 deposits 10000 mETH tokens to the exchange
     transaction = await exchange.connect(user2).depositToken(mETH.address , amount)
     await transaction.wait()
     console.log(`deposited ${amount} mTH tokens from${user2.address}\n`)


     //--------------------------
     // seed a cancelled order

     // user 1 makes an order
     let orderId
     transaction = await exchange.connect(user1).makeOrder(mETH.address ,tokens(100) , DApp.address ,tokens(5)) 
     result = await transaction.wait() 
     console.log(`made order from ${user1.address}\n`)

      //user1 cancels the order
      orderId = result.events[0].args.id
      transaction = await exchange.connect(user1).cancelOrder(orderId)
      result = await transaction.wait() 
      console.log(`cancelled order from ${user1.address}\n`)

      // wait 1 second
      await wait(1)

      //------------------------------
      // seed filled orders

      // user1 makes an order
       transaction = await exchange.connect(user1).makeOrder(mETH.address ,tokens(100), DApp.address ,tokens(10)) 
       result = await transaction.wait() 
       console.log(`made order from ${user1.address}\n`)
      //user2 fills the order
      orderId = result.events[0].args.id
      transaction = await exchange.connect(user2).fillOrder(orderId)
      result = await transaction.wait()
      console.log(`filled order from ${user2.address}\n`)

      // wait 1 second
       await wait(1)

      // user1 makes another order
      transaction = await exchange.connect(user1).makeOrder(mETH.address ,tokens(50), DApp.address ,tokens(15)) 
      result = await transaction.wait() 
      console.log(`made order from ${user1.address}\n`)
      //user2 fills another order
      orderId = result.events[0].args.id
      transaction = await exchange.connect(user2).fillOrder(orderId)
      result = await transaction.wait()
      console.log(`filled order from ${user2.address}\n`)

      // wait 1 second
       await wait(1)

       // user1 makes final order
      transaction = await exchange.connect(user1).makeOrder(mETH.address ,tokens(200), DApp.address ,tokens(20)) 
      result = await transaction.wait() 
      console.log(`made order from ${user1.address}\n`)
      //user2 fills final order
      orderId = result.events[0].args.id
      transaction = await exchange.connect(user2).fillOrder(orderId)
      result = await transaction.wait()
      console.log(`filled order from ${user2.address}\n`)

      // wait 1 second
       await wait(1)

    // -------------------------------------------
    // seed open orders

    // user 1 makes 10 orders
    for(let i =1 ; i <= 10 ; i++){
     transaction = await exchange.connect(user1).makeOrder(mETH.address ,tokens(10 * i), DApp.address ,tokens(10)) 
      result = await transaction.wait() 
      console.log(`made order from ${user1.address}\n`)

       // wait 1 second
          await wait(1)
    }

    // user 2 makes 10 orders
    for(let i =1 ; i <= 10 ; i++){
      transaction = await exchange.connect(user2).makeOrder(DApp.address ,tokens(10),mETH.address ,tokens(10 * i)) 
      result = await transaction.wait() 
      console.log(`made order from ${user2.address}\n`)

       // wait 1 second
          await wait(1)
    }
}


main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
