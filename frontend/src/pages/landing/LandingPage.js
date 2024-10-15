import React,{useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import { IoMdTime } from "react-icons/io";
import { TbTruckDelivery } from "react-icons/tb";
import { LiaFacebook } from "react-icons/lia";
import { LuPhone } from "react-icons/lu";
import { PiMapPinAreaDuotone } from "react-icons/pi";
// import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import 'assets/css/landing';

import * as images from 'assets/images';

export const LandingPage = () =>{
    const navigate = useNavigate();
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const handleRegisterClick = () => {
        navigate('/customer/sign-up');
    };

    const handleLoginClick = () => {
        navigate('/customer/sign-in');
    };

  
    const details = [
        {
          title: 'Open MONDAY - SATURDAY',
          icon: <IoMdTime className="LandingPage__detailIcon" />,
          description: 'We’re ready to serve you during our business hours.',
        },
        {
          title: 'FAST DELIVERY',
          icon: <TbTruckDelivery className="LandingPage__detailIcon" />,
          description: 'Enjoy quick and reliable delivery right to your doorstep – fast and hassle-free!',
        },
        {
          title: 'Social Media Link',
          icon: <LiaFacebook className="LandingPage__detailIcon" />,
          description: 'Stay connected! Follow us on social media for updates, and more.',
        },
    ];

    return(
        <div id="home" className="LandingPage__content">
            <header className={isScrolled ? 'scrolled' : ''}>
                <img className="LandingPage__logo" src={images.loginLogo} alt="LOGO"/>
                <nav>
                    <a href="#home">Home</a>
                    <a href="#about">About Us</a>
                    <a href="#location">Location</a>
                    <a href="#contact">Contact</a>
                    <button onClick={handleLoginClick} className="LandingPage__sign-in-btn-mob">Sign In</button>
                    <button onClick={handleRegisterClick} className="LandingPage__sign-in-btn">Register Now</button>
                    {/* <button className="LandingPage__hamburger-menu" onClick={toggleSidebarMobile}>
                        <img src={images.hamburgerIconClose} alt="Hamburger Menu"/>  
                    </button>  */}
                </nav>
            </header>
            <main>
                <section  className="LandingPage__hero">
                    <h1>
                        Drink Water, Live More <br/>
                        Refreshment Delivered <br/>
                        Straight Through Your Door!
                    </h1>
                    <div className="LandingPage__cta-buttons">
                        <button onClick={handleLoginClick} className="LandingPage__login-btn">Login</button>
                        <a href="#about" className="LandingPage__learn-more-btn">Learn More</a>
                    </div>
                    <div className="LandingPage__cta-hero">
                        <img className="LandingPage__hero-icon" src={images.heroIcon}/>
                    </div>
                </section>

                <section className="LandingPage__details">
                    {details.map((detail, index) => (
                        <div className="LandingPage__detailItem" key={index}>
                        <div className="LandingPage__detailInfo">
                            <span className="LandingPage__detailTitle">{detail.title}</span>
                            {detail.title === 'Social Media Link' ? (
                                <a href="https://www.facebook.com/poswaterrefills" target="_blank" >
                                    {detail.icon}
                                </a>
                            ) : (
                                detail.icon
                            )}
                        </div>
                        <p className="LandingPage__detailDescription">{detail.description}</p>
                        </div>
                    ))}
                </section>


                <section className="LandingPage__features" style={{ backgroundImage: `url(${images.backgroundFeatures})` }}>
                    <h3>CREATE YOUR ACCOUNT TO ENJOY THESE CONVENIENT FEATURES!</h3>
                    <div className="feature-slider">
                        <div className="feature-card ">
                            <img src={images.refillIcon} alt="Refill" />
                            <p className="feature-card-title">Refill</p>
                            <p className="feature-card-description">Easily request a refill for your gallons.</p>
                        </div>
                        <div className="feature-card">
                            <img src={images.borrowIcon} alt="Borrow" />
                            <p className="feature-card-title">Borrow</p>
                            <p className="feature-card-description">Borrow a water container temporarily from the delivery service.</p>
                        </div>
                        <div className="feature-card">
                            <img src={images.returnIcon} alt="Return" />
                            <p className="feature-card-title">Return</p>
                            <p className="feature-card-description">Return your borrowed gallons effortlessly.</p>
                        </div>
                        {/* <button className="slider-button prev-button">
                            <FaChevronLeft className="slider-button-icon" />
                        </button>
                        <button className="slider-button next-button">
                            <FaChevronRight className="slider-button-icon" />
                        </button> */}
                    </div>
                    <p className="LandingPage__lending-description">Don't have any available gallons? We can lend you some!</p>
                </section>

                <section className="LandingPage__details-mob">
                    {details.map((detail, index) => (
                        <div className="LandingPage__detailItem" key={index}>
                        <div className="LandingPage__detailInfo">
                            <span className="LandingPage__detailTitle">{detail.title}</span>
                            {detail.title === 'Social Media Link' ? (
                                <a href="https://www.facebook.com/poswaterrefills" target="_blank" >
                                    {detail.icon}
                                </a>
                            ) : (
                                detail.icon
                            )}
                        </div>
                        <p className="LandingPage__detailDescription">{detail.description}</p>
                        </div>
                    ))}
                </section>     
                
                <section id="about" className="LandingPage__about">
                    <div className="LandingPage__squares">
                        <img src={images.picture5} className="square square--1"/>
                        <img src={images.picture2} className="square square--2"/>
                        <img src={images.picture3} className="square square--3"/>
                        <img src={images.picture1} className="square square--4"/>
                        <img src={images.picture4} className="square square--5"/>
                    </div>
                    <div className="LandingPage__about-content">
                        <h2>Po's Purified Drinking Water & Refilling Hub</h2>
                        <p>
                            Founded in 2022, PO’s Purified Drinking Water & Refilling Hub has been a trusted source of clean drinking water for the local community. Recognizing the need for reliable water refilling stations in an era of growing demand and environmental awareness, we established our station in the City of Malolos. Over the years, we have evolved to meet the changing needs of our customers while staying true to our core values of quality and reliability.
                        </p>
                    </div>
                </section>
                           
                <section id="location" className="LandingPage__map">
                    <div className="LandingPage__map-location">
                        <img src={images.mapIcon} alt="Map Location Icon" />
                        <p>Visit Our Location<br />We're Just a Click Away on the Map!</p>
                    </div>
                    <iframe
                        className="LandingPage__map-iframe"
                        title="Moody J Cafe Location"
                        src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d15462.369276750745!2d120.8108632!3d14.85739!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x339653000957147f%3A0x19e581ae0978ad98!2sMoody%20J%20Cafe!5e0!3m2!1sen!2sph!4v1695934060509!5m2!1sen!2sph"
                        allowFullScreen=""
                        loading="lazy"
                    />
                </section>
                
                <section  id="contact" className="LandingPage__contact">
                    <h3>Got an Urgent Request? Reach Out to Us!</h3>
                    <div className="LandingPage__contact-card">
                        <div className="contact-card-icon-wrapper">
                            <LuPhone className="contact-card-icon" />
                        </div>
                        <p>0969-006-0510 - TM</p>
                        <p>0906-235-1619 - TNT</p>
                    </div>
                </section>
            </main>
            
            <footer>
                <section className="footer__compliance">
                    <p className="footer__text">
                        In compliance with the PHILIPPINE NATIONAL STANDARDS FOR DRINKING WATER of the Department of Health (DOH),<br/>
                        we ensure that our purified drinking water is monthly tested and monitored by a DOH-accredited laboratory.
                    </p>
                    
                    <p className="footer__address">
                        <PiMapPinAreaDuotone className="footer__contact-icon"/>
                        102 Lotus St. Alido Subd. Malolos, Bulacan, Philippines, 3000
                    </p>
                    
                    <p className="footer__contact">
                        <LuPhone className="footer__contact-icon"/>
                        0969-006-0510 / 0906-235-1619
                    </p>
                </section>
                
                <p className="footer__copyright">Copyright © PO’s Purified 2024</p>
            </footer>

        </div>
    );
};