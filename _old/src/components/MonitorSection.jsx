import { motion } from "framer-motion";
import { fadeIn, textVariant } from "../utils/motion";
import 'swiper/css';
import 'swiper/css/navigation';
import monitorCardBg from '../assets/ousa-chea-gKUC4TMhOiY-unsplash.jpg';

const MonitorSection = () => {
  return (
    <motion.section 
      variants={fadeIn('up', 0.2)}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      className="max-w-7xl mx-auto px-4 py-16 md:py-24"
    >
      <div className="flex flex-col md:flex-row items-center gap-12">
        {/* Left side - Content */}
        <motion.div 
          variants={fadeIn('right', 0.3)}
          className="w-full md:w-1/2"
        >
          <motion.span 
            variants={fadeIn('up', 0.4)}
            className="text-emerald-500 font-semibold"
          >
            RESEARCH
          </motion.span>
          <motion.h2 
            variants={textVariant(0.5)}
            className="text-3xl md:text-4xl font-bold text-navy-900 mt-4 mb-6 md:w-4/5"
          >
            Research & Project Support
          </motion.h2>
          <motion.p 
            variants={fadeIn('up', 0.6)}
            className="text-gray-600 mb-8 md:w-4/5"
          >
            We assist in securing and managing funding for cutting-edge research and technological advancements, ensuring the successful execution of scientific projects.
          </motion.p>
        </motion.div>

        {/* Right side - Swiper with background */}
        <motion.div 
          variants={fadeIn('left', 0.3)}
          className="w-full md:w-1/2 relative"
        >
          <motion.div 
            variants={fadeIn('up', 0.4)}
            className="p-4"
          >
            <motion.img 
              variants={fadeIn('up', 0.5)}
              src={monitorCardBg}
              alt="Dashboard statistics"
              className="w-full h-auto rounded-lg border-radius-5"
            />
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  )
}

export default MonitorSection 