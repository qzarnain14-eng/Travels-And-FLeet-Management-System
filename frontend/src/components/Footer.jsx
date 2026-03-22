import React, { useState } from 'react'
import { footerStyles as styles } from '../assets/dummyStyles';
import { Link } from 'react-router-dom';
import logo from '../assets/logocar.png';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaYoutube, FaEnvelope } from 'react-icons/fa';
import { FaMapMarkerAlt, FaPhone } from 'react-icons/fa';
import { GiCarKey } from 'react-icons/gi';
import { toast } from 'react-toastify';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast.error('Please enter a valid email');
      return;
    }

    setLoading(true);
    try {
      // Simulate API call - in real app, send to backend
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Store email in localStorage for persistence
      const emails = JSON.parse(localStorage.getItem('newsletterEmails') || '[]');
      if (!emails.includes(email)) {
        emails.push(email);
        localStorage.setItem('newsletterEmails', JSON.stringify(emails));
      }
      
      toast.success('Successfully subscribed to newsletter!');
      setEmail('');
    } finally {
      setLoading(false);
    }
  };
  return (
    <footer className={styles.container}>
      <div className={styles.topElements}>
        <div className={styles.circle1} />
        <div className={styles.circle2} />
        <div className={styles.roadLine} />
      </div>

      <div className={styles.innerContainer}>
        <div className={styles.grid}>
          <div className={styles.brandSection}>
            <Link to='/' className="flex items-center ">
              <div className={styles.logoContainer}>
                <img src={logo} alt="logo" className="h-[1em] w-auto block"
                  style={{
                    display: "block",
                    objectFit: "contain"
                  }}
                />
                <span className={styles.logoText}>Travels & Fleet Management System</span>
              </div>
            </Link>
            <p className={styles.description}>
              Premium Car Rental Services with the latest models and exceptional
              customer services. Drive your dream car today!
            </p>

            <div className={styles.socialIcons}>
              {
                [FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaYoutube].map((Icon, i) => (
                  <a href="#" key={i} className={styles.socialIcon}>
                    <Icon />
                  </a>
                ))}
            </div>
          </div>

          {/* QUICK LINKS */}

          <div>
            <h3 className={styles.sectionTitle}>
              Quick Links
            </h3>
            <ul className={styles.linkList}>
              {['Home', 'Cars', 'My Bookings', 'Contact Us'].map((link, i) => (
                <li key={i}>
                  <Link
                    to={link === 'Home' ? '/' : link === 'Contact Us' ? '/contact' : link === 'My Bookings' ? '/bookings' : '/cars'}
                    className={styles.linkItem}
                  >
                    <span className={styles.bullet}></span>
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* CONTACT */}

          <div>
            <h3 className={styles.sectionTitle}>Contact Us
              <span className={styles.underline} />
            </h3>
            <ul className={styles.contactList}>
              <li className={styles.contactItem}>
                <FaMapMarkerAlt className={styles.contactIcon} />
                <span>VIP Road VESU, SURAT, GUJARAT, INDIA</span>
              </li>


              <li className={styles.contactItem}>
                <FaPhone className={styles.contactIcon} />
                <span>+91 6354581007</span>
              </li>


              <li className={styles.contactItem}>
                <FaEnvelope className={styles.contactIcon} />
                <span>anushayadav441@gmail.com</span>
              </li>


            </ul>

            <div className={styles.hoursContainer}>
              <h4 className={styles.hoursTitle}>Business Hours</h4>
              <div className={styles.hoursText}>
                <p>Monday - Friday: 8:00 AM - 8:00 PM</p>
                <p>Saturday: 9:00 AM - 6:00 PM</p>
                <p>Sunday: 10:00 AM - 4:00 PM</p>
              </div>
            </div>
          </div>

          {/* NEWSLETTER */}

          <div>
            <h3 className={styles.sectionTitle}>
              NewsLetter
              <span className={styles.underline} />
            </h3>

            <p className={styles.newsletterText}>
              Subscribe for Special Offer and Updates
            </p>

            <form onSubmit={handleNewsletterSubmit} className="space-y-3">
              <input 
                type="email" 
                placeholder="Your Email Address" 
                className={styles.input}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
              <button 
                type="submit" 
                className={styles.subscribeButton}
                disabled={loading}
              >
                <GiCarKey className="mr-2 text-lg sm:text-xl" />
                {loading ? 'Subscribing...' : 'Subscribe Now'}
              </button>
            </form>
          </div>
        </div>

        {/* BOTTOM COPYRIGHT */}

        <div className={styles.copyright}>
          <p>&copy; {new Date().getFullYear()} Travels & Fleet Management System. All rights reserved.</p>
          <p className="mt-3 md:mt-0">
            Designed by <a href="http://localhost:5173/" target='_blank'
              rel='noopener noreferrer' className={styles.designerLink}
            >
              http://localhost:5173/
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer