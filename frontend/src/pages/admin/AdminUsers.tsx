import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { api } from '../../services/api';
import { Users, UserPlus, Search, Shield, GraduationCap, UserCheck, CheckCircle2 } from 'lucide-react';

export const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');

  // Provision User Modal State
  const [isProvisionOpen, setIsProvisionOpen] = useState(false);
  const [provisionForm, setProvisionForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'FACULTY',
    department: 'Computer Science & Engineering',
    studentId: '',
    facultyId: '',
    designation: 'Assistant Professor',
    semester: '6',
  });
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.admin.getUsers();
      if (res.success && res.users) {
        setUsers(res.users);
      }
    } catch (err) {
      console.warn('Using user list fallback');
      setUsers([
        { id: 'u-1', name: 'Dr. Vikram Sethi', email: 'admin@academia.edu', role: 'ADMIN', status: 'ACTIVE', department: 'Academic Affairs' },
        { id: 'u-2', name: 'Prof. Rajesh Sharma', email: 'prof.sharma@academia.edu', role: 'FACULTY', status: 'ACTIVE', department: 'Computer Science & Engineering', facultyId: 'FAC2026CS01' },
        { id: 'u-3', name: 'Dr. Ananya Mukherjee', email: 'prof.ananya@academia.edu', role: 'FACULTY', status: 'ACTIVE', department: 'Computer Science & Engineering', facultyId: 'FAC2026CS02' },
        { id: 'u-4', name: 'Ayush Srivastava', email: 'ayush.student@academia.edu', role: 'STUDENT', status: 'ACTIVE', department: 'Computer Science & Engineering', studentId: 'STU2026CS042' },
        { id: 'u-5', name: 'Priya Verma', email: 'priya.verma@academia.edu', role: 'STUDENT', status: 'ACTIVE', department: 'Computer Science & Engineering', studentId: 'STU2026CS015' },
        { id: 'u-6', name: 'Rohit Kumar', email: 'rohit.kumar@academia.edu', role: 'STUDENT', status: 'ACTIVE', department: 'Computer Science & Engineering', studentId: 'STU2026CS089' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleStatus = async (user: any) => {
    const newStatus = user.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    try {
      await api.admin.updateUserStatus(user.id, { status: newStatus });
      setNotice(`Account for ${user.name} set to ${newStatus}.`);
      await fetchUsers();
      setTimeout(() => setNotice(null), 4000);
    } catch (err: any) {
      alert(err.message || 'Failed to update user status');
    }
  };

  const handleProvisionUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.admin.createUser(provisionForm);
      setNotice(`New ${provisionForm.role} account provisioned successfully!`);
      setIsProvisionOpen(false);
      await fetchUsers();
      setTimeout(() => setNotice(null), 4000);
    } catch (err: any) {
      alert(err.message || 'Failed to provision account');
    } finally {
      setSaving(false);
    }
  };

  const filtered = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    if (roleFilter === 'ALL') return matchesSearch;
    return matchesSearch && u.role === roleFilter;
  });

  return (
    <DashboardLayout title="User Directory & Role Provisioning" subtitle="Authorized administrative identity and access management">
      {/* Success Notification */}
      {notice && (
        <div className="p-4 rounded-xl bg-[#E7F8F2] border border-[#BAEEDC] text-xs font-bold text-brand-emerald flex items-center justify-between shadow-sm animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
            <span>{notice}</span>
          </div>
          <button onClick={() => setNotice(null)} className="text-brand-emerald">
            ✕
          </button>
        </div>
      )}

      {/* Control Bar */}
      <Card variant="white" padding="sm" className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-brand-border bg-[#FAF9FE] text-xs text-brand-text placeholder-brand-muted focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
          />
          <Search className="w-4 h-4 text-brand-muted absolute left-3 top-2.5" />
        </div>

        {/* Role Filters & Provision Button */}
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-brand-bg border border-brand-border">
            {['ALL', 'STUDENT', 'FACULTY', 'ADMIN'].map((r) => (
              <button
                key={r}
                onClick={() => setRoleFilter(r)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  roleFilter === r
                    ? 'bg-violet-gradient text-white shadow-sm'
                    : 'text-brand-muted hover:text-brand-text'
                }`}
              >
                {r}
              </button>
            ))}
          </div>

          <Button
            size="md"
            onClick={() => {
              setProvisionForm({
                firstName: '',
                lastName: '',
                email: '',
                password: 'InitialPassword@123',
                role: 'FACULTY',
                department: 'Computer Science & Engineering',
                studentId: `STU${Date.now().toString().slice(-4)}`,
                facultyId: `FAC${Date.now().toString().slice(-4)}`,
                designation: 'Assistant Professor',
                semester: '6',
              });
              setIsProvisionOpen(true);
            }}
            leftIcon={<UserPlus className="w-4 h-4" />}
          >
            Provision Account
          </Button>
        </div>
      </Card>

      {/* Users Table */}
      <Card variant="white" padding="md" className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-brand-text flex items-center gap-2">
            <Users className="w-5 h-5 text-brand-primary" />
            Institutional Accounts Directory
          </h3>
          <span className="text-xs font-semibold text-brand-muted">{filtered.length} Users Listed</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-brand-border text-brand-muted text-[11px] uppercase tracking-wider">
                <th className="pb-3 font-semibold">User</th>
                <th className="pb-3 font-semibold">Role</th>
                <th className="pb-3 font-semibold">Identifier</th>
                <th className="pb-3 font-semibold">Department</th>
                <th className="pb-3 font-semibold">Status</th>
                <th className="pb-3 font-semibold text-right">Access Control</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border">
              {filtered.map((u) => (
                <tr key={u.id} className="hover:bg-brand-bg/50 transition-colors">
                  <td className="py-3">
                    <strong className="text-brand-text block">{u.name}</strong>
                    <span className="text-brand-muted text-[11px]">{u.email}</span>
                  </td>
                  <td className="py-3">
                    <Badge
                      variant={u.role === 'ADMIN' ? 'indigo' : u.role === 'FACULTY' ? 'amber' : 'lavender'}
                      size="sm"
                    >
                      {u.role}
                    </Badge>
                  </td>
                  <td className="py-3 font-mono font-bold text-brand-text">
                    {u.studentId || u.facultyId || 'INST-ADMIN'}
                  </td>
                  <td className="py-3 text-brand-muted">{u.department || 'Institutional Faculty'}</td>
                  <td className="py-3">
                    <Badge variant={u.status === 'ACTIVE' ? 'emerald' : 'red'} size="sm">
                      {u.status}
                    </Badge>
                  </td>
                  <td className="py-3 text-right">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleToggleStatus(u)}
                    >
                      {u.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Provision User Modal */}
      <Modal
        isOpen={isProvisionOpen}
        onClose={() => setIsProvisionOpen(false)}
        title="Provision Authorized User Account"
        description="Creates institutional credentials with role-based access enforcement"
      >
        <form onSubmit={handleProvisionUser} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-brand-text mb-1">First Name</label>
              <input
                type="text"
                required
                value={provisionForm.firstName}
                onChange={(e) => setProvisionForm({ ...provisionForm, firstName: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-brand-border bg-[#FBFBFE] text-brand-text"
              />
            </div>
            <div>
              <label className="block font-bold text-brand-text mb-1">Last Name</label>
              <input
                type="text"
                required
                value={provisionForm.lastName}
                onChange={(e) => setProvisionForm({ ...provisionForm, lastName: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-brand-border bg-[#FBFBFE] text-brand-text"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-brand-text mb-1">Institutional Email</label>
            <input
              type="email"
              required
              value={provisionForm.email}
              onChange={(e) => setProvisionForm({ ...provisionForm, email: e.target.value })}
              className="w-full p-2.5 rounded-xl border border-brand-border bg-[#FBFBFE] text-brand-text"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-brand-text mb-1">Assigned Institutional Role</label>
              <select
                value={provisionForm.role}
                onChange={(e) => setProvisionForm({ ...provisionForm, role: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-brand-border bg-[#FBFBFE] text-brand-text font-bold"
              >
                <option value="FACULTY">FACULTY (Instructor)</option>
                <option value="STUDENT">STUDENT (Learner)</option>
                <option value="ADMIN">ADMIN (System Administrator)</option>
              </select>
            </div>
            <div>
              <label className="block font-bold text-brand-text mb-1">Temporary Initial Password</label>
              <input
                type="text"
                required
                value={provisionForm.password}
                onChange={(e) => setProvisionForm({ ...provisionForm, password: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-brand-border bg-[#FBFBFE] text-brand-text font-mono"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsProvisionOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" size="sm" isLoading={saving}>
              Create User Account
            </Button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  );
};
