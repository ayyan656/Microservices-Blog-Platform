import { useAuth } from '../hooks/useAuth';

export default function ProfilePage() {
    const { user } = useAuth();

    return (
        <div className="container-main py-12">
            <div className="max-w-2xl mx-auto">
                <h1 className="text-4xl font-bold mb-8">Profile</h1>

                <div className="card">
                    <div className="space-y-4">
                        <div>
                            <label className="text-sm font-medium text-gray-600">Name</label>
                            <p className="text-lg">{user?.name}</p>
                        </div>

                        <div>
                            <label className="text-sm font-medium text-gray-600">Email</label>
                            <p className="text-lg">{user?.email}</p>
                        </div>

                        <div>
                            <label className="text-sm font-medium text-gray-600">Role</label>
                            <p className="text-lg capitalize">{user?.role}</p>
                        </div>

                        {user?.created_at && (
                            <div>
                                <label className="text-sm font-medium text-gray-600">Member Since</label>
                                <p className="text-lg">{new Date(user.created_at).toLocaleDateString()}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
