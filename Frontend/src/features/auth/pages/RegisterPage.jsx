import React from 'react';
import RegisterForm from '../components/RegisterForm';

function RegisterPage() {
    return (
        <div className="min-h-[calc(100vh-140px)] w-full bg-bg flex items-center justify-center py-12 md:py-16 px-4">
            <div className="w-full max-w-[640px]">
                <RegisterForm />
            </div>
        </div>
    );
}

export default RegisterPage;