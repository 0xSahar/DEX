import { createSelector } from 'reselect'
import { get , groupBy , reject } from 'lodash'
import moment from 'moment'
import { ethers } from 'ethers'


const GREEN = '#25CE8F'
const RED = '#F45353'

const tokens = state => get(state , 'tokens.contracts')

const allOrders = state => get(state , 'exchange.allOrders.data' , [])
const cancelledOrders = state => get(state , 'exchange.cancelledOrders.data' , [])
const filledOrders = state => get(state , 'exchange.filledOrders.data' , [])

const openOrders = state =>{
	const all = allOrders(state)
	const cancelled = cancelledOrders(state)
	const filled = filledOrders(state)

	const openOrders = reject(all , (order) => {
  const orderFilled = filled.some((o) => o.id.toString() === order.id.toString())
  const orderCancelled = cancelled.some((o) => o.id.toString() === order.id.toString())
  return (orderFilled || orderCancelled )
	}) 
	return openOrders
}


const decorateOrderBookOrders = (orders, tokens) =>{
	return(
      orders.map((order) =>{
    	order = decorateOrder(order , tokens)
    	order= decorateOrderBookOrder(order, tokens)
    	return(order)		
    })
  )
}

const decorateOrderBookOrder = (order , tokens) =>{
  const orderType = order.tokenGive === tokens[1].address ? 'buy' : 'sell'

  return({
  	...order,
  	orderType,
  	orderTypeClass : (orderType === 'buy' ? GREEN : RED),
  	orderFillAction : (orderType === 'buy' ? 'sell' : 'buy')
  })
}

const decorateOrder =(order, tokens) =>{
	let token0Amount , token1Amount
  
  //Note: DApp should be considered token 0 , mETH is considered token 1
  //example : giving mETH in exchange for DApp
   if(order.tokenGive === tokens[1].address){
   	token0Amount = order.amountGive //the amount of DApp we are giving
   	token1Amount = order.amountGet //the amount of mETH we want 
   }else{
     token0Amount = order.amountGet //the amount of DApp we want 
     token1Amount = order.amountGive // the amount of mETH we are giving
   }
   //calculate tokenPrice to 5 decimal places
   const precision = 100000
   let tokenPrice = (token1Amount/token0Amount)
   tokenPrice = Math.round(tokenPrice * precision) / precision


return({
	...order,
	token0Amount : ethers.utils.formatUnits(token0Amount , "ether"), 
	token1Amount : ethers.utils.formatUnits(token1Amount , "ether"),
	tokenPrice , //tokenPrice : tokenPrice 
	formattedTimestamp : moment.unix(order.timestamp).format('h :mm :ssa d MMM D')
})

}

//----------------------------------
//Order Book
export const OrderBookSelector = createSelector( 
	openOrders ,
	 tokens ,
	 (orders , tokens)=>{

	if(! tokens[0] || ! tokens[1]) { return } 
  //console.log('OrderBookSelector' , orders , tokens)

  //filter orders by selected tokens
    orders = orders.filter((o) => o.tokenGet === tokens[0].address || o.tokenGet === tokens[1].address)
    orders = orders.filter((o) => o.tokenGive === tokens[0].address || o.tokenGive === tokens[1].address)
     
     // decorate orders
     orders = decorateOrderBookOrders(orders , tokens)

     //group orders by orderType
     orders = groupBy(orders , 'orderType')

     // fetch buy orders
     const buyOrders = get(orders , 'buy' , [])
     // fetch sell orders 
     const sellOrders = get(orders , 'sell' , [])

     //sort buy orders by tokenPrice
     orders={
     	...orders,
     	buyOrders : buyOrders.sort((a,b) => b.tokenPrice - a.tokenPrice)
     }

     // sort sell orders by tokenPrice
     orders={
     	...orders,
     	sellOrders : sellOrders.sort((a,b) => b.tokenPrice - a.tokenPrice)
     }

     return orders
     
  })
