import React, { useState, useEffect } from "react"
import { motion } from "framer-motion"
import axios from "axios"
import { useNavigate } from "react-router-dom"

function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("adminToken")
        const response = await axios.get("/api/admin/ticket-stats", {
          headers: { Authorization: `Bearer ${token}` },
        })
        setStats(response.data)
      } catch (error) {
        console.error("Error fetching stats:", error)
        if (error.response && error.response.status === 401) {
          navigate("/admin")
        }
      }
    }

    fetchStats()
  }, [navigate])

  return (
    <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5 }}>
      <h2 className="text-2xl font-bold mb-4 mt-4 ml-4">Admin Dashboard</h2>
      {stats ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
          <div className="bg-purple-600 p-4 rounded shadow">
            <h3 className="text-white text-xl font-bold mb-2">Total Tickets</h3>
            <p className="text-white text-3xl">{stats.totalTickets}</p>
          </div>
          <div className="bg-purple-600 p-4 rounded shadow">
            <h3 className="text-white text-xl font-bold mb-2">Used Tickets</h3>
            <p className="text-white text-3xl">{stats.usedTickets}</p>
          </div>
          <div className="bg-purple-600 p-4 rounded shadow">
            <h3 className="text-white text-xl font-bold mb-2">Unused Tickets</h3>
            <p className="text-white text-3xl">{stats.unusedTickets}</p>
          </div>
        </div>
      ) : (
        <p>Loading stats...</p>
      )}
      <button
        onClick={() => navigate("/admin/verify")}
        className="mt-8 ml-4 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded transition duration-300"
      >
        Verify Tickets
      </button>
    </motion.div>
  )
}

export default AdminDashboard

