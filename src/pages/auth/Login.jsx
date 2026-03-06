import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button/Button';
import { Input } from '../../components/ui/Input/Input';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card/Card';
import { LogIn, UserPlus } from 'lucide-react';
import './Login.css';

const Login = () => {
    const { login, registerCitizen } = useAuth();
    const [isRegistering, setIsRegistering] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '', password: '', phone: '' });
    const [error, setError] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        setError(null);

        if (isRegistering) {
            if (!formData.name || !formData.email || !formData.password) {
                return setError("Please fill in all required fields.");
            }
            const res = registerCitizen(formData);
            if (!res.success) setError(res.error);
        } else {
            if (!formData.email || !formData.password) {
                return setError("Please enter email and password.");
            }
            const res = login(formData.email, formData.password);
            if (!res.success) setError(res.error);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="login-container">
            <Card className="login-card glass-panel">
                <CardHeader>
                    <CardTitle>{isRegistering ? 'Citizen Registration' : 'System Login'}</CardTitle>
                    <p className="text-muted text-sm">
                        {isRegistering
                            ? 'Create an account to submit complaints'
                            : 'Enter your credentials to access the command center'}
                    </p>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="login-form">
                        {error && <div className="error-alert">{error}</div>}

                        {isRegistering && (
                            <Input
                                name="name"
                                label="Full Name"
                                placeholder="John Doe"
                                value={formData.name}
                                onChange={handleChange}
                            />
                        )}

                        <Input
                            name="email"
                            type="email"
                            label="Email Address"
                            placeholder="user@example.com"
                            value={formData.email}
                            onChange={handleChange}
                        />

                        {isRegistering && (
                            <Input
                                name="phone"
                                label="Phone Number"
                                placeholder="9876543210"
                                value={formData.phone}
                                onChange={handleChange}
                            />
                        )}

                        <Input
                            name="password"
                            type="password"
                            label="Password"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={handleChange}
                        />

                        <Button
                            type="submit"
                            fullWidth
                            size="lg"
                            className="mt-4"
                            icon={isRegistering ? <UserPlus size={18} /> : <LogIn size={18} />}
                        >
                            {isRegistering ? 'Register' : 'Sign In'}
                        </Button>

                        <div className="toggle-mode mt-4 text-center">
                            <span className="text-sm text-muted">
                                {isRegistering ? "Already have an account? " : "Citizen and don't have an account? "}
                            </span>
                            <button
                                type="button"
                                className="btn-link text-sm"
                                onClick={() => { setIsRegistering(!isRegistering); setError(null); }}
                            >
                                {isRegistering ? 'Login here' : 'Register here'}
                            </button>
                        </div>

                        {!isRegistering && (
                            <div className="demo-accounts mt-8 p-4 bg-slate-50 rounded-md">
                                <p className="text-xs text-muted font-bold mb-2">Demo Accounts (Password: password123)</p>
                                <div className="text-xs text-muted flex-col gap-2">
                                    <div><strong>Citizen:</strong> citizen@example.com</div>
                                    <div><strong>Officer (Water):</strong> officer_water@pscrm.com</div>
                                    <div><strong>Admin:</strong> admin@pscrm.com (admin123)</div>
                                </div>
                            </div>
                        )}
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default Login;
