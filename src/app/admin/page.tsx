
"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Users, 
  LayoutDashboard, 
  Search, 
  ChevronRight, 
  TrendingUp, 
  Wallet,
  LogOut,
  ShieldCheck,
  UserCheck
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from '@/lib/utils';

export default function AdminDashboard() {
  const [users, setUsers] = useState<any[]>([]);
  const [stats, setStats] = useState({ totalUsers: 0, totalBalance: 0 });
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const isAdmin = localStorage.getItem('isAdminAuthenticated');
    if (isAdmin !== 'true') {
      router.push('/admin/login');
      return;
    }

    async function fetchData() {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (data) {
        setUsers(data);
        const totalBal = data.reduce((acc, user) => acc + (user.itoken_balance || 0), 0);
        setStats({
          totalUsers: data.length,
          totalBalance: totalBal
        });
      }
      setLoading(false);
    }

    fetchData();
  }, [router]);

  const filteredUsers = users.filter(user => 
    user.phone?.includes(searchTerm) || 
    user.numeric_id?.toString().includes(searchTerm)
  );

  const handleLogout = () => {
    localStorage.removeItem('isAdminAuthenticated');
    router.push('/admin/login');
  };

  if (loading) return (
    <div className="flex items-center justify-center h-full bg-[#f8fafc]">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-[#f8fafc] animate-slide-up overflow-hidden">
      {/* Admin Header */}
      <div className="bg-white px-6 py-4 flex items-center justify-between border-b border-slate-100 shrink-0">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 p-1.5 rounded-lg shadow-sm">
            <ShieldCheck className="h-4 w-4 text-white" />
          </div>
          <h1 className="text-[16px] font-black text-slate-800 uppercase tracking-tight">Admin Panel</h1>
        </div>
        <button 
          onClick={handleLogout}
          className="bg-slate-50 p-2 rounded-full border border-slate-100 active:scale-90 transition-all"
        >
          <LogOut className="h-4 w-4 text-slate-500" />
        </button>
      </div>

      <Tabs defaultValue="dashboard" className="flex-1 flex flex-col overflow-hidden">
        <div className="bg-white border-b border-slate-50 shrink-0">
          <TabsList className="w-full bg-transparent h-12 rounded-none p-0 flex">
            <TabsTrigger 
              value="dashboard" 
              className="flex-1 rounded-none data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-blue-500 text-[11px] font-black uppercase tracking-widest text-slate-400 data-[state=active]:text-blue-600"
            >
              Dashboard
            </TabsTrigger>
            <TabsTrigger 
              value="users" 
              className="flex-1 rounded-none data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-blue-500 text-[11px] font-black uppercase tracking-widest text-slate-400 data-[state=active]:text-blue-600"
            >
              Users List
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="flex-1 overflow-y-auto smooth-scroll p-4 pb-24">
          <TabsContent value="dashboard" className="m-0 space-y-4">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white p-5 rounded-[28px] border border-slate-100 shadow-sm flex flex-col gap-2 relative overflow-hidden group">
                <div className="absolute -right-2 -top-2 bg-blue-50 p-4 rounded-full opacity-50 group-hover:scale-110 transition-transform">
                  <Users className="h-8 w-8 text-blue-500/20" />
                </div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Users</span>
                <span className="text-2xl font-black text-slate-800">{stats.totalUsers}</span>
                <div className="flex items-center gap-1 text-[10px] font-bold text-green-500">
                  <TrendingUp className="h-3 w-3" />
                  <span>Growth Active</span>
                </div>
              </div>

              <div className="bg-white p-5 rounded-[28px] border border-slate-100 shadow-sm flex flex-col gap-2 relative overflow-hidden group">
                <div className="absolute -right-2 -top-2 bg-emerald-50 p-4 rounded-full opacity-50 group-hover:scale-110 transition-transform">
                  <Wallet className="h-8 w-8 text-emerald-500/20" />
                </div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Global Balance</span>
                <span className="text-2xl font-black text-slate-800">₹{stats.totalBalance.toLocaleString()}</span>
                <div className="flex items-center gap-1 text-[10px] font-bold text-blue-500">
                  <UserCheck className="h-3 w-3" />
                  <span>Live Tokens</span>
                </div>
              </div>
            </div>

            {/* Recent Users Chart/List Placeholder */}
            <div className="bg-white rounded-[28px] p-5 border border-slate-100 shadow-sm">
              <h3 className="text-[13px] font-black text-slate-800 uppercase tracking-tight mb-4">Newest Partners</h3>
              <div className="space-y-3">
                {users.slice(0, 5).map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-xl transition-colors">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 border-2 border-slate-50">
                        <AvatarImage src={`https://picsum.photos/seed/${user.id}/100`} />
                        <AvatarFallback className="bg-blue-100 text-blue-600 font-bold text-[10px]">U</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="text-[12px] font-black text-slate-700">{user.phone}</span>
                        <span className="text-[10px] font-bold text-slate-400 tracking-tighter">UID: {user.numeric_id}</span>
                      </div>
                    </div>
                    <span className="text-[12px] font-black text-blue-600">₹{user.itoken_balance}</span>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="users" className="m-0 space-y-4">
            {/* Search Box */}
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input 
                placeholder="Search by Mobile or UID..."
                className="pl-10 h-12 bg-white border-slate-100 rounded-2xl text-[13px] font-bold shadow-sm focus-visible:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Users List */}
            <div className="space-y-3">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <div 
                    key={user.id} 
                    className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex items-center justify-between active:scale-[0.98] transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div className="relative">
                         <Avatar className="h-12 w-12 border-2 border-slate-50">
                          <AvatarImage src={`https://picsum.photos/seed/${user.id}/100`} />
                          <AvatarFallback className="font-bold">U</AvatarFallback>
                        </Avatar>
                        <div className="absolute -bottom-1 -right-1 bg-green-500 w-3.5 h-3.5 rounded-full border-2 border-white"></div>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[14px] font-black text-slate-800 tracking-tight leading-none mb-1">{user.phone}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 px-1.5 py-0.5 rounded">UID: {user.numeric_id}</span>
                          <span className="text-[9px] font-black text-emerald-500">₹{user.itoken_balance?.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                    <Button 
                      onClick={() => router.push(`/admin/users/${user.id}`)}
                      size="sm" 
                      className="bg-blue-50 hover:bg-blue-100 text-blue-600 font-black text-[10px] uppercase h-8 px-4 rounded-xl border-none shadow-none"
                    >
                      View
                    </Button>
                  </div>
                ))
              ) : (
                <div className="py-12 text-center">
                  <span className="text-[12px] font-bold text-slate-300 uppercase tracking-widest">No users found</span>
                </div>
              )}
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
