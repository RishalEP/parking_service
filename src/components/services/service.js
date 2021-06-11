import Web3 from 'web3'

export  const loadWeb3 = async () => {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  } 

export  const getCurrentAccount = async () => {
    const web3 = window.web3
    const accounts = await web3.eth.getAccounts()
    return(accounts[0] ? accounts[0]:null)
  } 

export const getBalance = async (account) => {
  const web3 = window.web3
  const balance = await web3.eth.getBalance(account)
  const response = await web3.utils.fromWei(balance, "ether")
  return response
}

export const getOwner = async (contract) => {
    const owner = await contract.methods.owner.call().call()
    return owner
}

export const getUsers = async (contract) => {
  const users = await contract.methods.registeredUsers.call().call()
  return users
}

export const getTotalBookings = async (contract) => {
  const total = await contract.methods.totalBooking.call().call()
  return total
}

export const getTotalPlaces = async (contract) => {
  const total = await contract.methods.totalPlaces.call().call()
  return total
}

export const getUser = async (contract,address) => {
  const user = await contract.methods.users(address).call()
  return user
}

export const ifExists = async (contract,address) => {
  const exists = await contract.methods.existsUser(address).call()
  return exists
}

export const fetchBooking = async (contract,bookingId) => {
  const booking = await contract.methods.bookings(bookingId).call()
  return booking
}

export const fetchUserInfo = async (contract,userAddress) => {
  const booking = await contract.methods.userInfo(userAddress).call()
  return booking
}

export const fetchPlaceInfo = async (contract,placeId) => {
  const user = await contract.methods.placeInfo(placeId).call()
  return user
}

export const fetchBookPlace = async (contract,bookingId) => {
  const user = await contract.methods.bookInfo(bookingId).call()
  return user
}

const responseGenerator = (code,message,response) => {
  return({
    code:code,
    message:message,
    response:response
  })
}

export const registerUser = async (contract,name,password,account) => {
    contract.methods.setUser(name,password).send({from:account})
    .then((response) => {
      return(responseGenerator(200,'Transaction SuccessFull',response))
    }).catch((error) => {
      return(responseGenerator(400,'Transaction Failed',error))
    })
}

export const bookSlot = async (contract,account,placeId) => {
  contract.methods.bookSlot(placeId).send({from:account})
  .then((response) => {
    return(responseGenerator(200,'Transaction SuccessFull',response))
  }).catch((error) => {
    return(responseGenerator(400,'Transaction Failed',error))
  })
}

export const approveSlot = async (contract,bookingId,account) => {
  contract.methods.approveSlot(bookingId).send({from:account})
  .then((response) => {
    return(responseGenerator(200,'Transaction SuccessFull',response))
  }).catch((error) => {
    return(responseGenerator(400,'Transaction Failed',error))
  })
}

export const exitParking = async (contract,bookingId,rating,account) => {
  contract.methods.leaveParking(bookingId,rating).send({from:account,value:10})
  .then((response) => {
    return(responseGenerator(200,'Transaction SuccessFull',response))
  }).catch((error) => {
    return(responseGenerator(400,'Transaction Failed',error))
  })
}

export const rejectApproval = async (contract,bookingId,account) => {
  contract.methods.rejectApproval(bookingId).send({from:account})
  .then((response) => {
    return(responseGenerator(200,'Transaction SuccessFull',response))
  }).catch((error) => {
    return(responseGenerator(400,'Transaction Failed',error))
  })
}

export const addPlace = async (contract,name,maxSlots,account) => {
  contract.methods.setPlace(name,maxSlots).send({from:account})
  .then((response) => {
    return(responseGenerator(200,'Transaction SuccessFull',response))
  }).catch((error) => {
    return(responseGenerator(400,'Transaction Failed',error))
  })
}

export const withdrawAmount = async (contract,account) => {
  contract.methods.withdrawAll().send({from:account})
  .then((response) => {
    return(responseGenerator(200,'Transaction SuccessFull',response))
  }).catch((error) => {
    return(responseGenerator(400,'Transaction Failed',error))
  })
}




