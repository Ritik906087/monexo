
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
  UserCheck,
  AlertCircle,
  Copy
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

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
  const { toast } = useToast();

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
  }, [router, toast]);

  const handleCopy = (text: string, label: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `${label} has been copied to clipboard.`,
    });
  };

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
    <div className="min-h-screen bg-white flex flex-col font-sans select-none text-slate-900">
      <header className="bg-white px-6 py-5 flex items-center justify-between sticky top-0 z-30 border-b border-slate-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center">
            <ShieldCheck className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-[16px] font-black text-slate-950 uppercase tracking-tight leading-none mb-0.5">Admin Terminal</h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Global Control Node</p>
          </div>
        </div>

        <Button variant="ghost" size="icon" onClick={handleLogout} className="rounded-full hover:bg-slate-50">
          <LogOut className="h-5 w-5 text-slate-500" />
        </Button>
      </header>

      <main className="flex-1 p-4 md:p-8 space-y-8 max-w-[1400px] mx-auto w-full animate-slide-up">
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: 'Total Partners', val: stats.totalUsers, icon: Users, color: 'text-slate-900' },
            { label: 'Daily Logins', val: stats.totalLoginsToday, icon: Activity, color: 'text-slate-900' },
            { label: 'Security Alerts', val: stats.suspiciousCount, icon: AlertCircle, color: stats.suspiciousCount > 0 ? 'text-red-600' : 'text-slate-900' },
            { label: 'Verified Nodes', val: stats.activeNodes, icon: UserCheck, color: 'text-slate-900' }
          ].map((stat, i) => (
            <div key={i} className="bg-white p-6 rounded-[24px] shadow-sm border border-slate-50 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{stat.label}</span>
                <stat.icon className={cn("h-4 w-4", stat.color)} />
              </div>
              <p className={cn("text-3xl font-black tracking-tighter text-slate-950")}>{stat.val}</p>
            </div>
          ))}
        </section>

        <section className="bg-white rounded-[32px] shadow-sm border border-slate-50 overflow-hidden">
          <div className="p-6 flex flex-col md:flex-row gap-4 items-center justify-between border-b border-slate-50">
            <div className="relative w-full md:w-[320px]">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input 
                placeholder="Search by ID or Phone..."
                className="pl-11 h-12 bg-slate-50/50 border-none rounded-2xl font-bold text-sm text-slate-900 placeholder:text-slate-400"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-1.5 bg-slate-50/80 p-1.5 rounded-2xl shrink-0">
               {[
                 { id: 'all', label: 'All Nodes' },
                 { id: 'suspicious', label: 'Alerts' },
                 { id: 'active', label: 'Active' }
               ].map((tab) => (
                 <button 
                  key={tab.id}
                  onClick={() => setFilterStatus(tab.id as any)}
                  className={cn(
                    "px-4 py-2.5 rounded-xl text-[10px] font-black uppercase transition-all",
                    filterStatus === tab.id ? "bg-white text-slate-950 shadow-sm" : "text-slate-500 hover:text-slate-700"
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
                <tr className="bg-slate-50/30 text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-50">
                  <th className="px-6 py-5 text-left">Partner Entity</th>
                  <th className="px-6 py-5 text-left">Network Access (IP)</th>
                  <th className="px-6 py-5 text-left">Device Node</th>
                  <th className="px-6 py-5 text-center">Sessions</th>
                  <th className="px-6 py-5 text-center">Security</th>
                  <th className="px-6 py-5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/30 transition-colors group">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-10 w-10 border border-slate-100 shadow-sm">
                          <AvatarImage src={`https://picsum.photos/seed/${user.id}/100`} />
                          <AvatarFallback className="bg-slate-100 text-[11px] font-black text-slate-900 uppercase">U</AvatarFallback>
                        </Avatar>
                        <div>
                          <p 
                            className="text-[14px] font-black text-slate-950 tracking-tight leading-none mb-1 cursor-pointer hover:text-blue-600 flex items-center gap-1.5 group/copy"
                            onClick={() => handleCopy(user.phone, 'Phone number')}
                          >
                            {user.phone}
                            <Copy className="h-3 w-3 opacity-0 group-hover/copy:opacity-100 transition-opacity" />
                          </p>
                          <p 
                            className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter cursor-pointer hover:text-blue-500 flex items-center gap-1.5 group/copy-id"
                            onClick={() => handleCopy(user.numeric_id?.toString(), 'UID')}
                          >
                            ID: {user.numeric_id}
                            <Copy className="h-2 w-2 opacity-0 group-hover/copy-id:opacity-100 transition-opacity" />
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-[13px] font-black text-emerald-600 font-mono tracking-tight">{user.last_ip || '---'}</span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        {user.device_type === 'mobile' ? <Smartphone className="h-4 w-4 text-slate-400" /> : <Monitor className="h-4 w-4 text-slate-400" />}
                        <span className="text-[11px] font-black text-slate-500 uppercase">{user.device_type || 'Cloud Node'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <span className="text-[15px] font-black text-slate-950">{user.total_logins}</span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center justify-center gap-2">
                        <div className={cn("w-2 h-2 rounded-full shadow-sm", user.status === 'suspicious' ? "bg-red-600" : "bg-emerald-500")} />
                        <span className={cn("text-[10px] font-black uppercase tracking-tight", user.status === 'suspicious' ? "text-red-600" : "text-emerald-600")}>
                          {user.status === 'suspicious' ? 'Alert' : 'Active'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <Button 
                        onClick={() => router.push(`/admin/users/${user.id}`)} 
                        variant="ghost" 
                        size="sm" 
                        className="rounded-xl hover:bg-slate-100 h-9 px-4 text-slate-950 font-black text-[11px] uppercase tracking-wider group"
                      >
                        Details
                        <ChevronRight className="ml-1 h-4 w-4 text-slate-400 group-hover:text-slate-950 transition-colors" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {filteredUsers.length === 0 && (
              <div className="py-24 text-center space-y-4">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto">
                  <Filter className="h-8 w-8 text-slate-200" />
                </div>
                <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">No matching nodes found</p>
              </div>
            )}
          </div>
        </section>
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-slate-50 px-8 py-3.5 flex items-center justify-around z-50 shadow-2xl">
        <button onClick={() => router.push('/admin')} className="flex flex-col items-center gap-1 text-slate-950">
          <Activity className="h-5 w-5" />
          <span className="text-[9px] font-black uppercase tracking-widest">Dashboard</span>
        </button>
        <button onClick={() => router.push('/admin')} className="flex flex-col items-center gap-1 text-slate-400 hover:text-slate-950 transition-colors">
          <Users className="h-5 w-5" />
          <span className="text-[9px] font-black uppercase tracking-widest">Partners</span>
        </button>
      </nav>
    </div>
  );
}
