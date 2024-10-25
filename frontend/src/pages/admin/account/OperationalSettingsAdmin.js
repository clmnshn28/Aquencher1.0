    import React, {useState, useEffect} from "react";
    import 'assets/css/admin';
    import axios from 'axios';
    import {API_URL} from 'constants';

    import { OperationalSection } from "components/OperationalSection";
    // import { BusinessHoursModal } from "./modals/BusinessHoursModal";
    import { BorrowLimitModal } from "./modals/BorrowLimitModal";


    export const OperationalSettingsAdmin = () =>{

        // <===== BUSINESS HOURS =======>  
        // const [businessHours, setBusinessHours] = useState([]);

        // const [isBusinessHoursModalOpen, setIsBusinessHoursModalOpen] = useState(false);
        // const [tempBusinessHours, setTempBusinessHours] = useState([]);

        useEffect(()=>{
            // axios.get(`${API_URL}/api/admin/business-hours`,{
            //     headers:{
            //         'Authorization' : `Bearer ${localStorage.getItem('token') || sessionStorage.getItem('token')}`,
            //     },
            // })
            // .then((response) => {

            //     const formattedData = response.data.data.map(day => ({
            //         day: day.day,
            //         open: Boolean(day.is_open),
            //         timeSlots: day.time_slots.map(slot => ({
            //             id: slot.id,
            //             start: formatTime(slot.start),
            //             end: formatTime(slot.end),
            //         }))
            //     }));
            //     setBusinessHours(formattedData);
            //     setTempBusinessHours(formattedData);
            // })
            // .catch((error) => {
            //     console.error('Failed to fetch business hours:', error);
            // });

            // Fetch Borrow Limits
            axios.get(`${API_URL}/api/admin/borrow-limits`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token') || sessionStorage.getItem('token')}`,
                },
            })
            .then((response) => {
                const { slim_gallons, round_gallons } = response.data.data[0];
                setSlimGallons(slim_gallons ); // Ensure default value
                setRoundGallons(round_gallons);
            })
            .catch((error) => {
                console.error('Failed to fetch borrow limits:', error);
            });
        },[]);

        // const formatTime = (timeString) => {
        //     let [hour, minute] = timeString.split(':');
        //     hour = parseInt(hour);
        //     const period = hour >= 12 ? 'PM' : 'AM';
        //     hour = hour % 12 || 12; // Convert 0:00 or 12:00 hours to 12-hour format
        //     return {
        //         hour: hour,
        //         minute: parseInt(minute),
        //         period: period,
        //     };
        // };

        // // Open Business Hours Modal and store the current values in temporary state
        // const openBusinessHoursModal = () => {
        //     setIsBusinessHoursModalOpen(true);
        //     const deepCopy = businessHours.map(day => ({
        //         ...day,
        //         timeSlots: [...day.timeSlots] // shallow copy of timeSlots array 
        //     }));
        //     setTempBusinessHours(deepCopy); 
        // };

        // // Handle Cancel: reset temp values
        // const closeBusinessHoursModal = () => {
        //     setIsBusinessHoursModalOpen(false);
        //     const deepCopy = businessHours.map(day => ({
        //         ...day,
        //         timeSlots: [...day.timeSlots]
        //     }));
        //     setTempBusinessHours(deepCopy); // Reset temp state 
        // };


        // const convertTo24Hour = (time) => {
        //     let hour = time.hour;
        //     if (time.period === 'PM' && hour < 12) hour += 12;
        //     if (time.period === 'AM' && hour === 12) hour = 0; // Handle 12 AM case
        //     return `${String(hour).padStart(2, '0')}:${String(time.minute).padStart(2, '0')}`;
        // };

        // // Handle confirm business hours
        // const ConfirmBusinessHoursModal = () => {
        //     const updatedHours = tempBusinessHours.map(day => ({
        //         day: day.day,
        //         is_open: day.open,
        //         time_slots: day.timeSlots.map(slot => ({
        //             id: slot.id,
        //             start: convertTo24Hour(slot.start),
        //             end: convertTo24Hour(slot.end),
        //         })),
        //     }));

        //     console.log('this: ', updatedHours);

        //     axios.post(`${API_URL}/api/admin/business-hours`,
        //         { data: updatedHours}, {
        //         headers: {
        //             'Authorization': `Bearer ${localStorage.getItem('token') || sessionStorage.getItem('token')}`,
        //         },
        //     })
        //     .then(response => {
        //         console.log('Business hours updated:', response.data);
        //     })
        //     .catch(error => {
        //         console.error('Failed to update business hours:', error);
        //     });
        //     setBusinessHours(tempBusinessHours);
        //     setIsBusinessHoursModalOpen(false);
        // };


        // <===== BORROW LIMITS =======>
        const [isBorrowLimitsModalOpen, setIsBorrowLimitsModalOpen] = useState(false);

        const [slimGallons, setSlimGallons] = useState(null);
        const [roundGallons, setRoundGallons] = useState(null);
    
        const [tempSlimGallons, setTempSlimGallons] = useState(slimGallons);
        const [tempRoundGallons, setTempRoundGallons] = useState(roundGallons);

         // Open Borrow Limits Modal and store the current values in temporary state
        const openBorrowLimitsModal = () => {
            setIsBorrowLimitsModalOpen(true);
            setTempSlimGallons(slimGallons);
            setTempRoundGallons(roundGallons);
        };

        // Handle Cancel: reset temp values
        const closeBorrowLimitsModal = () => {
            setIsBorrowLimitsModalOpen(false);
            setTempSlimGallons(slimGallons); // Reset temp to original values
            setTempRoundGallons(roundGallons);
        };

        // Handle Confirm: save temp values to main state
        const ConfirmBorrowLimitsModal = () => {
            axios.post(`${API_URL}/api/admin/borrow-limits`, {
                slimGallons: tempSlimGallons,
                roundGallons: tempRoundGallons,
            }, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token') || sessionStorage.getItem('token')}`,
                },
            })
            .then(response => {
                setSlimGallons(tempSlimGallons);
                setRoundGallons(tempRoundGallons);
                console.log('Borrow limits updated:', response.data);
            })
            .catch(error => {
                console.error('Failed to update borrow limits:', error);
            });
            setIsBorrowLimitsModalOpen(false);
        };

        
        
        return(
            <>
                <div className="OperationalSettingsAdmin__container">
                    <h1 className="OperationalSettingsAdmin__header-text">Operational Settings</h1>
                    <p className="OperationalSettingsAdmin__description">
                        Configure key business functions such as pickup and delivery, borrowing limits, and operating hours
                    </p>
                </div>
{/* 
                <OperationalSection
                    title='Business Hours'
                    onEditClick={openBusinessHoursModal} 
                    content={
                        <>
                            {businessHours.map((day) => (
                                <p key={day.day} className="OperationalSettingsAdmin__label-hours">
                                    <span className="OperationalSettingsAdmin__label-text">{day.day}</span>
                                    <span className={`OperationalSettingsAdmin__status ${day.open ? 'open' : 'closed'}`}>
                                        {day.open && day.timeSlots.length > 0 ? (
                                            <span className="OperationalSettingsAdmin__value-time">
                                                {day.timeSlots.map((slot, index) => (
                                                    <span key={index}>
                                                        {`${String(slot.start.hour).padStart(2, '0')}:${String(slot.start.minute).padStart(2, '0')} ${slot.start.period} - ${String(slot.end.hour).padStart(2, '0')}:${String(slot.end.minute).padStart(2, '0')} ${slot.end.period}`}
                                                        {index < day.timeSlots.length - 1 && '\u00A0\u00A0\u00A0|\u00A0\u00A0\u00A0'}
                                                    </span>
                                                ))}
                                            </span>
                                        ) : (
                                            'Closed'
                                        )}
                                    </span>
                             
                                </p>
                            ))}
                        </> 
                    }
                /> */}

                <OperationalSection
                    title='Borrow Limits Per Customer'
                    onEditClick={openBorrowLimitsModal}
                    content={
                        <>
                            <p className="OperationalSettingsAdmin__label">
                                Slim Gallons 
                                <span className="OperationalSettingsAdmin__delivery-value">{slimGallons}</span>
                            </p>
                            <p className="OperationalSettingsAdmin__label">
                                Round Gallons
                                <span className="OperationalSettingsAdmin__delivery-value">{roundGallons}</span>
                            </p>
                        </>
                    }
                />
                
                {/* <BusinessHoursModal
                    isOpen={isBusinessHoursModalOpen}
                    onClose={closeBusinessHoursModal}
                    onConfirm={ConfirmBusinessHoursModal}
                    businessHours={tempBusinessHours}
                    setBusinessHours={setTempBusinessHours}
                /> */}

     

                <BorrowLimitModal
                    isOpen={isBorrowLimitsModalOpen}
                    onClose={closeBorrowLimitsModal}
                    onConfirm={ConfirmBorrowLimitsModal}
                    slimGallons={tempSlimGallons}         
                    roundGallons={tempRoundGallons}       
                    setSlimGallons={setTempSlimGallons}   
                    setRoundGallons={setTempRoundGallons}
                />

            </>
        );
    };