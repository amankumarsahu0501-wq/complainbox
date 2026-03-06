import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useComplaints } from '../../context/ComplaintContext';
import { Button } from '../../components/ui/Button/Button';
import { Input, Select } from '../../components/ui/Input/Input';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card/Card';
import { mockCategories, mockLocations } from '../../data/mockData';
import { Plus, List, MapPin, Tag, Clock, CheckCircle } from 'lucide-react';
import './CitizenDashboard.css';

const CitizenDashboard = () => {
    const { currentUser } = useAuth();
    const { getCitizenComplaints, submitComplaint } = useComplaints();

    const [activeTab, setActiveTab] = useState('list'); // 'list' or 'new'
    const complaints = getCitizenComplaints(currentUser.id);

    const [formData, setFormData] = useState({
        category: '',
        location: '',
        description: ''
    });

    const handleNewSubmit = (e) => {
        e.preventDefault();
        submitComplaint(formData, currentUser);
        setFormData({ category: '', location: '', description: '' });
        setActiveTab('list');
    };

    const getStatusBadge = (status) => {
        const statusMap = {
            'Submitted': 'status-submitted',
            'Assigned': 'status-assigned',
            'In Progress': 'status-inprogress',
            'Resolved': 'status-resolved',
            'Closed': 'status-closed'
        };
        return <span className={`badge ${statusMap[status] || 'status-closed'}`}>{status}</span>;
    };

    return (
        <div className="container dashboard-container">
            <div className="dashboard-header">
                <div>
                    <h2>Welcome, {currentUser.name}</h2>
                    <p className="text-muted">Manage your reported issues here.</p>
                </div>
                <div className="dashboard-actions">
                    <Button
                        variant={activeTab === 'list' ? 'primary' : 'secondary'}
                        onClick={() => setActiveTab('list')}
                    >
                        <List size={18} /> My Complaints
                    </Button>
                    <Button
                        variant={activeTab === 'new' ? 'primary' : 'secondary'}
                        onClick={() => setActiveTab('new')}
                    >
                        <Plus size={18} /> New Complaint
                    </Button>
                </div>
            </div>

            <div className="dashboard-content mt-8">
                {activeTab === 'list' ? (
                    <div className="complaint-list">
                        {complaints.length === 0 ? (
                            <div className="empty-state">
                                <CheckCircle size={48} className="text-muted mb-4" />
                                <h3>No complaints found</h3>
                                <p className="text-muted mb-4">You haven't submitted any complaints yet.</p>
                                <Button onClick={() => setActiveTab('new')}><Plus size={18} /> File a Complaint</Button>
                            </div>
                        ) : (
                            <div className="complaints-grid">
                                {complaints.map(c => (
                                    <Card key={c.id}>
                                        <CardContent className="complaint-card-content">
                                            <div className="complaint-header mb-4">
                                                <span className="complaint-id text-sm font-bold text-muted">{c.id}</span>
                                                {getStatusBadge(c.status)}
                                            </div>
                                            <h4 className="mb-2">{c.description}</h4>
                                            <div className="complaint-meta text-sm text-muted mb-4 flex-col gap-2">
                                                <div className="flex items-center gap-2"><Tag size={14} /> {c.category}</div>
                                                <div className="flex items-center gap-2"><MapPin size={14} /> {c.location}</div>
                                                <div className="flex items-center gap-2"><Clock size={14} /> {new Date(c.updatedAt).toLocaleDateString()}</div>
                                            </div>
                                            {c.remarks && c.remarks.length > 0 && (
                                                <div className="latest-remark p-4 bg-slate-50 rounded-md text-sm mt-4">
                                                    <strong>Latest Update:</strong> {c.remarks[c.remarks.length - 1].text}
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </div>
                ) : (
                    <Card className="new-complaint-card mx-auto">
                        <CardHeader>
                            <CardTitle>File a New Complaint</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleNewSubmit}>
                                <Select
                                    label="Category"
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    options={mockCategories}
                                    required
                                />

                                <Select
                                    label="Location Zone"
                                    value={formData.location}
                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                    options={mockLocations}
                                    required
                                />

                                <div className="input-wrapper w-full mt-4">
                                    <label className="input-label">Description</label>
                                    <textarea
                                        className="input-field"
                                        rows={4}
                                        placeholder="Describe the issue in detail..."
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="input-wrapper w-full mt-4 mb-8">
                                    <label className="input-label">Photo Evidence (Optional Mock)</label>
                                    <input type="file" className="input-field" accept="image/*" />
                                    <span className="text-xs text-muted mt-1">This is a mock upload for demonstration purposes.</span>
                                </div>

                                <Button type="submit" fullWidth size="lg">Submit Complaint</Button>
                            </form>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
};

export default CitizenDashboard;
