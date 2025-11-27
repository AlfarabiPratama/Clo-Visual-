import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Layers, Zap, Box, ArrowRight, CheckCircle2 } from 'lucide-react';

const LandingPage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <header className="relative bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
            <svg className="hidden lg:block absolute right-0 inset-y-0 h-full w-48 text-white transform translate-x-1/2" fill="currentColor" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
              <polygon points="50,0 100,0 50,100 0,100" />
            </svg>

            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="sm:text-center lg:text-left">
                <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                  <span className="block xl:inline">AI-Powered</span>{' '}
                  <span className="block text-orange-600 xl:inline">3D Fashion Canvas</span>
                </h1>
                <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                  Clo Vsual membantu desainer dan UMKM mengubah ide menjadi realitas. Ketik deskripsi desain, upload sketsa, dan lihat hasilnya secara instan pada model 3D.
                </p>
                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                  <div className="rounded-md shadow">
                    <Link to="/projects" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 md:py-4 md:text-lg">
                      Coba Desain Sekarang
                    </Link>
                  </div>
                  <div className="mt-3 sm:mt-0 sm:ml-3">
                    <Link to="/projects" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-orange-700 bg-orange-100 hover:bg-orange-200 md:py-4 md:text-lg">
                      Lihat Demo
                    </Link>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
        <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2 bg-gray-50 flex items-center justify-center">
          <img
            className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full opacity-90"
            src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80"
            alt="Fashion Designer working"
          />
          <div className="absolute inset-0 bg-orange-600mix-blend-multiply opacity-20"></div>
        </div>
      </header>

      {/* Target Audience Section */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base text-orange-600 font-semibold tracking-wide uppercase">Untuk Siapa?</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Solusi Digital untuk Ekosistem Fashion
            </p>
          </div>

          <div className="mt-10">
            <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { title: 'Desainer Independen', desc: 'Visualisasikan koleksi tanpa menjahit sampel fisik.' },
                { title: 'UMKM Fashion', desc: 'Hemat biaya R&D dan percepat time-to-market.' },
                { title: 'Pabrik Garmen', desc: 'Komunikasi visual yang lebih jelas dengan klien.' },
                { title: 'Sekolah Mode', desc: 'Media pembelajaran modern untuk siswa tata busana.' },
              ].map((item) => (
                <div key={item.title} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <h3 className="text-lg font-medium text-gray-900">{item.title}</h3>
                  <p className="mt-2 text-sm text-gray-500">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-orange-600 font-semibold tracking-wide uppercase">Fitur Utama</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Teknologi di Ujung Jari Anda
            </p>
          </div>

          <div className="mt-10">
            <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
              {[
                {
                  name: 'Text-to-Design AI',
                  description: 'Cukup ketik "batik modern warna pastel" dan AI akan membuatkan pola dan variasi desain untuk Anda.',
                  icon: Sparkles,
                },
                {
                  name: 'Sketch to 3D',
                  description: 'Upload foto sketsa tangan kasar, dan biarkan sistem memetakan tekstur ke model 3D.',
                  icon: Layers,
                },
                {
                  name: '3D Viewer Interaktif',
                  description: 'Putar, zoom, dan lihat detail pakaian dari segala sisi sebelum masuk ke produksi.',
                  icon: Box,
                },
                {
                  name: 'Ekspor Instan',
                  description: 'Simpan hasil desain sebagai gambar (PNG) untuk moodboard atau file 3D untuk pengembangan lanjut.',
                  icon: Zap,
                },
              ].map((feature) => (
                <div key={feature.name} className="relative">
                  <dt>
                    <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-orange-500 text-white">
                      <feature.icon className="h-6 w-6" aria-hidden="true" />
                    </div>
                    <p className="ml-16 text-lg leading-6 font-medium text-gray-900">{feature.name}</p>
                  </dt>
                  <dd className="mt-2 ml-16 text-base text-gray-500">{feature.description}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-orange-50 py-12 border-t border-orange-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm italic text-gray-600">
              "Clo Vsual memangkas waktu sampling saya hingga 50%. Luar biasa untuk presentasi ke klien."
              <div className="mt-4 font-bold text-gray-900 not-italic">— Sarah, Desainer Muda</div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm italic text-gray-600">
              "Sangat membantu UMKM seperti kami yang punya budget terbatas untuk photoshoot."
              <div className="mt-4 font-bold text-gray-900 not-italic">— Budi, Pemilik Brand Lokal</div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm italic text-gray-600">
              "Alat yang bagus untuk mengajarkan konsep desain digital kepada mahasiswa."
              <div className="mt-4 font-bold text-gray-900 not-italic">— Ibu Ratna, Dosen Mode</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
