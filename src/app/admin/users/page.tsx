'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Profile } from '@/lib/types';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ type: string; message: string } | null>(null);
  const supabase = createClient();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });
    setUsers(data || []);
    setLoading(false);
  };

  const updateRole = async (userId: string, newRole: string) => {
    const { error } = await supabase
      .from('profiles')
      .update({ role: newRole })
      .eq('id', userId);

    if (error) {
      setToast({ type: 'error', message: 'Gagal mengubah role: ' + error.message });
    } else {
      setToast({ type: 'success', message: 'Role berhasil diperbarui!' });
      fetchUsers();
    }
    setTimeout(() => setToast(null), 3000);
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}>
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div>
      {toast && (
        <div className={`toast toast-${toast.type}`}>
          {toast.type === 'success' ? '✅' : '❌'} {toast.message}
        </div>
      )}

      <div className="page-header">
        <h1 className="page-title">👥 Kelola Pengguna</h1>
        <p className="page-subtitle">Manajemen akun pengguna dan pengaturan role</p>
      </div>

      <div className="card">
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Nama</th>
                <th>Email</th>
                <th>Instansi/OPD</th>
                <th>Role</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u, i) => (
                <tr key={u.id}>
                  <td>{i + 1}</td>
                  <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                    {u.full_name || '-'}
                  </td>
                  <td>{u.email}</td>
                  <td>{u.nama_instansi || '-'}</td>
                  <td>
                    <span className={`badge ${
                      u.role === 'admin' ? 'badge-level-5'
                        : u.role === 'operator' ? 'badge-level-4'
                          : 'badge-level-2'
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td>
                    <select
                      className="form-select"
                      value={u.role}
                      onChange={(e) => updateRole(u.id, e.target.value)}
                      style={{ width: 130, padding: '6px 10px', fontSize: 12 }}
                    >
                      <option value="opd">OPD</option>
                      <option value="operator">Operator</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
