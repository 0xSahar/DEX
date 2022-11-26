import { useSelector , useDispatch } from 'react-redux'

//import assets
import sort from '../assets/sort.svg'

import { fillOrder } from '../store/interactions'

//import selectors
import { OrderBookSelector } from '../store/Selectors'

const OrderBook = () => {

   const dispatch = useDispatch()
   
  const provider = useSelector(state=> state.provider.connection)
  const exchange = useSelector(state=>state.exchange.contract)
  const symbols = useSelector(state=>state.tokens.symbols)
  const orderBook = useSelector(OrderBookSelector)


  const fillOrderHandler = (order) => {
    fillOrder(provider , exchange , order , dispatch)

  }



  return (
    <div className="component exchange__orderbook">
      <div className='component__header flex-between'>
        <h2>Order Book</h2>
      </div>

      <div className="flex">

      {!orderBook || orderBook.sellOrders.length === 0 ?(
        <p className='flex-center'>No Sell Orders</p>
        ) :(
        <table className='exchange__orderbook--sell'>
          <caption>Selling</caption>
          <thead>
            <tr>
              <th>{symbols && symbols[0]} <img src={sort} alt="sort" /> </th>
              <th>{symbols && symbols[0]}/{symbols && symbols[1]} <img src={sort} alt="sort" /></th>
              <th>{symbols && symbols[1]} <img src={sort} alt="sort" /></th>
            </tr>
          </thead>
          <tbody>
         
          {/* mapping of sell orders... */}

          {/* every time you loop through an elemnt like this in react you need to give each tablerow a unnique key
          every time you map over an array there is a second argument in the anonymous function = index 
          */}


          {orderBook && orderBook.sellOrders.map((order , index) =>{
            return(
            <tr key={index} onClick = {() =>fillOrderHandler(order)}>
              <td>{order.token0Amount}</td>
              <td style = {{color : `${order.orderTypeClass}`}}>{order.tokenPrice}</td>
              <td>{order.token1Amount}</td>
            </tr>
            )
          })}
            
          </tbody>
        </table>
        )
        }

        

        <div className='divider'></div>

        {!orderBook || orderBook.sellOrders.length === 0 ?(
          <p className='flex-center'>No buy Orders</p>
        ):(
         <table className='exchange__orderbook--buy'>
          <caption>Buying</caption>
          <thead>
            <tr>
              <th>{symbols && symbols[0]} <img src={sort} alt="sort" /> </th>
              <th>{symbols && symbols[0]}/{symbols && symbols[1]} <img src={sort} alt="sort" /></th>
              <th>{symbols && symbols[1]} <img src={sort} alt="sort" /></th>
            </tr>
          </thead>
          <tbody>

            {/* mapping of buy orders... */}
            {orderBook && orderBook.buyOrders.map((order,index) =>{
              return(
              <tr key = {index} onClick = {() =>fillOrderHandler(order)} >
              <td>{order.token0Amount}</td>
              <td style = {{color:`${order.orderTypeClass}`}}>{order.tokenPrice}</td>
              <td>{order.token1Amount}</td>
            </tr>
              )
            })}
            

            </tbody>
        </table>
        )}

       
         
      </div>
    </div>
  );
}

export default OrderBook;
