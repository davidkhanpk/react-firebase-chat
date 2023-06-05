import { useSelector } from "react-redux";
import { Button } from "reactstrap";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";

const Navbar = () => {
    const currentUser = useSelector((state) => state.auth.user)
    return (
        <div style={{ padding: "20px", backgroundColor: "black", color: "white", height: "80px", width: "100%", display: "flex", justifyContent: "space-between"}}>
            <h2>Firebase Chat</h2>
            <h2>Welcome {currentUser?.displayName}</h2>
            { currentUser ? <Button onClick={() => signOut(auth)} style={{ cursor: 'pointer'}}>Signout</Button> : <div></div>}
        </div>
    )
}

export default Navbar;