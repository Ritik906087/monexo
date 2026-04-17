
"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Users, 
  ShieldCheck, 
  Search, 
  LogOut, 
  Smartphone, 
  Monitor, 
  ChevronRight,
  Filter,
  Activity,
  UserCheck
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';

export default function AdminDashboard() {
  const [users, setUsers] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalLoginsToday: 0,
    suspiciousCount: 0,
    activeNodes: 0
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
          activeNodes: processedUsers.filter(u => u.total_logins > 0).length
        });

      } catch (err: any) {
        toast({ variant: "destructive", title: "Sync Error", description: err.message });
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
    <div className="flex items-center justify-center h-screen bg-white">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans select-none">
      <header className="bg-white px-6 py-5 flex items-center justify-between sticky top-0 z-30 border-b border-slate-50">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-slate-950 rounded-xl flex items-center justify-center">
            <ShieldCheck className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-[15px] font-black text-slate-900 uppercase tracking-tight">Admin Terminal</h1>
            <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">Global Control Node</p>
          </div>
        </div>

        <Button variant="ghost" size="icon" onClick={handleLogout} className="rounded-full hover:bg-slate-50">
          <LogOut className="h-5 w-5 text-slate-400" />
        </Button>
      </header>

      <main className="flex-1 p-4 md:p-8 space-y-8 max-w-[1400px] mx-auto w-full animate-slide-up">
        {/* Stats Cards - Minimal White Style */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Total Partners', val: stats.totalUsers, icon: Users, color: 'text-slate-900' },
            { label: 'Daily Logins', val: stats.totalLoginsToday, icon: Activity, color: 'text-slate-900' },
            { label: 'Security Alerts', val: stats.suspiciousCount, icon: ShieldCheck, color: stats.suspiciousCount > 0 ? 'text-red-500' : 'text-slate-900' },
            { label: 'Verified Nodes', val: stats.activeNodes, icon: UserCheck, color: 'text-slate-900' }
          ].map((stat, i) => (
            <div key={i} className="bg-white p-5 rounded-[24px] shadow-[0_4px_20px_rgb(0,0,0,0.02)] border border-slate-50 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.1em]">{stat.label}</span>
                <stat.icon className={cn("h-3.5 w-3.5", stat.color)} />
              </div>
              <p className={cn("text-2xl font-black tracking-tighter", stat.color)}>{stat.val}</p>
            </div>
          ))}
        </section>

        {/* Filter & Table Section */}
        <section className="bg-white rounded-[32px] shadow-[0_8px_40px_rgb(0,0,0,0.03)] border border-slate-50 overflow-hidden">
          <div className="p-5 flex flex-col md:flex-row gap-4 items-center justify-between border-b border-slate-50">
            <div className="relative w-full md:w-[320px]">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-300" />
              <Input 
                placeholder="Search by ID or Phone..."
                className="pl-11 h-11 bg-slate-50/50 border-none rounded-2xl font-bold text-xs"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2 bg-slate-50 p-1 rounded-2xl shrink-0">
               {[
                 { id: 'all', label: 'All Nodes' },
                 { id: 'suspicious', label: 'Alerts' },
                 { id: 'active', label: 'Active' }
               ].map((tab) => (
                 <button 
                  key={tab.id}
                  onClick={() => setFilterStatus(tab.id as any)}
                  className={cn(
                    "px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all",
                    filterStatus === tab.id ? "bg-white text-slate-900 shadow-sm" : "text-slate-400 hover:text-slate-600"
                  )}
                 >
                   {tab.label}
                 </button>
               ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50/30 text-[9px] font-black text-slate-300 uppercase tracking-widest border-b border-slate-50">
                  <th className="px-6 py-4 text-left">Partner Entity</th>
                  <th className="px-6 py-4 text-left">Network Node (IP)</th>
                  <th className="px-6 py-4 text-left">Device Mode</th>
                  <th className="px-6 py-4 text-center">Sessions</th>
                  <th className="px-6 py-4 text-center">Security</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9 border border-slate-100 shadow-sm">
                          <AvatarImage src={`https://picsum.photos/seed/${user.id}/100`} />
                          <AvatarFallback className="bg-slate-50 text-[10px] font-black uppercase">U</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-[13px] font-black text-slate-800 tracking-tight">{user.phone}</p>
                          <p className="text-[8px] font-bold text-slate-300 uppercase">ID: {user.numeric_id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-[12px] font-mono font-bold text-slate-500">{user.last_ip || '---'}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {user.device_type === 'mobile' ? <Smartphone className="h-3.5 w-3.5 text-slate-300" /> : <Monitor className="h-3.5 w-3.5 text-slate-300" />}
                        <span className="text-[10px] font-bold text-slate-400 uppercase">{user.device_type || 'Node'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-[13px] font-black text-slate-800">{user.total_logins}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-1.5">
                        <div className={cn("w-1.5 h-1.5 rounded-full", user.status === 'suspicious' ? "bg-red-500 animate-pulse" : "bg-emerald-500")} />
                        <span className={cn("text-[9px] font-black uppercase tracking-tight", user.status === 'suspicious' ? "text-red-500" : "text-emerald-500")}>
                          {user.status === 'suspicious' ? 'Alert' : 'Verified'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button 
                        onClick={() => router.push(`/admin/users/${user.id}`)} 
                        variant="ghost" 
                        size="sm" 
                        className="rounded-xl hover:bg-slate-100 h-8 w-8 p-0"
                      >
                        <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-slate-900 transition-colors" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {filteredUsers.length === 0 && (
              <div className="py-20 text-center space-y-3">
                <Filter className="h-8 w-8 text-slate-100 mx-auto" />
                <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">No active nodes found</p>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Admin Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-slate-50 px-8 py-3 flex items-center justify-around z-50">
        <button className="flex flex-col items-center gap-1 text-slate-900">
          <Activity className="h-5 w-5" />
          <span className="text-[8px] font-black uppercase tracking-widest">Terminal</span>
        </button>
        <button onClick={() => router.push('/admin')} className="flex flex-col items-center gap-1 text-slate-300 hover:text-slate-900 transition-colors">
          <Users className="h-5 w-5" />
          <span className="text-[8px] font-black uppercase tracking-widest">Partners</span>
        </button>
      </nav>
    </div>
  );
}
