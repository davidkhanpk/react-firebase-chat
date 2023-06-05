import { useEffect, useRef, useState } from "react";
import {
  query,
  collection,
  orderBy,
  onSnapshot,
  limit,
  doc,
  getDoc
} from "firebase/firestore";
import { db } from "../../firebase";
import { useDispatch, useSelector } from "react-redux";
import { setChatId, setMessages } from "../../reducers/chatSlice";

const ChatList = () => {
  const activeUser = useSelector((state) => state.user.activeUser)
  const currentUser = useSelector((state) => state.auth.user)
  const chatId = useSelector((state) => state.chat.chatId)
  const messages = useSelector((state) => state.chat.messages)
  const subscribeRef = useRef();
  const dispatch = useDispatch();
  useEffect(() => {
    if(subscribeRef.current) {
      subscribeRef.current();
      subscribeRef.current = null;
    }
    (async () => {
      dispatch(setMessages({ messages: [], concat: false }))
      if (activeUser && currentUser) {
        console.log(`${currentUser.uid}-${activeUser.userId}`)
        const docRef = doc(db, "chats", `${currentUser.uid}-${activeUser.userId}`);
        let docSnap = null;
        docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          dispatch(setChatId(`${currentUser.uid}-${activeUser.userId}`))
        } else {
          const docRef = doc(db, "chats", `${activeUser.userId}-${currentUser.uid}`);
          docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            dispatch(setChatId(`${activeUser.userId}-${currentUser.uid}`))
          } else {
            dispatch(setChatId(null))
            console.log("------------ not")
          }
        }

      }
    })();
  }, [activeUser]);

  useEffect(() => {
    console.log(chatId)
    if (activeUser && chatId) {
      // const q = query(
      //   collection(db, `chats/${currentUser.uid}-${activeUser.userId}/messages`),
      //   orderBy("createdAt"),
      //   limit(50)
      // );

      // unsubscribe = onSnapshot(q, (QuerySnapshot) => {
      //   let messages = [];
      //   QuerySnapshot.forEach((doc) => {
      //     messages.push({ ...doc.data(), id: doc.id });
      //   });
      //   dispatch(setMessages(messages));
      // });
      const messagesRef = collection(db, `chats/${chatId}/messages`);
      subscribeRef.current = onSnapshot(messagesRef, (snapshot) => {
        let messagesAdd = []
        console.log(messages)
        snapshot.docChanges().forEach((change) => {
          if (change.type === 'added') {
            const messageData = change.doc.data();
            if (messageData.text && messageData.chatId && messageData.chatId == chatId) {
              messagesAdd.push({ ...messageData })
            }
          }
        });
        if (messagesAdd.length) {
          dispatch(setMessages({ messages: messagesAdd, concat: true }));
        }
      });
    }
    return () => {}
  }, [chatId])
  return (
    <div className="messages">
      {messages.map((message, index) => (
        <div key={index} style={{width: "100%", display: "flex", justifyContent: message.userId != currentUser.uid ? 'sent' : 'received' ? "flex-end" : "flex-start"}}>
          <div  className={`message ${message.userId == currentUser.uid ? 'sent' : 'received'}`}>
            {message.type && message.type == 'file' ? <img src={message.url} style={{ maxWidth: '200px', maxHeight: "200px"}}/> : <></>}
            {message.text}
          </div>
        </div>
      ))}
      {!activeUser ? <h5 style={{margin: "10px 7px"}}>Please select user to chat</h5> : <></>}
      {activeUser && !messages.length ?<h5 style={{margin: "10px 7px"}}>No Messages</h5> : <></>}
    </div>
  )
}

export default ChatList;