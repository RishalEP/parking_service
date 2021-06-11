import {
    SET_CONTRACT,
    SET_OWNER,
    SET_CURRENT,
    SET_CONTRACT_ADDRESS
} from '../types';

const initialState = {
    ownerAddress:null,
    contract:null,
    currentAddress:null,
    contractAddress:null
};
 
export default function(state=initialState,action){
    switch(action.type){
        case SET_CURRENT:
            // console.log({current:action.payload})
            return {...state, currentAddress: action.payload }
        case SET_OWNER:
            // console.log({owner:action.payload})
            return {...state, ownerAddress: action.payload }
        case SET_CONTRACT:
            // console.log({contract:action.payload})
            return {...state, contract: action.payload }
        case SET_CONTRACT_ADDRESS:
            // console.log({contractAddress:action.payload})
            return {...state, contractAddress: action.payload }
        default:
            return state;
    }
}