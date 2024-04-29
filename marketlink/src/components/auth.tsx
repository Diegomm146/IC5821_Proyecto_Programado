import { auth } from "../firebase/firebaseConfig"
import { createUserWithEmailAndPassword } from "firebase/auth"
import { useState } from "react"


export const Auth = () => {

    const [email, setEmail] =  useState(""); 
    const [password, setPassword] = useState("");

const singIn = async () => {


};

    return (
        <div>
            <input placeholder="Email..."/>
            <input  placeholder="Password..."/>
            <button>Sign In</button>
        </div>
    )
}