import styles from "./page.module.css";
import RequestOTPForm from "@/components/RequestOTPForm";

export default function Home() {
    return (
        <div className={styles.page} style={{
            backgroundImage: `url("/background.jpg")`, backgroundSize: "cover", backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center', width: '100%', height: '100%',
        }}>
            <RequestOTPForm/>
        </div>
    );
}
