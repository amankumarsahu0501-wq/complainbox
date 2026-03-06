import React, { useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useComplaints } from '../../context/ComplaintContext';
import { mockUsers } from '../../data/mockData';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card/Card';
import { BarChart3, AlertCircle, CheckCircle2, TrendingUp, Users } from 'lucide-react';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const { currentUser } = useAuth();
    const { getAdminStats, complaints } = useComplaints();

    const stats = getAdminStats();

    // Calculate officer performance
    const officerPerformance = useMemo(() => {
        const officers = mockUsers.filter(u => u.role === 'officer');

        return officers.map(officer => {
            const officerComplaints = complaints.filter(c => c.assignedTo === officer.email);
            const total = officerComplaints.length;
            const resolved = officerComplaints.filter(c => c.status === 'Resolved' || c.status === 'Closed').length;
            const pending = total - resolved;
            const resolutionRate = total > 0 ? Math.round((resolved / total) * 100) : 0;

            return {
                ...officer,
                metrics: { total, resolved, pending, resolutionRate }
            };
        }).sort((a, b) => b.metrics.resolutionRate - a.metrics.resolutionRate);
    }, [complaints]);

    return (
        <div className="container dashboard-container">
            <div className="dashboard-header mb-8">
                <div>
                    <h2>Command Center</h2>
                    <p className="text-muted">Welcome, {currentUser.name} (Global Admin)</p>
                </div>
            </div>

            {/* Top Metrics Row */}
            <div className="metrics-grid mb-8">
                <Card className="metric-card">
                    <CardContent className="flex items-center gap-4 p-6">
                        <div className="metric-icon bg-indigo-100 text-indigo-600"><AlertCircle size={24} /></div>
                        <div>
                            <p className="text-sm text-muted font-semibold uppercase tracking-wider">Total Complaints</p>
                            <h3 className="text-3xl font-bold mt-1">{stats.total}</h3>
                        </div>
                    </CardContent>
                </Card>

                <Card className="metric-card">
                    <CardContent className="flex items-center gap-4 p-6">
                        <div className="metric-icon bg-emerald-100 text-emerald-600"><CheckCircle2 size={24} /></div>
                        <div>
                            <p className="text-sm text-muted font-semibold uppercase tracking-wider">Resolved Cases</p>
                            <h3 className="text-3xl font-bold mt-1">{stats.resolved}</h3>
                        </div>
                    </CardContent>
                </Card>

                <Card className="metric-card">
                    <CardContent className="flex items-center gap-4 p-6">
                        <div className="metric-icon bg-amber-100 text-amber-600"><TrendingUp size={24} /></div>
                        <div>
                            <p className="text-sm text-muted font-semibold uppercase tracking-wider">Resolution Rate</p>
                            <h3 className="text-3xl font-bold mt-1">
                                {stats.total > 0 ? Math.round((stats.resolved / stats.total) * 100) : 0}%
                            </h3>
                        </div>
                    </CardContent>
                </Card>

                <Card className="metric-card">
                    <CardContent className="flex items-center gap-4 p-6">
                        <div className="metric-icon bg-slate-100 text-slate-600"><BarChart3 size={24} /></div>
                        <div>
                            <p className="text-sm text-muted font-semibold uppercase tracking-wider">Pending Tasks</p>
                            <h3 className="text-3xl font-bold mt-1">{stats.pending}</h3>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="dashboard-grid-admin">
                {/* Left Column: Officer Performance */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Users size={20} /> Officer Performance Tracking</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="performance-list">
                            {officerPerformance.map(officer => (
                                <div key={officer.id} className="performance-item border-b py-4 last:border-0 border-slate-100">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <h4 className="font-semibold text-secondary">{officer.name}</h4>
                                            <p className="text-xs text-muted">Department: {officer.department}</p>
                                        </div>
                                        <span className={`badge ${officer.metrics.resolutionRate > 75 ? 'status-resolved' : officer.metrics.resolutionRate < 50 ? 'status-inprogress' : 'status-submitted'}`}>
                                            {officer.metrics.resolutionRate}% Rate
                                        </span>
                                    </div>

                                    <div className="progress-bar-container mt-2 mb-1">
                                        <div
                                            className="progress-fill"
                                            style={{ width: `${officer.metrics.resolutionRate}%`, backgroundColor: officer.metrics.resolutionRate > 75 ? 'var(--color-success)' : officer.metrics.resolutionRate < 50 ? 'var(--color-warning)' : 'var(--color-primary)' }}
                                        ></div>
                                    </div>
                                    <div className="flex justify-between text-xs text-muted">
                                        <span>{officer.metrics.resolved} Resolved</span>
                                        <span>{officer.metrics.pending} Pending</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Right Column: Category Distribution */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><BarChart3 size={20} /> Complaints by Category</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="category-stats">
                            {Object.entries(stats.byCategory).sort((a, b) => b[1] - a[1]).map(([category, count]) => (
                                <div key={category} className="category-item flex items-center justify-between p-3 bg-slate-50 rounded-md mb-2">
                                    <span className="font-medium text-secondary">{category}</span>
                                    <span className="bg-white border px-3 py-1 rounded-full text-sm font-bold">{count}</span>
                                </div>
                            ))}
                            {Object.keys(stats.byCategory).length === 0 && (
                                <p className="text-muted text-center py-8">No data available.</p>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default AdminDashboard;
