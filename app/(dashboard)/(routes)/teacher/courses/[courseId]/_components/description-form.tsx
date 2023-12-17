"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useState } from "react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { PencilIcon } from "lucide-react";
import { Landing } from "@/components/landing";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Course } from ".prisma/client";

interface DescriptionFormProps {
  initialData: Course;
  courseId: string;
}

const formSchema = z.object({
  description: z.string().min(1, {
    message: "Description is required"
  })
});

export const DescriptionForm = ({
  initialData,
  courseId
}: DescriptionFormProps) => {
  const [ isEditing, setIsEditing ] = useState(false);

  const toggleEdit = () => setIsEditing(current => !current);

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { description: initialData.description || "" }
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/courses/${courseId}`, values);

      toggleEdit();
      toast.success("Course updated");

      router.refresh();
    } catch {
      toast.error("Something went wrong");
    }
  }
  return (
    <div className="w-full border bg-slate-100 rounded-md p-4 flex flex-col gap-y-2 shadow">
      <div className="font-medium flex items-center justify-between">
        Course description
        <Button variant="ghost" onClick={toggleEdit}>
          { isEditing
            ? <>Cancel</>
            : (
              <>
                <PencilIcon className="w-4 h-4 mr-2" />
                Edit description
              </>
            )
          }
        </Button>
      </div>

      {
        !isEditing
          ? <p className={cn(
            "text-sm",
          !initialData.description && "text-slate-500 italic"
          )}>{ initialData.description || "No description" }</p>
          : (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea disabled={isSubmitting} placeholder="e.g. 'This course is about...'" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <Button className="gap-x-2" disabled={!isValid || isSubmitting}>
                  { isSubmitting && <Landing isLoading={isSubmitting} /> }
                  <span>Save</span>
                </Button>
              </form>
            </Form>
          )
      }
    </div>
  );
}