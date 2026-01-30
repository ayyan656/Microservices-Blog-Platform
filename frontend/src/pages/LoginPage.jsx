import LoginForm from '../components/auth/LoginForm';

export default function LoginPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-6xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-8 items-center">
                    {/* Left Side - Illustration (40%) */}
                    <div className="hidden md:flex md:col-span-2 items-center justify-center">
                        <div className="w-full max-w-md">
                            <img
                                src="/images/auth-illustration.png"
                                alt="Workspace Illustration"
                                className="w-full h-auto drop-shadow-2xl"
                            />
                        </div>
                    </div>

                    {/* Right Side - Login Card (60%) */}
                    <div className="md:col-span-3 flex items-center justify-center">
                        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 sm:p-10">
                            <LoginForm />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
