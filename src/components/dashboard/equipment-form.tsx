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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { BACKEND_BASE_URL } from "@/lib/constants";
import { useEffect, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle, Loader2, Check, X, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import type { Task, Equipment } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

const equipmentStatusSchema = z.object({
  equipmentId: z.string(),
  name: z.string(),
  status: z.enum(["ok", "issue"]),
  quantity: z.number().min(0, { message: "כמות חייבת להיות מספר חיובי" }),
  comment: z.string().optional(),
  physicalId: z.string().optional(),
  hasPhysicalId: z.boolean(),
}).refine(data => data.status === 'ok' || (data.status === 'issue' && data.comment && data.comment.length > 0), {
  message: "יש למלא הערה במקרה של תקלה",
  path: ["comment"],
}).refine(data => !data.hasPhysicalId || (data.hasPhysicalId && data.physicalId && data.physicalId.length > 0), {
  message: "יש למלא צ'",
  path: ["physicalId"],
});

const formSchema = z.object({
  task: z.string({ required_error: "יש לבחור משימה" }),
  firstName: z.string().min(2, { message: "שם פרטי הוא שדה חובה" }),
  lastName: z.string().min(2, { message: "שם משפחה הוא שדה חובה" }),
  soldierId: z.string().regex(/^[0-9]{7}$/, { message: "מספר אישי לא תקין" }),
  equipment: z.array(equipmentStatusSchema),
  confirmation: z.literal(true, {
    errorMap: () => ({ message: "יש לאשר את ההצהרה" }),
  }),
});

export function EquipmentForm() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoadingTasks, setIsLoadingTasks] = useState(true);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      task: "",
      firstName: "",
      lastName: "",
      soldierId: "",
      equipment: [],
      confirmation: false,
    },
  });
  
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch(`${BACKEND_BASE_URL}/api/tasks`);
        const data = await response.json();
        setTasks(data.tasks);
      } catch (error) {
        console.error("Failed to fetch tasks:", error);
      } finally {
        setIsLoadingTasks(false);
      }
    };

    fetchTasks();
  }, []);

  useEffect(() => {
    if (selectedTask) {
      const equipmentData = selectedTask.items.map((eq: Equipment) => ({
        equipmentId: eq.id,
        name: eq.name,
        status: "ok" as const,
        quantity: eq.quantity ?? 0,
        comment: "",
        physicalId: "",
        hasPhysicalId: !!eq.physicalId,
      }));
      form.setValue('equipment', equipmentData);
    }
  }, [selectedTask, form]);

  const { fields, update } = useFieldArray({
    control: form.control,
    name: "equipment",
  });

  async function handleNextStep(currentStep: number, targetStep: number) {
     let isValid = false;
     if (currentStep === 1) {
        isValid = await form.trigger(["task"]);
     } else if (currentStep === 2) {
       isValid = await form.trigger(["firstName", "lastName", "soldierId"]);
     }
    if (isValid) {
      setStep(targetStep);
    }
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      const response = await fetch(`${BACKEND_BASE_URL}/api/forms`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...values, date: new Date().toISOString() }),
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
      })
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
          העברת המשמרת תועדה במערכת. תודה {form.getValues('firstName')}.
        </AlertDescription>
         <Button onClick={() => {
           setIsSuccess(false);
           setStep(1);
           setSelectedTask(null);
           form.reset({
            task: "",
            firstName: "",
            lastName: "",
            soldierId: "",
            equipment: [],
            confirmation: false,
           });
         }} variant="outline" className="mt-4">
          מילוי טופס חדש
        </Button>
      </Alert>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {step === 1 && (
           <div className="space-y-8">
             <div>
               <h3 className="text-lg font-medium">שלב 1: בחירת משימה</h3>
               <p className="text-sm text-muted-foreground">נא לבחור את המשימה עבורה ממולא הטופס.</p>
             </div>
              <FormField
                control={form.control}
                name="task"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormControl>
                       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {isLoadingTasks ? (
                          <Loader2 className="animate-spin" />
                        ) : (
                          tasks.map((task) => (
                             <Button
                                key={task.id}
                                type="button"
                                variant={field.value === task.name ? "default" : "outline"}
                                className="p-8 text-xl h-auto"
                                onClick={() => {
                                  field.onChange(task.name);
                                  setSelectedTask(task);
                                  handleNextStep(1,2);
                                }}
                              >
                                {task.name}
                              </Button>
                          ))
                        )}
                       </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
           </div>
        )}

        {step === 2 && (
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-medium">שלב 2: פרטים אישיים</h3>
              <p className="text-sm text-muted-foreground">נא למלא את פרטי החייל/ת המקבל/ת את המשמרת.</p>
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
                חזור
              </Button>
              <Button onClick={() => handleNextStep(2, 3)} size="lg">הבא</Button>
            </div>
          </div>
        )}

        {step === 3 && selectedTask && (
          <div className="space-y-8">
             <div>
              <h3 className="text-lg font-medium">שלב 3: בדיקת ציוד</h3>
              <p className="text-sm text-muted-foreground">נא לוודא את תקינות וכמות כלל הציוד הרשום.</p>
            </div>
            <div className="space-y-6">
              {fields.map((field, index) => {
                const equipmentItem = selectedTask.items.find(eq => eq.id === field.equipmentId);
                return (
                <div key={field.id} className="p-4 border rounded-lg bg-card/50">
                   <div className="flex justify-between items-start">
                      <div>
                        <FormLabel className="text-base">{field.name}</FormLabel>
                        <FormDescription>
                          {equipmentItem?.description}
                        </FormDescription>
                      </div>
                       <div className="flex items-center gap-2">
                          <Button
                            type="button"
                            variant={form.watch(`equipment.${index}.status`) === 'ok' ? 'secondary' : 'ghost'}
                            size="icon"
                            className={cn("h-8 w-8", form.watch(`equipment.${index}.status`) === 'ok' && "border-2 border-green-500")}
                            onClick={() => update(index, { ...form.getValues(`equipment.${index}`), status: 'ok' })}
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                           <Button
                            type="button"
                             variant={form.watch(`equipment.${index}.status`) === 'issue' ? 'destructive' : 'ghost'}
                            size="icon"
                             className="h-8 w-8"
                            onClick={() => update(index, { ...form.getValues(`equipment.${index}`), status: 'issue' })}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                      </div>
                   </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                       <FormField
                          control={form.control}
                          name={`equipment.${index}.quantity`}
                          render={({ field: quantityField }) => (
                            <FormItem>
                              <FormLabel>כמות</FormLabel>
                              <FormControl>
                                <Input 
                                  type="number" 
                                  {...quantityField}
                                  onChange={e => quantityField.onChange(parseInt(e.target.value, 10) || 0)}
                                  />
                              </FormControl>
                               <FormMessage />
                            </FormItem>
                          )}
                        />

                      {field.hasPhysicalId && (
                         <FormField
                          control={form.control}
                          name={`equipment.${index}.physicalId`}
                          render={({ field: physicalIdField }) => (
                            <FormItem>
                              <FormLabel>צ'</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="הזן צ'"
                                  {...physicalIdField}
                                  />
                              </FormControl>
                               <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}

                      {form.watch(`equipment.${index}.status`) === 'issue' && (
                        <FormField
                          control={form.control}
                          name={`equipment.${index}.comment`}
                          render={({ field: commentField }) => (
                            <FormItem className="md:col-span-2">
                              <FormLabel>פירוט התקלה</FormLabel>
                              <FormControl>
                                <Textarea placeholder="פרט את הבעיה..." {...commentField} />
                              </FormControl>
                               <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}
                    </div>
                </div>
              )})}
            </div>

            <Separator />

            <FormField
              control={form.control}
              name="confirmation"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm">
                   <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="ml-2"
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      אני, {form.watch('firstName') || "החייל/ת"}, מאשר/ת כי בדקתי את כלל הציוד ומצאתי אותו במצב המתואר לעיל.
                    </FormLabel>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex gap-4">
              <Button type="button" onClick={() => setStep(2)} variant="outline">
                <ArrowRight className="mr-2 h-4 w-4" />
                חזור
              </Button>
              <Button type="button" onClick={form.handleSubmit(onSubmit)} disabled={isSubmitting} variant="default" size="lg" className="hover:bg-primary/80">
                {isSubmitting ? <Loader2 className="animate-spin" /> : "שלח"}
              </Button>
            </div>
          </div>
        )}
      </form>
    </Form>
  );
}
