import { Container, Typography, Button, Divider, Box, Input } from '@mui/material'
import { useEffect, useState } from 'react'
import ConnectWallet from './ConnectWallet';
import NoWalletDetected from './NoWalletDetected';
import contractAddress from '../contracts/contract-address.json'
import TokenArtifact from "../contracts/TokenArtifact.json";
import TransferForm from './TransferForm';

const { ethers } = require("ethers");

// to use when deploying to other networks.
const HARDHAT_NETWORK_ID = '1337';

// This is an error code that indicates that the user canceled a transaction
const ERROR_CODE_TX_REJECTED_BY_USER = 4001;

export default function Dapp() {

    const [state, setState] = useState({
        tokenData: undefined,
        selectedAddress: undefined,
        balance: 0,
        symbol: undefined,
        txBeingSent: undefined,
        transactionError: undefined,
        networkError: undefined,
    });

    const [contract, setContract] = useState(undefined);

   
    useEffect(() => {
        _initializeEthers();
    }, []);

    useEffect(() => {
        if ( state.selectedAddress !== undefined) {
            const interval = setInterval(() => _updateBalance(), 1000);            
            return () => clearInterval(interval);
        }
    }, [state.selectedAddress])

    if (window.ethereum === undefined) {
        return <NoWalletDetected />;
    }
    // console.log(window.ethereum);//log ethereum provider
    
    if (!state.selectedAddress) {
        return (
        <>
            <ConnectWallet connectWallet = {() => _connectWallet()}/>
        </>);
    }

    return (
        <Container>            
            <Typography variant='h3'>My Hardhat Token (MHT)</Typography>
            <p>Welcome <b>{state.selectedAddress}</b>, you have <b>{state.balance.toString()}</b> {state.symbol}</p>
            
            <Divider sx={{py: 2}}></Divider>
            {state.balance == 0 ?  
                <Box>
                    <Button onClick={() => { console.log(state)}}>Log state</Button>
                    <Typography>You don't have tokens to transfer</Typography>
                    <Typography>To get some tokens, open a terminal in the root of the repository and run</Typography>
                    <Typography color={'blue'}>npx hardhat --network localhost faucet {state.selectedAddress}</Typography>
                </Box>
                :
                <TransferForm symbol={state.symbol} transferTokens = {(to, amount) => _transferTokens(to, amount)}></TransferForm>
            }
        </Container>        
    );

    async function _connectWallet() {       
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const account = accounts[0];           
        // console.log(accounts);
        // First we check the network
        if (!_checkNetwork()) {
            return;
        }
        _initialize(account);  
    }

    async function _initializeEthers() {
        //provider: which address calls the contract function from
        // const provider = new ethers.providers.JsonRpcProvider();// no param : connect to localhost:8545
        const provider = new ethers.providers.Web3Provider(window.ethereum); //get provider from metamask
        console.log(provider.getSigner(0));
        const deployedContract = new ethers.Contract(
            contractAddress.Token,  //deployed contract address
            TokenArtifact.abi,
            provider.getSigner(0) //provider:only read, signer:can execute state-changing operation
        );
        setContract(deployedContract);
    }

    async function _initialize(userAddress) {     
        
        const name= await contract.name();
        const symbol = await contract.symbol();
        const totalSupply = await contract.totalSupply();
        const balance = await contract.balanceOf(userAddress);
        // console.log(balance.toString());
        setState({
            ...state,
            balance:balance,
            selectedAddress: userAddress,
            symbol: symbol
        });       
    }

    async function _updateBalance() {
        // console.log(state.selectedAddress);
        const balance = await contract.balanceOf(state.selectedAddress);        
        setState({...state, balance:balance});
    }

    async function _transferTokens(to, amount) {
        try{
            const tx = await contract.transfer(to, amount);        
            setState({...state, txBeingSent: tx.hash})
            const receipt = await tx.wait();
            // The receipt, contains a status flag, which is 0 to indicate an error.
            if (receipt.status === 0) {
                // We can't know the exact error that made the transaction fail when it
                // was mined, so we throw this generic one.
                throw new Error("Transaction failed");
                
            }
            await _updateBalance();
        } catch (error) {
            if (error.code === ERROR_CODE_TX_REJECTED_BY_USER) {
                return;
            }
        } finally {
            setState(...state, { txBeingSent: undefined });
        }
        
    }

    function _checkNetwork() {
        if (window.ethereum.networkVersion === HARDHAT_NETWORK_ID) {
          return true;
        }    
        alert("Please connect Metamask to Localhost:8545");
        return false;
    }

}