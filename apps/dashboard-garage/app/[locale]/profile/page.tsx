'use client';

export default function GarageProfilePage() {
  return (
      <div className="max-w-4xl space-y-8">
        <div className="flex items-end justify-between">
          <div className="flex items-center gap-6">
            <div className="relative group">
              <div className="w-24 h-24 rounded-2xl bg-primary-100 flex items-center justify-center text-4xl border-2 border-white shadow-xl">
                🏠
              </div>
              <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-gold rounded-lg flex items-center justify-center text-white shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                📷
              </button>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Garage Moderne</h1>
              <p className="text-gray-500 text-sm">Port-au-Prince, Delmas 15</p>
              <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-bold">
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                Profil Vérifié
              </div>
            </div>
          </div>
          <button className="btn-primary">Enregistrer les modifications</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Informations Générales */}
          <div className="admin-card space-y-4">
            <h3 className="font-bold text-gray-900 border-b border-gray-50 pb-2 mb-4">Informations Générales</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Nom du garage</label>
                <input type="text" defaultValue="Garage Moderne" className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-primary-300 transition-all text-sm" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Téléphone</label>
                <input type="text" defaultValue="+509 3456 7890" className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-primary-300 transition-all text-sm" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Adresse</label>
                <input type="text" defaultValue="15, Rue Delmas, Port-au-Prince" className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-primary-300 transition-all text-sm" />
              </div>
            </div>
          </div>

          {/* Spécialités */}
          <div className="admin-card space-y-4">
            <h3 className="font-bold text-gray-900 border-b border-gray-50 pb-2 mb-4">Spécialités & Services</h3>
            <div className="flex flex-wrap gap-2">
              {['Mécanique Générale', 'Électricité', 'Freinage', 'Diagnostic Scanner', 'Climatisation'].map((service) => (
                <div key={service} className="flex items-center gap-2 px-3 py-2 bg-primary-50 text-primary-700 rounded-xl text-xs font-bold border border-primary-100">
                  {service} <span className="cursor-pointer hover:text-red-500">✕</span>
                </div>
              ))}
              <button className="px-3 py-2 border border-dashed border-gray-300 rounded-xl text-xs font-bold text-gray-400 hover:border-primary-300 hover:text-primary-300 transition-all">
                + Ajouter
              </button>
            </div>
          </div>

          {/* Horaires d'ouverture */}
          <div className="admin-card md:col-span-2 space-y-4">
            <h3 className="font-bold text-gray-900 border-b border-gray-50 pb-2 mb-4">Horaires d'ouverture</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'].map((day) => (
                <div key={day} className="p-3 bg-gray-50 rounded-xl">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">{day}</p>
                  <p className="text-sm font-semibold text-gray-900">08:00 - 17:00</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
  );
}
