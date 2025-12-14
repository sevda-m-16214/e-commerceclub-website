// // frontend/src/pages/AdminDashboard.jsx

// import React, { useState } from 'react';
// import CreateEventForm from '../components/CreateEventForm'; // We'll create this component next

// const AdminDashboard = () => {
//     return (
//         <div className="max-w-4xl mx-auto py-12 px-4">
//             <h1 className="text-4xl font-bold text-indigo-700 mb-8 border-b pb-2">
//                 Admin Dashboard
//             </h1>

//             <section className="mb-12">
//                 <h2 className="text-3xl font-semibold text-gray-800 mb-6">
//                     Create New Event/Course
//                 </h2>
//                 <CreateEventForm />
//             </section>

//             <section>
//                 <h2 className="text-3xl font-semibold text-gray-800 mb-6">
//                     Manage Existing Items
//                 </h2>
//                 <p className="text-gray-600">
//                     (Future feature: List, edit, or delete existing events and announcements here.)
//                 </p>
//             </section>
//         </div>
//     );
// };

// export default AdminDashboard;


// frontend/src/pages/AdminDashboard.jsx

import React, { useState, useEffect } from 'react'; // 👈 Must import useEffect
import CreateEventForm from '../components/CreateEventForm';
import { useSearchParams } from 'react-router-dom'; // 👈 Must import hook for query params
import axiosInstance from '../utils/axiosInstance'; // 👈 Must import for data fetching

const AdminDashboard = () => {
    // 1. Read query parameters from the URL (e.g., ?editId=1)
    const [searchParams] = useSearchParams();
    const editId = searchParams.get('editId'); // Gets the ID as a string or null

    // 2. State to handle the event data if we are in Edit Mode
    const [eventToEdit, setEventToEdit] = useState(null);
    const [loadingEvent, setLoadingEvent] = useState(false);
    const [fetchError, setFetchError] = useState(null);

    // 3. Effect: Fetch Event Data for Edit Mode
    useEffect(() => {
        if (editId) {
            setLoadingEvent(true);
            setFetchError(null);
            
            // Fetch the existing event details using the ID from the query parameter
            axiosInstance.get(`/api/events/${editId}`) 
                .then(response => {
                    setEventToEdit(response.data);
                })
                .catch(err => {
                    console.error("Error fetching event for editing:", err);
                    setFetchError(`Failed to load event ID ${editId} for editing.`);
                })
                .finally(() => {
                    setLoadingEvent(false);
                });
        } else {
            // If no editId is present, reset state for Create Mode
            setEventToEdit(null);
        }
    }, [editId]); // Re-run when the editId query parameter changes

    // 4. Conditional Rendering for Loading/Error States
    if (loadingEvent) {
        return <div className="max-w-4xl mx-auto py-12 px-4 text-center">Loading event details for modification...</div>;
    }
    
    if (fetchError) {
         return <div className="max-w-4xl mx-auto py-12 px-4 text-center text-red-600">Error: {fetchError}</div>;
    }
    
    // 5. Determine Mode and Title
    const isEditMode = eventToEdit !== null;
    const title = isEditMode 
        ? `Modify Event: ${eventToEdit?.title || `ID ${editId}`}` 
        : 'Create New Event/Course';
    
    return (
        <div className="max-w-4xl mx-auto py-12 px-4">
            <h1 className="text-4xl font-bold text-indigo-700 mb-8 border-b pb-2">
                Admin Dashboard
            </h1>

            <section className="mb-12">
                <h2 className="text-3xl font-semibold text-gray-800 mb-6">
                    {title}
                </h2>
                {/* 6. Pass the event data and mode flag to the form */}
                <CreateEventForm eventToEdit={eventToEdit} isEditMode={isEditMode} />
            </section>

            <section>
                <h2 className="text-3xl font-semibold text-gray-800 mb-6">
                    Manage Existing Items
                </h2>
                <p className="text-gray-600">
                    (Future feature: List, edit, or delete existing events and announcements here.)
                </p>
            </section>
        </div>
    );
};

export default AdminDashboard;