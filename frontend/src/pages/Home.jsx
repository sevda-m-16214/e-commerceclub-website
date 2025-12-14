

// frontend/src/components/Home.jsx (FULL UPDATED VERSION)

import React, { useState, useEffect } from 'react';
import Slider from "react-slick";
import { Link } from "react-router-dom";
import { fetchEvents } from '../api/eventApi'; 

// Slider Arrows (Kept exactly as in your original file)
function SampleNextArrow(props) {
    const { onClick } = props;
    return (
        <div
            onClick={onClick}
            className="absolute top-1/2 right-4 transform -translate-y-1/2 z-10 cursor-pointer transition-opacity duration-300 opacity-30 hover:opacity-100 text-white text-4xl"
        >
            ❯
        </div>
    );
}

function SamplePrevArrow(props) {
    const { onClick } = props;
    return (
        <div
            onClick={onClick}
            className="absolute top-1/2 left-4 transform -translate-y-1/2 z-10 cursor-pointer transition-opacity duration-300 opacity-30 hover:opacity-100 text-white text-4xl"
        >
            ❮
        </div>);
}

// NOTE: Your original file had a duplicate definition for the arrows inside SamplePrevArrow.
// I have removed the duplicate definitions below the first set to avoid conflicts, 
// keeping only the clean, separate definitions above, which is standard practice.

function Home() {
    // 💥 STATE FOR EVENTS 💥
    const [upcomingEvents, setUpcomingEvents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Helper function to format the date for display
    const formatEventData = (event) => {
        // event_date is a full ISO datetime string (e.g., "2025-12-15T12:20:00")
        const dateObj = new Date(event.event_date);
        
        // Format the date part (e.g., "December 15, 2025")
        const datePart = dateObj.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
        
        // Format the time part (e.g., "12:20 PM")
        const timePart = event.event_time?.substring(0, 5) || 'TBD'; // Assuming event_time is "HH:MM:SS"
        
        return {
            name: event.title, // Map 'title' from DB to 'name' for display
            date: datePart,
            time: timePart === 'TBD' ? 'Time TBD' : `${timePart} (GMT+4)`, // Append timezone manually
            location: event.location,
            id: event.id, // Keep ID for potential future "See More" link
        };
    };

    // 💥 DATA FETCHING HOOK 💥
    useEffect(() => {
        const loadEvents = async () => {
            try {
                // Fetch all events (we rely on the API to sort them by date ascending)
                const data = await fetchEvents(true, false); 
                
                // 1. Map and format the data
                const formattedEvents = data.events.map(formatEventData);
                
                // 2. Filter to only show the next 2 upcoming events
                // Since the API typically returns events ordered by date ascending, 
                // the first 2 should be the next upcoming ones.
                const nextTwoEvents = formattedEvents.slice(0, 2); 
                
                setUpcomingEvents(nextTwoEvents);
            } catch (err) {
                console.error("Failed to fetch events:", err);
                
                let errorMessage = "Failed to load upcoming events. Check console for details.";
                
                // If the error object has a response (from Axios), use a detail message if available
                if (err.response) {
                    errorMessage = err.response.data?.detail || "API Error: Check browser console.";
                } 
                // If it's a general JavaScript error (like "Cannot read properties of undefined")
                else if (err.message) { 
                    errorMessage = `JS Error: ${err.message}`;
                }
                setError(errorMessage);
            } finally {
                setIsLoading(false);
            }
        };

        loadEvents();
    }, []);
    

    // Manually defined data for the slider and feature cards (KEEP THIS AS REQUESTED)
    const sliderImages = [
        "https://github.com/zasgar17/preFinalWebsite/blob/main/preFinal-Website/ecom2.jpeg?raw=true",
        "https://github.com/zasgar17/preFinalWebsite/blob/main/preFinal-Website/ecom3.jpeg?raw=true",
        "https://github.com/zasgar17/preFinalWebsite/blob/main/preFinal-Website/ecom1.jpeg?raw=true",
        "https://github.com/zasgar17/preFinalWebsite/blob/main/preFinal-Website/ecom4.jpeg?raw=true",
        "https://github.com/zasgar17/preFinalWebsite/blob/main/preFinal-Website/ecom5.jpeg?raw=true",
        "https://github.com/zasgar17/preFinalWebsite/blob/main/preFinal-Website/ecom6.jpeg?raw=true",
    ];
    
    const featureCards = [
        {
            title: 'Masterclass on Dropshipping & Digital Marketing',
            content: 'Industry experts led a hands-on workshop covering product sourcing, SEO strategies, and conversion funnels tailored for student entrepreneurs.'
        },
        {
            title: 'E-Commerce Club Kicks Off with Innovation Mixer at ADA University',
            content: 'Students from various majors gathered to pitch digital business ideas, network with peers, and meet mentors from top e-commerce startups.'
        },
        {
            title: 'Collaboration Alert: E-Commerce Club Partners with ADA Tech & Business Clubs',
            content: 'A new initiative aims to launch a campus-wide virtual marketplace built by students, for students — combining tech, design, and business talent.'
        },
    ];

    return (
        <div className="pt-0">
            {/* Slider */}
            <Slider
                dots={true}
                infinite={true}
                speed={600}
                slidesToShow={1}
                slidesToScroll={1}
                autoplay={true}
                autoplaySpeed={3500}
                nextArrow={<SampleNextArrow />}
                prevArrow={<SamplePrevArrow />}
            >
                {sliderImages.map((src, index) => (
                    <div key={index}>
                        <img src={src} alt={`Slide ${index + 1}`} className="w-full h-[600px] object-cover" />
                    </div>
                ))}
            </Slider>

            {/* Banner */}
            <div className="text-center bg-[#2e5941] text-white py-6 px-4">
                <h1 className="text-4xl md:text-5xl font-bold tracking-wide">
                    WELCOME TO E-COMMERCE CLUB
                </h1>
            </div>

            {/* Intro Section */}
            <div className="bg-[#b5d6c7] px-6 md:px-20 py-12 text-center text-black">
                <p className="max-w-3xl mx-auto text-lg font-medium font-serif leading-7 tracking-wide">
                    YOUR GO-TO HUB FOR EXPLORING THE <br />
                    DIGITAL MARKETPLACE, SPARKING <br />
                    INNOVATION, AND CONNECTING STUDENT <br />
                    MINDS SHAPING THE FUTURE OF ONLINE <br />
                    BUSINESS.
                </p>
            </div>

            {/* New Release Marquee */}
            <div className="bg-red-700 text-white py-2 overflow-hidden whitespace-nowrap">
                <marquee behavior="scroll" direction="left" className="text-sm font-semibold tracking-widest">
                    🎉 New Release: Join our upcoming Innovation Summit | Masterclass in Digital Marketing | Collaboration with ADA Tech Clubs! 🎉
                </marquee>
            </div>

            {/* Feature Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 md:px-20 bg-[#f8f8f8]">
                {featureCards.map((item, idx) => (
                    <div key={idx} className="shadow-lg rounded-md overflow-hidden">
                        <div className="bg-green-900 text-white px-4 py-3 text-base font-bold font-serif">
                            {item.title}
                        </div>
                        <div className="bg-white px-4 py-4 text-sm font-serif text-gray-700">
                            {item.content}
                        </div>
                    </div>
                ))}
            </div>

            {/* Upcoming Events Section */}
            <div className="px-6 md:px-20 py-12 grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Loading and Error States */}
                {isLoading && <p className="col-span-2 text-center text-lg text-gray-500">Loading upcoming events...</p>}
                {error && <p className="text-red-600 col-span-2 text-center text-lg">{error}</p>}
                
                {!isLoading && upcomingEvents.length === 0 && !error && (
                    <p className="col-span-2 text-gray-600 text-center text-lg">No upcoming events found.</p>
                )}

                {/* Event Cards */}
                {upcomingEvents.map((event, idx) => (
                    <div key={idx} className="relative border rounded-lg shadow-lg p-6 bg-white">
                        
                        {/* See All link - Stays the same */}
                        <Link
                            to="/events-courses"
                            className="absolute top-3 right-3 text-sm font-semibold text-red-900 hover:underline"
                        >
                            See All
                        </Link>

                        {/* Event Name */}
                        <h2 className="text-2xl md:text-3xl font-bold mb-4 text-[#8B0000]">{event.name}</h2>

                        {/* Event Details - Now dynamically populated */}
                        <ul className="list-disc pl-5 space-y-1 text-gray-700">
                            <li><b>Date:</b> {event.date}</li>
                            <li><b>Time:</b> {event.time}</li>
                            <li><b>Location:</b> {event.location}</li>
                            {/* Keynote and Panel are removed as requested */}
                        </ul>

                        {/* See More Button */}
                        <div className="mt-4">
                            <Link
                                to={`/events-courses`} // Directing to the list page for simplicity
                                className="inline-block bg-red-800 text-white py-2 px-4 rounded hover:bg-red-900 transition"
                            >
                                See More
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Home;