"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Users, 
  ShieldCheck, 
  Search, 
  LogOut, 
  TrendingUp, 
  ShieldAlert, 
  Smartphone, 
  Monitor, 
  Clock,
  ArrowUpRight,
  ChevronRight,
  Activity
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';

export default function AdminDashboard() {
  const [users, setUsers] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalLoginsToday: 0,
    suspiciousCount: 0,
    uniqueIPCount: 0
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'suspicious' | 'active'>('all');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const isAdmin = localStorage.getItem('isAdminAuthenticated');
    if (isAdmin !== 'true') {
      router.push('/admin/login');
      return;
    }

    async function fetchData() {
      try {
        const { data: usersData, error: usersError } = await supabase
          .from('users')
          .select('*')
          .order('created_at', { ascending: false });

        if (usersError) throw usersError;

        const processedUsers = (usersData || []).map(user => {
          const isSuspicious = (user.unique_ips || 0) > 3;
          return {
            ...user,
            status: isSuspicious ? 'suspicious' : 'active'
          };
        });

        setUsers(processedUsers);
        
        setStats({
          totalUsers: processedUsers.length,
          totalLoginsToday: processedUsers.reduce((acc, curr) => acc + (curr.total_logins > 0 ? 1 : 0), 0),
          suspiciousCount: processedUsers.filter(u => u.status === 'suspicious').length,
          uniqueIPCount: processedUsers.reduce((acc, curr) => acc + (curr.unique_ips || 1), 0)
        });

      } catch (err: any) {
        toast({
          variant: "destructive",
          title: "Database Error",
          description: err.message
        });
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [router]);

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.phone?.includes(searchTerm) || 
      user.numeric_id?.toString().includes(searchTerm) ||
      user.last_ip?.includes(searchTerm);
    
    if (filterStatus === 'all') return matchesSearch;
    return matchesSearch && user.status === filterStatus;
  });

  const handleLogout = () => {
    localStorage.removeItem('isAdminAuthenticated');
    router.push('/admin/login');
  };

  if (loading) return (
    <div className="flex items-center justify-center h-screen bg-[#f8fafc]">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col font-sans">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-xl shadow-lg shadow-blue-200">
            <ShieldCheck className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-[17px] font-black text-slate-900 uppercase tracking-tight">Security Terminal</h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Global Node v4.0</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={handleLogout} className="rounded-full hover:bg-red-50 hover:text-red-500">
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </header>

      <main className="flex-1 p-6 space-y-6 max-w-7xl mx-auto w-full">
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-[24px] border border-slate-200 shadow-sm">
            <div className="bg-blue-50 p-3 w-fit rounded-2xl mb-4">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
            <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Total Partners</h3>
            <p className="text-3xl font-black text-slate-900">{stats.totalUsers}</p>
          </div>

          <div className="bg-white p-5 rounded-[24px] border border-slate-200 shadow-sm">
            <div className="bg-emerald-50 p-3 w-fit rounded-2xl mb-4">
              <Clock className="h-5 w-5 text-emerald-600" />
            </div>
            <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Active Today</h3>
            <p className="text-3xl font-black text-slate-900">{stats.totalLoginsToday}</p>
          </div>

          <div className={cn("p-5 rounded-[24px] border shadow-sm", stats.suspiciousCount > 0 ? "bg-red-50 border-red-100" : "bg-white")}>
            <div className={cn("p-3 w-fit rounded-2xl mb-4", stats.suspiciousCount > 0 ? "bg-red-500 text-white" : "bg-slate-50 text-slate-400")}>
              <ShieldAlert className="h-5 w-5" />
            </div>
            <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Suspicious Status</h3>
            <p className={cn("text-3xl font-black", stats.suspiciousCount > 0 ? "text-red-600" : "text-slate-900")}>{stats.suspiciousCount}</p>
          </div>

          <div className="bg-white p-5 rounded-[24px] border border-slate-200 shadow-sm">
            <div className="bg-indigo-50 p-3 w-fit rounded-2xl mb-4">
              <TrendingUp className="h-5 w-5 text-indigo-600" />
            </div>
            <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Unique IPs</h3>
            <p className="text-3xl font-black text-slate-900">{stats.uniqueIPCount}</p>
          </div>
        </section>

        <section className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-[400px]">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input 
                placeholder="Search Nodes..."
                className="pl-11 h-12 bg-slate-50 border-none rounded-2xl font-bold"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
               <Button onClick={() => setFilterStatus('all')} variant={filterStatus === 'all' ? 'default' : 'outline'} className="rounded-xl font-black uppercase text-[10px]">All</Button>
               <Button onClick={() => setFilterStatus('suspicious')} variant={filterStatus === 'suspicious' ? 'destructive' : 'outline'} className="rounded-xl font-black uppercase text-[10px]">Suspicious</Button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <th className="px-6 py-4">Partner Identity</th>
                  <th className="px-6 py-4">Network Access (IP)</th>
                  <th className="px-6 py-4">Device Node</th>
                  <th className="px-6 py-4 text-center">Sessions</th>
                  <th className="px-6 py-4 text-center">Security Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={`https://picsum.photos/seed/${user.id}/100`} />
                          <AvatarFallback>U</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-[14px] font-black text-slate-800">{user.phone}</p>
                          <p className="text-[9px] font-bold text-slate-400 uppercase">UID: {user.numeric_id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-[13px] font-mono font-bold text-slate-600">{user.last_ip || '---'}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {user.device_type === 'mobile' ? <Smartphone className="h-4 w-4 text-slate-400" /> : <Monitor className="h-4 w-4 text-slate-400" />}
                        <span className="text-[11px] font-bold text-slate-500 uppercase">{user.device_type}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-[14px] font-black text-slate-800">{user.total_logins}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center">
                        {user.status === 'suspicious' ? (
                          <Badge className="bg-red-100 text-red-600 border-red-200 uppercase text-[9px] font-black">Suspicious</Badge>
                        ) : (
                          <Badge className="bg-emerald-100 text-emerald-600 border-emerald-200 uppercase text-[9px] font-black">Verified</Badge>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button onClick={() => router.push(`/admin/users/${user.id}`)} variant="ghost" size="sm" className="rounded-xl">
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}
