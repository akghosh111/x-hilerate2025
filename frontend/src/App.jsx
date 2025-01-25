import React from "react"
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import { motion } from "framer-motion"
import Home from "./pages/Home"
import TicketPurchase from "./pages/TicketPurchase"
import AdminLogin from "./pages/AdminLogin"
import AdminDashboard from "./pages/AdminDashboard"
import TicketVerification from "./pages/TicketVerification"
import Layout from "./components/Layout"

function App() {
  return (
    <Router>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/purchase" element={<TicketPurchase />} />
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/verify" element={<TicketVerification />} />
          </Routes>
        </Layout>
      </motion.div>
    </Router>
  )
}

export default App

