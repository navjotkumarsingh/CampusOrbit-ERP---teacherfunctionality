import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Form, message, Collapse, Carousel } from 'antd';
import { ArrowRightOutlined, MenuOutlined, CloseOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons';
import { FaGraduationCap, FaCheckCircle, FaArrowRight } from 'react-icons/fa';
import { TypeAnimation } from 'react-type-animation';
import axios from 'axios';
import '../styles/ModernLandingPage.css';

const ModernLandingPage = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll reveal effect for timeline
  useEffect(() => {
    const timelineItems = document.querySelectorAll('.timeline-item');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('aos-animate');
        }
      });
    }, {
      threshold: 0.2,
      rootMargin: '0px 0px -50px 0px'
    });

    timelineItems.forEach((item) => {
      observer.observe(item);
    });

    return () => {
      timelineItems.forEach((item) => {
        observer.unobserve(item);
      });
    };
  }, []);

  const faqItems = [
    {
      key: '1',
      label: 'How do I register for an account?',
      children: 'Click on the "Get Started" button and fill in your details. You\'ll be directed to complete the admission application form. Our admin team will review and approve your application within 1-3 business days.',
    },
    {
      key: '2',
      label: 'What is the admission process workflow?',
      children: 'The process is simple: Register → Fill Application → Admin Review → Approval → Access Dashboard. Each step is clearly marked, and you\'ll receive email notifications at every stage.',
    },
    {
      key: '3',
      label: 'Is my data secure?',
      children: 'Yes! All data is encrypted using JWT tokens and stored securely. We follow industry-standard security practices and GDPR compliance to protect your information.',
    },
    {
      key: '4',
      label: 'Can I edit my application after submission?',
      children: 'Once submitted, applications cannot be edited. However, you can contact our support team if you need to make changes before approval.',
    },
    {
      key: '5',
      label: 'What are the system requirements?',
      children: 'You need a modern web browser and stable internet connection. The system works seamlessly on desktop, tablet, and mobile devices.',
    },
    {
      key: '6',
      label: 'How do I reset my password?',
      children: 'Click "Forgot Password" on the login page and follow the instructions sent to your email to reset your password securely.',
    },
  ];

  const workflowSteps = [
    { step: 1, label: 'Register', icon: '📝' },
    { step: 2, label: 'Fill Form', icon: '📋' },
    { step: 3, label: 'Admin Review', icon: '✓' },
    { step: 4, label: 'Approval', icon: '🎉' },
    { step: 5, label: 'Login', icon: '🚀' },
  ];

  const features = [
    { icon: '📋', title: 'Admission Management', desc: 'Streamlined digital admission process' },
    { icon: '💳', title: 'Fee Management', desc: 'Automated fee collection system' },
    { icon: '📅', title: 'Attendance Tracking', desc: 'Digital attendance with analytics' },
    { icon: '📊', title: 'Results & Reports', desc: 'Comprehensive grading system' },
    { icon: '🕐', title: 'Timetable Management', desc: 'Dynamic scheduling system' },
    { icon: '💬', title: 'Communication Hub', desc: 'Integrated messaging platform' },
  ];

  return (
    <div className="modern-landing-page">
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-container">
          <div className="navbar-logo">
            <FaGraduationCap size={28} />
            <span>EduManage</span>
          </div>

          <button className="mobile-menu-btn" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <CloseOutlined /> : <MenuOutlined />}
          </button>

          <div className={`navbar-menu ${isMenuOpen ? 'active' : ''}`}>
            <a href="#home" className="nav-link">Home</a>
            <a href="#features" className="nav-link">Features</a>
            <a href="#workflow" className="nav-link">Process</a>
            <a href="#faq" className="nav-link">FAQ</a>
          </div>

          <div className="navbar-buttons">
            <Button type="ghost" className="nav-btn" onClick={() => navigate('/login')}>
              Login
            </Button>
            <Button type="primary" className="nav-btn-filled" onClick={() => navigate('/register')}>
              Get Started
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              <TypeAnimation
                sequence={[
                  'Smart Student Management',
                  2000,
                  'Digital Education Platform',
                  2000,
                  'Complete ERP Solution',
                  2000,
                ]}
                wrapper="span"
                speed={50}
                repeat={Infinity}
              />
            </h1>
            <p className="hero-subtitle">
              Streamline admissions, attendance, fees, and academic management in one unified platform. Empower your institution with modern digital tools for seamless operations.
            </p>
            <div className="hero-buttons">
              <Button
                size="large"
                type="primary"
                className="btn-get-started"
                onClick={() => navigate('/register')}
              >
                Get Started <FaArrowRight />
              </Button>
              <Button
                size="large"
                type="ghost"
                className="btn-learn-more"
                onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}
              >
                Learn More
              </Button>
            </div>
          </div>
          <div className="hero-image">
            <img
              src={process.env.PUBLIC_URL + '/edulearn.webp'}
              alt="EduManage Platform"
              className="hero-img"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features-section">
        <div className="features-container">
          <h2 className="features-title">Powerful Features</h2>
          <p className="features-subtitle">Everything you need for complete student management</p>

          <Carousel
            autoplay
            autoplaySpeed={3000}
            dots={true}
            className="features-carousel"
          >
            <div className="carousel-slide">
              <div className="features-grid">
                {features.slice(0, 3).map((feature, index) => (
                  <div key={index} className="feature-card">
                    <div className="feature-icon">{feature.icon}</div>
                    <h3>{feature.title}</h3>
                    <p>{feature.desc}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="carousel-slide">
              <div className="features-grid">
                {features.slice(3, 6).map((feature, index) => (
                  <div key={index} className="feature-card">
                    <div className="feature-icon">{feature.icon}</div>
                    <h3>{feature.title}</h3>
                    <p>{feature.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </Carousel>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="benefits-section">
        <div className="benefits-container">
          <h2 className="section-title">Why Choose EduManage?</h2>

          <div className="benefits-grid">
            <div className="benefit-item">
              <FaCheckCircle className="benefit-icon" />
              <h3>100% Digital</h3>
              <p>Eliminate paperwork and go completely digital</p>
            </div>
            <div className="benefit-item">
              <FaCheckCircle className="benefit-icon" />
              <h3>Real-Time Data</h3>
              <p>Make better decisions with instant access</p>
            </div>
            <div className="benefit-item">
              <FaCheckCircle className="benefit-icon" />
              <h3>Secure & Safe</h3>
              <p>Enterprise-grade security for all data</p>
            </div>
            <div className="benefit-item">
              <FaCheckCircle className="benefit-icon" />
              <h3>Easy to Use</h3>
              <p>Intuitive interface for everyone</p>
            </div>
            <div className="benefit-item">
              <FaCheckCircle className="benefit-icon" />
              <h3>24/7 Support</h3>
              <p>Round-the-clock customer support</p>
            </div>
            <div className="benefit-item">
              <FaCheckCircle className="benefit-icon" />
              <h3>Mobile Friendly</h3>
              <p>Access anytime, anywhere on any device</p>
            </div>
          </div>
        </div>
      </section>

      {/* Workflow/Process Section - Glassmorphism Timeline */}
      <section id="workflow" className="workflow-section">
        <div className="workflow-container">
          <h2 className="section-title">Admission Process Flowchart</h2>
          <p className="section-subtitle">5 simple steps from registration to access</p>

          <div className="timeline-vertical">
            {workflowSteps.map((item, index) => (
              <div key={index} className="timeline-item">
                <div className="timeline-connector"></div>
                <div className="timeline-step-badge">Step {item.step}</div>
                <div className="timeline-icon-wrapper">
                  <div className="timeline-icon">{item.icon}</div>
                </div>
                <div className="timeline-card">
                  <div className="timeline-content">
                    <h3 className="timeline-label">{item.label}</h3>
                    <p className="timeline-description">
                      {item.step === 1 && "Create your account with basic information"}
                      {item.step === 2 && "Fill in detailed application form"}
                      {item.step === 3 && "Admin reviews your application"}
                      {item.step === 4 && "Receive admission confirmation email"}
                      {item.step === 5 && "Login and start using the platform"}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Roles Section */}
      <section className="roles-section">
        <div className="roles-container">
          <h2 className="section-title">Built for Every Role</h2>

          <div className="roles-grid">
            <div className="role-card">
              <div className="role-icon">👨‍💼</div>
              <h3>Admin</h3>
              <ul>
                <li>System management</li>
                <li>User management</li>
                <li>Financial oversight</li>
                <li>Analytics & reports</li>
              </ul>
            </div>

            <div className="role-card">
              <div className="role-icon">👨‍🏫</div>
              <h3>Teacher</h3>
              <ul>
                <li>Attendance management</li>
                <li>Grade submission</li>
                <li>Assignment creation</li>
                <li>Student analytics</li>
              </ul>
            </div>

            <div className="role-card">
              <div className="role-icon">👨‍🎓</div>
              <h3>Student</h3>
              <ul>
                <li>Application submission</li>
                <li>Fee payment tracking</li>
                <li>Access materials</li>
                <li>View grades</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="faq-section">
        <div className="faq-container">
          <h2 className="section-title">Frequently Asked Questions</h2>
          <p className="section-subtitle">Find answers to common questions</p>

          <div className="accordion-wrapper">
            <Collapse
              items={faqItems}
              className="custom-accordion"
              accordion
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-container">
          <h2>Ready to Transform Your Institution?</h2>
          <p>Join hundreds of schools already using EduManage</p>
          <Button
            size="large"
            type="primary"
            className="cta-button"
            onClick={() => navigate('/register')}
          >
            Get Started Now
          </Button>
        </div>
      </section>

      {/* Premium Footer */}
      <footer className="premium-footer">
        <div className="footer-top-divider"></div>

        <div className="footer-main-content">
          {/* Brand Section */}
          <div className="footer-brand-section">
            <div className="footer-logo">
              <FaGraduationCap size={32} />
              <span>EduManage</span>
            </div>
            <p className="footer-brand-desc">Transforming educational institutions with intelligent digital solutions</p>
            <div className="footer-social-icons">
              <a href="#" className="footer-social-icon" title="LinkedIn">in</a>
              <a href="#" className="footer-social-icon" title="Twitter">𝕏</a>
              <a href="#" className="footer-social-icon" title="Facebook">f</a>
              <a href="#" className="footer-social-icon" title="Instagram">📷</a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-col">
            <h5>PRODUCT</h5>
            <ul className="footer-links">
              <li><a href="#features">Features</a></li>
              <li><a href="#workflow">How it Works</a></li>
              <li><a href="#faq">FAQ</a></li>
              <li><a href="#home">Pricing</a></li>
              <li><a href="#home">Security</a></li>
            </ul>
          </div>

          {/* Company */}
          <div className="footer-col">
            <h5>COMPANY</h5>
            <ul className="footer-links">
              <li><a href="#home">About Us</a></li>
              <li><a href="#home">Blog</a></li>
              <li><a href="#home">Careers</a></li>
              <li><a href="#home">Contact</a></li>
              <li><a href="#home">Support</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div className="footer-col">
            <h5>LEGAL</h5>
            <ul className="footer-links">
              <li><a href="#home">Privacy Policy</a></li>
              <li><a href="#home">Terms of Service</a></li>
              <li><a href="#home">Cookie Policy</a></li>
              <li><a href="#home">GDPR</a></li>
              <li><a href="#home">Compliance</a></li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom-divider"></div>
        <div className="footer-bottom-content">
          <p className="footer-copyright">&copy; 2024 EduManage. All rights reserved. | Made with ❤️ for educators</p>
          <div className="footer-badges">
            <span className="footer-badge">🔒 Secure</span>
            <span className="footer-badge">⚡ Fast</span>
            <span className="footer-badge">🌍 Global</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ModernLandingPage;
