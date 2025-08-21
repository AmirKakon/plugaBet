"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"; 
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button, buttonVariants } from "@/components/ui/button";
import { BACKEND_BASE_URL } from "@/lib/constants";
import { useEffect, useState } from "react";
import type { Task } from "@/lib/types";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle, Loader2, ArrowRight, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";

const equipmentStatusSchema = z.object({
  name: z.string(),
  quantity: z.number(),
  status: z.enum(["ok", "issue"], { required_error: "יש לבחור סטטוס" }),
  comment: z.string().optional(),
  physicalId: z.string().optional()
});

const formSchema = z.object({
  firstName: z.string().min(2, { message: "שם פרטי הוא שדה חובה" }),
  lastName: z.string().min(2, { message: "שם משפחה הוא שדה חובה" }),
  soldierId: z.string().regex(/^[0-9]{7}$/, { message: "מספר אישי לא תקין" }),
  equipmentStatus: z.array(equipmentStatusSchema),
});

type EquipmentFormValues = z.infer<typeof formSchema>;

export function EquipmentForm() {
  const [step, setStep] = useState(1);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();

  const form = useForm<EquipmentFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      task: "",
      firstName: "",
      lastName: "",
      soldierId: "",
      equipmentStatus: [],
    },
  });

  const { fields, replace } = useFieldArray({
    control: form.control,
    name: "equipmentStatus",
  });

  useEffect(() => {
    async function fetchTasks() {
      try {
        const response = await fetch(`${BACKEND_BASE_URL}/api/tasks`);
        if (!response.ok) throw new Error("Failed to fetch tasks");
        const data = await response.json();
        setTasks(data.tasks);
      } catch (error) {
        console.error("Failed to fetch tasks", error);
        toast({
          title: "שגיאה",
          description: "טעינת המשימות נכשלה. נסה שוב.",
          variant: "destructive",
        });
      }
    }
    fetchTasks();
  }, [toast]);
  
  const selectedTaskId = form.watch("task");

  useEffect(() => {
    if (selectedTaskId) {
      const selectedTask = tasks.find(t => t.id === selectedTaskId);
      if (selectedTask) {
        const newEquipmentStatus = selectedTask.items.map(item => ({
          equipmentId: item.id,
          name: item.name,
          quantity: item.quantity ?? 0,
          status: "ok" as const,
          comment: "",
          physicalId: "",
          hasPhysicalId: item.physicalId,
        }));
        replace(newEquipmentStatus);
      }
    } else {
        replace([]);
    }
  }, [selectedTaskId, tasks, replace]);


  async function handleNextStep() {
    setStep(s => s + 1);
  }

  async function onSubmit(values: EquipmentFormValues) {
    setIsSubmitting(true);
    try {
        const selectedTask = tasks.find(t => t.id === values.task);
        const payload = {
            ...values,
            task: selectedTask?.name, // Send task name instead of ID
            date: new Date().toISOString(),
        };

        const response = await fetch(`${BACKEND_BASE_URL}/api/forms`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            throw new Error('Failed to submit form');
        }
        setIsSuccess(true);
    } catch (error) {
        toast({
            title: "שגיאה",
            description: "הייתה בעיה בשליחת הטופס. נסה שוב.",
            variant: "destructive",
        });
        console.error("Form submission error:", error);
    } finally {
        setIsSubmitting(false);
    }
  }

  if (isSuccess) {
    return (
      <Alert variant="default" className="border-green-500 bg-green-50 text-green-800">
        <CheckCircle className="h-4 w-4 !text-green-500" />
        <AlertTitle>הטופס נשלח בהצלחה!</AlertTitle>
        <AlertDescription>
          תודה {form.getValues('firstName')}, החתימה שלך על הציוד נקלטה במערכת.
        </AlertDescription>
         <Button onClick={() => {
           setIsSuccess(false);
           setStep(1);
           form.reset();
         }} variant="outline" className="mt-4">
          חתימה חדשה
        </Button>
      </Alert>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8" noValidate>
        {step === 1 && (
            <div className="space-y-8">
                <div>
                    <h3 className="text-lg font-medium">שלב 1: בחירת משימה</h3>
                    <p className="text-sm text-muted-foreground">בחר את המשימה שעבורה אתה חותם על ציוד.</p>
                </div>
                 <FormField
                    control={form.control}
                    name="task"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>שם משימה</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="בחר משימה מהרשימה" />
                            </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                            {tasks.map(task => (
                                <SelectItem key={task.id} value={task.id}>
                                    {task.name}
                                </SelectItem>
                            ))}
                            </SelectContent>
                        </Select>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <Button onClick={handleNextStep} size="lg" type="button">הבא</Button>
            </div>
        )}

        {step === 2 && (
            <div className="space-y-8">
                <div>
                    <h3 className="text-lg font-medium">שלב 2: פרטים אישיים</h3>
                    <p className="text-sm text-muted-foreground">נא למלא את פרטי החייל/ת המדווח/ת.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>שם פרטי</FormLabel>
                            <FormControl>
                            <Input placeholder="ישראל" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="lastName"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>שם משפחה</FormLabel>
                            <FormControl>
                            <Input placeholder="ישראלי" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                </div>
                <FormField
                    control={form.control}
                    name="soldierId"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>מספר אישי</FormLabel>
                        <FormControl>
                            <Input placeholder="1234567" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                 <div className="flex gap-4">
                    <Button type="button" onClick={() => setStep(1)} variant="outline">
                        <ArrowRight className="ml-2 h-4 w-4" />
                        חזור
                    </Button>
                    <Button onClick={handleNextStep} size="lg" type="button">הבא</Button>
                </div>
            </div>
        )}

        {step === 3 && (
            <div className="space-y-8">
                <div>
                    <h3 className="text-lg font-medium">שלב 3: בדיקת ציוד</h3>
                    <p className="text-sm text-muted-foreground">עבור על כל פריט, וודא תקינות וכמות, ומלא את הפרטים הנדרשים.</p>
                </div>
                <div className="space-y-6">
                {fields.map((item, index) => (
                    <Card key={item.id} className="p-4">
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                            <div className="md:col-span-2">
                                <h4 className="font-bold text-lg">{item.name}</h4>
                           </div>

                            <FormField
                                control={form.control}
                                name={`equipmentStatus.${index}.status`}
                                render={({ field }) => (
                                <FormItem className="space-y-3">
                                    <FormLabel>סטטוס</FormLabel>
                                    <FormControl>
                                    <RadioGroup
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                        className="flex gap-4"
                                    >
                                        <FormItem className="flex items-center space-x-2 space-x-reverse">
                                        <FormControl>
                                            <RadioGroupItem value="ok" />
                                        </FormControl>
                                        <FormLabel className="font-normal">תקין</FormLabel>
                                        </FormItem>
                                        <FormItem className="flex items-center space-x-2 space-x-reverse">
                                        <FormControl>
                                            <RadioGroupItem value="issue" />
                                        </FormControl>
                                        <FormLabel className="font-normal">תקול</FormLabel>
                                        </FormItem>
                                    </RadioGroup>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />

                           <FormField
                                control={form.control}
                                name={`equipmentStatus.${index}.quantity`}
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>כמות בפועל</FormLabel>
                                    <FormControl>
                                    <Input
                                        type="number"
                                        {...field}
                                        onChange={e => field.onChange(parseInt(e.target.value, 10) || 0)} // Ensure number type
                                    />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                            {item.hasPhysicalId && (
                               <FormField
                                    control={form.control}
                                    name={`equipmentStatus.${index}.physicalId`}
                                    render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>צ'</FormLabel>
                                        <FormControl>
                                        <Input placeholder="הכנס מספר צ'" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                    )}
                                />
                            )}
                            
                            {form.watch(`equipmentStatus.${index}.status`) === 'issue' && (
                                <div className="md:col-span-2">
                                <FormField
                                    control={form.control}
                                    name={`equipmentStatus.${index}.comment`}
                                    render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>פירוט התקלה</FormLabel>
                                        <FormControl>
                                        <Textarea placeholder="פרט את התקלה כאן" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                    )}
                                />
                                </div>
                            )}
                       </div>
                    </Card>
                ))}
                </div>
                {form.formState.errors.equipmentStatus && (
                    <p className="text-sm font-medium text-destructive">{form.formState.errors.equipmentStatus.message}</p>
                )}
                <div className="flex gap-4">
                    <Button type="button" onClick={() => setStep(2)} variant="outline">
                        <ArrowRight className="ml-2 h-4 w-4" />
                        חזור
                    </Button>
                    <button type="submit" disabled={isSubmitting} className={cn(buttonVariants({ size: "lg" }))}>
                        {isSubmitting ? <Loader2 className="animate-spin" /> : "שלח"}
                    </button>
                </div>
            </div>
        )}
      </form>
    </Form>
  );
}
