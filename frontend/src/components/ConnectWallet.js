import { Container, Typography, Button } from '@mui/material'

export default function ConnectWallet({connectWallet}) {
    // console.log(connectWallet);

    return (
        <Container sx={{textAlign:'center'}}>
            <Typography variant='h2' sx={{p:5}}>Connect your wallet</Typography>
            <Button color="secondary" variant="outlined" onClick={connectWallet}>Connect Wallet</Button>            
        </Container>
    );
}