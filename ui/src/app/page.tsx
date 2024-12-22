import styles from "./page.module.css";
import RequestOTPForm from "@/app/components/RequestOTPForm";

export default function Home() {
    return (
        <div className={styles.page} style={{
            backgroundImage: `url("/background.jpg")`, backgroundSize: "cover", backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center', width: '100%', height: '100%',
        }}>
            <main className={styles.main}>
                <RequestOTPForm/>
            </main>
        </div>
    );
}
