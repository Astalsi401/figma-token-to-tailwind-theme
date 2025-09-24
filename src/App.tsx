import {
  Dropzone,
  DropzoneContent,
  DropzoneEmptyState,
} from "@ui/shadcn-io/dropzone";
import { Button } from "@ui/button";
import { CopyButton } from "@ui/shadcn-io/copy-button";
import { useEffect, useState } from "react";
import { tokensToCss } from "./utils/token-to-css";

export const App = () => {
  const [files, setFiles] = useState<File[] | undefined>();
  const [data, setData] = useState("");
  const [css, setCss] = useState("");

  const handleDrop = (files: File[]) => {
    setFiles(files);
    const fileReader = new FileReader();
    fileReader.readAsText(files[0], "UTF-8");
    fileReader.onload = (e: ProgressEvent<FileReader>) => {
      if (!e.target) return;
      setData(e.target.result as string);
    };
  };

  const generateCss = () => {
    if (!data) return;
    const res = tokensToCss(JSON.parse(data));
    setCss(res);
  };

  useEffect(() => {
    setCss("");
  }, [files]);

  return (
    <div className="flex flex-col gap-10">
      <div className="p-5">
        <Dropzone
          accept={{ "application/json": [".json"] }}
          maxFiles={1}
          maxSize={1024 * 1024 * 50}
          minSize={1024}
          onDrop={handleDrop}
          onError={console.error}
          src={files}
        >
          <DropzoneEmptyState />
          <DropzoneContent />
        </Dropzone>
      </div>
      <div className="p-5 flex items-center gap-2">
        <Button className="mx-auto" variant="outline" onClick={generateCss}>
          Generate CSS
        </Button>
      </div>
      <div className="p-5 relative">
        <CopyButton
          className="absolute top-6 right-6"
          variant="outline"
          content={css}
        />
        <div
          className="border border-gray-200 rounded-md p-2 min-h-50"
          dangerouslySetInnerHTML={{
            __html: css.replace(/(?:\r\n|\r|\n)/g, "<br />"),
          }}
        />
      </div>
    </div>
  );
};
