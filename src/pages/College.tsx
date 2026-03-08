import { useState } from 'react';
import Navbar from '@/components/Navbar';
import CollegeHero from '@/components/college/CollegeHero';
import CollegeStats from '@/components/college/CollegeStats';
import CollegeRatings from '@/components/college/CollegeRatings';
import CollegePlacements from '@/components/college/CollegePlacements';
import CollegeDepartments from '@/components/college/CollegeDepartments';
import CollegeCampus from '@/components/college/CollegeCampus';
import CollegeRecruiters from '@/components/college/CollegeRecruiters';
import CollegeWhyChoose from '@/components/college/CollegeWhyChoose';
import CollegeCTA from '@/components/college/CollegeCTA';

const College = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <CollegeHero />
      <CollegeStats />
      <CollegeRatings />
      <CollegeWhyChoose />
      <CollegePlacements />
      <CollegeDepartments />
      <CollegeCampus />
      <CollegeRecruiters />
      <CollegeCTA />
    </div>
  );
};

export default College;
