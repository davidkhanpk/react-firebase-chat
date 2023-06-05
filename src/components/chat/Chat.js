import { useSelector } from "react-redux"
import ChatForm from "./ChatForm"
import ChatList from "./ChatList"

const Chat = () => {
    const activeUser = useSelector((state) => state.user.activeUser)
    return (
        <div style={{ width: "70%"}}>
            <h2 style={{margin: "10px 7px"}}>{activeUser?.username}</h2>
            <ChatList />
            <ChatForm />
        </div>
    )
}

export default Chat;