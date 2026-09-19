import scheduleImage from '../assets/jakob-dalbjorn-cuKJre3nyYc-unsplash.jpg'
import { motion } from "framer-motion";
import { fadeIn, textVariant } from "../utils/motion";

const ScheduleSection = () => {
  return (
    <motion.section 
      variants={fadeIn('up', 0.2)}
      initial="hidden"
      whileInView="show"
      className="max-w-7xl mx-auto px-4 py-16 md:py-24"
    >
      <div className="flex flex-col md:flex-row items-center justify-between gap-12 md:gap-24">
        {/* Left side - Image */}
        <motion.div 
          variants={fadeIn('right', 0.3)}
          className="w-full md:w-1/2"
        >
          <motion.img 
            variants={fadeIn('up', 0.4)}
            src={scheduleImage} 
            alt="Statistics dashboard" 
            className="w-full h-auto border-radius-5"
          />
        </motion.div>

        {/* Right side - Content */}
        <motion.div 
          variants={fadeIn('left', 0.3)}
          className="w-full md:w-1/2"
        >
          <motion.span 
            variants={fadeIn('up', 0.4)}
            className="text-orange-500 font-semibold"
          >
            EVENTS
          </motion.span>
          <motion.h2 
            variants={textVariant(0.5)}
            className="text-3xl md:text-4xl font-bold text-navy-900 mt-4 mb-6"
          >
            Event Organization & <br />
            Knowledge Exchange
          </motion.h2>
          <motion.p 
            variants={fadeIn('up', 0.6)}
            className="text-gray-600 mb-8"
          >
            We host high-impact scientific conferences, symposiums, congresses, and expert roundtables to drive innovation and foster collaboration.
          </motion.p>
        </motion.div>
      </div>
    </motion.section>
  )
}

export default ScheduleSection