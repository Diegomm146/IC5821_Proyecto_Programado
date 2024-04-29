import { FunctionComponent } from "react";
import styles from "./Home.module.css";
import 'bootstrap/dist/css/bootstrap.css';
import { auth } from "../../src/firebase/firebaseConfig";
import React, { useState, useEffect } from 'react';
import { onAuthStateChanged } from "firebase/auth";

const Home: FunctionComponent = () => {
    useEffect(()=>{
        onAuthStateChanged(auth, (user) => {
            if (user) {
              const uid = user.uid;
              console.log("uid", uid, user.email)
              console.log(user)
            } else {
              console.log("user is logged out")
            }
          });
         
    }, [])
 
  return (
    <section>        
      …
    </section>
  )
};

export default Home;
