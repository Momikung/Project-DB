"use client";
import React, { useState } from 'react';
import Sidebar from '../../component/Sidebar';
import Header from '../../component/Header';
import { Package, Edit, Trash2, Search, Plus, Filter, AlertTriangle, LayoutGrid, Zap, ArrowUpRight, ShoppingCart } from 'lucide-react';
import { useProducts } from '../../hooks/useProducts';
import { api } from '../../init/api';

export default function ProductPage({ setCurrentPage, user, onLogout }: any) {
  const {
    productsData,
    isLoading,
    searchTerm,
    setSearchTerm,
    categoryFilter,
    setCategoryFilter,
    categories,
    filteredProducts,
    lowStockCount,
    addProduct,
    updateProduct
  } = useProducts();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [formData, setFormData] = useState({ id: 0, name: '', category: '', price: '', userId: '', index: '' });
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [pageIndex, setPageIndex] = useState(1);
  const itemsPerPage = 10;

  React.useEffect(() => {
    api.getUsers().then((res: any) => {
      setAllUsers(res.users || []);
    }).catch(err => console.error("Failed to load users for product page", err));
  }, []);

  // Reset page when filter changes
  React.useEffect(() => {
    setPageIndex(1);
  }, [searchTerm, categoryFilter]);

  if (isLoading) return null;

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;
  const currentProducts = filteredProducts.slice((pageIndex - 1) * itemsPerPage, pageIndex * itemsPerPage);

  const handleOpenAdd = () => {
    setModalMode('add');
    setFormData({ id: 0, name: '', category: '', price: '', userId: '', index: '' });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (p: any) => {
    setModalMode('edit');
    const priceRaw = p.price ? p.price.replace(/[^0-9.]/g, '') : '';
    setFormData({ id: p.id, name: p.name, category: p.category || '', price: priceRaw, userId: p.user_id ? p.user_id.toString() : '', index: '' });
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    const payload = {
      name: formData.name,
      category: formData.category,
      price: parseFloat(formData.price) || 0,
      userId: formData.userId ? parseInt(formData.userId) : null
    };

    if (modalMode === 'add') {
      await addProduct(payload);
    } else {
      await updateProduct(formData.id, payload);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="flex min-h-screen bg-[#151521] text-gray-200 font-sans">
      <Sidebar currentPage="products" setCurrentPage={setCurrentPage} />
      
      <main className="flex-1 p-8 overflow-y-auto max-w-[1750px] mx-auto w-full relative">
        <Header user={user} onLogout={onLogout} title="Product Inventory" subtitle="" hideSubtitle />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-10 mt-6">
          <ProductOrbiter title="Total Products" value={productsData.length} color="#3B82F6" icon={<Package size={24}/>} />
          <ProductOrbiter title="Active Categories" value={categories.length - 1} color="#6366F1" icon={<LayoutGrid size={24}/>} />
          <ProductOrbiter title="Low Stock Items" value={lowStockCount} color="#EF4444" icon={<AlertTriangle size={24}/>} />
          <div onClick={handleOpenAdd} className="bg-[#20202A] border border-white/5 p-10 rounded-2xl shadow-lg flex flex-col justify-between h-52 group hover:border-blue-500/30 transition-all cursor-pointer">
              <div className="flex justify-between items-start">
                 <div className="p-4 bg-blue-500/10 rounded-xl text-blue-500 border border-blue-500/20 shadow-inner"><Plus size={24}/></div>
              </div>
              <div>
                 <h4 className="text-xl font-bold text-white uppercase">+ Product</h4>
              </div>
          </div>
        </div>

        <div className="bg-[#20202A] border border-white/5 rounded-2xl p-6 mb-8 shadow-lg flex items-center gap-6">
            <div className="flex-1 relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input type="text" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-[#151521] border border-white/5 rounded-xl pl-12 pr-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500/50" />
            </div>
            <div className="flex items-center gap-2">
                <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="bg-[#151521] border border-white/5 text-gray-300 text-sm rounded-xl py-3 px-4 focus:outline-none">
                    {categories.map((cat: string) => (
                        <option key={cat} value={cat}>{cat === 'all' ? 'CATEGORY' : cat.toUpperCase()}</option>
                    ))}
                </select>
                <select className="bg-[#151521] border border-white/5 text-gray-300 text-sm rounded-xl py-3 px-4 focus:outline-none">
                    <option>Price</option>
                </select>
                <select className="bg-[#151521] border border-white/5 text-gray-300 text-sm rounded-xl py-3 px-4 focus:outline-none">
                    <option>ID</option>
                </select>
            </div>
        </div>

        <div className="bg-[#20202A] border border-white/5 rounded-2xl overflow-hidden shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-gray-500 text-xs font-bold uppercase tracking-wider border-b border-white/5">
                  <th className="px-8 py-5">ID</th>
                  <th className="px-8 py-5">NAME</th>
                  <th className="px-8 py-5">CATEGORY</th>
                  <th className="px-8 py-5">PRICE</th>
                  <th className="px-8 py-5">User ID</th>
                  <th className="px-8 py-5">Index</th>
                  <th className="px-8 py-5">Update at</th>
                  <th className="px-8 py-5 text-right"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {currentProducts.map((p: any, index: number) => (
                  <tr key={p.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-8 py-4 text-sm text-gray-400">{(pageIndex - 1) * itemsPerPage + index + 1}</td>
                    <td className="px-8 py-4 text-sm text-gray-300">{p.name}</td>
                    <td className="px-8 py-4 text-sm text-gray-400">{p.category || 'Standard'}</td>
                    <td className="px-8 py-4 text-sm text-gray-300">{p.price}</td>
                    <td className="px-8 py-4 text-sm text-gray-400">{p.user_id || '-'}</td>
                    <td className="px-8 py-4 text-sm text-gray-400">{150 - (index * 25)}</td>
                    <td className="px-8 py-4 text-sm text-gray-400">{p.updateAt}</td>
                    <td className="px-8 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => handleOpenEdit(p)} className="p-2 bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 rounded transition-all"><Edit size={16} /></button>
                        <button className="p-2 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded transition-all"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Pagination Controls */}
          <div className="p-5 border-t border-white/5 flex items-center justify-between text-sm text-gray-400">
            <div>
              Showing <span className="text-white font-medium">{(pageIndex - 1) * itemsPerPage + 1}</span> to <span className="text-white font-medium">{Math.min(pageIndex * itemsPerPage, filteredProducts.length)}</span> of <span className="text-white font-medium">{filteredProducts.length}</span> entries
            </div>
            <div className="flex gap-2">
              <button 
                disabled={pageIndex === 1} 
                onClick={() => setPageIndex(p => Math.max(1, p - 1))}
                className="px-4 py-2 bg-[#151521] border border-white/5 rounded-lg hover:bg-white/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <div className="flex items-center gap-1 px-2">
                <span className="font-medium text-white">{pageIndex}</span> / <span>{totalPages}</span>
              </div>
              <button 
                disabled={pageIndex === totalPages} 
                onClick={() => setPageIndex(p => Math.min(totalPages, p + 1))}
                className="px-4 py-2 bg-[#151521] border border-white/5 rounded-lg hover:bg-white/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        </div>

        {/* Modal Overlay */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-[#20202A] border border-white/10 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden text-gray-200 font-sans">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="text-white">
                    {modalMode === 'add' ? <ShoppingCart size={24} /> : <Package size={24} />}
                  </div>
                  <h2 className="text-lg font-bold text-white">
                    {modalMode === 'add' ? 'ADD NEW PRODUCT' : formData.name || 'Edit Product'}
                  </h2>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center">
                    <label className="w-24 text-sm font-semibold text-gray-400">Name</label>
                    <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="flex-1 bg-[#151521] border border-white/5 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" placeholder="Product Name" />
                  </div>
                  
                  <div className="flex items-center">
                    <label className="w-24 text-sm font-semibold text-gray-400">Category</label>
                    <input type="text" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="flex-1 bg-[#151521] border border-white/5 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" placeholder="Category.." />
                  </div>

                  <div className="flex items-center">
                    <label className="w-24 text-sm font-semibold text-gray-400">Price</label>
                    <input type="text" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="flex-1 bg-[#151521] border border-white/5 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" placeholder="$" />
                  </div>

                  <div className="flex items-center">
                    <label className="w-24 text-sm font-semibold text-gray-400">User ID</label>
                    <select value={formData.userId} onChange={e => setFormData({...formData, userId: e.target.value})} className="flex-1 bg-[#151521] border border-white/5 text-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500">
                        <option value="">Select User...</option>
                        {allUsers.map(u => (
                          <option key={u.id} value={u.id}>{u.id} - {u.name}</option>
                        ))}
                    </select>
                  </div>

                  <div className="flex items-center">
                    <label className="w-24 text-sm font-semibold text-gray-400">Index</label>
                    <input type="text" className="flex-1 bg-[#151521] border border-white/5 text-gray-400 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" placeholder="User.." />
                  </div>
                </div>

                <div className="flex items-center gap-3 mt-8">
                  <button onClick={handleSave} className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-lg transition-colors shadow-lg">
                    Save Product
                  </button>
                  <button onClick={() => setIsModalOpen(false)} className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white text-sm font-semibold rounded-lg transition-colors shadow-lg uppercase">
                    CANCEL
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </main>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
      `}</style>
    </div>
  );
}

const ProductOrbiter = ({ title, value, color, icon }: any) => (
  <div className="relative group p-8 rounded-[2rem] bg-[#20202A]/40 border border-white/5 shadow-2xl backdrop-blur-xl overflow-hidden transition-all duration-500 hover:border-white/10">
    {/* Pulsing background glow */}
    <div className="absolute top-0 right-0 w-32 h-32 blur-[80px] -z-10 group-hover:opacity-100 opacity-20 transition-opacity duration-700" style={{backgroundColor: color}}></div>
    
    <div className="flex justify-between items-start mb-6">
      <div className="p-4 bg-white/5 rounded-2xl text-gray-400 group-hover:text-white transition-all shadow-inner border border-white/5" style={{color: color}}>{icon}</div>
      <ArrowUpRight size={20} className="text-gray-700 group-hover:text-white transition-all" />
    </div>
    
    <div>
      <p className="text-[10px] font-black text-gray-600 uppercase tracking-[0.2em] mb-2">{title}</p>
      <h4 className="text-3xl font-black text-white tracking-tighter leading-none">{value}</h4>
    </div>
  </div>
);