/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useEffect, useContext } from 'react';
import { mockComplaints, officerAssignments } from '../data/mockData';

const ComplaintContext = createContext();

export const useComplaints = () => useContext(ComplaintContext);

export const ComplaintProvider = ({ children }) => {
    const [complaints, setComplaints] = useState([]);

    // Load complaints on mount
    useEffect(() => {
        const loadComplaints = () => {
            let saved = localStorage.getItem('pscrm_complaints');
            if (saved) {
                try {
                    setComplaints(JSON.parse(saved));
                } catch {
                    setComplaints(mockComplaints);
                }
            } else {
                setComplaints(mockComplaints);
                localStorage.setItem('pscrm_complaints', JSON.stringify(mockComplaints));
            }
        };
        loadComplaints();
    }, []);

    // Sync to local storage whenever complaints change
    useEffect(() => {
        if (complaints.length > 0) {
            localStorage.setItem('pscrm_complaints', JSON.stringify(complaints));
        }
    }, [complaints]);

    // Submit a new complaint
    const submitComplaint = (complaintData, citizen) => {
        const { category } = complaintData;

        // Auto-assignment Logic
        // In a real system, this would query the DB for the officer covering this location & category
        // For mock data, we use a simple mapping based on category
        const assignedOfficerEmail = officerAssignments[category] || officerAssignments['Other'];

        const newComplaint = {
            id: `CMP-${Math.floor(1000 + Math.random() * 9000)}`, // Simple ID generator
            citizenId: citizen.id,
            citizenName: citizen.name,
            ...complaintData,
            status: 'Assigned', // Skip submitted and go directly to assigned since we do auto-assignment
            assignedTo: assignedOfficerEmail,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            remarks: [],
            resolutionProofUrl: null
        };

        setComplaints(prev => [newComplaint, ...prev]);
        return newComplaint;
    };

    // Update complaint status (used by Officers)
    const updateComplaintStatus = (complaintId, newStatus, remark, officerEmail) => {
        setComplaints(prev => prev.map(c => {
            if (c.id === complaintId) {
                const timestamp = new Date().toISOString();
                const updatedRemarks = remark
                    ? [...c.remarks, { text: remark, addedBy: officerEmail, timestamp }]
                    : c.remarks;

                return {
                    ...c,
                    status: newStatus,
                    updatedAt: timestamp,
                    remarks: updatedRemarks
                };
            }
            return c;
        }));
    };

    // Get complaints by citizen ID
    const getCitizenComplaints = (citizenId) => {
        return complaints.filter(c => c.citizenId === citizenId);
    };

    // Get complaints assigned to an officer
    const getOfficerComplaints = (officerEmail) => {
        return complaints.filter(c => c.assignedTo === officerEmail);
    };

    // Get admin statistics
    const getAdminStats = () => {
        const total = complaints.length;
        const resolved = complaints.filter(c => c.status === 'Resolved' || c.status === 'Closed').length;
        const pending = total - resolved;

        // Category distribution
        const byCategory = complaints.reduce((acc, c) => {
            acc[c.category] = (acc[c.category] || 0) + 1;
            return acc;
        }, {});

        return { total, resolved, pending, byCategory };
    };

    const value = {
        complaints,
        submitComplaint,
        updateComplaintStatus,
        getCitizenComplaints,
        getOfficerComplaints,
        getAdminStats
    };

    return (
        <ComplaintContext.Provider value={value}>
            {children}
        </ComplaintContext.Provider>
    );
};
