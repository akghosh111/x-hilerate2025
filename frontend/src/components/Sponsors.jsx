import React from 'react';

const Sponsors = () => {
  return (
    <div className="bg-black text-white py-8 md:py-12">
      <div className="container mx-auto text-center">
        <h2 className="text-2xl sm:text-3xl font-bold mb-4 md:mb-6">Our Media Partners & Sponsors</h2>
        <p className="text-lg mb-8 md:mb-12">Our college concert is supported by leading companies</p>
        <div className="m-10 grid grid-cols-4 sm:grid-cols-4 sm:gap-2 gap-3">
          <div className="bg-slate-900 shadow rounded-lg">sponsor1</div>
          <div className="bg-slate-900 shadow rounded-lg">sponsor2</div>
          <div className="bg-slate-900 shadow rounded-lg">sponsor3</div>
          <div className="bg-slate-900 shadow rounded-lg">sponsor4</div>

        </div>
      </div>
    </div>
  );
};

export default Sponsors;