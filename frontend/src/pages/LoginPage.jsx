import LoginForm from '../components/auth/LoginForm';

export default function LoginPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-editorial-bg py-12 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-2xl shadow-editorial p-8 sm:p-10">
                    <LoginForm />
                </div>
            </div>
        </div>
    );
}
