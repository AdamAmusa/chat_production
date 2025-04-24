import { FormControl, TextField, InputLabel, Box, styled, alpha, Button, Typography, Link} from "@mui/material";
import MuiCard from '@mui/material/Card';
import { useState } from "react";

import { signInUser } from "./Authentication";
import { useFetch } from "./Authentication";
import { usesignInGoogle } from "./Authentication";

import { GoogleIcon} from './CustomIcons';




const Card = styled(MuiCard)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignSelf: 'center',
    width: '325px',
    borderRadius: 10,
    padding: theme.spacing(4),
    gap: theme.spacing(2),
    margin: 'auto',
    [theme.breakpoints.up('sm')]: {
        maxWidth: '',
    },
    boxShadow:
        'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
    ...theme.applyStyles('dark', {
        boxShadow:
            'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
    }),
    
}));

const BootstrapInput = styled(TextField)(({ theme }) => ({
    'label + &': {
        marginTop: theme.spacing(3),
    },
    '& .MuiInputBase-input': {
        borderRadius: 8,
        position: 'relative',
        backgroundColor: '#F3F6F9',
        border: '1px solid',
        borderColor: '#E0E3E7',
        fontSize: 16,
        width: '100%',
        padding: '10px 12px',
        transition: theme.transitions.create([
            'border-color',
            'background-color',
            'box-shadow',
        ]),
        
        // Use the system font instead of the default Roboto font.
        fontFamily: [
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"',
        ].join(','),
        '&:focus': {
            boxShadow: `${alpha(theme.palette.primary.main, 0.25)} 0 0 0 0.2rem`,
            borderColor: theme.palette.primary.main,
        },
        ...theme.applyStyles('dark', {
            backgroundColor: '#1A2027',
            borderColor: '#2D3843',
        }),
    },
}));

const ButtonS = styled(Button)(({ theme }) => ({
    borderRadius: 9,
    fontFamily: [
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"',
    ] 
}));

const ButtonI = styled(Button)(({ theme }) => ({
    borderRadius: 100,
    fontSize: 15,
    color:"black",
    borderColor:"grey",
    width: '400px',
    fontFamily: [
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"',
    ]
}));


function Login() {
    useFetch();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [emailError, setEmailError] = useState(false);
    const [emailErrorMessage, setEmailErrorMessage] = useState('');

    const [passwordError, setPasswordError] = useState(false);
    const [passwordErrorMessage, setPasswordErrorMessage] = useState('');

    const [disableButton, setdisableButton] = useState(false);


    const confirmInputs = () =>{
        const email = document.getElementById('email');
        const password = document.getElementById('password');
        

        let isValidForm = true;

        if (!email.value || !/\S+@\S+\.\S+/.test(email.value)) {
            console.log("Invalid Format");
            setEmailError(true);
            setEmailErrorMessage('Please enter a valid email address.');
            isValidForm = false;
          } else {
            setEmailError(false);
            setEmailErrorMessage('');
          }

          if(password == ""){
            console.log("password issue");
            setPasswordError(true);
            setPasswordErrorMessage('Enter Password!');
            isValidForm = false;
          }
          else {
            setPasswordError(false);
            setPasswordErrorMessage('');
          }    
          
          return isValidForm;
    };

     const Submit = async () =>{
        const isValidForm = confirmInputs();
        console.log("Button Pressed!");
        if(isValidForm){
            setdisableButton(true);
            const response = await signInUser(email, password);
            console.log(response.errorCode)
            if (response.errorCode === "auth/invalid-credential"){
                console.log("Invalid Credentials");
                setdisableButton(false);
                setPasswordError(true);
                setPasswordErrorMessage("Invalid email or password");
                
            }
        }
        else{
            console.log("Error signing up" + isValidForm);
        }
     }
    
    return (
        <div
            className="Login"
            style={{
                display: 'flex',
                justifyContent: 'center', // Center horizontally
                alignItems: 'center', // Center vertically
                height: '100vh', // Full viewport height
                backgroundColor: '#f5f5f5', // Optional: Add a background color
            }}
        >
            <Card variant="" >

                <Box
                    component="form"
                    //onSubmit={handleSubmit}
                    noValidate
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        width: '100%',
                        gap: 2,
                        
                        }}
                >
                    <FormControl variant="standard">
                        <InputLabel shrink htmlFor="bootstrap-input">
                            Email
                        </InputLabel>
                        <BootstrapInput id="email"
                         error={emailError}
                         helperText={emailErrorMessage}
                         value ={email}
                         type="email"
                         required
                         autoComplete="email"
                         autoFocus
                         onChange={(e) => setEmail(e.target.value)}
                        />
                    </FormControl>


                    <FormControl variant="standard">
                        <InputLabel shrink htmlFor="bootstrap-input">
                            Password
                        </InputLabel>
                        <BootstrapInput id="password"
                        value={password}
                        error={passwordError}
                        helperText={passwordErrorMessage}
                        type = "password"
                        required
                        onChange={(e) => setPassword(e.target.value)}
                        />
                    </FormControl>


                    <ButtonS
                        type="submit"
                        fullWidth
                        variant="contained"
                        disabled={disableButton}
                        onClick={Submit}

                        
                    //onClick={validateInputs}
                    >
                        Sign in
                    </ButtonS>

                    <Typography sx={{ textAlign: 'center' }}>
                        Don&apos;t have an account?{' '}
                        <span>
                            <Link
                                to="/signup"
                                href="/signup"
                                variant="body2"
                                sx={{ alignSelf: 'center' }}
                            >
                                Sign up
                            </Link>
                        </span>
                    </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
                    <ButtonI
                        type="submit"
                        fullWidth
                        variant="outlined"
                        onClick={usesignInGoogle}
                        startIcon={<GoogleIcon />}
                    >
                        Log in with Google
                    </ButtonI>

                </Box>
            </Card>

        </div>
    );
}

export default Login;