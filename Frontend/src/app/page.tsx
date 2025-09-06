"use client";

import React from 'react';
import Header from '@/components/Header';
import StoryStudio from '@/components/StoryStudio';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="flex-1">
        <StoryStudio />
      </main>
    </div>
  );
}