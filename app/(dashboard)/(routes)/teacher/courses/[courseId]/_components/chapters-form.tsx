"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useState } from "react";
import { cn } from "@/lib/utils";

import type { Chapter, Course } from "@prisma/client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { PlusCircleIcon } from "lucide-react";
import { Landing } from "@/components/landing";
import { Input } from "@/components/ui/input";
import { ChaptersList } from "./chapters-list";

interface ChaptersFormProps {
  initialData: Course & { chapters: Chapter[] };
  courseId: string;
}

const formSchema = z.object({
  title: z.string().min(1)
});

export const ChaptersForm = ({
  initialData,
  courseId
}: ChaptersFormProps) => {
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating ] = useState(false);

  const toggleCreating = () => setIsCreating(current => !current);

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { title: "" }
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.post(`/api/courses/${courseId}/chapters`, values);

      toggleCreating();
      toast.success("Chapter created");

      form.setValue("title", "");
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    }
  }

  const onReorder = async (updateData: { id: string; position: number }[]) => {
    try {
      setIsUpdating(true);

      await axios.put(`/api/courses/${courseId}/chapters/reorder`, {
        list: updateData
      });
      toast.success("Chapters reordered");
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsUpdating(false);
    }
  }

  const onEdit = (id: string) => {
    router.push(`/teacher/courses/${courseId}/chapters/${id}`);
  }

  return (
    <div className="relative w-full border bg-slate-100 rounded-md p-4 flex flex-col gap-y-2 shadow">
      {isUpdating && (
        <div className="absolute w-full h-full bg-slate-500/30 rounded-md top-0 left-0 flex items-center justify-center">
          <Landing size={30} isLoading={true} />
        </div>
      )}
      <div className="font-medium flex items-center justify-between">
        Course chapters
        <Button variant="ghost" onClick={toggleCreating}>
          { isCreating
            ? <>Cancel</>
            : (
              <>
                <PlusCircleIcon className="w-4 h-4 mr-2" />
                Add an chapters
              </>
            )
          }
        </Button>
      </div>

      {
        !isCreating
          ? (
            <>
              <div className={cn(
                "text-sm",
                !initialData.chapters.length && "text-slate-500 italic"
              )}>
                { !initialData.chapters.length && "No chapters" }

                <ChaptersList
                  onEdit={onEdit}
                  onReorder={onReorder}
                  items={initialData.chapters || []}
                />
              </div>

              {initialData.chapters.length > 0 && (
                <p className="text-xs text-muted-foreground">
                Drat and drop to reorder the chapter
                </p>
              )}
            </>
          )
          : (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input disabled={isSubmitting} placeholder="e.g. 'Introduction to the course...'" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <Button className="gap-x-2" disabled={!isValid || isSubmitting}>
                  { isSubmitting && <Landing isLoading={isSubmitting} /> }
                  <span>Create</span>
                </Button>
              </form>
            </Form>
          )
      }
    </div>
  );
}