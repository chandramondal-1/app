import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Edit, Trash2, ArrowDownCircle, ArrowUpCircle } from 'lucide-react';
import { API_BASE_URL } from '../../api/config';

const InventoryList = () => {
  const [products, setProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '', sku: '', category: '', purchase_price: '', selling_price: '', quantity: 0, low_stock_level: 5
  });
  const [isEdit, setIsEdit] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get(`${API_BASE_URL}/api/inventory`);
      setProducts(data);
    } catch (err) {
      console.error(err);
    }
  };

  const openForm = (product = null) => {
    if (product) {
      setIsEdit(true);
      setCurrentId(product.id);
      setFormData(product);
    } else {
      setIsEdit(false);
      setCurrentId(null);
      setFormData({ name: '', sku: '', category: '', purchase_price: '', selling_price: '', quantity: 0, low_stock_level: 5 });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (isEdit) {
        await axios.put(`${API_BASE_URL}/api/inventory/${currentId}`, formData);
      } else {
        await axios.post(`${API_BASE_URL}/api/inventory`, formData);
      }
      setIsModalOpen(false);
      fetchProducts();
    } catch (err) {
      alert('Error saving product');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      await axios.delete(`${API_BASE_URL}/api/inventory/${id}`);
      fetchProducts();
    } catch (err) {
      alert('Error deleting');
    }
  };

  const stockMovement = async (id, type) => {
    const qty = prompt(`Enter quantity to move ${type}:`);
    if (!qty || isNaN(qty) || qty <= 0) return;

    try {
      await axios.post(`${API_BASE_URL}/api/inventory/${id}/stock`, {
        type,
        quantity: parseInt(qty),
        note: `Manual ${type}`
      });
      fetchProducts();
    } catch (err) {
      alert(err.response?.data?.error || 'Error moving stock');
    }
  };

  return (
    <div>
      <div className="header">
        <h2>Inventory Management</h2>
        <button className="btn btn-primary" onClick={() => openForm(null)}>
          <Plus size={18} /> Add Product
        </button>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>SKU</th>
              <th>Name</th>
              <th>Category</th>
              <th>Stock</th>
              <th>Price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id}>
                <td className="text-muted">{p.sku}</td>
                <td>
                  <div style={{fontWeight: 500}}>{p.name}</div>
                  {p.quantity <= p.low_stock_level && <span className="badge badge-danger" style={{fontSize: '0.65rem'}}>Low Stock</span>}
                </td>
                <td>{p.category}</td>
                <td>
                  <div className="flex-item">
                    {p.quantity}
                    <button className="btn btn-outline" style={{padding: '0.25rem 0.5rem', border: 'none', color: 'var(--success)'}} onClick={() => stockMovement(p.id, 'IN')} title="Stock In">
                      <ArrowDownCircle size={16} />
                    </button>
                    <button className="btn btn-outline" style={{padding: '0.25rem 0.5rem', border: 'none', color: 'var(--danger)'}} onClick={() => stockMovement(p.id, 'OUT')} title="Stock Out">
                      <ArrowUpCircle size={16} />
                    </button>
                  </div>
                </td>
                <td>${p.selling_price}</td>
                <td>
                  <div className="flex-item">
                    <button className="btn btn-outline" style={{padding: '0.4rem', border: 'none'}} onClick={() => openForm(p)}>
                      <Edit size={16} />
                    </button>
                    <button className="btn btn-outline" style={{padding: '0.4rem', border: 'none', color: 'var(--danger)'}} onClick={() => handleDelete(p.id)}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {products.length === 0 && <tr><td colSpan="6" className="text-center text-muted">No products found.</td></tr>}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>{isEdit ? 'Edit Product' : 'Add New Product'}</h3>
            <form onSubmit={handleSave} style={{marginTop: '1.5rem'}}>
              <div className="form-group">
                <label className="form-label">Product Name</label>
                <input className="form-control" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
              </div>
              <div style={{display: 'flex', gap: '1rem'}}>
                <div className="form-group" style={{flex: 1}}>
                  <label className="form-label">SKU</label>
                  <input className="form-control" value={formData.sku} onChange={e => setFormData({...formData, sku: e.target.value})} required />
                </div>
                <div className="form-group" style={{flex: 1}}>
                  <label className="form-label">Category</label>
                  <input className="form-control" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} />
                </div>
              </div>
              <div style={{display: 'flex', gap: '1rem'}}>
                <div className="form-group" style={{flex: 1}}>
                  <label className="form-label">Purchase Price</label>
                  <input type="number" step="0.01" className="form-control" value={formData.purchase_price} onChange={e => setFormData({...formData, purchase_price: e.target.value})} required />
                </div>
                <div className="form-group" style={{flex: 1}}>
                  <label className="form-label">Selling Price</label>
                  <input type="number" step="0.01" className="form-control" value={formData.selling_price} onChange={e => setFormData({...formData, selling_price: e.target.value})} required />
                </div>
              </div>
              {!isEdit && (
                <div className="form-group">
                  <label className="form-label">Initial Stock Quantity</label>
                  <input type="number" className="form-control" value={formData.quantity} onChange={e => setFormData({...formData, quantity: e.target.value})} required />
                </div>
              )}
              
              <div style={{display: 'flex', gap: '1rem', marginTop: '1.5rem', justifyContent: 'flex-end'}}>
                <button type="button" className="btn btn-outline" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Product</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryList;
