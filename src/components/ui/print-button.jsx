import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";
import { useReactToPrint } from "react-to-print";

export function PrintButton({ contentRef }) {
  const handlePrint = useReactToPrint({
    content: () => contentRef.current,
    documentTitle: "Affidavit Document",
    onBeforeGetContent: () => {
      if (!contentRef.current) {
        console.error("Print content not found");
        return Promise.reject("Print content not found");
      }
      return Promise.resolve();
    },
    onPrintError: (error) => console.error("Print failed", error),
  });

  return (
    <Button onClick={handlePrint} className="flex items-center gap-2">
      <Printer className="h-4 w-4" />
      Print Affidavit
    </Button>
  );
}
