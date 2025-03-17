import { AffidavitDocument } from "@/components/child/AffidavitDocument";
import { Button } from "@/components/ui/button";
import { studentDetails } from "@/lib/studentDetails";
import { ChevronLeft, Printer } from "lucide-react";
import React, { useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useReactToPrint } from "react-to-print";

const AffidavitPrintPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const componentRef = useRef();

  const student = studentDetails.find((s) => s.enrollNo === id);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: `Affidavit_${student?.name || 'Student'}_${student?.enrollNo || 'Unknown'}`,
    onBeforeGetContent: () => {
      if (!componentRef.current) {
        return Promise.reject('Print content not ready');
      }
      return Promise.resolve();
    },
    pageStyle: `
      @page {
        size: A4;
        margin: 0;
      }
      @media print {
        body {
          margin: 0;
          padding: 0;
        }
        .no-print {
          display: none !important;
        }
      }
    `,
  });

  if (!student) {
    return (
      <div className="container mx-auto py-10 no-print">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-xl font-semibold flex items-center gap-2">
            <span className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
              ⚠️
            </span>
            Student Not Found
          </h1>
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => navigate("/affidavits")}
          >
            <ChevronLeft className="h-4 w-4" />
            Back
          </Button>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-600">
            No student found with enrollment number: {id}
          </p>
          <Button
            className="mt-4"
            variant="outline"
            onClick={() => navigate("/affidavits")}
          >
            Return to Affidavit List
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - No Print */}
      <div className="container mx-auto py-10 no-print">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-xl font-semibold flex items-center gap-2">
            <span className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
              📄
            </span>
            Affidavit Preview
          </h1>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={() => navigate("/affidavits")}
            >
              <ChevronLeft className="h-4 w-4" />
              Back
            </Button>
            <Button
              onClick={handlePrint}
              className="bg-green-500 hover:bg-green-600 text-white flex items-center gap-2"
            >
              <Printer className="h-4 w-4" />
              Print Affidavit
            </Button>
          </div>
        </div>

        {/* Document Preview */}
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div ref={componentRef} className="w-[210mm] mx-auto bg-white">
            <AffidavitDocument student={student} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AffidavitPrintPage;
