import { useDispatch } from 'react-redux';
import { useHistory, Link } from 'react-router-dom';
import { setUser } from '../reducers/authSlice';
import { useState } from 'react';
import { Container, Form, FormGroup, Label, Input, Button } from 'reactstrap';
import { getAuth, setPersistence, signInWithEmailAndPassword, browserLocalPersistence } from "firebase/auth";

const Login = () => {
  const auth = getAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };
  const dispatch = useDispatch();

  const history = useHistory();

  const handleLogin = (e) => {
    e.preventDefault();
    setPersistence(auth, browserLocalPersistence).then(() => {
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Login successful
          const user = userCredential.user;
          dispatch(setUser(user));
          console.log('Logged in:', user);
        })
        .catch((error) => {
          // Login failed
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log('Login error:', errorCode, errorMessage);
        });
    })
  };

  return (
    <Container>
      <h2>Login</h2>
      <Form onSubmit={handleLogin}>
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
        <Button color="primary" type="submit">Login</Button>
        <p className="mt-3">
          Don't have an account?{' '}
          <Link to="/register">Register</Link>
        </p>
      </Form>
    </Container>
  );
};

export default Login;