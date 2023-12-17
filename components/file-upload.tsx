import { UploadDropzone } from "@/lib/uploadthing";
import { ourFileRouter } from "@/app/api/uploadthing/core";
import toast from "react-hot-toast";

interface File {
  key: string;
  name: string;
  size: number;
  url: string;
}

interface FileUploadProps {
  onChange: (url?: File) => void;
  endpoint: keyof typeof ourFileRouter;
}

export const FileUpload = ({
  onChange,
  endpoint
}: FileUploadProps) => {
  return (
    <UploadDropzone
      endpoint={endpoint}
      onClientUploadComplete={(res) => {
        onChange(res?.[0]);
      }}
      onUploadError={(error) => {
        toast.error(`${error.message}`);
      }}
    />
  );
}