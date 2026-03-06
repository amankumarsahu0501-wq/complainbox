import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useComplaints } from '../../context/ComplaintContext';
import { Button } from '../../components/ui/Button/Button';
import { Input, Select } from '../../components/ui/Input/Input';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card/Card';
import { MapPin, Tag, Clock, User, MessageCircle, FileUp } from 'lucide-react';
import './OfficerDashboard.css';

const OfficerDashboard = () => {
    const { currentUser } = useAuth();
    const { getOfficerComplaints, updateComplaintStatus } = useComplaints();

    const [activeComplaint, setActiveComplaint] = useState(null);
    const [remarkText, setRemarkText] = useState('');
    const [newStatus, setNewStatus] = useState('');
    const [isUpdating, setIsUpdating] = useState(false);

    // Fetch officer complaints
    const complaints = getOfficerComplaints(currentUser.email);

    const handleUpdateStatus = (e) => {
        e.preventDefault();
        if (!newStatus && !remarkText) return;

        setIsUpdating(true);
        // Simulate API delay
        setTimeout(() => {
            updateComplaintStatus(
                activeComplaint.id,
                newStatus || activeComplaint.status,
                remarkText,
                currentUser.email
            );
            setRemarkText('');
            setNewStatus('');
            setActiveComplaint(null);
            setIsUpdating(false);
        }, 600);
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
            <div className="dashboard-header mb-8">
                <div>
                    <h2>Officer Dashboard</h2>
                    <p className="text-muted">Department: <strong>{currentUser.department}</strong></p>
                </div>
            </div>

            <div className="dashboard-grid">
                {/* Left Column: Complaint List */}
                <div className="complaint-list-sidebar">
                    <h3 className="mb-4 text-lg">Assigned Tasks ({complaints.length})</h3>
                    {complaints.length === 0 ? (
                        <div className="empty-state p-8">
                            <p className="text-muted">No pending complaints assigned to you.</p>
                        </div>
                    ) : (
                        <div className="officer-complaint-list">
                            {complaints.map(c => (
                                <div
                                    key={c.id}
                                    className={`task-list-item ${activeComplaint?.id === c.id ? 'active' : ''}`}
                                    onClick={() => setActiveComplaint(c)}
                                >
                                    <div className="task-header">
                                        <span className="font-bold text-sm text-primary">{c.id}</span>
                                        {getStatusBadge(c.status)}
                                    </div>
                                    <p className="task-desc">{c.description.substring(0, 60)}...</p>
                                    <div className="task-meta mt-2 flex justify-between items-center text-xs text-muted">
                                        <span className="flex items-center gap-1"><MapPin size={12} /> {c.location.split('-')[0]}</span>
                                        <span className="flex items-center gap-1"><Clock size={12} /> {new Date(c.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Right Column: Complaint Details & Action */}
                <div className="complaint-detail-pane">
                    {!activeComplaint ? (
                        <Card className="h-full flex items-center justify-center p-8 text-center bg-slate-50 border-dashed">
                            <div>
                                <MessageCircle size={48} className="text-muted mx-auto mb-4" />
                                <h3 className="text-muted">Select a complaint to view details and update status</h3>
                            </div>
                        </Card>
                    ) : (
                        <Card className="h-full">
                            <CardHeader className="border-b pb-4 border-slate-200">
                                <div className="flex justify-between items-start mb-2">
                                    <CardTitle>{activeComplaint.id}</CardTitle>
                                    {getStatusBadge(activeComplaint.status)}
                                </div>
                                <p className="text-lg font-medium">{activeComplaint.description}</p>

                                <div className="metadata-grid mt-4 pt-4 border-t border-slate-100">
                                    <div className="meta-item">
                                        <span className="meta-label"><User size={14} /> Citizen Name</span>
                                        <span className="meta-value">{activeComplaint.citizenName}</span>
                                    </div>
                                    <div className="meta-item">
                                        <span className="meta-label"><Tag size={14} /> Category</span>
                                        <span className="meta-value">{activeComplaint.category}</span>
                                    </div>
                                    <div className="meta-item">
                                        <span className="meta-label"><MapPin size={14} /> Location</span>
                                        <span className="meta-value">{activeComplaint.location}</span>
                                    </div>
                                    <div className="meta-item">
                                        <span className="meta-label"><Clock size={14} /> Last Updated</span>
                                        <span className="meta-value">{new Date(activeComplaint.updatedAt).toLocaleString()}</span>
                                    </div>
                                </div>
                            </CardHeader>

                            <CardContent className="detail-content bg-slate-50">
                                <h4 className="mb-4 text-sm font-bold text-secondary uppercase tracking-wider">Update Status & Remarks</h4>

                                <form onSubmit={handleUpdateStatus} className="update-form">
                                    <div className="form-row">
                                        <Select
                                            label="New Status"
                                            value={newStatus}
                                            onChange={(e) => setNewStatus(e.target.value)}
                                            options={['Assigned', 'In Progress', 'Resolved', 'Closed'].filter(s => s !== activeComplaint.status)}
                                            fullWidth
                                        />
                                    </div>

                                    <div className="input-wrapper w-full mt-2">
                                        <label className="input-label">Add Remark</label>
                                        <textarea
                                            className="input-field bg-white"
                                            rows={3}
                                            placeholder="Detail actions taken or reason for status change..."
                                            value={remarkText}
                                            onChange={(e) => setRemarkText(e.target.value)}
                                        />
                                    </div>

                                    <div className="input-wrapper w-full mt-4 mb-4">
                                        <label className="input-label flex items-center gap-2">
                                            <FileUp size={16} /> Resolution Proof (Optional Mock)
                                        </label>
                                        <input type="file" className="input-field bg-white" accept="image/*,.pdf" />
                                    </div>

                                    <Button
                                        type="submit"
                                        fullWidth
                                        isLoading={isUpdating}
                                        disabled={!newStatus && !remarkText}
                                    >
                                        Submit Update
                                    </Button>
                                </form>

                                {activeComplaint.remarks && activeComplaint.remarks.length > 0 && (
                                    <div className="remarks-history mt-8">
                                        <h4 className="mb-4 text-sm font-bold text-secondary uppercase tracking-wider">Log History</h4>
                                        <div className="timeline">
                                            {activeComplaint.remarks.map((r, idx) => (
                                                <div key={idx} className="timeline-item">
                                                    <div className="timeline-indicator"></div>
                                                    <div className="timeline-content">
                                                        <p className="text-sm font-medium">{r.text}</p>
                                                        <div className="text-xs text-muted mt-1 flex justify-between">
                                                            <span>{r.addedBy}</span>
                                                            <span>{new Date(r.timestamp).toLocaleString()}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OfficerDashboard;
