
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAdmin } from '@/context/AdminContext';
import { useAuth } from '@/context/AuthContext';
import { getAllUsers, updateUserSubscription, AdminUser } from '@/services/adminService';
import { ArrowLeft, Users, Shield } from 'lucide-react';
import Header from '@/components/Header';
import LoadingSpinner from '@/components/LoadingSpinner';

const AdminDashboard = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const { isAdmin, loading: adminLoading } = useAdmin();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    console.log('AdminDashboard useEffect - admin check:', { 
      adminLoading, 
      user: user?.email, 
      isAdmin 
    });

    if (!adminLoading) {
      if (!user) {
        console.log('No user, redirecting to home');
        navigate('/');
        return;
      }
      
      if (!isAdmin) {
        console.log('User is not admin, redirecting to home');
        navigate('/');
        return;
      }

      // User is admin, load users
      console.log('User is admin, loading users');
      loadUsers();
    }
  }, [isAdmin, adminLoading, user, navigate]);

  const loadUsers = async () => {
    console.log('Loading users...');
    setLoading(true);
    
    try {
      const userData = await getAllUsers();
      console.log('Users loaded in component:', userData);
      setUsers(userData);
    } catch (error) {
      console.error('Error loading users in component:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePlanUpdate = async (userId: string, newPlan: string) => {
    setUpdating(userId);
    
    const expiresAt = newPlan === 'lifetime' ? null : 
                     newPlan === 'monthly' ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() :
                     newPlan === 'daily' ? new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() : null;
    
    const success = await updateUserSubscription(userId, newPlan, true, expiresAt);
    
    if (success) {
      await loadUsers();
    }
    
    setUpdating(null);
  };

  const getPlanBadgeVariant = (planType: string) => {
    switch (planType) {
      case 'lifetime': return 'default';
      case 'monthly': return 'secondary';
      case 'daily': return 'outline';
      default: return 'destructive';
    }
  };

  if (adminLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Button>
          <div className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-wordcraft-purple" />
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{users.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Premium Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {users.filter(u => u.plan_type !== 'free').length}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Free Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {users.filter(u => u.plan_type === 'free').length}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>User Management</CardTitle>
            <CardDescription>
              Manage user subscriptions and view user information
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-8">
                <LoadingSpinner />
              </div>
            ) : users.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No users found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Email</TableHead>
                      <TableHead>Full Name</TableHead>
                      <TableHead>Signup Date</TableHead>
                      <TableHead>Plan</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Expires</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.email}</TableCell>
                        <TableCell>{user.full_name || 'N/A'}</TableCell>
                        <TableCell>
                          {new Date(user.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Badge variant={getPlanBadgeVariant(user.plan_type)}>
                            {user.plan_type}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={user.is_active ? 'default' : 'destructive'}>
                            {user.is_active ? 'Active' : 'Inactive'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {user.expires_at 
                            ? new Date(user.expires_at).toLocaleDateString()
                            : 'Never'
                          }
                        </TableCell>
                        <TableCell>
                          <Select
                            value={user.plan_type}
                            onValueChange={(value) => handlePlanUpdate(user.id, value)}
                            disabled={updating === user.id}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="free">Free</SelectItem>
                              <SelectItem value="daily">Daily</SelectItem>
                              <SelectItem value="monthly">Monthly</SelectItem>
                              <SelectItem value="lifetime">Lifetime</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
