import React from 'react';
import { Link } from 'react-router-dom';
import LoginForm from '../components/LoginForm';

function LoginPage() {
    return (
        <div className="loginPage">
            <LoginForm />
        </div>
    );
}

export default LoginPage;