import React from "react"
import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import eventpromo from "../assets/poster.png"
import Sponsors from "../components/Sponsors"

function Home() {
  return (
    <>
    
        <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center"
        >
        {/* Image container with max-height to prevent overflow */}
        <div className="w-full max-h-[70vh]">
            <img
            src={eventpromo}
            alt="X-hilerate event promotional image"
            className="w-full h-full object-cover object-center"
            />
        </div>

        {/* Heading and Paragraph with responsive text sizes */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold mb-4">Welcome to X-hilerate 2k25</h1>
        <p className="text-xl sm:text-2xl mb-8">Get ready for the most awaited event of the year!</p>

        {/* Link with responsive padding */}
        <Link
            to="/purchase"
            className="bg-purple-700 hover:bg-purple-800 text-white font-bold py-2 px-4 rounded transition duration-300"
        >
            Grab your tickets
        </Link>
        </motion.div>
        
        
    </>
    
  )
}

export default Home
