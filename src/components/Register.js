import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory, Link } from 'react-router-dom';
import { setUser } from '../reducers/authSlice';
import { Container, Form, FormGroup, Label, Input, Button } from 'reactstrap';
import { createUserWithEmailAndPassword, setPersistence, browserLocalPersistence, updateProfile } from "firebase/auth";
import { collection, addDoc } from "firebase/firestore";
import { auth, db } from '../firebase';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const dispatch = useDispatch();
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };


  const handleRegister = (e) => {
    e.preventDefault();
    setPersistence(auth, browserLocalPersistence).then(() => {
      createUserWithEmailAndPassword(auth, email, password)
        .then(async (userCredential) => {
          // Registration successful
          const user = userCredential.user;
          const doc = await addDoc(collection(db, "users"), {
            email,
            username,
            userId: user.uid
          });
          await updateProfile(auth.currentUser, {
            displayName: username
          }).then(() => {
            user.displayName = username
            dispatch(setUser(user));
            console.log('Registered and logged in:', user);
          })
        })
        .catch((error) => {
          // Registration failed
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log('Registration error:', errorCode, errorMessage);
        });
    })
  };

  return (
    <Container>
      <h2>Register</h2>
      <Form onSubmit={handleRegister}>
      <FormGroup>
          <Label for="username">Username</Label>
          <Input
            type="text"
            id="username"
            placeholder="Username"
            value={username}
            onChange={handleUsernameChange}
          />
        </FormGroup>
        <FormGroup>
          <Label for="email">Email</Label>
          <Input
            type="email"
            id="email"
            placeholder="Email"
            value={email}
            onChange={handleEmailChange}
          />
        </FormGroup>
        <FormGroup>
          <Label for="password">Password</Label>
          <Input
            type="password"
            id="password"
            placeholder="Password"
            value={password}
            onChange={handlePasswordChange}
          />
        </FormGroup>
        <Button color="primary" type="submit">
          Register
        </Button>
        <p className="mt-3">
          Already have an account?{' '}
          <Link to="/login">Login</Link>
        </p>
      </Form>
    </Container>
  );
};

export default Register;