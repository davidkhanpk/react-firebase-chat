import { useEffect, useRef, useState } from 'react';
import { Form, Input, Button, Progress } from 'reactstrap';
import { addDoc, collection, serverTimestamp, setDoc, doc } from "firebase/firestore";
import { auth, db, storage } from '../../firebase';
import { useDispatch, useSelector } from 'react-redux';
import { setChatId } from '../../reducers/chatSlice';
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";

const ChatForm = () => {
    const fileRef = useRef();
    const [imgUrl, setImgUrl] = useState(null);
    const [progresspercent, setProgresspercent] = useState(0);
    const [file, setFile] = useState(null);
    const dispatch = useDispatch()
    const [message, setMessage] = useState('');
    const currentUser = useSelector((state) => state.auth.user)
    const activeUser = useSelector((state) => state.user.activeUser)
    const chatId = useSelector((state) => state.chat.chatId)
    const handleInputChange = (e) => {
        setMessage(e.target.value);
    };

    const getChatId = () => {
        if (chatId) {
            return chatId
        }
        return `${currentUser.uid}-${activeUser.userId}`
    }

    const uploadFile = () => {
        const storageRef = ref(storage, `files/${file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, file);
        uploadTask.on("state_changed",
            (snapshot) => {
                const progress =
                    Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                    setProgresspercent(progress);
            },
            (error) => {
                alert(error);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    setImgUrl(downloadURL)
                });
            }
        );
    }
    useEffect(() => {
        if(imgUrl) {
            sendMessage();
        }
    }, [imgUrl])
    const sendMessage = async () => {
        if(activeUser && currentUser) {
            if (!chatId) {
                await setDoc(doc(db, "chats", getChatId()), {});
            }
            await addDoc(collection(db, `chats/${getChatId()}/messages`), {
                text: message,
                createdAt: serverTimestamp(),
                userId: currentUser.uid,
                chatId: getChatId(),
                type: imgUrl ? 'file' : 'text',
                url: imgUrl ? imgUrl : '',
            });
            dispatch(setChatId(getChatId()))
            fileRef.current.value = ''
            setMessage("");
            setFile(null);
            setProgresspercent(0);
        }
    }
    const handleSendMessage = async (event) => {
        event.preventDefault();
        if (file) {
            uploadFile();
            return;
        }
        if (message.trim() === "") {
            alert("Enter valid message");
            return;
        }
        if (activeUser && currentUser) {
            sendMessage();
        }
    };

    const handleFileChange = (e) => {
        if (!e.target.files.length) {
            return;
        }
        if (!e.target.files[0].type.includes("image")) {
            return;
        }
        if (!e.target.files[0].type.includes("image")) {
            return;
        }
        if (!e.target.files[0].size > 2000000) {
            return;
        }
        setMessage(e.target.files[0].name)
        setFile(e.target.files[0]);
        console.log(e.target.files[0]);
    }

    const onFileButtonClick = (e) => {
        e.preventDefault();
        fileRef.current.click()
    }

    return (
        <Form onSubmit={handleSendMessage}>
            { progresspercent && file ? <Progress style={{ margin: "10px 5px"}} value={progresspercent} /> : <></>}
            <div style={{ display: 'flex' }}>
                <Button disabled={activeUser ? false : true} onClick={(e) => onFileButtonClick(e)} style={{ margin: "0 5px" }} color="primary" type="submit">
                    <div><i class="fas fa-file"></i></div>
                </Button>
                <Input
                    type="text"
                    placeholder="Type a message..."
                    value={message}
                    onChange={handleInputChange}
                />
                <input onChange={(e) => handleFileChange(e)} style={{ display: "none" }} type='file' ref={fileRef} />
                <Button disabled={activeUser ? false : true} style={{ margin: "0 5px" }} color="primary" type="submit">
                    Send
                </Button>

            </div>
        </Form>

    )
}

export default ChatForm;