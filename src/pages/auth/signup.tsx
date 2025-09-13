import { Button, Card, Field, Flex, Input, Stack } from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";
import { Toaster, toaster } from "../../components/ui/toaster";
import { useNavigate } from "react-router-dom";

function Signup() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [mail, setMail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    async function clearHandler() {
        setFirstName('');
        setLastName('');
        setMail('');
        setPhone('');
        setPassword('');
    }

    async function signUpHandler() {
        const toastId = toaster.create({
            description: "Attempting signup, please wait...",
            type: "loading",
            id: "login-toast"
        });
        try {
            const response = await axios({
                url: "https://grub-workable-rhino.ngrok-free.app/v1/api/root/userSignup",
                method: "POST",
                data: {
                    firstName: firstName || '',
                    lastName: lastName || '',
                    email: mail || '',
                    phone: phone || '',
                    password: password || ''
                }
            });

            let color = '';
            console.log(response);

            if(response.data.msg === "User has been created successfully, navigating to login...") {
                color = 'success';
                setTimeout(() => {
                    navigate('/login');
                }, 4000);
            } else if(response.data.msg === "Missing Credentials.") {
                color = "info";
            } else {
                color = 'error';
            }
            toaster.update(toastId, {
                description: response.data.msg,
                type: color,
                duration: 3000
            });

        } catch(err) {
            toaster.update(toastId, {
                type: "error",
                description: "Backend Server Unavailable.",
                duration: 3000
            });
        }
        
    }

  return (
    <Flex justifyContent={"center"}>
        <Toaster />

        <Card.Root maxW="md" mt={{base: "10vw", md: "2vw"}} mr={{base: "10vw", md: "0vw"}} ml={{base: "10vw", md: "0vw"}}>
            <Card.Header>
            <Card.Title>Sign up</Card.Title>
            <Card.Description>
                Fill in the credentials below to create an account and access NeoGuardian Platform.
            </Card.Description>
            </Card.Header>
            <Card.Body>
            <Stack gap="4" w="full">
                <Field.Root>
                <Field.Label>First Name</Field.Label>
                <Input placeholder="enter name." value={firstName} onChange={(e) => {setFirstName(e.target.value)}}/>
                </Field.Root>

                <Field.Root>
                <Field.Label>Last Name</Field.Label>
                <Input placeholder="enter surname." value={lastName} onChange={(e) => {setLastName(e.target.value)}}/>
                </Field.Root>

                <Field.Root>
                <Field.Label>Email ID</Field.Label>
                <Input placeholder="enter valid email address." value={mail} onChange={(e) => {setMail(e.target.value)}}/>
                </Field.Root>

                <Field.Root>
                <Field.Label>Phone Number</Field.Label>
                <Input placeholder="enter 10 digit phone-number." value={phone} onChange={(e) => setPhone(e.target.value)}/>
                </Field.Root>

                <Field.Root>
                <Field.Label>Password</Field.Label>
                <Input placeholder="minimum six characters." value={password} onChange={(e) => {setPassword(e.target.value)}}/>
                </Field.Root>
            </Stack>
            </Card.Body>
            <Card.Footer justifyContent="flex-end">
            <Button variant="outline" onClick={clearHandler}>Clear</Button>
            <Button variant="outline" onClick={() => {navigate('/login')}}>Login</Button>
            <Button variant="solid" onClick={signUpHandler}>Sign Up</Button>
            </Card.Footer>
        </Card.Root>
    </Flex>
    )

}

export default Signup