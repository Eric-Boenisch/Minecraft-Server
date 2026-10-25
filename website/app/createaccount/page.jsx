"use client"

import { useState, useActionState } from "react";
import { Bedrock } from "./action";
 

export default function CreateAccount() {
    
    const [IsChecked, SetIsChecked] = useState(false);

    const [BedrockState, BedrockAction, IsPending] = useActionState(
        Bedrock,
        { message: "" }
    );

    async function Java(FormData) {
        return(console.log("Java Account creation"));
    }
    return(
        <main>
            <label className= "switch">
                <input 
                type="checkbox"
                checked= {IsChecked}
                onChange={(e) => SetIsChecked(e.target.checked)}/>
                <span className= "slider round"/>
            </label>

            <div>
                {IsChecked ? (
                    <div>
                        <h1>Bedrock Account Registration</h1>
                        <form key="Bedrock" action={BedrockAction}>
                            <label htmlFor="BUsername">Ingame Username</label>
                            <input type="text" id=".BUsername" name=".BUsername" readOnly={true} value={"."}/>
                            <input type="text" id="BUsername" name="BUsername" required pattern="\S*" title="Leerzeichen sind nicht erlaubt"/>

                            <label htmlFor="BPassword">Passwort</label>
                            <input type="text" id="BPassword" name="BPassword" required pattern="\S*" title="Leerzeichen sind nicht erlaubt"/>
                            <label htmlFor="BPasswordCompare">Passwort wiederholen</label>
                            <input type="text" id="BPasswordCompare" name="BPasswordCompare" required pattern="\S*" title="Leerzeichen sind nicht erlaubt"/>

                            {BedrockState.message && <p>{BedrockState.message}</p>}
                            <button type="submit" disabled={IsPending}>Create Account</button>
                        </form>
                    </div>
                ) : (
                    <div>
                        <h1>Java Account Registration</h1>
                        <form key="Java" action={Java}>
                            <label htmlFor="JUsername">Ingame Username</label>
                            <input type="text" id="JUsername" name="JUsername" required pattern="\S*" title="Leerzeichen sind nicht erlaubt"/>

                            <label htmlFor="JPassword">Passwort</label>
                            <input type="text" id="JPassword" name="JPassword" required pattern="\S*" title="Leerzeichen sind nicht erlaubt"/>
                            <label htmlFor="JPasswordCompare">Passwort wiederholen</label>
                            <input type="text" id="JPasswordCompare" name="JPasswordCompare" required pattern="\S*" title="Leerzeichen sind nicht erlaubt"/>

                            <button type="submit">Create Account</button>
                        </form>
                    </div>
                ) }
            </div>
        </main>
    )
}