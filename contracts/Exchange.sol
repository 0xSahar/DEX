// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0; 

import "hardhat/console.sol";
import "./Token.sol";

contract Exchange{

	address public feeAccount;
	uint256 public feePercent;

    mapping (address => mapping(address => uint256)) public tokens; //tracks the user's balance on exchange
	  mapping (uint256 => _Order) public orders;
    uint256 public ordersCount;
    mapping(uint256 => bool) public orderCancelled;
    mapping(uint256 => bool) public orderFilled;
    


	event Deposit(address token , address user , uint256 amount , uint256 balance);
	event Withdraw(address token , address user , uint256 amount , uint256 balance);
	event Order(
		uint256 id,
		address user, 
		address tokenGet,
		uint256 amountGet,
		address tokenGive,
		uint256 amountGive,
		uint256 timestamp
	);

	event Cancel(
		uint256 id,
		address user, 
		address tokenGet,
		uint256 amountGet,
		address tokenGive,
		uint256 amountGive,
		uint256 timestamp
		);
	event Trade(
		uint256 id,
		address user, 
		address tokenGet,
		uint256 amountGet,
		address tokenGive,
		uint256 amountGive,
		address creator,
		uint256 timestamp);

     struct _Order{
     	uint256 id;
		address user; //user who made order
		address tokenGet;
		uint256 amountGet;
		address tokenGive;
		uint256 amountGive;
		uint256 timestamp; //when order was created
     }

	constructor(address _feeAccount , uint256 _feePercent){
       feeAccount = _feeAccount;
       feePercent = _feePercent;
	}
 


    // ------------------------------
	// Deposit & Withdraw Tokens
	function depositToken(address _token , uint256 _amount) public{
	   // Transfer Tokens to exchange 
       require(Token(_token).transferFrom(msg.sender , address(this) , _amount));  
       //update user balance
       tokens[_token][msg.sender]= tokens[_token][msg.sender] + _amount;
       //Emit an event
       emit Deposit(_token , msg.sender , _amount , tokens[_token][msg.sender] );  
	}

	function withdrawToken(address _token , uint256 _amount) public{
		// ensure that user has enough tokens to withdraw
		require(tokens[_token][msg.sender] >= _amount);
		// Transfer tokens to the user
		Token(_token).transfer(msg.sender , _amount);
		// update balance
		tokens[_token][msg.sender] = tokens[_token][msg.sender] - _amount;
		// Emit an event
		emit Withdraw(_token , msg.sender , _amount , tokens[_token][msg.sender]);

	}

	// check balances (wrapper function that checks the value out of a mapping)
	function balanceOf(address _token , address _user)
	public 
	view
	returns(uint256){

		return tokens[_token][_user];
	}

    // --------------------------------
     // make and cancel orders

	function makeOrder(
		address _tokenGet , 
		uint256 _amountGet , 
		address _tokenGive , 
		uint256 _amountGive
     ) public{

   //require token balance 
   require(balanceOf(_tokenGive , msg.sender) >= _amountGive);

   // instantiate a new order

     	ordersCount++;

     	orders[ordersCount] =  _Order(
     	ordersCount ,
     	 msg.sender ,
     	 _tokenGet ,
     	 _amountGet ,
     	 _tokenGive ,
     	 _amountGive ,
     	 block.timestamp
     	 );

     	// Emit event
     	emit Order(
     	ordersCount ,
     	msg.sender ,
     	_tokenGet ,
     	_amountGet ,
     	_tokenGive ,
     	_amountGive ,
     	block.timestamp);

	}

	function cancelOrder(uint256 _id) public{
        // fetch the order
        _Order storage _order = orders[_id];

        // ensure the caller of the function is the owner of the order
        require(msg.sender == address(_order.user));

        // order must exist
        require(_order.id == _id);
		// cancel the order

		orderCancelled[_id] = true;
		//Emit event
		emit Cancel(
	    _order.id,
		msg.sender ,
		_order.tokenGet , 
		_order.amountGet ,
	    _order.tokenGive ,
		_order.amountGive ,
		block.timestamp
	  );
	}
  

  // -------------------------
  // executing orders

    function fillOrder(uint256 _id) public{
    	//must be valid orderId
    	require(_id > 0 && _id <= ordersCount , "order does not exist!" );
    	// order can't be filled
    	require(!orderFilled[_id]);
    	// order can't be cancelled
    	require(!orderCancelled[_id]);

    	// fetch order
    	_Order storage _order = orders[_id];

    	// execute the order
    	_trade(
    		_order.id , 
    		_order.user ,
    		_order.tokenGet ,
    		_order.amountGet ,
    	    _order.tokenGive ,
    		_order.amountGive );

    	// mark order as filled
    	orderFilled[_order.id] = true; 
    }

    function _trade(
    	uint256 _orderId ,
    	address _user ,
        address _tokenGet ,
    	uint256 _amountGet ,
    	address _tokenGive ,
    	uint256 _amountGive ) 
    internal {
    	// fee is paid by the user who filled the order(msg.sender)
    	// fee is deducted from _amountGet
          uint256 _feeAmount = (_amountGet * feePercent) / 100;

    	// do trade here
    	// user is the one who made the order , msg.sender is who filled the order
    	tokens[_tokenGet][msg.sender] = tokens[_tokenGet][msg.sender] - (_amountGet + _feeAmount);
    	tokens[_tokenGet][_user] = tokens[_tokenGet][_user] + _amountGet;

    	 // charge fees 
    	 tokens[_tokenGet][feeAccount] = tokens[_tokenGet][feeAccount] + _feeAmount; 

    	tokens[_tokenGive][msg.sender] = tokens[_tokenGive][msg.sender] + _amountGive;
    	tokens[_tokenGive][_user] = tokens[_tokenGive][_user] - _amountGive;

    	// emit the Trade event
    	emit Trade(
    		_orderId , 
    		msg.sender ,
    		_tokenGet ,
    		_amountGet ,
    		_tokenGive ,
    		_amountGive ,
    		_user,
    		block.timestamp 
    		);
    }
}

