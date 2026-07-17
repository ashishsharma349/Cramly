import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '../ui/button';

export function AboutPage({ onBack }: { onBack: () => void }) {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl w-full space-y-8">
        <Button variant="ghost" onClick={onBack} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
        </Button>
        <h1 className="text-4xl font-bold tracking-tight">About Cramly</h1>
        <div className="prose dark:prose-invert max-w-none text-muted-foreground">
          <p className="text-lg">
            Cramly is your ultimate AI-powered study companion. We understand that parsing through hundreds of pages of textbooks and notes can be overwhelming.
          </p>
          <p className="text-lg mt-4">
            That's why we built a smart tool that instantly converts any topic or subject into a concise, easy-to-read, and downloadable cheatsheet. Whether you are a school student preparing for exams or a college student tackling complex subjects, our platform helps you learn faster, revise smarter, and save countless hours.
          </p>
        </div>
      </div>
    </div>
  );
}
