import React from 'react';
import { ArrowLeft, Mail } from 'lucide-react';
import { Button } from '../ui/button';

export function ContactPage({ onBack }: { onBack: () => void }) {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl w-full space-y-8">
        <Button variant="ghost" onClick={onBack} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
        </Button>
        <h1 className="text-4xl font-bold tracking-tight">Contact Us</h1>
        <div className="prose dark:prose-invert max-w-none text-muted-foreground">
          <p className="text-lg">
            Have a question, feedback, or need support? We're here to help!
          </p>
          <div className="mt-8 flex items-center gap-4 bg-secondary/50 p-6 rounded-lg border border-border">
            <div className="bg-primary/10 p-3 rounded-full">
              <Mail className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground m-0">Email Support</h3>
              <p className="m-0 text-sm">Drop us an email at <a href="mailto:lua551719@gmail.com" className="text-primary hover:underline">lua551719@gmail.com</a> and our team will get back to you within 24 hours.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
