import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import {
    pageBackground,
    pageWrapper,
    pageTitleClass,
    cardClass,
    subHeadingClass,
    bodyText,
    mutedText,
    primaryBtn,
    secondaryBtn,
    successClass,
    errorClass,
    loadingClass,
    emptyStateClass,
    tagClass
} from "../styles/common";

function AdminProfile() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const res = await axios.get("http://localhost:4000/admin-api/users", { withCredentials: true });
            setUsers(res.data.payload);
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to fetch users");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleToggleBlock = async (userId, currentlyBlocked) => {
        const action = currentlyBlocked ? "unblock" : "block";
        try {
            const res = await axios.put(
                `http://localhost:4000/admin-api/users/${userId}/${action}`,
                {},
                { withCredentials: true }
            );
            toast.success(res.data.message);
            // Update local state
            setUsers(users.map(u => u._id === userId ? { ...u, isBlocked: !currentlyBlocked } : u));
        } catch (err) {
            toast.error(err.response?.data?.message || `Failed to ${action} user`);
        }
    };

    const filteredUsers = users.filter(user => 
        user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.role.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) return <div className={loadingClass}>Loading users...</div>;

    return (
        <div className={pageBackground}>
            <div className={pageWrapper}>
                <header className="mb-10">
                    <h1 className={pageTitleClass}>Admin Dashboard</h1>
                    <p className={bodyText}>Manage authors and users of the platform.</p>
                </header>

                <div className="mb-8 max-w-md">
                    <input
                        type="text"
                        placeholder="Search by name, email or role..."
                        className="w-full bg-[#f5f5f7] border border-[#d2d2d7] rounded-full px-6 py-3 text-sm focus:outline-none focus:border-[#0066cc] transition"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                {filteredUsers.length === 0 ? (
                    <div className={emptyStateClass}>No users found.</div>
                ) : (
                    <div className="grid gap-4">
                        {filteredUsers.map((user) => (
                            <div key={user._id} className={`${cardClass} flex items-center justify-between`}>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-[#0066cc]/10 flex items-center justify-center text-[#0066cc] font-bold text-lg">
                                        {user.firstName[0].toUpperCase()}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h3 className={subHeadingClass}>{user.firstName} {user.lastName}</h3>
                                            <span className={tagClass}>{user.role}</span>
                                        </div>
                                        <p className={mutedText}>{user.email}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="text-right mr-4">
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${user.isBlocked ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                                            {user.isBlocked ? 'Blocked' : 'Active'}
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => handleToggleBlock(user._id, user.isBlocked)}
                                        className={user.isBlocked ? successClass : errorClass}
                                        style={{ padding: '8px 16px', borderRadius: '9999px', cursor: 'pointer', border: 'none' }}
                                    >
                                        {user.isBlocked ? "Unblock" : "Block"}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default AdminProfile;
