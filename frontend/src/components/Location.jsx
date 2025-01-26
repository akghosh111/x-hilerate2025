import React from 'react';
import { MapPinPlusInside } from "lucide-react";
import { Clock3 } from "lucide-react"


const Location = () => {
  return (
    <>
        <div className="m-10 grid grid-cols-2 sm:grid-cols-2 sm:gap-2 gap-3">

            <div className="rounded-lg bg-slate-900 shadow border-violet-700 border-dotted border-2 hover:bg-slate-950">
                <div className="container mx-auto text-center">
                <h2 className="pt-3 text-2xl sm:text-2.5xl font-bold mb-4 md:mb-6">
                    <MapPinPlusInside className="inline-block h-12 w-12 sm:h-15 sm:w-15 text-white" />
                </h2>
                <p className="text-lg mb-8 font-semibold md:mb-12 px-0.2">
                    North Bengal 
                    St. Xavier's College,
                    <br />
                    Rajganj Campus
                </p>
                </div>
            </div>
            <div className="min-h-[100px] rounded-lg bg-slate-900 shadow border-violet-700 border-dotted border-2 hover:bg-slate-950">
                <div className="container mx-auto text-center">
                    <h2 className="pt-3 text-2xl sm:text-2.5xl font-bold mb-4 md:mb-6">
                        <Clock3 className="inline-block h-12 w-12 sm:h-15 sm:w-15 text-white"/>
                    </h2>
                    <p className="text-lg font-semibold mb-8 md:mb-12">
                        1st March 2025 
                        <br />
                        starts from 04:30PM
                    </p>

                    
            
                </div>
                

            </div>
            


        </div>
    </>
  )
}

export default Location
