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
   const ele = await ethers.getContractAt('Token' , config[chainId].ele.address)
   console.log(`ele token fetched : ${ele.address}\n`)

   const mWETH = await ethers.getContractAt('Token' , config[chainId].mWETH.address)
   console.log(`mWEth token fetched : ${mWETH.address}\n`)

   const mDAI = await ethers.getContractAt('Token' , config[chainId].mDAI.address)
   console.log(`mDAI token fetched : ${mDAI.address}\n`)

   const mUSDT = await ethers.getContractAt('Token' , config[chainId].mUSDT.address)
   console.log(`mUSDT token fetched : ${mUSDT.address}\n`)

   const mUNI = await ethers.getContractAt('Token' , config[chainId].mUNI.address)
   console.log(`mUNI token fetched : ${mUNI.address}\n`)

   const mMATIC = await ethers.getContractAt('Token' , config[chainId].mMATIC.address)
   console.log(`mMATIC token fetched : ${mMATIC.address}\n`)

   const mSHIB = await ethers.getContractAt('Token' , config[chainId].mSHIB.address)
   console.log(`mSHIB token fetched : ${mSHIB.address}\n`)

   const mLINK = await ethers.getContractAt('Token' , config[chainId].mLINK.address)
   console.log(`mLINK token fetched : ${mLINK.address}\n`)

   const mXEN = await ethers.getContractAt('Token' , config[chainId].mXEN.address)
   console.log(`mXEN token fetched : ${mXEN.address}\n`)

   // fetch the deployed exchange
    const exchange = await ethers.getContractAt('Exchange' ,config[chainId].exchange.address)
    console.log(`exchange fetched : ${exchange.address}\n`)

    const sender = accounts[0]
    const receiver1 = accounts[1]
    const receiver2 = accounts[2]
    const receiver3 = accounts[3]
    const receiver4 = accounts[4]
    const receiver5 = accounts[5]
    const receiver6 = accounts[6]
    const receiver7 = accounts[7]
    const receiver8 = accounts[8]
    let amount = tokens(10000)

 
      // user1 (deployer) transfers 10000 mWETH to user2
    let transaction , result
    transaction = await mWETH.connect(sender).transfer(receiver1.address , amount)
    console.log(`Transferred ${amount} tokens from ${sender.address} to ${receiver1.address}\n`)

     // user1 (deployer) transfers 10000 mDAI to user3
    transaction = await mDAI.connect(sender).transfer(receiver2.address , amount)
    console.log(`Transferred ${amount} tokens from ${sender.address} to ${receiver2.address}\n`)

     // user1 (deployer) transfers 10000 mUSDT to user4
    transaction = await mUSDT.connect(sender).transfer(receiver3.address , amount)
    console.log(`Transferred ${amount} tokens from ${sender.address} to ${receiver3.address}\n`)

     // user1 (deployer) transfers 10000 mUNI to user5
    transaction = await mUNI.connect(sender).transfer(receiver4.address , amount)
    console.log(`Transferred ${amount} tokens from ${sender.address} to ${receiver4.address}\n`)

     // user1 (deployer) transfers 10000 mMATIC to user6
    transaction = await mMATIC.connect(sender).transfer(receiver5.address , amount)
    console.log(`Transferred ${amount} tokens from ${sender.address} to ${receiver5.address}\n`)

     // user1 (deployer) transfers 10000 mSHIB to user7
    transaction = await mSHIB.connect(sender).transfer(receiver6.address , amount)
    console.log(`Transferred ${amount} tokens from ${sender.address} to ${receiver6.address}\n`)

     // user1 (deployer) transfers 10000 mLINK to user8
    transaction = await mLINK.connect(sender).transfer(receiver7.address , amount)
    console.log(`Transferred ${amount} tokens from ${sender.address} to ${receiver7.address}\n`)

     // user1 (deployer) transfers 10000 mXEN to user9
    transaction = await mXEN.connect(sender).transfer(receiver8.address , amount)
    console.log(`Transferred ${amount} tokens from ${sender.address} to ${receiver8.address}\n`)


    // set up exchange users 
     const user1 = accounts[0]
     const user2 = accounts[1]
     const user3 = accounts[2]
     const user4 = accounts[3]
     const user5 = accounts[4]
     const user6 = accounts[5]
     const user7 = accounts[6]
     const user8 = accounts[7]
     const user9 = accounts[8]



     

     // user 1 approves 10000 ele tokens
     transaction = await ele.connect(user1).approve(exchange.address , amount)
     await transaction.wait()
     console.log(`approved ${amount} ele tokens from ${user1.address}\n`)
     // user1 deposits 10000 ele tokens to the exchange
     transaction = await exchange.connect(user1).depositToken(ele.address , amount)
     await transaction.wait()
     console.log(`deposited ${amount} ele tokens from${user1.address}\n`)


     // user 2 approves 10000 mWETH tokens
     transaction = await mWETH.connect(user2).approve(exchange.address , amount)
     await transaction.wait()
     console.log(`approved ${amount} mWETH tokens from ${user2.address}\n`)
     // user2 deposits 10000 mWETH tokens to the exchange
     transaction = await exchange.connect(user2).depositToken(mWETH.address , amount)
     await transaction.wait()
     console.log(`deposited ${amount} mWETH tokens from${user2.address}\n`)


     // user 3 approves 10000 mDAI tokens
     transaction = await mDAI.connect(user3).approve(exchange.address , amount)
     await transaction.wait()
     console.log(`approved ${amount} mDAI tokens from ${user3.address}\n`)
     // user3 deposits 10000 mDAI tokens to the exchange
     transaction = await exchange.connect(user3).depositToken(mDAI.address , amount)
     await transaction.wait()
     console.log(`deposited ${amount} mDAI tokens from${user3.address}\n`)


     // user 4 approves 10000 mUSDT tokens
     transaction = await mUSDT.connect(user4).approve(exchange.address , amount)
     await transaction.wait()
     console.log(`approved ${amount} mUSDT tokens from ${user4.address}\n`)
     // user4 deposits 10000 mUSDT tokens to the exchange
     transaction = await exchange.connect(user4).depositToken(mUSDT.address , amount)
     await transaction.wait()
     console.log(`deposited ${amount} mUSDT tokens from${user4.address}\n`)


     // user 5 approves 10000 mUNI tokens
     transaction = await mUNI.connect(user5).approve(exchange.address , amount)
     await transaction.wait()
     console.log(`approved ${amount} mUNI tokens from ${user5.address}\n`)
     // user5 deposits 10000 mUNI tokens to the exchange
     transaction = await exchange.connect(user5).depositToken(mUNI.address , amount)
     await transaction.wait()
     console.log(`deposited ${amount} mUNI tokens from${user5.address}\n`)


     // user 6 approves 10000 mMATIC tokens
     transaction = await mMATIC.connect(user6).approve(exchange.address , amount)
     await transaction.wait()
     console.log(`approved ${amount} mMATIC tokens from ${user6.address}\n`)
     // user6 deposits 10000 mMATIC tokens to the exchange
     transaction = await exchange.connect(user6).depositToken(mMATIC.address , amount)
     await transaction.wait()
     console.log(`deposited ${amount} mMATIC tokens from${user6.address}\n`)


     // user 7 approves 10000 mSHIB tokens
     transaction = await mSHIB.connect(user7).approve(exchange.address , amount)
     await transaction.wait()
     console.log(`approved ${amount} mSHIB tokens from ${user7.address}\n`)
     // user7 deposits 10000 mSHIB tokens to the exchange
     transaction = await exchange.connect(user7).depositToken(mSHIB.address , amount)
     await transaction.wait()
     console.log(`deposited ${amount} mSHIB tokens from${user7.address}\n`)


     // user 8 approves 10000 mLINK tokens
     transaction = await mLINK.connect(user8).approve(exchange.address , amount)
     await transaction.wait()
     console.log(`approved ${amount} mLINK tokens from ${user8.address}\n`)
     // user8 deposits 10000 mLINK tokens to the exchange
     transaction = await exchange.connect(user8).depositToken(mLINK.address , amount)
     await transaction.wait()
     console.log(`deposited ${amount} mLINK tokens from${user8.address}\n`)


     // user 9 approves 10000 mXEN tokens
     transaction = await mXEN.connect(user9).approve(exchange.address , amount)
     await transaction.wait()
     console.log(`approved ${amount} mXEN tokens from ${user9.address}\n`)
     // user9 deposits 10000 mXEN tokens to the exchange
     transaction = await exchange.connect(user9).depositToken(mXEN.address , amount)
     await transaction.wait()
     console.log(`deposited ${amount} mXEN tokens from${user9.address}\n`)





    //--------------------------
     // seed cancelled orders

     // user 1 makes an order
     let orderId
     transaction = await exchange.connect(user1).makeOrder(mWETH.address ,tokens(100) , ele.address ,tokens(5)) 
     result = await transaction.wait() 
     console.log(`made order from ${user1.address}\n`)

      //user1 cancels the order
      orderId = result.events[0].args.id
      transaction = await exchange.connect(user1).cancelOrder(orderId)
      result = await transaction.wait() 
      console.log(`cancelled order from ${user1.address}\n`)

      // wait 1 second
        await wait(1)


       // user 2 makes an order
     transaction = await exchange.connect(user2).makeOrder(ele.address ,tokens(10) , mWETH.address ,tokens(2)) 
     result = await transaction.wait() 
     console.log(`made order from ${user2.address}\n`)

      //user2 cancels the order
      orderId = result.events[0].args.id
      transaction = await exchange.connect(user2).cancelOrder(orderId)
      result = await transaction.wait() 
      console.log(`cancelled order from ${user2.address}\n`)

     // wait 1 second
      await wait(1)


       // user 3 makes an order
      transaction = await exchange.connect(user3).makeOrder(ele.address ,tokens(50) , mDAI.address ,tokens(5)) 
      result = await transaction.wait() 
      console.log(`made order from ${user3.address}\n`)

       //user3 cancels the order
      orderId = result.events[0].args.id
      transaction = await exchange.connect(user3).cancelOrder(orderId)
      result = await transaction.wait() 
      console.log(`cancelled order from ${user3.address}\n`)

      // wait 1 second
      await wait(1)


       // user 4 makes an order
      transaction = await exchange.connect(user4).makeOrder(ele.address ,tokens(70) , mUSDT.address ,tokens(5)) 
      result = await transaction.wait() 
      console.log(`made order from ${user4.address}\n`)

       //user4 cancels the order
       orderId = result.events[0].args.id
       transaction = await exchange.connect(user4).cancelOrder(orderId)
       result = await transaction.wait() 
       console.log(`cancelled order from ${user4.address}\n`)

      // wait 1 second
      await wait(1)

 
        // user 5 makes an order
       transaction = await exchange.connect(user5).makeOrder(ele.address ,tokens(30) , mUNI.address ,tokens(3)) 
       result = await transaction.wait() 
       console.log(`made order from ${user5.address}\n`)

       //user5 cancels the order
       orderId = result.events[0].args.id
       transaction = await exchange.connect(user5).cancelOrder(orderId)
       result = await transaction.wait() 
       console.log(`cancelled order from ${user5.address}\n`)

      // wait 1 second
      await wait(1)



       // user 6 makes an order
      transaction = await exchange.connect(user6).makeOrder(ele.address ,tokens(40) , mMATIC.address ,tokens(10)) 
      result = await transaction.wait() 
      console.log(`made order from ${user6.address}\n`)

       //user6 cancels the order
      orderId = result.events[0].args.id
      transaction = await exchange.connect(user6).cancelOrder(orderId)
      result = await transaction.wait() 
      console.log(`cancelled order from ${user6.address}\n`)

      // wait 1 second
      await wait(1)



       // user 7 makes an order
      transaction = await exchange.connect(user7).makeOrder(ele.address ,tokens(60) , mSHIB.address ,tokens(5)) 
      result = await transaction.wait() 
      console.log(`made order from ${user7.address}\n`)

       //user7 cancels the order
      orderId = result.events[0].args.id
      transaction = await exchange.connect(user7).cancelOrder(orderId)
      result = await transaction.wait() 
      console.log(`cancelled order from ${user7.address}\n`)

      // wait 1 second
      await wait(1)



       // user 8 makes an order
      transaction = await exchange.connect(user8).makeOrder(ele.address ,tokens(80) , mLINK.address ,tokens(2)) 
      result = await transaction.wait() 
      console.log(`made order from ${user8.address}\n`)

       //user8 cancels the order
      orderId = result.events[0].args.id
      transaction = await exchange.connect(user8).cancelOrder(orderId)
      result = await transaction.wait() 
      console.log(`cancelled order from ${user8.address}\n`)

      // wait 1 second
      await wait(1)


        // user 9 makes an order
      transaction = await exchange.connect(user9).makeOrder(ele.address ,tokens(80) , mXEN.address ,tokens(2)) 
      result = await transaction.wait() 
      console.log(`made order from ${user9.address}\n`)

       //user9 cancels the order
      orderId = result.events[0].args.id
      transaction = await exchange.connect(user9).cancelOrder(orderId)
      result = await transaction.wait() 
      console.log(`cancelled order from ${user9.address}\n`)

      // wait 1 second
      await wait(1)



      //------------------------------
      // seed filled orders

      // user1 makes an order
       transaction = await exchange.connect(user1).makeOrder(mWETH.address ,tokens(100), ele.address ,tokens(10)) 
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
      transaction = await exchange.connect(user1).makeOrder(mWETH.address ,tokens(50), ele.address ,tokens(15)) 
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
      transaction = await exchange.connect(user1).makeOrder(mWETH.address ,tokens(200), ele.address ,tokens(20)) 
      result = await transaction.wait() 
      console.log(`made order from ${user1.address}\n`)
      //user2 fills final order
      orderId = result.events[0].args.id
      transaction = await exchange.connect(user2).fillOrder(orderId)
      result = await transaction.wait()
      console.log(`filled order from ${user2.address}\n`)

      // wait 1 second
       await wait(1)


       // user2 makes an order
       transaction = await exchange.connect(user2).makeOrder(ele.address ,tokens(100), mWETH.address ,tokens(10)) 
       result = await transaction.wait() 
       console.log(`made order from ${user2.address}\n`)
      //user1 fills the order
      orderId = result.events[0].args.id
      transaction = await exchange.connect(user1).fillOrder(orderId)
      result = await transaction.wait()
      console.log(`filled order from ${user1.address}\n`)

      // wait 1 second
       await wait(1)

      // user2 makes another order
      transaction = await exchange.connect(user2).makeOrder(ele.address ,tokens(50), mWETH.address ,tokens(15)) 
      result = await transaction.wait() 
      console.log(`made order from ${user2.address}\n`)
      //user1 fills another order
      orderId = result.events[0].args.id
      transaction = await exchange.connect(user1).fillOrder(orderId)
      result = await transaction.wait()
      console.log(`filled order from ${user1.address}\n`)

      // wait 1 second
       await wait(1)

       // user2 makes final order
      transaction = await exchange.connect(user2).makeOrder(ele.address ,tokens(200), mWETH.address ,tokens(20)) 
      result = await transaction.wait() 
      console.log(`made order from ${user2.address}\n`)
      //user1 fills final order
      orderId = result.events[0].args.id
      transaction = await exchange.connect(user1).fillOrder(orderId)
      result = await transaction.wait()
      console.log(`filled order from ${user1.address}\n`)

      // wait 1 second
       await wait(1)


       // user3 makes an order
       transaction = await exchange.connect(user3).makeOrder(ele.address ,tokens(100), mDAI.address ,tokens(10)) 
       result = await transaction.wait() 
       console.log(`made order from ${user3.address}\n`)
      //user1 fills the order
      orderId = result.events[0].args.id
      transaction = await exchange.connect(user1).fillOrder(orderId)
      result = await transaction.wait()
      console.log(`filled order from ${user1.address}\n`)

      // wait 1 second
       await wait(1)

      // user3 makes another order
      transaction = await exchange.connect(user3).makeOrder(ele.address ,tokens(50), mDAI.address ,tokens(15)) 
      result = await transaction.wait() 
      console.log(`made order from ${user3.address}\n`)
      //user1 fills another order
      orderId = result.events[0].args.id
      transaction = await exchange.connect(user1).fillOrder(orderId)
      result = await transaction.wait()
      console.log(`filled order from ${user1.address}\n`)

      // wait 1 second
       await wait(1)

       // user3 makes final order
      transaction = await exchange.connect(user3).makeOrder(ele.address ,tokens(200), mDAI.address ,tokens(20)) 
      result = await transaction.wait() 
      console.log(`made order from ${user3.address}\n`)
      //user1 fills final order
      orderId = result.events[0].args.id
      transaction = await exchange.connect(user1).fillOrder(orderId)
      result = await transaction.wait()
      console.log(`filled order from ${user1.address}\n`)

      // wait 1 second
       await wait(1)


       // user4 makes an order
       transaction = await exchange.connect(user4).makeOrder(ele.address ,tokens(100), mUSDT.address ,tokens(10)) 
       result = await transaction.wait() 
       console.log(`made order from ${user4.address}\n`)
      //user1 fills the order
      orderId = result.events[0].args.id
      transaction = await exchange.connect(user1).fillOrder(orderId)
      result = await transaction.wait()
      console.log(`filled order from ${user1.address}\n`)

      // wait 1 second
       await wait(1)

      // user4 makes another order
      transaction = await exchange.connect(user4).makeOrder(ele.address ,tokens(50), mUSDT.address ,tokens(15)) 
      result = await transaction.wait() 
      console.log(`made order from ${user4.address}\n`)
      //user1 fills another order
      orderId = result.events[0].args.id
      transaction = await exchange.connect(user1).fillOrder(orderId)
      result = await transaction.wait()
      console.log(`filled order from ${user1.address}\n`)

      // wait 1 second
       await wait(1)

       // user4 makes final order
      transaction = await exchange.connect(user4).makeOrder(ele.address ,tokens(200), mUSDT.address ,tokens(20)) 
      result = await transaction.wait() 
      console.log(`made order from ${user4.address}\n`)
      //user1 fills final order
      orderId = result.events[0].args.id
      transaction = await exchange.connect(user1).fillOrder(orderId)
      result = await transaction.wait()
      console.log(`filled order from ${user1.address}\n`)

      // wait 1 second
       await wait(1)


       // user5 makes an order
       transaction = await exchange.connect(user5).makeOrder(ele.address ,tokens(100), mUNI.address ,tokens(10)) 
       result = await transaction.wait() 
       console.log(`made order from ${user5.address}\n`)
      //user1 fills the order
      orderId = result.events[0].args.id
      transaction = await exchange.connect(user1).fillOrder(orderId)
      result = await transaction.wait()
      console.log(`filled order from ${user1.address}\n`)

      // wait 1 second
       await wait(1)

      // user5 makes another order
      transaction = await exchange.connect(user5).makeOrder(ele.address ,tokens(50), mUNI.address ,tokens(15)) 
      result = await transaction.wait() 
      console.log(`made order from ${user5.address}\n`)
      //user1 fills another order
      orderId = result.events[0].args.id
      transaction = await exchange.connect(user1).fillOrder(orderId)
      result = await transaction.wait()
      console.log(`filled order from ${user1.address}\n`)

      // wait 1 second
       await wait(1)

       // user5 makes final order
      transaction = await exchange.connect(user5).makeOrder(ele.address ,tokens(200), mUNI.address ,tokens(20)) 
      result = await transaction.wait() 
      console.log(`made order from ${user5.address}\n`)
      //user1 fills final order
      orderId = result.events[0].args.id
      transaction = await exchange.connect(user1).fillOrder(orderId)
      result = await transaction.wait()
      console.log(`filled order from ${user1.address}\n`)

      // wait 1 second
       await wait(1)



       // user6 makes an order
       transaction = await exchange.connect(user6).makeOrder(ele.address ,tokens(100), mMATIC.address ,tokens(10)) 
       result = await transaction.wait() 
       console.log(`made order from ${user6.address}\n`)
      //user1 fills the order
      orderId = result.events[0].args.id
      transaction = await exchange.connect(user1).fillOrder(orderId)
      result = await transaction.wait()
      console.log(`filled order from ${user1.address}\n`)

      // wait 1 second
       await wait(1)

      // user6 makes another order
      transaction = await exchange.connect(user6).makeOrder(ele.address ,tokens(50), mMATIC.address ,tokens(15)) 
      result = await transaction.wait() 
      console.log(`made order from ${user6.address}\n`)
      //user1 fills another order
      orderId = result.events[0].args.id
      transaction = await exchange.connect(user1).fillOrder(orderId)
      result = await transaction.wait()
      console.log(`filled order from ${user1.address}\n`)

      // wait 1 second
       await wait(1)

       // user6 makes final order
      transaction = await exchange.connect(user6).makeOrder(ele.address ,tokens(200), mMATIC.address ,tokens(20)) 
      result = await transaction.wait() 
      console.log(`made order from ${user6.address}\n`)
      //user1 fills final order
      orderId = result.events[0].args.id
      transaction = await exchange.connect(user1).fillOrder(orderId)
      result = await transaction.wait()
      console.log(`filled order from ${user1.address}\n`)

      // wait 1 second
       await wait(1)



        // user7 makes an order
       transaction = await exchange.connect(user7).makeOrder(ele.address ,tokens(100), mSHIB.address ,tokens(10)) 
       result = await transaction.wait() 
       console.log(`made order from ${user7.address}\n`)
      //user1 fills the order
      orderId = result.events[0].args.id
      transaction = await exchange.connect(user1).fillOrder(orderId)
      result = await transaction.wait()
      console.log(`filled order from ${user1.address}\n`)

      // wait 1 second
       await wait(1)

      // user7 makes another order
      transaction = await exchange.connect(user7).makeOrder(ele.address ,tokens(50), mSHIB.address ,tokens(15)) 
      result = await transaction.wait() 
      console.log(`made order from ${user7.address}\n`)
      //user1 fills another order
      orderId = result.events[0].args.id
      transaction = await exchange.connect(user1).fillOrder(orderId)
      result = await transaction.wait()
      console.log(`filled order from ${user1.address}\n`)

      // wait 1 second
       await wait(1)

       /// user7 makes final order
      transaction = await exchange.connect(user7).makeOrder(ele.address ,tokens(200), mSHIB.address ,tokens(20)) 
      result = await transaction.wait() 
      console.log(`made order from ${user7.address}\n`)
      //user1 fills final order
      orderId = result.events[0].args.id
      transaction = await exchange.connect(user1).fillOrder(orderId)
      result = await transaction.wait()
      console.log(`filled order from ${user1.address}\n`)

      // wait 1 second
       await wait(1)


        // user8 makes an order
       transaction = await exchange.connect(user8).makeOrder(ele.address ,tokens(100), mLINK.address ,tokens(10)) 
       result = await transaction.wait() 
       console.log(`made order from ${user8.address}\n`)
      //user1 fills the order
      orderId = result.events[0].args.id
      transaction = await exchange.connect(user1).fillOrder(orderId)
      result = await transaction.wait()
      console.log(`filled order from ${user1.address}\n`)

      // wait 1 second
       await wait(1)

      // user8 makes another order
      transaction = await exchange.connect(user8).makeOrder(ele.address ,tokens(50), mLINK.address ,tokens(15)) 
      result = await transaction.wait() 
      console.log(`made order from ${user8.address}\n`)
      //user1 fills another order
      orderId = result.events[0].args.id
      transaction = await exchange.connect(user1).fillOrder(orderId)
      result = await transaction.wait()
      console.log(`filled order from ${user1.address}\n`)

      // wait 1 second
       await wait(1)

       // user8 makes final order
      transaction = await exchange.connect(user8).makeOrder(ele.address ,tokens(200), mLINK.address ,tokens(20)) 
      result = await transaction.wait() 
      console.log(`made order from ${user8.address}\n`)
      //user1 fills final order
      orderId = result.events[0].args.id
      transaction = await exchange.connect(user1).fillOrder(orderId)
      result = await transaction.wait()
      console.log(`filled order from ${user1.address}\n`)

      // wait 1 second
       await wait(1)




        // user9 makes an order
       transaction = await exchange.connect(user9).makeOrder(ele.address ,tokens(100), mXEN.address ,tokens(10)) 
       result = await transaction.wait() 
       console.log(`made order from ${user9.address}\n`)
      //user1 fills the order
      orderId = result.events[0].args.id
      transaction = await exchange.connect(user1).fillOrder(orderId)
      result = await transaction.wait()
      console.log(`filled order from ${user1.address}\n`)

      // wait 1 second
       await wait(1)

      // user9 makes another order
      transaction = await exchange.connect(user9).makeOrder(ele.address ,tokens(50), mXEN.address ,tokens(15)) 
      result = await transaction.wait() 
      console.log(`made order from ${user9.address}\n`)
      //user1 fills another order
      orderId = result.events[0].args.id
      transaction = await exchange.connect(user1).fillOrder(orderId)
      result = await transaction.wait()
      console.log(`filled order from ${user1.address}\n`)

      // wait 1 second
       await wait(1)

       // user9 makes final order
      transaction = await exchange.connect(user9).makeOrder(ele.address ,tokens(200), mXEN.address ,tokens(20)) 
      result = await transaction.wait() 
      console.log(`made order from ${user9.address}\n`)
      //user1 fills final order
      orderId = result.events[0].args.id
      transaction = await exchange.connect(user1).fillOrder(orderId)
      result = await transaction.wait()
      console.log(`filled order from ${user1.address}\n`)

      // wait 1 second
       await wait(1)

       

    // -------------------------------------------
    // seed open orders

    // user 1 makes 10 orders
    for(let i =1 ; i <= 10 ; i++){
     transaction = await exchange.connect(user1).makeOrder(mWETH.address ,tokens(10 * i), ele.address ,tokens(10)) 
      result = await transaction.wait() 
      console.log(`made order from ${user1.address}\n`)

       // wait 1 second
          await wait(1)
    }

    // user 2 makes 10 orders
    for(let i =1 ; i <= 10 ; i++){
      transaction = await exchange.connect(user2).makeOrder(ele.address ,tokens(10),mWETH.address ,tokens(10 * i)) 
      result = await transaction.wait() 
      console.log(`made order from ${user2.address}\n`)

       // wait 1 second
          await wait(1)
    }

    // user 1 makes 10 orders
    for(let i =1 ; i <= 10 ; i++){
     transaction = await exchange.connect(user1).makeOrder(mDAI.address ,tokens(10 * i), ele.address ,tokens(10)) 
      result = await transaction.wait() 
      console.log(`made order from ${user1.address}\n`)

       // wait 1 second
          await wait(1)
    }


     // user 3 makes 10 orders
    for(let i =1 ; i <= 10 ; i++){
     transaction = await exchange.connect(user3).makeOrder(ele.address ,tokens(10), mDAI.address ,tokens(10 * i)) 
      result = await transaction.wait() 
      console.log(`made order from ${user3.address}\n`)

       // wait 1 second
          await wait(1)
    }

     // user 1 makes 10 orders
    for(let i =1 ; i <= 10 ; i++){
     transaction = await exchange.connect(user1).makeOrder(mUSDT.address ,tokens(10 * i), ele.address ,tokens(10)) 
      result = await transaction.wait() 
      console.log(`made order from ${user1.address}\n`)

       // wait 1 second
          await wait(1)
    }


     // user 4 makes 10 orders
    for(let i =1 ; i <= 10 ; i++){
     transaction = await exchange.connect(user4).makeOrder(ele.address ,tokens(10), mUSDT.address ,tokens(10 * i)) 
      result = await transaction.wait() 
      console.log(`made order from ${user4.address}\n`)

       // wait 1 second
          await wait(1)
    }

    // user 1 makes 10 orders
    for(let i =1 ; i <= 10 ; i++){
     transaction = await exchange.connect(user1).makeOrder(mUNI.address ,tokens(10 * i), ele.address ,tokens(10)) 
      result = await transaction.wait() 
      console.log(`made order from ${user1.address}\n`)

       // wait 1 second
          await wait(1)
    }

  
   // user 5 makes 10 orders
    for(let i =1 ; i <= 10 ; i++){
     transaction = await exchange.connect(user5).makeOrder(ele.address ,tokens(10), mUNI.address ,tokens(10 * i)) 
      result = await transaction.wait() 
      console.log(`made order from ${user5.address}\n`)

       // wait 1 second
          await wait(1)
    }

      // user 1 makes 10 orders
    for(let i =1 ; i <= 10 ; i++){
     transaction = await exchange.connect(user1).makeOrder(mMATIC.address ,tokens(10 * i), ele.address ,tokens(10)) 
      result = await transaction.wait() 
      console.log(`made order from ${user1.address}\n`)

       // wait 1 second
          await wait(1)
    }



     // user 6 makes 10 orders
    for(let i =1 ; i <= 10 ; i++){
     transaction = await exchange.connect(user6).makeOrder(ele.address ,tokens(10), mMATIC.address ,tokens(10 * i)) 
      result = await transaction.wait() 
      console.log(`made order from ${user6.address}\n`)

       // wait 1 second
          await wait(1)
    }

       // user 1 makes 10 orders
    for(let i =1 ; i <= 10 ; i++){
     transaction = await exchange.connect(user1).makeOrder(mSHIB.address ,tokens(10 * i), ele.address ,tokens(10)) 
      result = await transaction.wait() 
      console.log(`made order from ${user1.address}\n`)

       // wait 1 second
          await wait(1)
    }



     // user 7 makes 10 orders
    for(let i =1 ; i <= 10 ; i++){
     transaction = await exchange.connect(user7).makeOrder(ele.address ,tokens(10), mSHIB.address ,tokens(10 * i)) 
      result = await transaction.wait() 
      console.log(`made order from ${user7.address}\n`)

       // wait 1 second
          await wait(1)
    }


     // user 1 makes 10 orders
    for(let i =1 ; i <= 10 ; i++){
     transaction = await exchange.connect(user1).makeOrder(mLINK.address ,tokens(10 * i), ele.address ,tokens(10)) 
      result = await transaction.wait() 
      console.log(`made order from ${user1.address}\n`)

       // wait 1 second
          await wait(1)
    }




     // user 8 makes 10 orders
    for(let i =1 ; i <= 10 ; i++){
     transaction = await exchange.connect(user8).makeOrder(ele.address ,tokens(10), mLINK.address ,tokens(10 * i)) 
      result = await transaction.wait() 
      console.log(`made order from ${user8.address}\n`)

       // wait 1 second
          await wait(1)
    }


    // user 1 makes 10 orders
    for(let i =1 ; i <= 10 ; i++){
     transaction = await exchange.connect(user1).makeOrder(mXEN.address ,tokens(10 * i), ele.address ,tokens(10)) 
      result = await transaction.wait() 
      console.log(`made order from ${user1.address}\n`)

       // wait 1 second
          await wait(1)
    }



    // user 9 makes 10 orders
    for(let i =1 ; i <= 10 ; i++){
     transaction = await exchange.connect(user9).makeOrder(ele.address ,tokens(10), mXEN.address ,tokens(10 * i)) 
      result = await transaction.wait() 
      console.log(`made order from ${user9.address}\n`)

       // wait 1 second
          await wait(1)
    }
}


main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
