import React from 'react';
import LoginForm from '../components/LoginForm';

function LoginPage() {
    return (
        <div className="min-h-[calc(100vh-140px)] w-full bg-bg flex items-center justify-center py-12 md:py-16 px-4">
            <div className="w-full max-w-[440px]">
                <LoginForm />
            </div>
        </div>
    );
}

export default LoginPage;