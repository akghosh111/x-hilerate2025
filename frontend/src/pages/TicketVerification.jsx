import React, { useState } from "react"
import { motion } from "framer-motion"
import axios from "axios"

function TicketVerification() {
  const [ticketId, setTicketId] = useState("")
  const [verificationResult, setVerificationResult] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem("adminToken")
      const response = await axios.post(
        `/tickets/${ticketId}/verify`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )
      setVerificationResult(response.data)
    } catch (error) {
      console.error("Error verifying ticket:", error)
      setVerificationResult({ error: "Failed to verify ticket" })
    }
  }

  return (
    <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5 }}>
      <h2 className="text-2xl font-bold mb-4">Verify Ticket</h2>
      <form onSubmit={handleSubmit} className="max-w-md mx-auto">
        <div className="mb-4">
          <label htmlFor="ticketId" className="block mb-2">
            Ticket ID:
          </label>
          <input
            type="text"
            id="ticketId"
            value={ticketId}
            onChange={(e) => setTicketId(e.target.value)}
            required
            className="w-full p-2 border rounded"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300"
        >
          Verify Ticket
        </button>
      </form>
      {verificationResult && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className={`mt-8 p-4 rounded ${verificationResult.status === "valid" ? "bg-green-100 border-green-400" : "bg-red-100 border-red-400"}`}
        >
          <h3 className="text-xl font-bold mb-2">
            {verificationResult.status === "valid" ? "Ticket Valid" : "Ticket Invalid"}
          </h3>
          {verificationResult.status === "valid" && (
            <div>
              <p>Name: {verificationResult.ticket.name}</p>
              <p>Email: {verificationResult.ticket.email}</p>
              <p>Ticket Type: {verificationResult.ticket.ticketType}</p>
            </div>
          )}
          {verificationResult.error && <p>{verificationResult.error}</p>}
        </motion.div>
      )}
    </motion.div>
  )
}

export default TicketVerification

