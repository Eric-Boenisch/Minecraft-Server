import { getColumnIndex , getCellValue, readRows } from "../dashboard/components/excelService";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { getJwtSecret } from "../auth";
import Link from "next/link";
import styles from "./page.module.css";

export default function LoginPage() {
    async function Login(FormData) {
    'use server';
    const rows = await readRows();
    const name = FormData.get('Username');
    const password = FormData.get('Password');
    const passwordhash = getCellValue(rows, 1, getColumnIndex (rows, name));
    const isPasswordValid = await bcrypt.compare(password, passwordhash);

    if (isPasswordValid) {
        const token = jwt.sign(
            { Username: name },
            getJwtSecret(),
            { expiresIn: '1h' } // Token expires in 1 hour
        );

        const cookieStore = await cookies();
            cookieStore.set({
            name: 'auth_token',
            value: token,
            httpOnly: true, // Prevents JavaScript (XSS attacks) from reading the token
            secure: process.env.NODE_ENV === 'production', // Requires HTTPS in production
            sameSite: 'strict',
            path: '/',
            maxAge: 60 * 60, // 1 hour in seconds
        });

        redirect("/dashboard");
    }
    else {
        console.log("password is incorrect");
        return { error: 'Invalid email or password' };
    }
    }

    return(
        <main className={styles.page}>
            <section className={styles.panel}>
                <div className={styles.content}>
                    <section className={styles.formSection} aria-labelledby="login-heading">
                        <h1 id="login-heading">Login</h1>
                        <form className={styles.form} action={Login}>
                            <div className={styles.field}>
                                <label htmlFor="Username">Ingame-Benutzername</label>
                                <input
                                    className={styles.textInput}
                                    type="text"
                                    id="Username"
                                    name="Username"
                                    autoComplete="username"
                                    required
                                />
                            </div>
                            <div className={styles.field}>
                                <label htmlFor="Password">Passwort</label>
                                <input
                                    className={styles.textInput}
                                    type="password"
                                    id="Password"
                                    name="Password"
                                    autoComplete="current-password"
                                    required
                                />
                            </div>
                            <button className={styles.submitButton} type="submit">Login</button>
                        </form>
                    </section>
                </div>
                <p className={styles.registerPrompt}>
                    Bitte beachte, dass Bedrock-User vor ihren Username einen Punkt (".") setzen müssen...
                    <br></br>
                    z.B. Edgar_ &rarr; .Edgar_
                </p>
                <p className={styles.registerPrompt}>
                    Noch kein Account? <Link href="/createaccount">Dann geht&apos;s hier zur Registrierung.</Link>
                </p>
            </section>
        </main>
    )
}

