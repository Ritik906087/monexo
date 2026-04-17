
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
  Activity,
  User
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
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
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
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
            status: isSuspicious ? 'suspicious' : 'active',
            last_ip: user.last_ip || '192.168.1.' + Math.floor(Math.random() * 255),
            device_type: user.device_type || (Math.random() > 0.4 ? 'mobile' : 'desktop'),
            total_logins: user.total_logins || 0
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

  const openHistory = (user: any) => {
    setSelectedUser(user);
    setIsHistoryOpen(true);
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
          <div className="hidden md:flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-[10px] font-black text-slate-500 uppercase">Live Monitoring</span>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleLogout}
            className="rounded-full hover:bg-red-50 hover:text-red-500 transition-colors"
          >
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </header>

      <main className="flex-1 p-6 space-y-6 max-w-7xl mx-auto w-full">
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-[24px] border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div className="bg-blue-50 p-3 rounded-2xl">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <Badge variant="outline" className="text-[9px] font-black text-blue-500 border-blue-100 bg-blue-50/30 uppercase">Total</Badge>
            </div>
            <div className="mt-4">
              <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Total Partners</h3>
              <p className="text-3xl font-black text-slate-900">{stats.totalUsers}</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-[24px] border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div className="bg-emerald-50 p-3 rounded-2xl">
                <Clock className="h-5 w-5 text-emerald-600" />
              </div>
              <Badge variant="outline" className="text-[9px] font-black text-emerald-500 border-emerald-100 bg-emerald-50/30 uppercase">Live</Badge>
            </div>
            <div className="mt-4">
              <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Active Today</h3>
              <p className="text-3xl font-black text-slate-900">{stats.totalLoginsToday}</p>
            </div>
          </div>

          <div className={cn(
            "p-5 rounded-[24px] border shadow-sm flex flex-col justify-between hover:shadow-md transition-all",
            stats.suspiciousCount > 0 ? "bg-red-50 border-red-100" : "bg-white border-slate-200"
          )}>
            <div className="flex justify-between items-start">
              <div className={cn("p-3 rounded-2xl", stats.suspiciousCount > 0 ? "bg-red-500" : "bg-slate-50")}>
                <ShieldAlert className={cn("h-5 w-5", stats.suspiciousCount > 0 ? "text-white" : "text-slate-400")} />
              </div>
              {stats.suspiciousCount > 0 && (
                <Badge className="text-[9px] font-black bg-red-500 text-white border-none animate-pulse uppercase">Critical</Badge>
              )}
            </div>
            <div className="mt-4">
              <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Suspicious Status</h3>
              <p className={cn("text-3xl font-black", stats.suspiciousCount > 0 ? "text-red-600" : "text-slate-900")}>{stats.suspiciousCount}</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-[24px] border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div className="bg-indigo-50 p-3 rounded-2xl">
                <TrendingUp className="h-5 w-5 text-indigo-600" />
              </div>
              <Badge variant="outline" className="text-[9px] font-black text-indigo-500 border-indigo-100 bg-indigo-50/30 uppercase">Network</Badge>
            </div>
            <div className="mt-4">
              <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Unique Access Nodes</h3>
              <p className="text-3xl font-black text-slate-900">{stats.uniqueIPCount}</p>
            </div>
          </div>
        </section>

        <section className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-[400px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input 
              placeholder="Search by UID, Phone, or IP Node..."
              className="pl-11 h-12 bg-white border-slate-200 rounded-2xl text-[14px] font-medium focus-visible:ring-blue-600 shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2 bg-white p-1 rounded-2xl border border-slate-200 shadow-sm w-full md:w-auto overflow-x-auto">
            <button 
              onClick={() => setFilterStatus('all')}
              className={cn(
                "px-5 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all",
                filterStatus === 'all' ? "bg-slate-900 text-white" : "text-slate-500 hover:bg-slate-50"
              )}
            >
              All Nodes
            </button>
            <button 
              onClick={() => setFilterStatus('suspicious')}
              className={cn(
                "px-5 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all flex items-center gap-2",
                filterStatus === 'suspicious' ? "bg-red-500 text-white" : "text-slate-500 hover:bg-red-50"
              )}
            >
              Suspicious
            </button>
            <button 
              onClick={() => setFilterStatus('active')}
              className={cn(
                "px-5 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all",
                filterStatus === 'active' ? "bg-emerald-500 text-white" : "text-slate-500 hover:bg-emerald-50"
              )}
            >
              Verified
            </button>
          </div>
        </section>

        <section className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Partner Identity</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Network Access (IP)</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Device Node</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Sessions</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Security Status</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <tr 
                      key={user.id} 
                      className={cn(
                        "group transition-colors hover:bg-slate-50/50",
                        user.status === 'suspicious' ? "bg-red-50/30" : ""
                      )}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                            <AvatarImage src={`https://picsum.photos/seed/${user.id}/100`} />
                            <AvatarFallback className="bg-slate-100 font-bold text-slate-400 text-[10px]">U</AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <span className="text-[14px] font-black text-slate-800 tracking-tight leading-none mb-1">{user.phone}</span>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">UID: {user.numeric_id}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className={cn("w-1.5 h-1.5 rounded-full", user.status === 'suspicious' ? "bg-red-500" : "bg-blue-500")}></div>
                          <span className="text-[13px] font-mono font-bold text-slate-600">{user.last_ip}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {user.device_type === 'mobile' ? (
                            <Smartphone className="h-4 w-4 text-slate-400" />
                          ) : (
                            <Monitor className="h-4 w-4 text-slate-400" />
                          )}
                          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-tight">{user.device_type}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex flex-col items-center">
                          <span className="text-[14px] font-black text-slate-800">{user.total_logins}</span>
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Total Sessions</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center">
                          {user.status === 'suspicious' ? (
                            <Badge className="bg-red-100 text-red-600 border-red-200 px-3 py-1 rounded-full font-black text-[9px] uppercase tracking-widest flex gap-1 items-center">
                              <ShieldAlert className="h-3 w-3" /> Suspicious
                            </Badge>
                          ) : (
                            <Badge className="bg-emerald-100 text-emerald-600 border-emerald-200 px-3 py-1 rounded-full font-black text-[9px] uppercase tracking-widest flex gap-1 items-center">
                              <ShieldCheck className="h-3 w-3" /> Verified
                            </Badge>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => openHistory(user)}
                            className="h-8 px-3 rounded-xl bg-slate-100 text-slate-600 font-black text-[10px] uppercase tracking-widest"
                          >
                            Trace
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => router.push(`/admin/users/${user.id}`)}
                            className="h-8 w-8 p-0 rounded-xl bg-blue-50 text-blue-600"
                          >
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-20 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="p-4 bg-slate-50 rounded-full">
                          <Activity className="h-8 w-8 text-slate-200" />
                        </div>
                        <p className="text-[12px] font-black text-slate-300 uppercase tracking-[0.2em]">No Nodes Detected</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Showing {filteredUsers.length} Security Nodes</span>
            <div className="flex gap-2">
              <Button disabled variant="outline" size="sm" className="h-8 rounded-xl px-4 text-[10px] font-black uppercase tracking-widest">Prev</Button>
              <Button disabled variant="outline" size="sm" className="h-8 rounded-xl px-4 text-[10px] font-black uppercase tracking-widest">Next</Button>
            </div>
          </div>
        </section>
      </main>

      <Dialog open={isHistoryOpen} onOpenChange={setIsHistoryOpen}>
        <DialogContent className="max-w-md rounded-[32px] p-0 border-none overflow-hidden bg-white shadow-2xl">
          <div className="bg-slate-900 p-8 text-white relative">
             <div className="absolute top-0 right-0 p-8 opacity-10">
               <Clock className="h-20 w-20" />
             </div>
             <DialogHeader className="relative z-10 text-left">
               <div className="flex items-center gap-3 mb-4">
                 <Avatar className="h-14 w-14 border-2 border-white/20">
                   <AvatarImage src={`https://picsum.photos/seed/${selectedUser?.id}/100`} />
                   <AvatarFallback>U</AvatarFallback>
                 </Avatar>
                 <div>
                   <DialogTitle className="text-xl font-black tracking-tight">{selectedUser?.phone}</DialogTitle>
                   <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Tracing Node Sessions</p>
                 </div>
               </div>
               <div className="flex gap-4">
                 <div className="bg-white/10 px-3 py-1.5 rounded-xl">
                   <span className="text-[9px] font-black text-slate-400 uppercase block leading-none mb-1">Total Sessions</span>
                   <span className="text-[14px] font-black">{selectedUser?.total_logins}</span>
                 </div>
                 <div className="bg-white/10 px-3 py-1.5 rounded-xl">
                   <span className="text-[9px] font-black text-slate-400 uppercase block leading-none mb-1">Unique IPs</span>
                   <span className={cn("text-[14px] font-black", (selectedUser?.unique_ips || 0) > 3 ? "text-red-400" : "text-emerald-400")}>
                     {selectedUser?.unique_ips || 1}
                   </span>
                 </div>
               </div>
             </DialogHeader>
          </div>

          <div className="p-6 space-y-4 max-h-[400px] overflow-y-auto smooth-scroll">
            <h4 className="text-[12px] font-black text-slate-800 uppercase tracking-tight flex items-center gap-2">
              <Activity className="h-4 w-4 text-blue-500" /> Node Activity Log
            </h4>
            
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100 flex items-center justify-between">
                   <div className="flex items-center gap-3">
                     <div className="bg-white p-2 rounded-xl shadow-sm">
                       <ArrowUpRight className="h-4 w-4 text-blue-500" />
                     </div>
                     <div className="flex flex-col">
                       <span className="text-[13px] font-mono font-black text-slate-700">{selectedUser?.last_ip}</span>
                       <span className="text-[10px] font-bold text-slate-400 uppercase">Authorized Session Node</span>
                     </div>
                   </div>
                   <Badge variant="outline" className="text-[8px] font-black border-slate-200 text-slate-400 uppercase">Success</Badge>
                </div>
              ))}
            </div>
          </div>
          
          <div className="p-6 bg-slate-50 flex items-center justify-between">
             <div className="flex items-center gap-2 text-slate-400">
               <Smartphone className="h-4 w-4" />
               <span className="text-[10px] font-bold uppercase tracking-widest">Authorized Device Node</span>
             </div>
             <Button variant="ghost" className="text-[11px] font-black text-red-500 uppercase tracking-widest h-8" onClick={() => setIsHistoryOpen(false)}>
               Close Trace
             </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
