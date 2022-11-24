import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import config from '../config.json';

import { loadProvider ,
 loadNetwork ,
 loadAccount,
 loadTokens,
 loadExchange,
 loadAllOrders,
 subscribeToEvents
} from '../store/interactions';

import Navbar from './Navbar'
import Markets from './Markets'
import Balance from './Balance'
import Order from './Order' 
import OrderBook from'./OrderBook'
import PriceChart from './PriceChart'
import Trades from './Trades'


function App() {

  const dispatch = useDispatch()

  const loadBlockchainData = async () =>{
  
   //connect ethers to blockchain 
    const provider = loadProvider(dispatch) 
  //fetch current networks's chainId (e.g. hardhat :31337 , kovan :42) 
    const chainId = await loadNetwork(provider , dispatch) //network.chainId = {chainId} destructring in javascript
    

  //reload the page when network changes
   window.ethereum.on('chainChanged' , () =>{
    window.location.reload()
   })
  //fetch current account and balance from metamask when changed 
  window.ethereum.on('accountsChanged' , () =>{
     loadAccount(provider,dispatch)
  }) 
    // await loadAccount(provider,dispatch)


    //load token smart conctracts
    const DApp = config[chainId].DApp
    const mETH = config[chainId].mETH
    await loadTokens(provider , [DApp.address , mETH.address] , dispatch )

    //load exchange smart contract
    const exchangeConfig = config[chainId].exchange 
    const exchange = await loadExchange(provider , exchangeConfig.address , dispatch)


    // fetch all orders (open , filled , cancelled)
    loadAllOrders(provider , exchange , dispatch)
    
    //listen to events
     subscribeToEvents(exchange , dispatch)
    }



  useEffect(() =>{
    loadBlockchainData()
  })

  return (
    <div>

     <Navbar />

      <main className='exchange grid'>
        <section className='exchange__section--left grid'>

          <Markets />

          <Balance />

          <Order />

        </section>
        <section className='exchange__section--right grid'>

          <PriceChart />
          
          {/* Transactions */}

          <Trades />

           <OrderBook />


        </section>
      </main>

      {/* Alert */}

    </div>
  );
}

export default App;