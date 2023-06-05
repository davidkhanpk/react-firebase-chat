import React from 'react';
import { useSelector } from 'react-redux';
import UserList from './UserList';
import Chat from './chat/Chat';

const Dashboard = () => {
  const user = useSelector((state) => state.auth.user);

  return (
    <div>
      <div style={{width: "100%", display: "flex"}}>
        <UserList />
        <Chat />
      </div>

    </div>
  );
};

export default Dashboard;