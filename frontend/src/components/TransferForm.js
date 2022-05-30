import { Typography, Stack, TextField, Button, Input } from "@mui/material";
import { Container } from "@mui/system";
import { useRef, useState } from "react";

export default function TransferForm({symbol, transferTokens}) {

    // const [amount, setAmount] = useState(1);

    // const address = useRef("40");
    const [amount, setAmount] = useState(0);
    const [address, setAddress] = useState('0x5fbdb2315678afecb367f032d93f642f64180aa3');

   
    return (
        <Container>
            <Typography variant="h3" sx={{py:2}}>
                Transfer
            </Typography>
            <Stack spacing={2}>
                <Typography>Amount of {symbol}</Typography>
                <TextField placeholder="0" variant="outlined" value={amount} onChange={(event) => setAmount(event.target.value)}/>
                <Typography>Recipient address</Typography>
                <TextField placeholder="0x5fbdb2315678afecb367f032d93f642f64180aa3" variant="outlined" value={address} onChange={(event) => setAddress(event.target.value)}/>
                <Button variant="contained" onClick={() =>transferTokens(address, amount) }>Transfer</Button>
               
            </Stack>
        </Container>
    )
  
}