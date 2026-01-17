// components/dashboard/recent-activity.tsx
"use client";

import { formatDistanceToNow } from "date-fns";
import { motion } from "framer-motion";
import { Clock, FileText } from "lucide-react";
import Link from "next/link";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Document {
  id: string;
  title: string;
  createdAt: Date;
  language: string | null;
}

export function RecentActivity({ documents }: { documents: Document[] }) {
  if (documents.length === 0) {
    return (
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <FileText className="text-muted-foreground mb-4 h-12 w-12" />
              <p className="text-muted-foreground text-sm">
                No documents yet. Upload your first file to get started!
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {documents.map((doc) => (
            <Link
              key={doc.id}
              href={`/documents/${doc.id}`}
              className="hover:bg-muted flex items-start gap-3 rounded-lg p-3 transition-colors"
            >
              <div className="rounded-lg bg-blue-50 p-2 dark:bg-blue-950">
                <FileText className="h-4 w-4 text-blue-600" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">{doc.title}</p>
                <div className="text-muted-foreground mt-1 flex items-center gap-2 text-xs">
                  <Clock className="h-3 w-3" />
                  {formatDistanceToNow(new Date(doc.createdAt), { addSuffix: true })}
                </div>
              </div>
              {doc.language && (
                <span className="rounded bg-gray-100 px-2 py-1 text-xs dark:bg-gray-800">
                  {doc.language}
                </span>
              )}
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
