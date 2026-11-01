"use client";

import { useState, useActionState } from "react";
import { Bedrock, Java } from "./action";
import { redirect } from "next/navigation";
import Image from "next/image";
import styles from "./page.module.css";

export default function CreateAccount() {
  const [IsChecked, SetIsChecked] = useState(false);

  const [BedrockState, BedrockAction, BedrockIsPending] = useActionState(
    Bedrock,
    { message: "" }
  );

  const [JavaState, JavaAction, JavaIsPending] = useActionState(
    Java,
    { message: "" }
  );

  async function Login() {
    return redirect("/login");
  }

  return (
    <main className={`${styles.page} ${IsChecked ? styles.bedrock : ""}`}>
      <section className={styles.panel}>
        <div className={styles.content}>
          <div className={styles.accountType}>
            <div className={`${styles.logo} ${!IsChecked ? styles.activeLogo : ""}`}>
              <Image src="/Java.png" alt="Java Edition" width={323} height={93} priority />
            </div>
            <label className={styles.switch}>
              <input
                type="checkbox"
                role="switch"
                aria-label="Zwischen Java- und Bedrock-Account wechseln"
                checked={IsChecked}
                onChange={(e) => SetIsChecked(e.target.checked)}
              />
              <span className={styles.track}>
                <span className={styles.thumb} />
              </span>
            </label>
            <div className={`${styles.logo} ${IsChecked ? styles.activeLogo : ""}`}>
              <Image src="/Bedrock.png" alt="Bedrock Edition" width={300} height={100} priority />
            </div>
          </div>

          {IsChecked ? (
            <section className={styles.formSection} aria-labelledby="bedrock-heading">
              <h1 id="bedrock-heading">Bedrock-Account erstellen</h1>
              <form className={styles.form} key="Bedrock" action={BedrockAction}>
                <div className={styles.field}>
                  <label htmlFor="BUsername">Ingame-Benutzername</label>
                  <div className={styles.bedrockUsername}>
                    <input
                      className={styles.usernamePrefix}
                      type="text"
                      id=".BUsername"
                      name=".BUsername"
                      aria-label="Bedrock-Benutzernamenpräfix"
                      readOnly={true}
                      value="."
                    />
                    <input
                      className={styles.textInput}
                      type="text"
                      id="BUsername"
                      name="BUsername"
                      autoComplete="username"
                      required
                      pattern="\S*"
                      title="Leerzeichen sind nicht erlaubt"
                    />
                  </div>
                </div>

                <div className={styles.field}>
                  <label htmlFor="BPassword">Passwort</label>
                  <input
                    className={styles.textInput}
                    type="password"
                    id="BPassword"
                    name="BPassword"
                    autoComplete="new-password"
                    required
                    pattern="\S*"
                    title="Leerzeichen sind nicht erlaubt"
                  />
                </div>

                <div className={styles.field}>
                  <label htmlFor="BPasswordCompare">Passwort wiederholen</label>
                  <input
                    className={styles.textInput}
                    type="password"
                    id="BPasswordCompare"
                    name="BPasswordCompare"
                    autoComplete="new-password"
                    required
                    pattern="\S*"
                    title="Leerzeichen sind nicht erlaubt"
                  />
                </div>

                {BedrockState.message && (
                  <p className={styles.message} role="status">
                    {BedrockState.message}
                  </p>
                )}
                <button className={styles.createButton} type="submit" disabled={BedrockIsPending}>
                  {BedrockIsPending ? "Wird erstellt..." : "Account erstellen"}
                </button>
              </form>
            </section>
          ) : (
            <section className={styles.formSection} aria-labelledby="java-heading">
              <h1 id="java-heading">Java-Account erstellen</h1>
              <form className={styles.form} key="Java" action={JavaAction}>
                <div className={styles.field}>
                  <label htmlFor="JUsername">Ingame-Benutzername</label>
                  <input
                    className={styles.textInput}
                    type="text"
                    id="JUsername"
                    name="JUsername"
                    autoComplete="username"
                    required
                    pattern="\S*"
                    title="Leerzeichen sind nicht erlaubt"
                  />
                </div>

                <div className={styles.field}>
                  <label htmlFor="JPassword">Passwort</label>
                  <input
                    className={styles.textInput}
                    type="password"
                    id="JPassword"
                    name="JPassword"
                    autoComplete="new-password"
                    required
                    pattern="\S*"
                    title="Leerzeichen sind nicht erlaubt"
                  />
                </div>

                <div className={styles.field}>
                  <label htmlFor="JPasswordCompare">Passwort wiederholen</label>
                  <input
                    className={styles.textInput}
                    type="password"
                    id="JPasswordCompare"
                    name="JPasswordCompare"
                    autoComplete="new-password"
                    required
                    pattern="\S*"
                    title="Leerzeichen sind nicht erlaubt"
                  />
                </div>

                {JavaState.message && (
                  <p className={styles.message} role="status">
                    {JavaState.message}
                  </p>
                )}
                <button className={styles.createButton} type="submit" disabled={JavaIsPending}>
                  {JavaIsPending ? "Wird erstellt..." : "Account erstellen"}
                </button>
              </form>
            </section>
          )}
        </div>

        <form className={styles.loginForm} action={Login}>
          <button className={styles.loginButton} type="submit">
            Zurück zum Login
          </button>
        </form>
      </section>
    </main>
  );
}