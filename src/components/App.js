import React, { useState, useEffect, useMemo } from "react";
import { Route, Switch } from "react-router-dom";
import { Router } from "react-router";
import ParkingContract from '../abis/ParkingPlaces.json'
import { history } from "./helpers";
import { useSelector, useDispatch } from "react-redux";

import "./App.css";
import { Home } from "./Home";
import { Admin } from "./admin/index"
import { User } from "./user/index";
import {  getOwner , loadWeb3 } from "./services/service";
import { setOwner,setContract,setCurrent, setContractAddress } from "./redux/_actions";
import { Header } from "./Header";


const App = () => {

  const dispatch = useDispatch();

  const [loading, setLoading] = useState(true);
  useEffect(async () => {
      await loadWeb3()
      await loadBlockchainData()
  },[]);

  const loadBlockchainData = async () => {

    const web3 = window.web3
    let accounts = await web3.eth.getAccounts()
    let currentAccount = accounts[0]
    dispatch(setCurrent(accounts[0]));

    const accountInterval = setInterval(async function() {
      accounts = await web3.eth.getAccounts()
      if (accounts[0] != currentAccount) {
        currentAccount = accounts[0]
        dispatch(setCurrent(accounts[0]));
      }
    }, 3000);

    const networkId = await web3.eth.net.getId()
    const parkingData = ParkingContract.networks[networkId]
    if(parkingData) {

      dispatch(setContractAddress(parkingData.address));

      const parkingDetails = new web3.eth.Contract(ParkingContract.abi, parkingData.address)
      dispatch(setContract(parkingDetails));

      const owner = await getOwner(parkingDetails)
      dispatch(setOwner(owner));

    } else {
      window.alert('ParkingService contract not deployed to detected network.')
    }

    setLoading(false)
  }

  const signOut = () => {
    history.replace('/')
  }

  return (

    <div className="App">
        <Header logout={signOut} />
        <Router history={history}>
          <Switch>
              <Route exact path="/" component={Home} />
              <Route  path="/admin" component={Admin} />
              <Route  path="/user" component={User} />
          </Switch>
        </Router>
        
    </div>
  );
}

export default App;
