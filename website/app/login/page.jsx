import { getColumnIndex , getCellValue, readRows } from "../dashboard/components/excelService";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { getJwtSecret } from "../auth";

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

    async function test(FormData) {
        "use server"
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(FormData.get('hash'), salt);
        return console.log(hash)
    }
    
    return(
        <main>
        <form action={Login}>    
            <input name="Username"></input>
            <input name="Password"></input>
            <button type="submit">login</button>
        </form>

        <p>absatz</p>
            
        <form action={test}>
            <input name="hash"></input>
            <button type="submit">hash generieren</button>
        </form>

        </main>
    )
}


