"use client";

import * as z from "zod";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useState } from "react";
import { Attachment, Course } from ".prisma/client";

import { Button } from "@/components/ui/button";
import { FileIcon, LoaderIcon, PlusCircleIcon, XIcon } from "lucide-react";
import { FileUpload } from "@/components/file-upload";

interface AttachmentFormProps {
  initialData: Course & { attachments: Attachment[] };
  courseId: string;
}

const formSchema = z.object({
  url: z.string().min(1),
  name: z.string().min(1)
});

export const AttachmentForm = ({
  initialData,
  courseId
}: AttachmentFormProps) => {
  const [ isEditing, setIsEditing ] = useState(false);
  const [ deletingId, setDeletingId ] = useState<string | null>(null);
  const toggleEdit = () => setIsEditing(current => !current);

  const router = useRouter();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.post(`/api/courses/${courseId}/attachments`, values);

      toggleEdit();
      toast.success("Attachment updated");

      router.refresh();
    } catch {
      toast.error("Something went wrong");
    }
  }

  const onDelete = async (id: string) => {
    try {
      setDeletingId(id);
      await axios.delete(`/api/courses/${courseId}/attachments/${id}`);

      toast.success("Attachment updated");

      router.refresh();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="w-full border bg-slate-100 rounded-md p-4 flex flex-col gap-y-2 shadow">
      <div className="font-medium flex items-center justify-between">
        Course attachment
        <Button variant="ghost" onClick={toggleEdit}>
          { isEditing && <>Cancel</> }
          { !isEditing && (
            <>
              <PlusCircleIcon className="w-4 h-4 mr-2" />
              Add an attachment
            </>
          ) }
        </Button>
      </div>
      { !isEditing && (
        <>
          { initialData.attachments.length === 0 && (
            <div className="text-sm text-slate-500 italic">
              No attachments yet
            </div>
          )}
          {
            initialData.attachments.length > 0 && (
              <div className="space-y-2">
                {
                  initialData.attachments.map(attachment => (
                    <div
                      key={attachment.id}
                      className="flex items-center w-full px-3 py-2 bg-sky-100 border-sky-200 border text-sky-700 rounded-md"
                    >
                      <FileIcon className="w-4 h-4 mr-2 flex-shrink-0" />
                      <p className="flex-grow text-sm line-clamp-1" >
                        { attachment.name }
                      </p>
                      { deletingId === attachment.id && (
                        <LoaderIcon className="w-4 h-4 animate-spin" />
                      ) }
                      {
                        deletingId !== attachment.id && (
                          <button onClick={() => onDelete(attachment.id)} className="hover:text-red-500 transition">
                            <XIcon className="w-4 h-4" />
                          </button>
                        )
                      }
                    </div>
                  ))
                }
              </div>
            )
          }
        </>
      ) }
      { isEditing && (
        <>
          <FileUpload
            endpoint="courseAttachment"
            onChange={(file) => {
              if (file?.url) onSubmit(file)
            }}
          />
          <div className="text-sm text-slate-500 text-muted-foreground">
            Add anything your students might need to complete the course.
          </div>
        </>
      ) }
    </div>
  );
}