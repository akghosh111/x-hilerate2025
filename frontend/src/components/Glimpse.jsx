import React from 'react'
import Video from "../assets/video.mp4"
import Thumbnail from "../assets/thumb.png"

const Glimpse = () => {
  return (
    <div className="bg-black text-white py-8 md:py-12 max-w-full">
      <div className="container mx-auto text-center">
        <h2 className="text-2xl sm:text-3xl font-bold mb-4 md:mb-6">Glimpses of Past Year</h2>
        <p className="text-lg mb-8 md:mb-12">Witness the spirit of the most happening event live!!</p>
        <div className="flex justify-center">
            <video src={Video} width="750" height="500" controls preload="metadata" poster={Thumbnail} className="rounded-lg shadow-lg">
            </video>

        </div>
        
    
        
        
      </div>
    </div>
    
  )
}

export default Glimpse
