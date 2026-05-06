import AdminLayout from '@/components/layout/AdminLayout';

export default function FeaturedModelsPage() {
  const models = [
    { id: '1', make: 'Toyota', model: '4Runner', years: '2010-2024', image: 'https://images.unsplash.com/photo-1594568284297-7c64468067b1', isActive: true },
    { id: '2', make: 'Toyota', model: 'Hilux', years: '2015-2024', image: 'https://images.unsplash.com/photo-1621932953986-15fcf084da0f', isActive: true },
    { id: '3', make: 'Suzuki', model: 'Grand Vitara', years: '2006-2015', image: 'https://images.unsplash.com/photo-1606016159991-fee4bfa69612', isActive: false },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Modèles en Vedette (CMS)</h1>
            <p className="text-gray-500 text-sm">Gérez les véhicules affichés dans la section &quot;Shop by Model&quot; de la page d&apos;accueil.</p>
          </div>
          <button className="btn-primary flex items-center gap-2">
            <span>✨</span> Ajouter un modèle
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {models.map((model) => (
            <div key={model.id} className="admin-card !p-0 group overflow-hidden border-2 border-transparent hover:border-orange-500 transition-all">
              <div className="relative h-48 bg-gray-100">
                <img 
                  src={model.image} 
                  alt={model.model} 
                  className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all"
                />
                <div className="absolute top-3 right-3">
                  <span className={`px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-widest ${model.isActive ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'}`}>
                    {model.isActive ? 'Actif' : 'Masqué'}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-orange-600 uppercase tracking-widest">{model.make}</span>
                  <span className="text-xs text-gray-400 font-medium">{model.years}</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{model.model}</h3>
                
                <div className="flex items-center gap-2 pt-4 border-t border-gray-50">
                  <button className="flex-1 py-2 text-sm font-bold bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
                    Modifier
                  </button>
                  <button className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          ))}
          
          {/* Empty Add Slot */}
          <button className="border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center p-8 hover:bg-orange-50 hover:border-orange-200 transition-all text-gray-400 hover:text-orange-500 group">
            <span className="text-4xl mb-2 group-hover:scale-110 transition-transform">➕</span>
            <span className="font-bold text-sm uppercase tracking-widest">Nouveau Modèle</span>
          </button>
        </div>
      </div>
    </AdminLayout>
  );
}
