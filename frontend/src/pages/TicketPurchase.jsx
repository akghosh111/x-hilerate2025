import React, { useState } from "react"
import { motion } from "framer-motion"
import axios from "axios"

function TicketPurchase() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    ticketType: "standard",
  })
  const [ticketInfo, setTicketInfo] = useState(null)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post("/tickets", formData)
      setTicketInfo(response.data)
    } catch (error) {
      console.error("Error purchasing ticket:", error)
    }
  }

  return (
    <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5 }}>
      <h2 className="text-2xl font-bold mb-4">Purchase Ticket</h2>
      <form onSubmit={handleSubmit} className="max-w-md mx-auto">
        <div className="mb-4">
          <label htmlFor="name" className="block mb-2">
            Name:
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block mb-2">
            Email:
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="ticketType" className="block mb-2">
            Ticket Type:
          </label>
          <select
            id="ticketType"
            name="ticketType"
            value={formData.ticketType}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="standard">Standard</option>
            <option value="vip">VIP</option>
          </select>
        </div>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300"
        >
          Purchase Ticket
        </button>
      </form>
      {ticketInfo && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mt-8 p-4 bg-green-100 border border-green-400 rounded"
        >
          <h3 className="text-xl font-bold mb-2">Ticket Purchased Successfully!</h3>
          <p>Ticket ID: {ticketInfo.ticketId}</p>
          <p>
            <a
              href={ticketInfo.downloadUrl}
              className="text-blue-500 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Download Ticket
            </a>
          </p>
        </motion.div>
      )}
    </motion.div>
  )
}

export default TicketPurchase

