import { useEffect, useState } from 'react'
import { authClient } from '../../lib/authClient'
import { api } from '../../lib/api'

function AccountSection() {
  const [email, setEmail] = useState('')
  const [newEmail, setNewEmail] = useState('')
  const [currentPw, setCurrentPw] = useState('')
  const [newPw, setNewPw] = useState('')
  const [confirmPw, setConfirmPw] = useState('')
  const [msg, setMsg] = useState('')
  const [err, setErr] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    authClient.getSession().then(({ data }) => {
      setEmail(data?.user?.email || '')
      setNewEmail(data?.user?.email || '')
    })
  }, [])

  async function updateEmail() {
    setErr(''); setMsg('')
    if (!newEmail || newEmail === email) return
    setSaving(true)
    // Better Auth's changeEmail flow (Neon Auth is built on Better Auth)
    const { error } = await authClient.changeEmail({ newEmail })
    setSaving(false)
    if (error) setErr(error.message)
    else setMsg('Confirmation link sent to your new email — click it to finish the change.')
  }

  async function updatePassword() {
    setErr(''); setMsg('')
    if (!currentPw) { setErr('Enter your current password.'); return }
    if (newPw.length < 8) { setErr('Password should be at least 8 characters.'); return }
    if (newPw !== confirmPw) { setErr('Passwords do not match.'); return }
    setSaving(true)
    const { error } = await authClient.changePassword({ newPassword: newPw, currentPassword: currentPw })
    setSaving(false)
    if (error) setErr(error.message)
    else { setMsg('Password updated ✓'); setCurrentPw(''); setNewPw(''); setConfirmPw('') }
  }

  return (
    <div className="admin-settings-card" style={{ marginTop: '24px' }}>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', color: 'var(--navy-800)', marginBottom: '6px' }}>My Account</h2>
      <p className="admin-settings-desc">Change the login email or password used to access this admin panel.</p>

      <div className="admin-field">
        <label>Login Email</label>
        <input value={newEmail} onChange={e => setNewEmail(e.target.value)} />
      </div>
      <button className="admin-btn-outline" onClick={updateEmail} disabled={saving || newEmail === email} style={{ marginBottom: '24px' }}>
        Update Email
      </button>

      <div className="admin-field">
        <label>Current Password</label>
        <input type="password" value={currentPw} onChange={e => setCurrentPw(e.target.value)} />
      </div>
      <div className="admin-field">
        <label>New Password</label>
        <input type="password" value={newPw} onChange={e => setNewPw(e.target.value)} placeholder="At least 8 characters" />
      </div>
      <div className="admin-field">
        <label>Confirm New Password</label>
        <input type="password" value={confirmPw} onChange={e => setConfirmPw(e.target.value)} />
      </div>
      <button className="admin-btn-primary" onClick={updatePassword} disabled={saving || !newPw}>
        {saving ? 'Saving...' : 'Update Password'}
      </button>

      {msg && <p style={{ color: '#1e6f6a', fontSize: '13px', marginTop: '12px' }}>{msg}</p>}
      {err && <p style={{ color: '#c0392b', fontSize: '13px', marginTop: '12px' }}>{err}</p>}
    </div>
  )
}

export default function AdminSettings() {
  const [settings, setSettings] = useState(null)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')

  useEffect(() => {
    api.get('/api/popup-settings').then(data => setSettings(data)).catch(() => {})
  }, [])

  async function save() {
    setSaving(true)
    try {
      await api.put('/api/popup-settings', settings)
      setMsg('Saved ✓')
    } catch (err) {
      setMsg('Error: ' + err.message)
    }
    setSaving(false)
    setTimeout(() => setMsg(''), 2000)
  }

  return (
    <div className="admin-panel">
      <div className="admin-panel-header">
        <h1>Settings</h1>
      </div>

      {!settings ? (
        <p className="admin-empty">Loading popup settings...</p>
      ) : (
        <div className="admin-settings-card">
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', color: 'var(--navy-800)', marginBottom: '6px' }}>Popup Settings</h2>
          <p className="admin-settings-desc">
            Controls the "Book Your Consultation" popup that appears when visitors first land on your website.
          </p>

          <label className="admin-checkbox admin-checkbox-lg">
            <input type="checkbox" checked={settings.enabled} onChange={e => setSettings(s => ({ ...s, enabled: e.target.checked }))} />
            Show popup to visitors
          </label>

          <div className="admin-field">
            <label>Delay before showing (milliseconds)</label>
            <input type="number" min="0" max="60000" step="500" value={settings.delay_ms} onChange={e => setSettings(s => ({ ...s, delay_ms: parseInt(e.target.value) || 0 }))} />
          </div>

          <div className="admin-field">
            <label>Popup Title</label>
            <input value={settings.title} onChange={e => setSettings(s => ({ ...s, title: e.target.value }))} />
          </div>

          <div className="admin-field">
            <label>Popup Message</label>
            <input value={settings.message} onChange={e => setSettings(s => ({ ...s, message: e.target.value }))} />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button className="admin-btn-primary" onClick={save} disabled={saving}>
              {saving ? 'Saving...' : 'Save Settings'}
            </button>
            {msg && <span className="admin-save-msg">{msg}</span>}
          </div>
        </div>
      )}

      <AccountSection />
    </div>
  )
}
