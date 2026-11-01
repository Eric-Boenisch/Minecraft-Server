import Image from "next/image";
import { LogoutAction } from "./logout.jsx";
import styles from "../dashboard.module.css";

export default function Navbar({BedrockUser, name}) {
  const src = BedrockUser ? "/Bedrock.png" : "/Java.png";
  const alt = BedrockUser ? "Bedrock Edition" : "Java Edition";

  return (
    <header className={styles.navbar}>
      <div className={styles.welcome}>
        <p>Hallo, <strong>{name}</strong></p>
        <span className={styles.accountType}>{alt}-Account</span>
      </div>
      <Image
        className={styles.editionLogo}
        src={src}
        alt={alt}
        width={323}
        height={100}
        priority
      />
      <form action={LogoutAction}>
        <button className={styles.logoutButton} type="submit">Logout</button>
      </form>
    </header>
  );
}