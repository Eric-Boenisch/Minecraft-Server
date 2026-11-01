export default function Navbar({BedrockUser, name}) {
    if (BedrockUser === true) {
        var src = "/Bedrock.png";
        var alt = "Bedrock Edition";
    } else {
        var src = "/Java.png";
        var alt = "Java Edition";
    }
    return(
        <div>
            <p>Hallo {name}</p>
            <image src={src} alt={alt} priority />
        </div>
    )
}