import { useAuth } from "../hooks/useAuth";

const Profile = () => {
    const { auth, setAuth } = useAuth();

    const handleLogout = () => {
        setAuth({ user: null, token: null });
        localStorage.removeItem('auth');
    };

    if (!auth.user) {
        return <p>You are not logged in.</p>;
    }

    return (
        <div>
            <h1>Welcome, {auth.user.username}</h1>
            <button onClick={handleLogout}>Log Out</button>
        </div>
    );
};

export default Profile;