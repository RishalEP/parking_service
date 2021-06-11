import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { Account } from '../account/Account'
import { fetchPlaceInfo, getTotalPlaces } from '../services/service';
import { PlacesInfo } from './PlacesInfo';


export const Home = (props) => {

    const currentAddress = useSelector(state => state.reducer.currentAddress);
    const contractAddress = useSelector(state => state.reducer.contractAddress);

    return (
        <div>
              <Account 
                type={'Owner Account Information'}
                userName={'Owner'}
                address={currentAddress}
                isContract={false}
            />

                <Account
                    type={'Contract Account Information'}
                    userName={'Parking Contract'}
                    address={contractAddress}
                    isContract={true}
                />

        </div>
    )
}
