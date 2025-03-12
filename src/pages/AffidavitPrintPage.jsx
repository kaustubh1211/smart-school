import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { ArrowLeft, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate, useParams } from "react-router-dom";
import { AffidavitDocument } from "@/components/child/AffidavitDocument";
import { studentAffidavits } from "@/lib/studentAffidavits";

export default function AffidavitPrintPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const printRef = useRef(null);

  const student = studentAffidavits.find((s) => s.enrollNo === id);

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: `Affidavit_${student.name}_${student.enrollNo}`,
  });

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <Button
          variant="outline"
          className="flex items-center gap-2"
          onClick={() => navigate(`/affidavits`)}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to List
        </Button>
        <Button onClick={() => handlePrint} className="flex items-center gap-2">
          <Printer className="h-4 w-4" />
          Print Affidavit
        </Button>
      </div>

      <div className="border rounded-lg p-4 bg-white">
        <div ref={printRef} className="p-4 max-w-[800px] mx-auto">
          <AffidavitDocument student={student} />
        </div>
      </div>
    </div>
  );
}
