    import React, {useState, useEffect} from "react";
    import 'assets/css/auth';

    import Modal from "components/Modal";

    export const TermsAndCondition = ({ isOpen, onClose, onTermsChecked  }) =>{
        const [isChecked, setIsChecked] = useState(false);

        const handleModalCheckboxChange = (e) => {
            const checked = e.target.checked;
            setIsChecked(checked);

            if (checked) {
            onTermsChecked(true); // Pass true to the sign-up form
            }
        };

        useEffect(() => {
            if (!isOpen) {
            setIsChecked(false); // Reset the checkbox when modal closes
            }
        }, [isOpen]);
        
        if(!isOpen) return null;

        return(
            <Modal>
                <div className={`TermsAndCondition__container`}>
                    <button className="NewUserModal__close" onClick={onClose}>&times;</button>
                    <h2>Terms and Conditions</h2>

                    <div className="terms-content">
                        <h3>Introduction</h3>
                        <p>Welcome to Po’s Purified Drinking Water & Refilling Hub. By accessing or using our website and services, you agree to comply with and be bound by these Terms and Conditions (“Terms”). Please read these Terms carefully. If you do not agree to these Terms, you may not use our services.</p>
                        <h4>1. Account Registration</h4>
                        <p>1.1 Eligibility: To use certain features of our services, such as submitting refill requests, borrowing, or returning gallons, you must create an account. You agree to provide accurate, current, and complete information during the registration process.</p>
                        <p>1.2 Responsibility: You are responsible for maintaining the confidentiality of your account login details and for any activity that occurs under your account. If you suspect unauthorized use of your account, notify us immediately.</p>
                        <p>1.3 Deactivated Accounts: We reserve the right to deactivate or suspend accounts at our discretion for violations of these Terms or misuse of our services. Deactivated accounts will be listed in the User Management section for admin review.</p>

                        <h4>2. Water Refilling Requests</h4>
                        <p>2.1 Types of Requests: Customers may request the following:</p>
                        <ul>
                            <li>Refill: Request to refill your own water containers.</li>
                            <li>Borrow: Borrow containers from us when you do not have your own.</li>
                            <li>Return: Return borrowed containers.</li>
                        </ul>
                        <p>2.2 Request Processing: All requests are subject to availability and must be placed through your account. Once submitted, the admin will review and approve your request before it is added to the queue.</p>

                        <h4>3. Borrowed Containers</h4>
                        <p>3.1 Borrowing Policy: When borrowing water containers, you agree to return them in good condition. The containers are strictly for storing drinking water and should not be used for any other liquids, such as juices or other substances. This ensures the containers remain clean and safe for future use.</p>
                        <p>3.2 Deposit: A deposit is required for each borrowed water container. If a container is not returned, is damaged, or gets lost, the deposit will be forfeited, and this may also limit your ability to borrow containers in the future.</p>

                        <h4>4. Service Availability</h4>
                        <p>4.1 Service Interruptions: We strive to provide uninterrupted service, but we cannot guarantee the availability of our services in case of unforeseen events, such as system outages or natural disasters.</p>

                        <h4>5. Customer Responsibilities</h4>
                        <p>5.1 Accurate Information: You agree to provide accurate and up-to-date information when submitting requests and communicating with us.</p>
                        <p>5.2 Timely Pickup and Returns: You are responsible for ensuring that your gallons are available for pickup at the agreed time and for returning any borrowed containers on time.</p>

                        <h4>6. Privacy Notice</h4>
                        <p>Your personal information is collected, used, and stored in accordance with our internal privacy practices. This includes details such as your name, contact information, and delivery address, which are required to process your requests and provide our water delivery services. By using our services, you consent to our use of your data as described here, including for order processing, communication, and improving our services. We are committed to protecting your privacy and ensuring that your data is handled securely and responsibly.</p>

                        <h4>9. Changes to Terms</h4>
                        <p>We reserve the right to modify these Terms at any time. Changes will be posted on our website and will become effective immediately upon posting. Your continued use of the services following any changes indicates your acceptance of the new Terms.</p>

                        <h4>10. Contact Information</h4>
                        <p>If you have any questions about these Terms, please contact us at:</p>
                        <p>Email: [Your Contact Email]</p>
                        <p>Phone: [Your Contact Number]</p>
                    </div>
                    <div className="terms-modal-footer">
                        <label>
                            <input 
                                type="checkbox"  
                                checked={isChecked}
                                onChange={handleModalCheckboxChange}
                            /> I agree to the terms and conditions
                        </label>
                    </div>
                </div>
            </Modal>
        );
    };