import { getColumnIndex , getCellValue, readRows } from "../dashboard/components/excelService";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";


export default function LoginPage() {
    async function Login(FormData) {
    'use server';
    const rows = await readRows();
    const name = FormData.get('Username');
    const password = FormData.get('Password');
    const passwordhash = getCellValue(rows, 1, getColumnIndex (rows, name));
    console.log("passwordhash: " + passwordhash);
    console.log(await bcrypt.compare(password, passwordhash));

    if (await bcrypt.compare(password, passwordhash) === true) {
        redirect("/dashboard");
    }
    else {
        console.log("password is incorrect");
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

