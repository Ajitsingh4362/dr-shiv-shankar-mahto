import { useEffect, useState } from 'react'
import { api, uploadImage } from '../../lib/api'

export default function AdminGallery() {
  const [items, setItems] = useState([])
  const [cats, setCats] = useState([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [newCat, setNewCat] = useState('')

  useEffect(() => { fetchAll() }, [])

  async function fetchAll() {
    const [g, c] = await Promise.all([
      api.get('/api/gallery?all=1'),
      api.get('/api/gallery-categories'),
    ])
    setItems(g || [])
    setCats(c || [])
    setLoading(false)
  }

  async function handleUpload(e) {
    const files = Array.from(e.target.files || [])
    if (!files.length) return
    setUploading(true)
    for (const file of files) {
      try {
        const publicUrl = await uploadImage(file, 'gallery')
        await api.post('/api/gallery', {
          image_url: publicUrl,
          title: file.name.replace(/\.[^.]+$/, ''),
          category: cats[0]?.slug || 'general',
          sort_order: items.length,
          visible: true,
        })
      } catch (err) {
        console.error('Gallery upload failed', err)
        alert('Upload failed for ' + file.name)
      }
    }
    setUploading(false)
    fetchAll()
  }

  async function updateItem(id, patch) {
    setItems(prev => prev.map(i => i.id === id ? { ...i, ...patch } : i))
    await api.put(`/api/gallery?id=${id}`, patch)
  }

  async function deleteItem(id) {
    if (!confirm('Delete this image?')) return
    await api.del(`/api/gallery?id=${id}`)
    fetchAll()
  }

  async function addCategory() {
    if (!newCat.trim()) return
    const slug = newCat.toLowerCase().replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-')
    await api.post('/api/gallery-categories', { name: newCat.trim(), slug, sort_order: cats.length })
    setNewCat('')
    fetchAll()
  }

  return (
    <div className="admin-panel">
      <div className="admin-panel-header">
        <h1>Gallery</h1>
        <label className="admin-btn-primary admin-upload-label">
          {uploading ? 'Uploading...' : '+ Upload Images'}
          <input type="file" accept="image/*" multiple onChange={handleUpload} hidden />
        </label>
      </div>

      <div className="admin-cat-manager">
        <span>Categories:</span>
        {cats.map(c => <span key={c.id} className="admin-tag">{c.name}</span>)}
        <input placeholder="New category name" value={newCat} onChange={e => setNewCat(e.target.value)} onKeyDown={e => e.key === 'Enter' && addCategory()} />
        <button className="admin-btn-outline admin-btn-sm" onClick={addCategory}>Add</button>
      </div>

      {loading ? <p className="admin-empty">Loading...</p> : items.length === 0 ? (
        <p className="admin-empty">No images yet. Upload your first batch!</p>
      ) : (
        <div className="admin-gallery-grid">
          {items.map(item => (
            <div key={item.id} className="admin-gallery-item">
              <img src={item.image_url} alt={item.title || ''} />
              <div className="admin-gallery-controls">
                <input
                  className="admin-gallery-title"
                  value={item.title || ''}
                  placeholder="Title / caption"
                  onChange={e => updateItem(item.id, { title: e.target.value })}
                />
                <select value={item.category || ''} onChange={e => updateItem(item.id, { category: e.target.value })}>
                  {cats.map(c => <option key={c.id} value={c.slug}>{c.name}</option>)}
                </select>
                <div className="admin-gallery-row2">
                  <label className="admin-checkbox">
                    <input type="checkbox" checked={item.visible} onChange={e => updateItem(item.id, { visible: e.target.checked })} />
                    Visible
                  </label>
                  <button className="admin-btn-danger admin-btn-sm" onClick={() => deleteItem(item.id)}>Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
