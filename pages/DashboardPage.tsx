import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Clock, MoreVertical, Search } from 'lucide-react';
import { Project, GarmentType } from '../types';

const MOCK_PROJECTS: Project[] = [
  {
    id: '1',
    name: 'T-Shirt Streetwear Gen Z',
    garmentType: 'T-Shirt',
    lastEdited: '2 jam yang lalu',
    thumbnailUrl: 'https://picsum.photos/seed/streetwear/300/200',
    description: 'Koleksi musim panas untuk target pasar remaja.'
  },
  {
    id: '2',
    name: 'Gamis Minimalis Raya',
    garmentType: 'Dress',
    lastEdited: '1 hari yang lalu',
    thumbnailUrl: 'https://picsum.photos/seed/gamis/300/200',
    description: 'Konsep warna earth tone.'
  },
  {
    id: '3',
    name: 'Seragam Batik Sekolah',
    garmentType: 'T-Shirt', // Using T-shirt as base for prototype
    lastEdited: '3 hari yang lalu',
    thumbnailUrl: 'https://picsum.photos/seed/batik/300/200',
    description: 'Motif parang modifikasi.'
  }
];

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [selectedType, setSelectedType] = useState<string>(GarmentType.TSHIRT);

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectName) return;
    
    // In a real app, this would perform an API call.
    // For prototype, we just navigate to designer with state.
    navigate('/designer', { 
      state: { 
        isNew: true, 
        name: newProjectName, 
        type: selectedType 
      } 
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Proyek Desain</h1>
            <p className="mt-1 text-sm text-gray-500">Kelola dan lanjutkan karya kreatif Anda.</p>
          </div>
          <div className="mt-4 md:mt-0 flex gap-3">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                placeholder="Cari proyek..."
              />
            </div>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-orange-600 hover:bg-orange-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Buat Desain Baru
            </button>
          </div>
        </div>

        {/* Project Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {MOCK_PROJECTS.map((project) => (
            <div key={project.id} className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow">
              <div className="h-48 w-full bg-gray-200 relative">
                <img src={project.thumbnailUrl} alt={project.name} className="w-full h-full object-cover" />
                <div className="absolute top-2 right-2 bg-white/90 px-2 py-1 rounded text-xs font-semibold text-gray-700">
                  {project.garmentType}
                </div>
              </div>
              <div className="px-4 py-5 sm:p-6">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 truncate">{project.name}</h3>
                  <button className="text-gray-400 hover:text-gray-500">
                    <MoreVertical className="h-5 w-5" />
                  </button>
                </div>
                <p className="mt-1 text-sm text-gray-500 line-clamp-2">{project.description}</p>
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                    {project.lastEdited}
                  </div>
                  <Link 
                    to="/designer" 
                    state={{ isNew: false, project: project }}
                    className="text-sm font-medium text-orange-600 hover:text-orange-500"
                  >
                    Buka Editor &rarr;
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* New Project Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={() => setIsModalOpen(false)}></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form onSubmit={handleCreateProject}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Mulai Proyek Baru</h3>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nama Proyek</label>
                    <input 
                      type="text" 
                      required
                      value={newProjectName}
                      onChange={(e) => setNewProjectName(e.target.value)}
                      className="shadow-sm focus:ring-orange-500 focus:border-orange-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                      placeholder="Contoh: Koleksi Lebaran 2024" 
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Jenis Pakaian (Base Model)</label>
                    <select 
                      value={selectedType}
                      onChange={(e) => setSelectedType(e.target.value)}
                      className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                    >
                      <option value={GarmentType.TSHIRT}>T-Shirt (Default)</option>
                      <option value={GarmentType.HOODIE}>Hoodie</option>
                      <option value={GarmentType.DRESS}>Dress</option>
                    </select>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button type="submit" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-orange-600 text-base font-medium text-white hover:bg-orange-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm">
                    Buat Proyek
                  </button>
                  <button type="button" onClick={() => setIsModalOpen(false)} className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
                    Batal
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
