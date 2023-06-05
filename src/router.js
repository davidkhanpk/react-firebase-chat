import { Switch, Route, Redirect } from 'react-router-dom';

import Dashboard from './components/Dashboard';
import Register from './components/Register';
import Login from './components/Login';
import { useSelector } from 'react-redux';
import Navbar from './components/Navbar';

const Routes = () => {
    const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
    return (
        <>
        
            <Navbar />
            <Switch>
                <Route exact path="/login">
                    {isLoggedIn ? <Redirect to="/" /> : <Login />}
                </Route>
                <Route exact path="/register">
                    {isLoggedIn ? <Redirect to="/" /> : <Register />}
                </Route>
                <PrivateRoute path="/dashboard" component={Dashboard} />
                <PrivateRoute path="/" component={Dashboard} />
            </Switch>
        
        </>
    )
}

const PrivateRoute = ({ component: Component, ...rest }) => {
    const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

    return (
        <Route
            {...rest}
            render={(props) =>
                isLoggedIn ? (
                    <Component {...props} />
                ) : (
                    <Redirect to="/login" />
                )
            }
        />
    );
};

export default Routes;