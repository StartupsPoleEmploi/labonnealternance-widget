export default function ErrorMessage(props) {
    const text = props.text || "Erreur lors de l'appel au serveur.'";
    return (
        <div className="alert">{ props.text }</div>
    )
}