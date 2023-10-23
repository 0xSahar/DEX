async function main() {
  console.log(`preparing deployment ...\n`)


 //fetch contract to deploy (artifacts)
 const Token = await ethers.getContractFactory('Token')
 const Exchange = await ethers.getContractFactory('Exchange')

 // fetch accounts
 const accounts = await ethers.getSigners()
 console.log(`accounts fetched :\n ${accounts[0].address}\n ${accounts[1].address}\n`)

 //deploy contracts
 const ele = await Token.deploy('Elephant' , 'ele' , '1000000')//writes it
 await ele.deployed()//reads it
 console.log(`ele depolyed to : ${ele.address}`)

 const mWETH = await Token.deploy('mWETH' , 'mWETH' , '1000000' ) 
 await mWETH.deployed()
 console.log(`mWETH depolyed to : ${mWETH.address}`)

 const mDAI = await Token.deploy('mDAI' , 'mDAI' , '1000000')
 await mDAI.deployed()
 console.log(`mDAI depolyed to : ${mDAI.address}`)

 const mUSDT = await Token.deploy('mUSDT' , 'mUSDT' , '1000000')
 await mUSDT.deployed()
 console.log(`mUSDT depolyed to : ${mUSDT.address}`)

 const mUNI = await Token.deploy('mUNI' , 'mUNI' , '1000000')
 await mUNI.deployed()
 console.log(`mUNI depolyed to : ${mUNI.address}`)

 const mMATIC = await Token.deploy('mMATIC' , 'mMATIC' , '1000000')
 await mMATIC.deployed()
 console.log(`mMATIC depolyed to : ${mMATIC.address}`)

 const mSHIB= await Token.deploy('mSHIB' , 'mSHIB' , '1000000')
 await mSHIB.deployed()
 console.log(`mSHIB depolyed to : ${mSHIB.address}`)

 const mLINK = await Token.deploy('mLINK' , 'mLINK' , '1000000')
 await mLINK.deployed()
 console.log(`mLINK depolyed to : ${mLINK.address}`)

 const mXEN = await Token.deploy('mXEN' , 'mXEN' , '1000000')
 await mXEN.deployed()
 console.log(`mXEN depolyed to : ${mXEN.address}`)



 const exchange = await Exchange.deploy(accounts[1].address , 10)
 await exchange.deployed()
 console.log(`exchange deployed to : ${exchange.address}`)

}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
