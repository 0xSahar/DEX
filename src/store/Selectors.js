import { createSelector } from 'reselect'
import { get , groupBy , reject , maxBy , minBy} from 'lodash'
import moment from 'moment'
import { ethers } from 'ethers'


const GREEN = '#25CE8F'
const RED = '#F45353'

const tokens = state => get(state , 'tokens.contracts')
const account = state => get(state , 'provider.account')
const events = state =>get(state , 'exchange.events')

//---------------------------------------
//my events
  export const myEventsSelector = createSelector(
  	account ,
  	events ,
  	(account , events) =>{

  		events = events.filter((e) => e.args.user === account) 
  		
  		return events

  }
  )









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


// -------------------------
// my open orders
export const myOpenOrdersSelector = createSelector(
	  account ,
	  openOrders ,
	  tokens,
	  (account , orders , tokens)=>{
	  	if(! tokens[0] || ! tokens[1]) { return }

	  //filter orders created by current account
	  orders = orders.filter((o)=> o.user === account )	

	  //filter orders by selected tokens
    orders = orders.filter((o) => o.tokenGet === tokens[0].address || o.tokenGet === tokens[1].address)
    orders = orders.filter((o) => o.tokenGive === tokens[0].address || o.tokenGive === tokens[1].address)

    // decorate orders - add display attributes
    orders = decorateMyOpenOrders(orders , tokens)

    // sort orders by time descending
     orders = orders.sort((a,b)=> b.timestamp - a.timestamp)

     return orders

}) 

const decorateMyOpenOrders = (orders , tokens)=>{
	return(
	 orders.map((order)=>{
	 	order = decorateOrder(order, tokens)
	 	order = decorateMyOpenOrder(order , tokens)
	 	return(order)
		})
		)

}

const decorateMyOpenOrder = (order , tokens) =>{
   let orderType = order.tokenGive === tokens[1].address ? 'buy' : 'sell'
   return({
   	...order,
   	  orderType,
   	  orderTypeClass : (orderType === 'buy' ? GREEN : RED)
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

// --------------------------------------------------
// All Filled orders
 export const filledOrdersSelector = createSelector(
 	filledOrders,
 	tokens,
 	 (orders , tokens) =>{
 	 	if(! tokens[0] || ! tokens[1]) { return }

 	 	//filter orders by selected tokens
    orders = orders.filter((o) => o.tokenGet === tokens[0].address || o.tokenGet === tokens[1].address)
    orders = orders.filter((o) => o.tokenGive === tokens[0].address || o.tokenGive === tokens[1].address)

    //step 1 : sort orders by time ascending 
    //step 2 : apply order colors
    //step 3 : sort orders by time descending for UI

    // sort orders by time ascending for price comparison 
    orders = orders.sort((a,b) => a.timestamp - b.timestamp) 


     orders = decorateFilledOrders(orders , tokens)

     // sort orders by time descending for display
     orders = orders.sort((a,b) => b.timestamp - a.timestamp)

     return orders
 })

 const decorateFilledOrders = (orders , tokens) =>{
 	// track previous order to comaore history
 	  let previousOrder = orders[0]
 	return(
 		orders.map((order) =>{
    // decorate each individual order
    order = decorateOrder(order , tokens)
    order = decorateFilledOrder(order , previousOrder)
    previousOrder = order // update the previous order once it's decorated 
    return order

 		})
 		)

 } 

 const decorateFilledOrder = (order , previousOrder) =>{
   return({
   	...order,
   	tokenPriceClass : tokenPriceClass(order.tokenPrice , order.id , previousOrder)

   })
 }

 const tokenPriceClass = (tokenPrice , orderId , previousOrder) =>{

 	// show green price if only one order exists
 	if(previousOrder.id === orderId ){
 		return GREEN
 	} 

 	// show green price if order price higher than previous order price
  // show red price if order price lower than previous order price
   if(previousOrder.tokenPrice <= tokenPrice ){
   	return GREEN //success
   }else{
   	 return RED //Danger 
   }

 }

 //----------------------------
 // My Filled Orders

 export const myFilledOrdersSelector = createSelector(
 	 account,
 	 filledOrders , 
 	 tokens, 
 	 (account ,orders , tokens) =>{

 	 	if(! tokens[0] || ! tokens[1]) { return }

	  //filter orders created or filled  by current account
	  orders = orders.filter((o)=> o.user === account || o.creator === account )	

	  //filter orders by selected tokens
    orders = orders.filter((o) => o.tokenGet === tokens[0].address || o.tokenGet === tokens[1].address)
    orders = orders.filter((o) => o.tokenGive === tokens[0].address || o.tokenGive === tokens[1].address)

    // sort orders by time descending
     orders = orders.sort((a,b)=> b.timestamp - a.timestamp)

     // decorate orders - add display attributes
     orders = decorateMyFilledOrders(orders , account , tokens)

    return orders
    
 })

 const decorateMyFilledOrders =(orders , account , tokens) =>{
 	return(
 		orders.map((order) =>{
 			order = decorateOrder(order , tokens)
 			order = decorateMyfilledOrder(order , account , tokens)

 			return(order)
 		})
 	)
 }

const decorateMyfilledOrder =(order, account , tokens) =>{
	const myOrder = order.creator === account

	let orderType

	if(myOrder){
		orderType = (order.tokenGive === tokens[1].address ? 'buy' : 'sell')

	}else{
		orderType = (order.tokenGive === tokens[1].address ? 'sell' : 'buy')

	}
	return({
		...order,
		orderType,
		orderClass : (orderType === 'buy' ? GREEN : RED) , 
		orderSign : (orderType === 'buy' ? '+' : '-')
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

//--------------------------------
//priceChart

export const PriceChartSelector = createSelector(
	filledOrders ,
	 tokens ,
	 (orders , tokens) => {
	 	 if(! tokens[0] || ! tokens[1]) { return }

	 	 	//filter orders by selected tokens
    orders = orders.filter((o) => o.tokenGet === tokens[0].address || o.tokenGet === tokens[1].address)
    orders = orders.filter((o) => o.tokenGive === tokens[0].address || o.tokenGive === tokens[1].address)
     

     //sort orders by date ascending to compare history
     orders = orders.sort((a,b) => a.timestamp - b.timestamp) 

    //decorate orders- add dispaly atributes
    orders = orders.map((o) => decorateOrder(o, tokens)) 
    
    // get  last 2 orders for final price  & price change
    let lastOrder , secondLastOrder 
    [secondLastOrder , lastOrder] = orders.slice(orders.length - 2 , orders.length)
    

   // get last order price
    const lastPrice = get(lastOrder , 'tokenPrice' , 0) 
  // get secondLast order price 
    const lastSecondPrice = get(secondLastOrder, 'tokenPrice' , 0)

    return({
    	lastPrice,
    	lastPriceChange : (lastPrice >= lastSecondPrice ? '+' : '-'),
    	series :[{
    		data :buildraphData(orders)
    	}]
    })

	 }) 

const buildraphData = (orders) =>{
	//group the orders by hour for the graph
	orders = groupBy(orders , (o) => moment.unix(o.timestamp).startOf('hour').format())//hourly canclestick
    
    //get each hour where data exists
    const hours = Object.keys(orders)


 // build the graph series
    const graphData = hours.map((hour)=>{
    	//fetch all orders from current hour 
    	const group = orders[hour]

    	//calculate price values : open , high , low , close
    	const open = group[0] //first order
    	const high = maxBy(group , 'tokenPrice') // high price
    	const low = minBy(group , 'tokenPrice') //low price
    	const close = group[group.length - 1] //last order

    	return({
    		x: new Date(hour),
    		y:[open.tokenPrice ,
    		   high.tokenPrice ,
    		   low.tokenPrice ,
    		   close.tokenPrice]
   	})
  })
 return graphData
}
