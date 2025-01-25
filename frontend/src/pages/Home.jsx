import React from "react"
import { motion } from "framer-motion"
import { Link } from "react-router-dom"

function Home() {
  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="text-center"
    >
      <h1 className="text-4xl font-bold mb-4">Welcome to X-hilerate 2k25</h1>
      <p className="text-xl mb-8">Get ready for the most exciting event of the year!</p>
      <Link
        to="/purchase"
        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300"
      >
        Purchase Tickets
      </Link>
    </motion.div>
  )
}

export default Home

