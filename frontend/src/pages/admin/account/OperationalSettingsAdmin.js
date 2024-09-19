    import React, {useState} from "react";
    import 'assets/css/admin';

    import { OperationalSection } from "components/OperationalSection";
    import { BusinessHoursModal } from "./modals/BusinessHoursModal";
    import { PickupDeliveryTimeModal } from "./modals/PickupDeliveryTimeModal";
    import { BorrowLimitModal } from "./modals/BorrowLimitModal";


    export const OperationalSettingsAdmin = () =>{

        // <===== BUSINESS HOURS =======>  
        const [businessHours, setBusinessHours] = useState( [
            { day: "Sunday", open: false, timeSlots: [] },
            { day: "Monday", open: false, timeSlots: [] },
            { day: "Tuesday", open: false, timeSlots: [] },
            { day: "Wednesday", open: false, timeSlots: [] },
            { day: "Thursday", open: false, timeSlots: [] },
            { day: "Friday", open: false, timeSlots: [] },
            { day: "Saturday", open: false, timeSlots: [] }
        ]);

        const [isBusinessHoursModalOpen, setIsBusinessHoursModalOpen] = useState(false);
        const [tempBusinessHours, setTempBusinessHours] = useState(businessHours);

        // Open Business Hours Modal and store the current values in temporary state
        const openBusinessHoursModal = () => {
            setIsBusinessHoursModalOpen(true);
            const deepCopy = businessHours.map(day => ({
                ...day, // shallow copy of each day object
                timeSlots: [...day.timeSlots] // shallow copy of timeSlots array 
            }));
            setTempBusinessHours(deepCopy); 
        };

        // Handle Cancel: reset temp values
        const closeBusinessHoursModal = () => {
            setIsBusinessHoursModalOpen(false);
            const deepCopy = businessHours.map(day => ({
                ...day,
                timeSlots: [...day.timeSlots]
            }));
            setTempBusinessHours(deepCopy); // Reset temp state 
        };

        // Handle confirm business hours
        const ConfirmBusinessHoursModal = () => {
            setIsBusinessHoursModalOpen(false);
            setBusinessHours(tempBusinessHours); // Save temp to actual state
        };




        // <===== PICKUP & DELIVERY =======>
        const [isPickupDeliverModalOpen, setIsPickupDeliverModalOpen] = useState(false);
        const [pickupTime, setPickupTime] = useState({ minute: 0, second: 0 });
        const [deliveryTime, setDeliveryTime] = useState({ minute: 0, second: 0 });

        const [tempPickupTime, setTempPickupTime] = useState(pickupTime);
        const [tempDeliveryTime, setTempDeliveryTime] = useState(deliveryTime);


        // Open Pickup & Delivery Time Modal and store the current values in temporary state
        const openPickupDeliveryTimeModal = () => {
            setIsPickupDeliverModalOpen(true);
            setTempPickupTime(pickupTime);
            setTempDeliveryTime(deliveryTime);
        };

        const closePickupDeliverModal = () =>{
            setIsPickupDeliverModalOpen(false);
            setTempPickupTime(pickupTime);
            setTempDeliveryTime(deliveryTime);
        };

        // Handle confirm pickup deliver time
        const ConfirmPickupDeliverModal = () => {
            setIsPickupDeliverModalOpen(false);
            setPickupTime(tempPickupTime);
            setDeliveryTime(tempDeliveryTime);
        };


        // Format Time Helper Function
        const formatTime = (time) => {
            const minutes = String(time.minute).padStart(2, '0');
            const seconds = String(time.second).padStart(2, '0');
            return `${minutes}:${seconds} m`;
        };


        // <===== BORROW LIMITS =======>
        const [isBorrowLimitsModalOpen, setIsBorrowLimitsModalOpen] = useState(false);

        const [slimGallons, setSlimGallons] = useState(0);
        const [roundGallons, setRoundGallons] = useState(0);
    
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
            setIsBorrowLimitsModalOpen(false);
            setSlimGallons(tempSlimGallons);
            setRoundGallons(tempRoundGallons);
        };

        
        
        return(
            <>
                <div className="OperationalSettingsAdmin__container">
                    <h1 className="OperationalSettingsAdmin__header-text">Operational Settings</h1>
                    <p className="OperationalSettingsAdmin__description">
                        Configure key business functions such as pickup and delivery, borrowing limits, and operating hours
                    </p>
                </div>

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
                />
                
                <OperationalSection
                    title='Pickup and Delivery Time'
                    onEditClick={openPickupDeliveryTimeModal} 
                    content={
                        <>
                            <p className="OperationalSettingsAdmin__label">
                                Estimated Pickup Time
                                <span className="OperationalSettingsAdmin__delivery-value">{formatTime(pickupTime)}</span>
                            </p>
                            <p className="OperationalSettingsAdmin__label">
                                Estimated Delivery Time 
                                <span className="OperationalSettingsAdmin__delivery-value">{formatTime(deliveryTime)}</span>
                            </p>
                        </>
                    }
                    
                />

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
                
                <BusinessHoursModal
                    isOpen={isBusinessHoursModalOpen}
                    onClose={closeBusinessHoursModal}
                    onConfirm={ConfirmBusinessHoursModal}
                    businessHours={tempBusinessHours}
                    setBusinessHours={setTempBusinessHours}
                />

                <PickupDeliveryTimeModal
                    isOpen={isPickupDeliverModalOpen}
                    onClose={closePickupDeliverModal}
                    onConfirm={ConfirmPickupDeliverModal}
                    pickupTime={tempPickupTime}
                    deliveryTime={tempDeliveryTime}
                    setPickupTime={setTempPickupTime}
                    setDeliveryTime={setTempDeliveryTime}
                />

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