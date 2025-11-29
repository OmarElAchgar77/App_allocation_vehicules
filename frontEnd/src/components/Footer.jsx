import React from 'react';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

function Footer() {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: 'Brwose', href: '/browse' },
    { name: 'Rent a Motorbike', href: '/motors' },
    { name: 'FAQs', href: '/faqs' },
    { name: 'Blog', href: '/blog' },
  ];

  const companyLinks = [
    { name: 'About Us', href: '/about' },
    { name: 'Contact Us', href: '/contact' },
    { name: 'Careers', href: '/careers' },
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms & Conditions', href: '/terms' },
  ];

  return (
    <footer className="mt-16 bg-gray-800 py-10 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 border-b border-gray-700 pb-8">
          
          <div className="col-span-2 md:col-span-1">
            <h3 className="text-xl font-bold mb-3 text-yellow-400">DriveGo</h3> 
            <p className="text-sm text-gray-400 leading-relaxed">
              Your journey starts here. Premium and reliable car and motor rentals for every adventure.
            </p>
            
            <div className="flex space-x-4 mt-4 text-gray-400">
              <a href="#" className="hover:text-yellow-400 transition duration-300"><FaFacebook size={20} /></a>
              <a href="#" className="hover:text-yellow-400 transition duration-300"><FaTwitter size={20} /></a>
              <a href="#" className="hover:text-yellow-400 transition duration-300"><FaInstagram size={20} /></a>
              <a href="#" className="hover:text-yellow-400 transition duration-300"><FaLinkedin size={20} /></a>
            </div>
          </div>
          
          
          <div className="md:col-span-1">
            <h4 className="text-lg font-semibold mb-3 text-white">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="text-sm text-gray-400 hover:text-yellow-400 transition duration-300">{link.name}</a>
                </li>
              ))}
            </ul>
          </div>

          
          <div className="md:col-span-1">
            <h4 className="text-lg font-semibold mb-3 text-white">Company</h4>
            <ul className="space-y-2">
              {companyLinks.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="text-sm text-gray-400 hover:text-yellow-400 transition duration-300">{link.name}</a>
                </li>
              ))}
            </ul>
          </div>
          
          
          <div className="col-span-2 md:col-span-2">
            <h4 className="text-lg font-semibold mb-3 text-white">Get In Touch</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-start">
                <svg className="w-5 h-5 mr-2 text-yellow-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor"><path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.828 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                <span>123 Main Street, Metropolis, CA 90210</span>
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 mr-2 text-yellow-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor"><path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                <span>(555) 123-4567</span>
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 mr-2 text-yellow-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor"><path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                <span>support@drivego.com</span>
              </li>
            </ul>
          </div>
          
        </div>
          <div className="flex flex-col md:flex-row justify-between items-center pt-6">
          <div className="text-sm text-gray-500">
            &copy; {currentYear} DriveGo Car & Motor Rentals. All rights reserved.
          </div>
          <div className="text-sm text-gray-500 mt-2 md:mt-0">
            Designed for travelers by travelers.
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;