// components/documents/document-card.tsx
"use client";

import { formatDistanceToNow } from "date-fns";
import { motion } from "framer-motion";
import { Calendar, FileText, MoreVertical } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DocumentCardProps {
  document: {
    id: string;
    title: string;
    language: string | null;
    createdAt: Date;
  };
}

export function DocumentCard({ document }: DocumentCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="transition-shadow hover:shadow-md">
        <CardHeader className="flex flex-row items-start justify-between pb-3">
          <div className="flex min-w-0 flex-1 items-start gap-3">
            <div className="rounded-lg bg-blue-50 p-2 dark:bg-blue-950">
              <FileText className="h-4 w-4 text-blue-600" />
            </div>
            <div className="min-w-0 flex-1">
              <Link href={`/documents/${document.id}`}>
                <CardTitle className="truncate text-base transition-colors hover:text-blue-600">
                  {document.title}
                </CardTitle>
              </Link>
              {document.language && (
                <Badge variant="secondary" className="mt-2">
                  {document.language}
                </Badge>
              )}
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Edit</DropdownMenuItem>
              <DropdownMenuItem>Download</DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>

        <CardContent>
          <div className="text-muted-foreground flex items-center gap-2 text-xs">
            <Calendar className="h-3 w-3" />
            {formatDistanceToNow(new Date(document.createdAt), { addSuffix: true })}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
