import { AffidavitDocument } from "@/components/child/AffidavitDocument";
import { Button } from "@/components/ui/button";
import { studentAffidavits } from "@/lib/studentAffidavits";
import { ArrowLeft, Printer } from "lucide-react";
import React, { useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useReactToPrint } from "react-to-print";

const AffidavitPrintPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const contentRef = useRef(null);

  const student = studentAffidavits.find((s) => s.enrollNo === id);
  
  const handlePrint = useReactToPrint({
    content: () => contentRef.current,
    documentTitle: `Affidavit_${student.name}_${student.enrollNo}`,
    onAfterPrint: () => alert("Print Success"),
  });

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <Button
          variant="outline"
          className="flex items-center gap-2"
          onClick={() => navigate(`/affidavits`)}
        >
          <ArrowLeft className="h-4 w-4">Back to List</ArrowLeft>
        </Button>
        <Button onClick={handlePrint} className="flex items-center gap-2">
          <Printer className="h-4 w-4"></Printer>
          Print Affidavit
        </Button>
      </div>
      {student ? (
        <div className="border rounded-lg p-4 bg-white">
          <div
            ref={contentRef}
            className="p-4 max-w-[800px] mx-auto print:bg-white"
          >
            <AffidavitDocument student={student} />
          </div>
        </div>
      ) : (
        <p className="text-red-500 text-center">Student not found</p>
      )}
    </div>
  );
};

export default AffidavitPrintPage;
