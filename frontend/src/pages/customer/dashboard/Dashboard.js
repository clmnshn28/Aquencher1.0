import React, {useState, useEffect} from "react";
import 'assets/css/customer';
import { format } from 'date-fns';
import { RiMegaphoneLine } from "react-icons/ri";
import { Line } from "react-chartjs-2";
import 'chart.js/auto';
import axios from 'axios';
import {API_URL} from 'constants';
import { useAuth } from "context/AuthContext";

import * as images from 'assets/images';
import { GallonInfo } from "components/GallonInfo";
import { AnnouncementViewModal } from "./modals/AnnouncementViewModal";

export const Dashboard = () =>{
    const { user } = useAuth(); 

    const [announcements, setAnnouncements] = useState([]);
    const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
    const [isAnnouncementModalOpen, setIsAnnouncementModalOpen] = useState(false);

    useEffect(()=>{
        fetchAnnouncement();
    },[])
    
    const fetchAnnouncement = async () =>{
        try{
          const response = await axios.get(API_URL + '/api/customer/announcement',{
            headers: {
              'Authorization' : `Bearer ${localStorage.getItem('token')}`,
            },
          });
          const announcementWithUpdatedDateTime = response.data.data
          .map((announcement) => {
            const updatedAt = new Date(announcement.updated_at);
            const hasBeenRead = announcement.read_status.some(read => read.customer_id === user.id && read.is_read === 1);

            return {
              ...announcement,
              date: updatedAt,
              updatedAt,    
              read: hasBeenRead,
            };
          }).sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
          setAnnouncements( announcementWithUpdatedDateTime);
        }catch(error){
          console.error('Error fetching announcements:', error);
        }
    };

    

    const currentDate = new Date();
    const currentDateStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());

    // Split announcements into recent and earlier based on date
    const recentAnnouncements = announcements.filter(announcement => announcement.updatedAt >= currentDateStart);
    const earlierAnnouncements = announcements.filter(announcement => announcement.updatedAt < currentDateStart);

    const [currentTimeDashboard, setCurrentTimeDashboard] = useState('');
    const [currentDateDashboard, setCurrentDateDashboard] = useState('');
  
    useEffect(() => {

      updateTimeAndDate();
      const intervalId = setInterval(updateTimeAndDate, 1000); // update every second
  
      return () => clearInterval(intervalId); // Cleanup interval on component unmount
    }, []);

    const updateTimeAndDate = () => {
        const now = new Date();
        const timeOptions = { hour: '2-digit', minute: '2-digit', hour12: true };
        const dateOptions = { year: 'numeric', month: 'short', day: 'numeric' };
  
        setCurrentTimeDashboard(now.toLocaleTimeString('en-US', timeOptions));
        setCurrentDateDashboard(now.toLocaleDateString('en-US', dateOptions));
    };

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
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // changes in this part
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

    const handleAnnouncementClick = async (announcement) => {
        try {
            await axios.post(API_URL + `/api/customer/announcement/${announcement.id}/read`, {}, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });

            const updatedAnnouncements = announcements.map((a) =>
                a.id === announcement.id ? { ...a, read: true } : a
            );
            setAnnouncements(updatedAnnouncements);
            setSelectedAnnouncement(announcement);
            setIsAnnouncementModalOpen(true);
        } catch (error) {
            console.error('Error marking announcement as read:', error);
        }
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
                    <h3 className="Dashboard__time-text">{currentTimeDashboard}</h3>
                    <p className="Dashboard__date-text">{currentDateDashboard}</p>
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
                                            <div className="Dashboard__indicator-section">
                                                <span className={`Dashboard__new-indicator ${announcement.read ? 'Dashboard__unread-new' : ''}`}>New</span>
                                                <span>{format(announcement.updatedAt, 'MMM dd, hh:mm a')}</span>
                                            </div>
                                        </div>
                                        <p className="Dashboard__announcement-description">
                                            {announcement.content}
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
                                            <div className="Dashboard__indicator-section">
                                                <span className={`Dashboard__new-indicator ${announcement.read ? 'Dashboard__unread-new' : ''}`}>New</span>
                                                <span>{format(announcement.updatedAt, 'MMM dd, hh:mm a')}</span>
                                            </div>
                                        </div>
                                        <p className="Dashboard__announcement-description">
                                            {announcement.content}
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