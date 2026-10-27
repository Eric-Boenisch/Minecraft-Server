"use server"

import { getCellValue, updateCellValue, readRows } from "../dashboard/components/excelService";
import bcrypt from "bcryptjs";

export async function Bedrock(_previousState, FormData) {
        const rows = await readRows();
        const Username = FormData.get('.BUsername') + FormData.get('BUsername');
        console.log("Username:" + Username);
        const Password = FormData.get('BPassword');
        const PasswordCompare = FormData.get('BPasswordCompare');

        if (Password !== PasswordCompare) {
            return( {message: 'Passwort stimmt nicht überein.'} );
        }

        const salt = await bcrypt.genSalt(10);
        const PasswordHash = await bcrypt.hash(Password, salt);

        let i = 0;
        do {
            i++
            if (getCellValue(rows, 0, i) === Username) {
                return( {message: "User exitiert bereits."} );
            };
        } while (getCellValue(rows, 0, i) !== null);

        await updateCellValue(0, i, Username);
        await updateCellValue(1, i, PasswordHash);

        return( {message: "Bedrock Account wurde erfolgreich hinzugefügt"} );
    }

    export async function Java(_previousState, FormData) {
        const rows = await readRows();
        const Username = FormData.get('JUsername');
        console.log("Username:" + Username);
        const Password = FormData.get('JPassword');
        const PasswordCompare = FormData.get('JPasswordCompare');

        if (Password !== PasswordCompare) {
            return( {message: 'Passwort stimmt nicht überein.'} );
        }

        const salt = await bcrypt.genSalt(10);
        const PasswordHash = await bcrypt.hash(Password, salt);

        let i = 0;
        do {
            i++
            if (getCellValue(rows, 0, i) === Username) {
                return( {message: "User exitiert bereits."} );
            };
        } while (getCellValue(rows, 0, i) !== null);

        await updateCellValue(0, i, Username);
        await updateCellValue(1, i, PasswordHash);

        return( {message: "Java Account wurde erfolgreich hinzugefügt"} );
    }