
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import type { Submission, EquipmentStatus } from "@/lib/types";
import { BACKEND_BASE_URL } from "@/lib/constants";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Check, X } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";

interface FormDetailDialogProps {
  submissionId: string | null;
  onOpenChange: (isOpen: boolean) => void;
}

export function FormDetailDialog({ submissionId, onOpenChange }: FormDetailDialogProps) {
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (submissionId) {
      async function fetchSubmissionDetails() {
        try {
          setLoading(true);
          setError(null);
          setSubmission(null);
          const response = await fetch(`${BACKEND_BASE_URL}/api/forms/${submissionId}`);
          if (!response.ok) {
            throw new Error("Failed to fetch submission details");
          }
          const data = await response.json();
          // The API returns { form: ... }, so we access data.form
          setSubmission(data.form);
        } catch (err) {
          setError(err instanceof Error ? err.message : "An unknown error occurred");
        } finally {
          setLoading(false);
        }
      }
      fetchSubmissionDetails();
    }
  }, [submissionId]);
  
  const getStatusBadge = (status: EquipmentStatus['status']) => {
    if (status === 'exists') {
        return <Badge variant="default" className="bg-green-500 hover:bg-green-600"><Check className="ml-1 h-4 w-4" /> קיים</Badge>
    }
    return <Badge variant="destructive"><X className="ml-1 h-4 w-4" /> חסר</Badge>
  }

  return (
    <Dialog open={!!submissionId} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>פרטי דיווח</DialogTitle>
          <DialogDescription>
            פירוט מלא של טופס הציוד שנחתם.
          </DialogDescription>
        </DialogHeader>
        {loading && (
            <div className="space-y-4">
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <div className="border rounded-md p-4 space-y-2">
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-full" />
                </div>
            </div>
        )}
        {error && (
            <Alert variant="destructive">
                <AlertTitle>שגיאה</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        )}
        {submission && (
          <div className="space-y-6 text-sm">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div><strong>שם:</strong> {submission.firstName} {submission.lastName}</div>
                <div><strong>מ.א:</strong> {submission.soldierId}</div>
                <div><strong>משימה:</strong> {submission.task}</div>
                <div className="md:col-span-3">
                    <strong>תאריך:</strong> {format(new Date(submission.date), 'dd/MM/yyyy HH:mm:ss')}
                </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2 text-base">פירוט ציוד</h4>
              <ScrollArea className="h-[300px] w-full border rounded-md">
                 <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>פריט</TableHead>
                            <TableHead>סטטוס</TableHead>
                            <TableHead>כמות</TableHead>
                            <TableHead>הערות</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {submission.equipmentStatus.map((item, index) => (
                            <TableRow key={index}>
                                <TableCell className="font-medium">{item.name}</TableCell>
                                <TableCell>{getStatusBadge(item.status)}</TableCell>
                                <TableCell>{item.quantity}</TableCell>
                                <TableCell>{item.comment || "-"}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
              </ScrollArea>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
