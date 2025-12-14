// frontend/src/components/EventCourses.jsx (Updated with Timezone Fix)

import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import { fetchEvents } from '../api/eventApi'; 

function EventCourses() {
    // ... [STATE MANAGEMENT REMAINS THE SAME] ...
    const [allEvents, setAllEvents] = useState([]);
    const [upcomingEvents, setUpcomingEvents] = useState([]);
    const [pastEvents, setPastEvents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState("upcoming");

    const eventsToShow = activeTab === "upcoming" ? upcomingEvents : pastEvents;
    
    // Helper function (Reused from Home.jsx with minor adjustments)
    const formatEventData = (event) => {
    
      // 1. Extract components from API strings
      const dateParts = event.event_date.split('-'); // ["2025", "12", "15"]
      const timeParts = event.event_time?.substring(0, 5).split(':') || ['00', '00']; // ["10", "00"] or ["00", "00"]
      
      const year = parseInt(dateParts[0], 10);
      // Month is 0-indexed in JavaScript Date (Jan=0, Dec=11)
      const monthIndex = parseInt(dateParts[1], 10) - 1; 
      const day = parseInt(dateParts[2], 10);
      const hours = parseInt(timeParts[0], 10);
      const minutes = parseInt(timeParts[1], 10);

      // 2. Safely construct the Date object in the local timezone (Browser/Baku time)
      const eventDateInLocalTime = new Date(year, monthIndex, day, hours, minutes);
      
      // 3. Format strings for display (using the original methods)
      const datePart = eventDateInLocalTime.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
      
      const timePart = event.event_time?.substring(0, 5) || 'TBD'; 
      
      return {
          name: event.title,
          date: datePart,
          time: timePart === 'TBD' ? 'Time TBD' : `${timePart} (GMT+4)`,
          location: event.location,
          id: event.id,
          // Use the manually constructed Date object for comparison
          fullDateTime: eventDateInLocalTime, 
      };
  };

    // ... [DATA FETCHING AND CLASSIFICATION REMAINS THE SAME] ...
    useEffect(() => {
        const loadAllEvents = async () => {
            try {
                const data = await fetchEvents(true, false); 
                
                // The comparison point: Current time in the browser's local timezone (which should be GMT+4 in Baku)
                const now = new Date(); 
                
                const formattedEvents = data.events.map(formatEventData);

                const upcoming = [];
                const past = [];

                formattedEvents.forEach(event => {
                    // This comparison now uses two Date objects that are interpreted in the local timezone.
                    if (event.fullDateTime >= now) {
                        upcoming.push(event);
                    } else {
                        past.push(event);
                    }
                });

                upcoming.sort((a, b) => a.fullDateTime - b.fullDateTime);
                past.sort((a, b) => b.fullDateTime - a.fullDateTime); 

                setUpcomingEvents(upcoming);
                setPastEvents(past);
                setAllEvents(formattedEvents);

            } catch (err) {
                console.error("Failed to fetch all events:", err);
                let errorMessage = "Failed to load events. Please try again later.";
                if (err.response) {
                    errorMessage = err.response.data?.detail || "API Error: Check browser console.";
                } else if (err.message) { 
                    errorMessage = `JS Error: ${err.message}`;
                }
                setError(errorMessage);
            } finally {
                setIsLoading(false);
            }
        };

        loadAllEvents();
    }, []);

    
    // ... [RENDER LOGIC REMAINS THE SAME] ...
    return (
        <div className="pt-10 pb-20 min-h-screen bg-white text-gray-900">
            <div className="px-6 md:px-20 py-8">
                <h1 className="text-4xl md:text-5xl font-bold text-green-900 mb-6">
                    Events & Courses
                </h1>

                {/* Tabs */}
                <div className="flex gap-4 mb-8 border-b border-green-800">
                    <button
                        onClick={() => setActiveTab("upcoming")}
                        className={`py-2 px-4 font-semibold rounded-t-lg transition ${
                            activeTab === "upcoming"
                                ? "bg-green-800 text-white"
                                : "text-green-900 hover:bg-green-900 hover:bg-opacity-20"
                        }`}
                    >
                        Upcoming Events ({upcomingEvents.length})
                    </button>
                    <button
                        onClick={() => setActiveTab("past")}
                        className={`py-2 px-4 font-semibold rounded-t-lg transition ${
                            activeTab === "past"
                                ? "bg-green-800 text-white"
                                : "text-green-900 hover:bg-green-900 hover:bg-opacity-20"
                        }`}
                    >
                        Past Events ({pastEvents.length})
                    </button>
                </div>

                {/* Loading and Error States */}
                {isLoading && (
                    <p className="text-center text-xl text-gray-500 py-10">Loading all events...</p>
                )}
                
                {error && (
                    <div className="text-center text-red-600 border border-red-300 p-4 rounded bg-red-50 my-8">
                        {error}
                    </div>
                )}
                
                {/* No Events Found State */}
                {!isLoading && eventsToShow.length === 0 && !error && (
                    <p className="text-center text-xl text-gray-600 py-10">
                        {activeTab === "upcoming" ? "There are currently no upcoming events scheduled." : "No past events found in the database."}
                    </p>
                )}


                {/* Event Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {eventsToShow.map((event, idx) => (
                        <div
                            key={event.id || idx}
                            className="relative bg-white border border-red-900 rounded-lg shadow-lg p-6 hover:scale-[1.02] transition transform"
                        >
                            <h2 className="text-2xl md:text-3xl font-bold mb-3 text-red-800">
                                {event.name}
                            </h2>
                            <ul className="list-disc pl-5 space-y-1 text-gray-700">
                                <li><b>Date:</b> {event.date}</li>
                                <li><b>Time:</b> {event.time}</li>
                                <li><b>Location:</b> {event.location}</li>
                            </ul>
                            <div className="mt-4">
                                <Link 
                                    to={`/events/${event.id}`} 
                                    className="inline-block bg-red-800 text-white font-semibold py-2 px-4 rounded hover:bg-red-900 transition"
                                >
                                    Learn more →
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default EventCourses;