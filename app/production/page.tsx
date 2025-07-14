'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useMachineStore } from '@/src/store/machine-store';
import { ScheduleBoard } from '@/src/components/schedules/ScheduleBoard';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Calendar, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { AuthLayout } from '@/src/components/layout/AuthLayout';

export default function ProductionPage() {
  const { machines, schedules, initializeData, updateScheduleProgress } = useMachineStore();

  useEffect(() => {
    if (machines.length === 0) {
      initializeData();
    }
    const interval = setInterval(() => {
      updateScheduleProgress();
    }, 2000);
    return () => clearInterval(interval);
  }, [machines.length, initializeData, updateScheduleProgress]);

  const totalSchedules = schedules.length;
  const completedSchedules = schedules.filter((s) => s.progress === 100).length;
  const inProgressSchedules = schedules.filter((s) => s.progress > 0 && s.progress < 100).length;
  const pendingSchedules = schedules.filter((s) => s.progress === 0).length;

  return (
    <AuthLayout>
      <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold">生産スケジュール管理</h1>
          <p className="text-gray-600">品目別の生産計画と進捗管理</p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">総スケジュール</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalSchedules}</div>
              <p className="text-xs text-muted-foreground">登録済み</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">進行中</CardTitle>
              <Clock className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{inProgressSchedules}</div>
              <p className="text-xs text-muted-foreground">
                {Math.round((inProgressSchedules / totalSchedules) * 100)}%
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">完了</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedSchedules}</div>
              <p className="text-xs text-muted-foreground">
                {Math.round((completedSchedules / totalSchedules) * 100)}%
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">待機中</CardTitle>
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingSchedules}</div>
              <p className="text-xs text-muted-foreground">
                {Math.round((pendingSchedules / totalSchedules) * 100)}%
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-sm text-muted-foreground"
      >
        <p>ヒント: カードをドラッグ&ドロップして優先順位を変更できます</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <ScheduleBoard schedules={schedules} machines={machines} />
      </motion.div>
    </div>
    </AuthLayout>
  );
}