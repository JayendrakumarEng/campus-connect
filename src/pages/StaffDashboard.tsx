import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Navigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Calendar, BarChart3, Award, CheckCircle } from 'lucide-react';
import StaffPostsTab from '@/components/staff/StaffPostsTab';
import StaffEventsTab from '@/components/staff/StaffEventsTab';
import StaffPollsTab from '@/components/staff/StaffPollsTab';
import StaffEndorseTab from '@/components/staff/StaffEndorseTab';
import StaffApprovalTab from '@/components/staff/StaffApprovalTab';

const StaffDashboard = () => {
  const { profile } = useAuth();

  if (profile?.role !== 'staff' && profile?.role !== 'admin') {
    return <Navigate to="/feed" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container max-w-4xl py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">Staff Dashboard</h1>
          <p className="text-sm text-muted-foreground">Manage posts, events, polls, and student endorsements</p>
        </div>

        <Tabs defaultValue="posts">
          <TabsList className="mb-6 w-full flex-wrap h-auto gap-1">
            <TabsTrigger value="posts" className="flex-1 gap-1">
              <Briefcase className="h-4 w-4" /> Opportunities
            </TabsTrigger>
            <TabsTrigger value="events" className="flex-1 gap-1">
              <Calendar className="h-4 w-4" /> Events
            </TabsTrigger>
            <TabsTrigger value="polls" className="flex-1 gap-1">
              <BarChart3 className="h-4 w-4" /> Polls
            </TabsTrigger>
            <TabsTrigger value="endorse" className="flex-1 gap-1">
              <Award className="h-4 w-4" /> Endorse
            </TabsTrigger>
            <TabsTrigger value="approve" className="flex-1 gap-1">
              <FileText className="h-4 w-4" /> Approve
            </TabsTrigger>
          </TabsList>

          <TabsContent value="posts"><StaffPostsTab /></TabsContent>
          <TabsContent value="events"><StaffEventsTab /></TabsContent>
          <TabsContent value="polls"><StaffPollsTab /></TabsContent>
          <TabsContent value="endorse"><StaffEndorseTab /></TabsContent>
          <TabsContent value="approve"><StaffApprovalTab /></TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default StaffDashboard;
