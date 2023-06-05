import React, { useEffect, useState } from 'react';
import { Container, ListGroup, ListGroupItem } from 'reactstrap';
import { collection, getDocs } from "firebase/firestore";
import { db } from '../firebase';
import { useDispatch, useSelector } from 'react-redux';
import { setActiveUser, setUsers } from '../reducers/userSlice';
import Avatar from '../assets/images/avatar.png';

const UserList = () => {
  const currentUser = useSelector((state) => state.auth.user)
  const activeUser = useSelector((state) => state.user.activeUser)
  const dispatch = useDispatch();
const users = useSelector((state) => state.user.users);
  useEffect(() => {
    // Fetch the users from the Firestore collection
    const fetchUsers = async () => {
      try {
        await getDocs(collection(db, "users"))
            .then((querySnapshot)=>{               
                const newData = querySnapshot.docs
                    .map((doc) => ({...doc.data(), id:doc.id }));
                    dispatch(setUsers(newData));
        })
      } catch (error) {
        console.log('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div style={{ width: "30%", borderRight: "1px solid #dee2e6"}} className='user-list'>
      {users.length < 2 ? <h3 style={{textAlign: 'center', marginTop: "20px"}}>No User Found</h3> : <></>}
      <ListGroup>
        {users.map((user, index) => 
          { 
            if(currentUser.uid != user.userId) {
              return (
                <ListGroupItem className={ activeUser && activeUser.userId == user.userId ? 'selected-user': ''} key={index} onClick={() => dispatch(setActiveUser(user))}>
                  <div style={{display: 'flex'}}>
                    <div>
                      <img height={64} width={64} src={Avatar} />
                    </div>
                    <div style={{ marginLeft: "10px" , marginTop: "7px"}}>
                      <p style={{margin: "0"}} >{user.username}</p>
                      <p style={{margin: "0"}} >{user.email}</p>
                    </div>
                  </div>
                </ListGroupItem>
  
              )
            } else {
              return <></>
            }
          }
        )}
      </ListGroup>
    </div>
  );
};

export default UserList;