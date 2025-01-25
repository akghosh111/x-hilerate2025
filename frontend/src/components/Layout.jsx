import React from "react"
import { Link } from "react-router-dom"

function Layout({ children }) {
  return (
    <div className="min-h-screen bg-slate-900">
      <nav className="bg-gray-900 rounded-md bg-clip-padding backdrop-filter backdrop-blur-3xl bg-opacity-10 border border-gray-600 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold">
            X-hilerate 2k25
          </Link>
          <div>
            <Link to="/purchase" className="mr-4">
              Buy Ticket
            </Link>
            <Link to="/admin">Admin</Link>
          </div>
        </div>
      </nav>
      <main className="container mx-auto mt-8 p-4">{children}</main>
    </div>
  )
}

export default Layout

