// src/data/mockData.js

export const mockCategories = [
  'Water',
  'Road',
  'Electricity',
  'Garbage',
  'Health',
  'Other'
];

export const mockLocations = [
  'Zone A - North',
  'Zone B - South',
  'Zone C - East',
  'Zone D - West',
  'Zone E - Central'
];

// Define officer assignments based on category and location
export const officerAssignments = {
  'Water': 'officer_water@pscrm.com',
  'Road': 'officer_road@pscrm.com',
  'Electricity': 'officer_elec@pscrm.com',
  'Garbage': 'officer_sanitation@pscrm.com',
  'Health': 'officer_health@pscrm.com',
  'Other': 'officer_general@pscrm.com'
};

export const mockUsers = [
  {
    id: 'u1',
    name: 'Aman Kumar',
    email: 'citizen@example.com',
    password: 'password123', // In a real app, never store plain text passwords
    role: 'citizen',
    phone: '9876543210'
  },
  {
    id: 'o1',
    name: 'Officer Water Dept',
    email: 'officer_water@pscrm.com',
    password: 'password123',
    role: 'officer',
    department: 'Water'
  },
  {
    id: 'o2',
    name: 'Officer Road Dept',
    email: 'officer_road@pscrm.com',
    password: 'password123',
    role: 'officer',
    department: 'Road'
  },
  {
    id: 'a1',
    name: 'Chief Admin',
    email: 'admin@pscrm.com',
    password: 'admin123',
    role: 'admin'
  }
];

export const mockComplaints = [
  {
    id: 'CMP-1001',
    citizenId: 'u1',
    citizenName: 'Aman Kumar',
    category: 'Water',
    location: 'Zone A - North',
    description: 'Pipeline broken in main street causing water logging.',
    photoUrl: null,
    status: 'In Progress', // Submitted, Assigned, In Progress, Resolved, Closed
    assignedTo: 'officer_water@pscrm.com',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
    remarks: [
      {
        text: 'Inspected the area, will send repair team tomorrow.',
        addedBy: 'officer_water@pscrm.com',
        timestamp: new Date(Date.now() - 86400000).toISOString()
      }
    ],
    resolutionProofUrl: null
  },
  {
    id: 'CMP-1002',
    citizenId: 'u1',
    citizenName: 'Aman Kumar',
    category: 'Electricity',
    location: 'Zone C - East',
    description: 'Street lights are not working for the past week.',
    photoUrl: null,
    status: 'Submitted',
    assignedTo: null,
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(), // 5 hours ago
    updatedAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    remarks: [],
    resolutionProofUrl: null
  }
];

// Helper functions for localStorage initialization
export const initializeStorage = () => {
  if (!localStorage.getItem('pscrm_users')) {
    localStorage.setItem('pscrm_users', JSON.stringify(mockUsers));
  }
  if (!localStorage.getItem('pscrm_complaints')) {
    localStorage.setItem('pscrm_complaints', JSON.stringify(mockComplaints));
  }
};
