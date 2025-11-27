import React from 'react';
import { Check } from 'lucide-react';
import { Link } from 'react-router-dom';

const PricingPage: React.FC = () => {
  return (
    <div className="bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
          Paket Harga Sederhana
        </h2>
        <p className="mt-4 text-xl text-gray-500">
          Pilih paket yang sesuai dengan kebutuhan skala produksi fashion Anda.
        </p>
      </div>

      <div className="mt-16 bg-white pb-12 lg:mt-20 lg:pb-20">
        <div className="relative z-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-md mx-auto grid gap-5 lg:grid-cols-3 lg:max-w-none lg:gap-5">
            
            {/* Starter Plan */}
            <div className="flex flex-col rounded-lg shadow-lg overflow-hidden border border-gray-200">
              <div className="px-6 py-8 bg-white sm:p-10 sm:pb-6">
                <div>
                  <h3 className="inline-flex px-4 py-1 rounded-full text-sm font-semibold tracking-wide uppercase bg-orange-100 text-orange-600">
                    Starter
                  </h3>
                </div>
                <div className="mt-4 flex items-baseline text-6xl font-extrabold text-gray-900">
                  Rp0
                  <span className="ml-1 text-2xl font-medium text-gray-500">/bulan</span>
                </div>
                <p className="mt-5 text-lg text-gray-500">
                  Sempurna untuk desainer independen dan pelajar yang baru memulai.
                </p>
              </div>
              <div className="flex-1 flex flex-col justify-between px-6 pt-6 pb-8 bg-gray-50 space-y-6 sm:p-10 sm:pt-6">
                <ul className="space-y-4">
                  {['3 Proyek Desain Aktif', 'Akses AI Generator Terbatas', '3D Viewer Dasar', 'Export Gambar (Low Res)'].map((feature) => (
                    <li key={feature} className="flex items-start">
                      <div className="flex-shrink-0">
                        <Check className="h-6 w-6 text-green-500" />
                      </div>
                      <p className="ml-3 text-base text-gray-700">{feature}</p>
                    </li>
                  ))}
                </ul>
                <div className="rounded-md shadow">
                  <Link to="/projects" className="flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-orange-600 bg-white hover:bg-gray-50 border-orange-200">
                    Mulai Gratis
                  </Link>
                </div>
              </div>
            </div>

            {/* Pro Plan */}
            <div className="flex flex-col rounded-lg shadow-xl overflow-hidden border-2 border-orange-500 relative transform scale-105 z-10">
              <div className="absolute top-0 inset-x-0 h-2 bg-orange-500"></div>
              <div className="px-6 py-8 bg-white sm:p-10 sm:pb-6">
                <div>
                  <h3 className="inline-flex px-4 py-1 rounded-full text-sm font-semibold tracking-wide uppercase bg-orange-100 text-orange-600">
                    Pro (UMKM)
                  </h3>
                </div>
                <div className="mt-4 flex items-baseline text-6xl font-extrabold text-gray-900">
                  Rp250rb
                  <span className="ml-1 text-2xl font-medium text-gray-500">/bulan</span>
                </div>
                <p className="mt-5 text-lg text-gray-500">
                  Untuk brand fashion berkembang yang butuh efisiensi.
                </p>
              </div>
              <div className="flex-1 flex flex-col justify-between px-6 pt-6 pb-8 bg-gray-50 space-y-6 sm:p-10 sm:pt-6">
                <ul className="space-y-4">
                  {['20 Proyek Desain Aktif', 'Unlimited AI Text-to-Design', 'Image-to-3D Generator', 'Export GLB & High Res PNG', 'Dukungan Prioritas'].map((feature) => (
                    <li key={feature} className="flex items-start">
                      <div className="flex-shrink-0">
                        <Check className="h-6 w-6 text-green-500" />
                      </div>
                      <p className="ml-3 text-base text-gray-700">{feature}</p>
                    </li>
                  ))}
                </ul>
                <div className="rounded-md shadow">
                  <Link to="/projects" className="flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700">
                    Mulai Trial 14 Hari
                  </Link>
                </div>
              </div>
            </div>

            {/* Enterprise Plan */}
            <div className="flex flex-col rounded-lg shadow-lg overflow-hidden border border-gray-200">
              <div className="px-6 py-8 bg-white sm:p-10 sm:pb-6">
                <div>
                  <h3 className="inline-flex px-4 py-1 rounded-full text-sm font-semibold tracking-wide uppercase bg-gray-100 text-gray-800">
                    Studio
                  </h3>
                </div>
                <div className="mt-4 flex items-baseline text-6xl font-extrabold text-gray-900">
                  Kontak
                  <span className="ml-1 text-2xl font-medium text-gray-500">Kami</span>
                </div>
                <p className="mt-5 text-lg text-gray-500">
                  Solusi kustom untuk pabrik garmen dan institusi pendidikan.
                </p>
              </div>
              <div className="flex-1 flex flex-col justify-between px-6 pt-6 pb-8 bg-gray-50 space-y-6 sm:p-10 sm:pt-6">
                <ul className="space-y-4">
                  {['Unlimited Project & Storage', 'API Access', 'Custom 3D Base Models', 'Multi-user Team Access', 'Onboarding & Training'].map((feature) => (
                    <li key={feature} className="flex items-start">
                      <div className="flex-shrink-0">
                        <Check className="h-6 w-6 text-green-500" />
                      </div>
                      <p className="ml-3 text-base text-gray-700">{feature}</p>
                    </li>
                  ))}
                </ul>
                <div className="rounded-md shadow">
                  <Link to="/" className="flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-orange-600 bg-white hover:bg-gray-50 border-orange-200">
                    Hubungi Sales
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
