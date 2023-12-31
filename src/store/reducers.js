export const provider = (state = {} , action ) =>{
  switch(action.type){
  	case 'PROVIDER_LOADED':
  	return{
  		...state,
  		connection: action.connection
  	}
  	case 'NETWORK_LOADED':
  	return{
  		...state,
  		chainId : action.chainId
  	}
     case 'ACCOUNT_LOADED':
     return{
     	...state,
     	account : action.account
     }
     case 'ETHER_BALANCE_LOADED':
     return{
     	...state,
     	balance : action.balance
     }

  	default:
  	  return state 
  }
}

const DEFAULT_TOKENS_STATE = {
 loaded : false , 
 contracts : [] ,
  symbols : [] 
} 

export const tokens = (state = DEFAULT_TOKENS_STATE , action ) =>{
   switch(action.type){
   	case 'TOKEN_1_LOADED' :
   	return{
   		...state,
   		loaded : true,
   		contracts : [action.token],
   		symbols :[action.symbol] 
   	}
      case 'TOKEN_1_BALANCE_LOADED':
      return{
         ...state,
         balances : [action.balance]
      }
   	case 'TOKEN_2_LOADED' :
   	return{
   		...state,
   		loaded : true,
   		contracts : [...state.contracts , action.token ],
   		symbols :[...state.symbols , action.symbol]
   	}

      case 'TOKEN_2_BALANCE_LOADED' :
      return{
         ...state,
         balances : [...state.balances , action.balance]
      }

	default:
   	return state
   }
}

const DEFAULT_EXCHANGE_STATE = {
   loaded : false, 
   contract : {},
   transaction : {
    isSuccessful : false
   },
   allOrders :{
      loaded:false,
      data:[]
   },
   cancelledOrders:{
      data:[]
   },
   filledOrders:{
      data:[] 
   },
   events : []
}

export const exchange = (state = DEFAULT_EXCHANGE_STATE , action  )=>{
   switch (action.type){
   	case 'EXCHANGE_LOADED' :
   	return{
       ...state,
       loaded : true,
       contract : action.exchange
   	}

  //---------------------------------------------
  //orders loaded (open ,cancelld , filled & all)

      case 'FILLED_ORDERS_LOADED' :
      return{
         ...state,
         filledOrders :{
            loaded : true,
            data: action.filledOrders
         }
      }

      case 'CANCELLED_ORDERS_LOADED' :
      return{
        ...state,
        cancelledOrders : {
        loaded : true,
        data : action.cancelledOrders
       }
  }

      case 'ALL_ORDERS_LOADED'  :
      return{
         ...state,
         allOrders :{
            loaded : true,
            data : action.allOrders
         }           
      }



      
   //---------------------------------------------------------------
    //Balance cases 
     case 'EXCHANGE_TOKEN _1_BALANCE_LOADED' :
     return{
      ...state,
      balances : [action.balance]
     }

     case 'EXCHANGE_TOKEN _2_BALANCE_LOADED' :
     return{
      ...state,
      balances :[...state.balances , action.balance]
     }


   //----------------------------------------------------------
  // cancelling orders
  case 'ORDER_CANCEL_REQUEST' :
    return{
      ...state,
      transaction :{
        transactionType : 'Cancel',
        inPending : true,
        isSuccessful : false
      }
    }

    case 'ORDER_CANCEL_SUCCESS' :
    return{
       ...state,
      transaction :{
        transactionType : 'Cancel',
        inPending : false,
        isSuccessful : true
      },
      cancelledOrders :{
         ...state.cancelledOrders,
         data :[
          ...state.cancelledOrders.data , 
          action.order
         ]
      },
      events : [action.event , ...state.events]
    }

      case 'ORDER_CANCEL_FAIL' :
     return{
      ...state,
      transaction : {
         transactionType : 'Cancel',
         isPending : false,
         isSuccessful:false,
         isError : true
      }
   }

   //------------------------------------------------------------
   // filling orders
   case 'ORDER_FILL_REQUEST' :
    return{
      ...state,
      transaction :{
        transactionType : 'Fill Order',
        inPending : true,
        isSuccessful : false
      }
    }

    case 'ORDER_FILL_SUCCESS' :
     return{
       ...state,
      transaction :{
        transactionType : 'Fill Order',
        inPending : false,
        isSuccessful : true
      },
      filledOrders :{
         ...state.filledOrders,
         data :[
          ...state.filledOrders.data , 
          action.order
         ]
      },
      events : [action.event , ...state.events]
    }

      case 'ORDER_FILL_FAIL' :
     return{
      ...state,
      transaction : {
         transactionType : 'Fill Order',
         isPending : false,
         isSuccessful:false,
         isError : true
      }
   }


     //--------------------------------------------------------------------
     //transfer Cases(deposit and withdraws)
     case 'TRANSFER_REQUEST' : 
     return{
      ...state, 
      transaction : {
         transactionType : 'Transfer',
         isPending : true,
         isSuccessful:false
      },
       transferInProgress : true
     }

     case 'TRANSFER_SUCCESS' :
     return{
      ...state,
      transaction : {
         transactionType : 'Transfer',
         isPending : false,
         isSuccessful:true
      },
      transferInProgress : false,
      events :[action.event , ...state.events]
     }

     case 'TRANSFER_FAIL' :
     return{
      ...state,
      transaction : {
         transactionType : 'Transfer',
         isPending : false,
         isSuccessful:false,
         isError : true
      },
      transferInProgress : false 
     }

     //-----------------------
     //making Orders Cases
     case 'NEW_ORDER_REQUEST' :
     return{
      ...state,
      transaction :{
         transactionType : 'New Order',
         isPending : true,
         isSuccessful:false
      },
     }

     case 'NEW_ORDER_SUCCESS' :

     
     return{
      ...state,
      allOrders :{
       ...state.allOrders,
       data :[...state.allOrders.data , action.order]
      },
      transaction :{
         transactionType : 'New Order',
         isPending : false,
         isSuccessful:true
      },
      events:[action.event , ...state.events]
     }

     case 'NEW_ORDER_FAIL' :
     return{
      ...state,
      transaction :{
         transactionType : 'New Order',
         isPending : false,
         isSuccessful:false,
         isError : true
      },
     }

   	default:
   	return state
   }
} 
