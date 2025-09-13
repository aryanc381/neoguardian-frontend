import { Button, Card, Field, Flex, Input, Stack } from "@chakra-ui/react";
import { useState } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { toaster, Toaster } from "../../components/ui/toaster";

function Login() {

    const [mail, setMail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    async function Loginhandler() {
        const toastId = toaster.create({
            description: "Attempting login, please wait...",
            type: "loading",
            id: "login-toast"
        });
        try {
            const response = await axios({
                url: "https://grub-workable-rhino.ngrok-free.app/v1/api/root/userLogin",
                method: "POST",
                data: {
                    email: mail,
                    password: password
                }
            });
            console.log(response.data.msg);

            let color = "";
            if(response.data.msg === "Login Successfull") {
                color = "success";
                navigate("/dash");   
            } else {
                color = "error";
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

        <Card.Root maxW="md" mt={{base: "40vw", md: "10vw"}} mr={{base: "10vw", md: "0vw"}} ml={{base: "10vw", md: "0vw"}}>
            <Card.Header>
            <Card.Title>Login</Card.Title>
            <Card.Description>
                Log In to your account with Email ID and Password.
            </Card.Description>
            </Card.Header>
            <Card.Body>
            <Stack gap="4" w="full">
                <Field.Root>
                <Field.Label>Email ID</Field.Label>
                <Input placeholder="ex. hello@gmail.com / 9049122622" value={mail} onChange={(e) => {setMail(e.target.value)}}/>
                </Field.Root>

                <Field.Root>
                <Field.Label>Password</Field.Label>
                <Input placeholder="ex. password@123" value={password} onChange={(e) => {setPassword(e.target.value)}}/>
                </Field.Root>
            </Stack>
            </Card.Body>
            <Card.Footer justifyContent="flex-end">
            <Button variant="outline" onClick={() => {navigate('/signUp')}}>Sign Up</Button>
            <Button variant="solid" onClick={Loginhandler}>Log In</Button>
            </Card.Footer>
            
        </Card.Root>
    </Flex>
    )

}

export default Login;