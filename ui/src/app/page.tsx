"use client"
import styles from "./page.module.css";
import RequestOTPForm from "@/components/RequestOTPForm";
import OTPLoginForm from "@/components/OTPLoginForm";
import {useState} from "react";

export default function Home() {
    const [email, setEmail] = useState("");

    return (
        <div className={styles.page} style={{
            backgroundImage: `url("/background.jpg")`, backgroundSize: "cover", backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center', width: '100%', height: '100%',
        }}>
            <RequestOTPForm setEmail={setEmail} />
            {email && <OTPLoginForm email={email}/>}
        </div>
    );
}
