import { useSelector } from 'react-redux'
import { useRef , useEffect } from 'react'

import { myEventsSelector } from '../store/Selectors'

import config from '../config.json'

const Alert = () => {

  const alertRef = useRef(null)

  const network = useSelector(state=> state.provider.network)
  const account = useSelector(state=> state.provider.account)
  const isPending = useSelector(state=> state.exchange.transaction.isPending)
  const isError = useSelector(state=>state.exchange.transaction.isError)

  const events = useSelector(myEventsSelector)


  useEffect(()=>{
    if((events[0] || isPending || isError) && account){//check for the presence of an account
      alertRef.current.className = 'alert'
    }
  }, [events ,isPending , isError , account])// to listen for that change


  const removeHandler = async(e)=>{
     alertRef.current.className = 'alert--remove'
   }

  
  
  return (
    <div>
    {isPending ?(

        <div className="alert alert--remove" onClick={removeHandler} ref={alertRef}>
          <h1>Transaction Pending...</h1>
        </div>

      ): isError ? (

      <div className="alert alert--remove" onClick={removeHandler} ref={alertRef}>
          <h1>Transaction Will Fail</h1>
        </div>
      /* it is gonna show it before metamask pops up cause it uses ethers to determine that */

      ) : !isPending && events[0] ?(

             <div className="alert alert--remove" onClick={removeHandler} ref={alertRef}>
          <h1>Transaction Successful</h1>
            <a
              href={config[network] ? `${config[network].explorerURL}/tx/${events[0].transactionHash}` : '#'}
              target='_blank'
              rel='noreferrer'
            >
            {events[0].transactionHash.slice(0,6) + '...' + events[0].transactionHash.slice(60,66)}
            </a>
        </div>

      ) : (
      <div className="alert alert--remove" onClick={removeHandler} ref={alertRef} ></div>
      )}
        
   
    </div>
  );
}

export default Alert;
