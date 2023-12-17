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
import { Combobox } from "@/components/ui/combobox";

interface CategoryFormProps {
  initialData: Course;
  courseId: string;
  options: Array<{ label: string; value: string; }>
}

const formSchema = z.object({
  categoryId: z.string().min(1)
});

export const CategoryForm = ({
  initialData,
  courseId,
  options
}: CategoryFormProps) => {
  const [ isEditing, setIsEditing ] = useState(false);

  const toggleEdit = () => setIsEditing(current => !current);

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { categoryId: initialData.categoryId || "" }
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

  const selectedOption = options.find((option) => option.value === initialData.categoryId);

  return (
    <div className="w-full border bg-slate-100 rounded-md p-4 flex flex-col gap-y-2 shadow">
      <div className="font-medium flex items-center justify-between">
        Course category
        <Button variant="ghost" onClick={toggleEdit}>
          { isEditing
            ? <>Cancel</>
            : (
              <>
                <PencilIcon className="w-4 h-4 mr-2" />
                Edit category
              </>
            )
          }
        </Button>
      </div>

      {
        !isEditing
          ? <p className={cn(
            "text-sm",
          !initialData.categoryId && "text-slate-500 italic"
          )}>{ selectedOption?.label || "No category" }</p>
          : (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="categoryId"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Combobox options={options} {...field} />
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