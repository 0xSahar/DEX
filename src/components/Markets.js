import { useSelector , useDispatch } from 'react-redux'
import config from '../config.json'

import {loadTokens} from '../store/interactions'

const Markets = () => {


  const dispatch = useDispatch()

  const provider = useSelector(state=> state.provider.connection)
  const chainId = useSelector(state => state.provider.chainId)

  const markethandler = async (e) =>{
    await loadTokens(provider , (e.target.value).split(",") , dispatch)

  }

  return(
    <div className='component exchange__markets'>
      <div className='component__header'>
       <h2> Select Market </h2>
      </div>
      {config && config[chainId] 
      ? 
      (<select name="markets" id="markets" onChange = {markethandler}> 
      <option value={`${config[chainId].ele.address},${config[chainId].mWETH.address}`} > ele / mWETH  </option>
      <option value={`${config[chainId].ele.address},${config[chainId].mDAI.address}`} > ele / mDAI </option>
      <option value={`${config[chainId].ele.address},${config[chainId].mUSDT.address}`} > ele / mUSDT </option>
      <option value={`${config[chainId].ele.address},${config[chainId].mUNI.address}`} > ele / mUNI </option>
      <option value={`${config[chainId].ele.address},${config[chainId].mMATIC.address}`} > ele / mMATIC </option>
      <option value={`${config[chainId].ele.address},${config[chainId].mSHIB.address}`} > ele / mSHIB </option>
      <option value={`${config[chainId].ele.address},${config[chainId].mLINK.address}`} > ele / mLINK </option>
      <option value={`${config[chainId].ele.address},${config[chainId].mXEN.address}`} > ele / mXEN </option>
      </select>) 
      : 
      (<div>
        <p> Not deployed to network </p>
       </div>)}
      
      <hr />
    </div>
  )
}

export default Markets;
