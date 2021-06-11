import {
    SET_CONTRACT,
    SET_OWNER,
    SET_CURRENT,
    SET_CONTRACT_ADDRESS
} from '../types';

export function setContract(contract) {
    return {
        type: SET_CONTRACT,
        payload: contract
    }
}

export function setOwner(owner) {
    return {
        type: SET_OWNER,
        payload: owner
    }
}

export function setCurrent(account) {
    return {
        type: SET_CURRENT,
        payload: account
    }
}

export function setContractAddress(account) {
    return {
        type: SET_CONTRACT_ADDRESS,
        payload: account
    }
}
