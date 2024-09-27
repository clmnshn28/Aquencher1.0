import React, {useState} from "react";
import 'assets/css/customer';
import { format, formatDistanceToNow } from 'date-fns';
import { RiMegaphoneLine } from "react-icons/ri";
import { Line } from "react-chartjs-2";
import 'chart.js/auto';

import * as images from 'assets/images';
import { GallonInfo } from "components/GallonInfo";
import { AnnouncementViewModal } from "./modals/AnnouncementViewModal";

export const Dashboard = () =>{
    const [announcements, setAnnouncements] = useState([
        { id: 1, title: 'Water Quality Inspection', summary: 'Reminder: Water quality inspection scheduled for next week.', date: new Date('2024-09-27T09:00:00'), read: false },
        { id: 2, title: 'Maintenance Downtime', summary: 'Planned maintenance on water refilling machines this Friday.', date: new Date('2024-09-10T14:00:00'), read: true },
        { id: 3, title: 'New Water Delivery Service', summary: 'We are introducing a new water delivery service starting next month.', date: new Date('2024-09-01T10:30:00'), read: true },
        { id: 4, title: 'Employee Training Session', summary: 'Mandatory training session on safety protocols for all staff.', date: new Date('2024-08-20T13:00:00'), read: true },
        { id: 5, title: 'Customer Feedback', summary: 'Encouraging all customers to fill out the feedback form after their next refill.', date: new Date('2024-08-15T11:00:00'), read: true },
    ]);
    const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
    const [isAnnouncementModalOpen, setIsAnnouncementModalOpen] = useState(false);


    const currentDate = new Date();
    const currentDateStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());

    // Split announcements into recent and earlier based on date
    const recentAnnouncements = announcements.filter(announcement => announcement.date >= currentDateStart);
    const earlierAnnouncements = announcements.filter(announcement => announcement.date < currentDateStart);

    const lineData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [
        {
            label: 'Slim Gallons',
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],// changes in this part
            fill: false,
            backgroundColor: '#0071CA',
            borderColor: '#0071CA',
        },
        {
            label: 'Round Gallons',
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,   0], // changes in this part
            fill: false,
            backgroundColor: '#A4D3FF',
            borderColor: '#A4D3FF',
        },
        ],
    };

    const lineOptions = {
        maintainAspectRatio: false,
        plugins: {
        legend: {
            display: false, // hide the legend
        },
        },
        scales: {
        y: {
            title: {
            display: true,
            text: 'Quantity of Gallons',
            font: {
                weight: '600',
                family: 'poppins',
            },
            color: '#626262',
            },
            min: 0,
        },
        },
    }

    const handleAnnouncementClick = (announcement) => {
        const updatedAnnouncements = announcements.map((a) =>
            a.id === announcement.id ? { ...a, read: true } : a
        );
        setAnnouncements(updatedAnnouncements);
        setSelectedAnnouncement(announcement);
        setIsAnnouncementModalOpen(true);
    };

    const closeModal = () => {
        setIsAnnouncementModalOpen(false);
        setSelectedAnnouncement(null);
    };


    return(
        <>
            <div className="Dashboard__first-content">
                <h2 className="Dashboard__welcome">
                    Welcome Back to Po’s Purified  Drinking Water <br/>& Refilling Hub, <span style={{ fontWeight: 'bold' }}>Francis Harvey</span>
                </h2>
                <div className="Dashboard__time-date">
                    <h3 className="Dashboard__time-text">10:46 AM</h3>
                    <p className="Dashboard__date-text">Feb 23, 2024</p>
                </div>
                <div className="Dashboard__summary-gallons">
                   <GallonInfo
                        image={images.refillIcon}
                        label='Refilled Gallons'
                        value={0}
                   />
                    <GallonInfo
                        image={images.borrowIcon}
                        label='Borrowed Gallons'
                        value={0}
                   />
                    <GallonInfo
                        image={images.returnIcon}
                        label='Returned Gallons'
                        value={0}
                   />
                </div>
            </div>
        
            <div className="Dashboard__second-content">
                <div className="Dashboard__returned-section">
                    <h4> 
                        <RiMegaphoneLine className="Dashboard__announcement-icon" />
                        Admin Announcements
                    </h4>
                    <div className="Dashboard__announcement-list">
                        {recentAnnouncements.length > 0 && (
                            <>
                                <h5 className="Dashboard__announcement-list-header">Recent </h5>
                                {recentAnnouncements.map(announcement => (
                                    <div 
                                        key={announcement.id} 
                                        className={`Dashboard__announcement-item ${announcement.read ? '' : 'Dashboard__unread'}`}
                                        onClick={() => handleAnnouncementClick(announcement)}
                                    >
                                        <div className="Dashboard__announcement-text">
                                            <span>{announcement.title}</span>
                                            <span>{format(announcement.date, 'MMM dd, hh:mm a')}</span>
                                        </div>
                                        <p className="Dashboard__announcement-description">
                                            {announcement.summary}
                                        </p>
                                    </div>
                                ))}
                            </>
                        )}

                        {earlierAnnouncements.length > 0 && (
                            <>
                                <h5 className="Dashboard__announcement-list-header">Earlier </h5>
                                {earlierAnnouncements.map(announcement => (
                                    <div 
                                        key={announcement.id} 
                                        className={`Dashboard__announcement-item ${announcement.read ? '' : 'Dashboard__unread'}`}
                                        onClick={() => handleAnnouncementClick(announcement)}
                                        >
                                        <div className="Dashboard__announcement-text">
                                            <span>{announcement.title}</span>
                                            <span>{format(announcement.date, 'MMM dd, hh:mm a')}</span>
                                        </div>
                                        <p className="Dashboard__announcement-description">
                                            {announcement.summary}
                                        </p>
                                    </div>
                                ))}
                            </>
                        )}

                        {recentAnnouncements.length === 0 && earlierAnnouncements.length === 0 && (
                            <div className="Dashboard__no-announcements">
                                No announcements at this time
                            </div>
                        )}
                    </div>
                </div>
                <div className="Dashboard__refill-borrow-section">
                    <h3  className="Dashboard__header-chart">GALLON REFILL REQUESTS PER MONTH</h3>
                    <div className="chart-container-small">
                        <Line 
                        data={lineData} 
                        options={lineOptions}
                        />
                    </div>   
                    <div className="Dashboard__refill-borrow-legend">
                        <p><span className="Dashboard__refill-borrow-legend-dot refill"></span> Slim Gallons</p>
                        <p><span className="Dashboard__refill-borrow-legend-dot borrow"></span> Round Gallons</p>
                    </div>
                </div>
            </div>
            <AnnouncementViewModal
                isOpen={isAnnouncementModalOpen}
                onClose={closeModal}
                announcement={selectedAnnouncement} 
            />
        </>
    );
};