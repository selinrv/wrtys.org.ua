import React from 'react'
import { FaFacebookF, FaTwitter, FaLinkedinIn } from 'react-icons/fa'
import { motion } from "framer-motion";
import { fadeIn, textVariant } from "../utils/motion";

const Footer = () => {
  const footerLinks = {
    company: [
      { name: 'About', href: '#' },
      { name: 'Terms of Use', href: '#' },
      { name: 'Privacy Policy', href: '#' },
      { name: 'How it Works', href: '#' },
      { name: 'Contact Us', href: '#' },
    ],
    getHelp: [
      { name: 'Support Carrer', href: '#' },
      { name: '24h Service', href: '#' },
      { name: 'Quick Chat', href: '#' },
    ],
    support: [
      { name: 'FAQ', href: '#' },
      { name: 'Policy', href: '#' },
      { name: 'Business', href: '#' },
    ],
    contact: [
      { name: 'WhatsApp', href: '#' },
      { name: 'Support 24', href: '#' },
    ],
  }

  return (
    <motion.footer 
      variants={fadeIn('up', 0.2)}
      initial="hidden"
      whileInView="show"
      className="bg-gray-50"
    >
      <div className="section-container">
        <motion.div 
          variants={fadeIn('up', 0.3)}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12"
        >
          {/* Brand Column */}
          <motion.div 
            variants={fadeIn('right', 0.4)}
            className="lg:col-span-4"
          >
            <motion.div 
              variants={fadeIn('down', 0.5)}
              className="flex items-center gap-1 mb-6"
            >

              <span className="text-xl font-medium ml-1">NGO "WRTYS"</span>
            </motion.div>
            <motion.p 
              variants={fadeIn('up', 0.6)}
              className="text-gray-600 mb-6"
            >
              NGO "WRTYS"" supports and coordinates scientific, technical, and educational initiatives, fostering Ukraine's integration into the global research community.
            </motion.p>

          </motion.div>

          {/* Links Columns */}
          <motion.div 
            variants={fadeIn('left', 0.4)}
            className="lg:col-span-8"
          >
            <div className="grid grid-cols-2 md:grid-cols-2 gap-8">

              <motion.p
                  variants={fadeIn('up', 0.6)}
                  className="text-gray-600 mb-6"
              >
                {' '}
              </motion.p>
              <motion.p
                  variants={fadeIn('up', 0.6)}
                  className="text-gray-600 mb-6"
                  style={{ textAlign: 'right'}}
              >
                <motion.p>
                  Kyiv, Ukraine
                </motion.p>
                <motion.p>
                  Kazimir Malevich Str. 11
                </motion.p>
                <motion.p>
                  <motion.a
                      href={'mailto:office@wrtys.org.ua'}
                  >
                    office@wrtys.org.ua
                  </motion.a>
                </motion.p>
              </motion.p>

            </div>
          </motion.div>
        </motion.div>

        {/* Copyright */}
        <motion.div 
          variants={fadeIn('up', 0.8)}
          className="border-t border-gray-200 mt-12 pt-8"
        >
          <motion.div 
            variants={fadeIn('up', 0.9)}
            className="flex flex-col md:flex-row justify-between items-center gap-4"
          >
            <motion.p 
              variants={fadeIn('right', 1.0)}
              className="text-gray-600 text-sm"
            >
              Copyright © {new Date().getFullYear()}
            </motion.p>
            <motion.p 
              variants={fadeIn('left', 1.0)}
              className="text-gray-600 text-sm"
            >

            </motion.p>
          </motion.div>
        </motion.div>
      </div>
    </motion.footer>
  )
}

export default Footer