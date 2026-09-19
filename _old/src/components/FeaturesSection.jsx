import React from 'react'
import { motion } from "framer-motion";
import { fadeIn, textVariant } from "../utils/motion";

const FeaturesSection = () => {
  const features = [
    {
      icon: "🔍", 
      title: "Advocacy & Representation",
      description: "We safeguard and promote the collective interests of scientists"
    },
    {
      icon: "⚙️",
      title: "Global Scientific Networking",
      description: "We facilitate professional connections between early-career researchers and experts"
    },
    {
      icon: "🚀",
      title: "Comprehensive Support",
      description: "We provide access to critical scientific and career opportunities, including grants, conferences, research funding"
    }
  ]

  return (
    <motion.section 
      variants={fadeIn('up', 0.2)}
      initial="hidden"
      whileInView="show"
      className="max-w-7xl mx-auto px-4 py-16"
      id="help"
    >
      <motion.div 
        variants={fadeIn('up', 0.3)}
        className="text-center mb-12"
      >
        <motion.h2 
          variants={textVariant(0.2)}
          className="text-3xl font-bold mb-4"
        >
          How can we help?
        </motion.h2>
        <motion.p 
          variants={fadeIn('up', 0.4)}
          className="text-gray-600"
        >
          Main directions of the NGO
        </motion.p>
      </motion.div>
      
      <motion.div 
        variants={fadeIn('up', 0.5)}
        className="grid grid-cols-1 md:grid-cols-3 gap-8"
      >
        {features.map((feature, index) => (
          <motion.div 
            key={index}
            variants={fadeIn('up', 0.3 * (index + 1))}
            className="flex flex-col items-center p-6"
          >
            <motion.div 
              variants={fadeIn('down', 0.4 * (index + 1))}
              className="w-24 h-24 rounded-full mb-6 flex items-center justify-center" 
              style={{ 
                backgroundColor: index === 0 ? '#F1EFFD' : 
                               index === 1 ? '#FFE7E7' : 
                               '#FFF3E4'
              }}
            >
              <motion.div 
                variants={fadeIn('up', 0.5 * (index + 1))}
                className="text-3xl"
              >
                {feature.icon}
              </motion.div>
            </motion.div>
            <motion.h3 
              variants={textVariant(0.3)}
              className="text-2xl font-medium mb-3"
            >
              {feature.title}
            </motion.h3>
            <motion.p 
              variants={fadeIn('up', 0.6 * (index + 1))}
              className="text-gray-500 text-center"
            >
              {feature.description}
            </motion.p>
          </motion.div>
        ))}
      </motion.div>

      <motion.div 
        variants={fadeIn('up', 0.7)}
        className="text-center mt-12"
      >
        <motion.button
          onClick={() => window.location = 'mailto:office@wrtys.org.ua'}
          variants={fadeIn('up', 0.8)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-wrtys text-white cursor-pointer px-8 py-3 rounded-full font-medium hover:bg-wrtys transition-colors relative"
        >
          Become a Partner
          <div className="absolute -z-10 w-full h-full rounded-full bg-wrtys blur-xl top-0 left-0"></div>
        </motion.button>
      </motion.div>
    </motion.section>
  )
}

export default FeaturesSection