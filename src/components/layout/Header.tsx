'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Factory } from 'lucide-react';

export function Header() {
  return (
    <motion.header 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="border-b border-border bg-background/80 backdrop-blur-lg"
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Factory className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-xl font-bold">Smart PMS</h1>
              <p className="text-sm text-muted-foreground">Production Management System</p>
            </div>
          </div>
          <div className="text-sm text-muted-foreground">
            {new Date().toLocaleString('ja-JP')}
          </div>
        </div>
      </div>
    </motion.header>
  );
}