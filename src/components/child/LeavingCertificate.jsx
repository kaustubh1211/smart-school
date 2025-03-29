import { Button } from "@/components/ui/button";
import dayjs from "dayjs";
import { useRef } from "react";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import dateConverter from "@nexisltd/date2word";

export default function LeavingCertificate({ student }) {
  const certificateRef = useRef(null);

  const formatDateToWords = (dateString) => {
    const dateObject = dayjs(dateString).toDate();
    return dateConverter(dateObject, {});
  };

  const handleDownload = async () => {
    if (!certificateRef.current) return;

    try {
      const canvas = await html2canvas(certificateRef.current, {
        scale: 2,
        logging: false,
        useCORS: true,
        allowTaint: true,
        scrollX: 0,
        scrollY: 0,
      });

      const imgData = canvas.toDataURL("image/png", 1.0);
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(
        `LeavingCertificate_${student.student.firstName}_${student.student.lastName}.pdf`
      );
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF. Please try again.");
    }
  };

  return (
    <div className="p-6 flex flex-col justify-center items-center">
      <div className="flex justify-end mb-4">
        <Button
          onClick={handleDownload}
          className="bg-blue-600 hover:bg-blue-700 mt-4"
        >
          Download Certificate
        </Button>
      </div>

      <div
        ref={certificateRef}
        className="border-2 border-dashed border-black p-20 justify-center bg-white my-4"
        style={{
          width: "210mm",
          minHeight: "297mm",
          padding: "20mm",
          boxSizing: "border-box",
        }}
      >
        {/* Certificate Header */}
        <div id="certificate">
          <div className="text-center mb-4">
            <div className="flex items-center justify-center mb-2">
              <img
                src="/placeholder.svg"
                alt="School Logo"
                className="h-16 w-16"
              />
              <div>
                <h1 className="text-2xl font-bold text-blue-900 ml-2">
                  SHRI RAGHUBIR MADHYAMIK VIDYALAYA
                </h1>
                <p className="text-sm font-light">
                  YADAV NAGAR BOISAR (EAST), PALGHAR-401501 MAHARASHTRA
                </p>
              </div>
            </div>
            <div className="flex justify-between text-sm mt-2">
              <div>
                <span className="font-bold">Phone : </span>
                <span className="font-light ml-1">9657273935</span>
              </div>
              <div>
                <span className="font-bold">Email :</span>
                <span className="font-light ml-1">
                  raghubirschoolboisar@gmail.com
                </span>
              </div>
              <div>
                <span className="font-bold">Website :</span>
                <span className="font-light ml-1"> raghubirschool.com</span>
              </div>
            </div>
            <div className="flex justify-between text-sm">
              <div>
                <span className="font-bold">UDISE No.:</span>
                <span className="font-light ml-1"> 27361115613</span>
              </div>
              <div>
                <span className="font-bold">Board: </span>
                <span className="font-light ml-1"> STATE BOARD</span>
              </div>
              <div>
                <span className="font-bold">Affiliation No.: </span>
                <span className="font-light ml-1">S.18.07.065</span>
              </div>
            </div>
            <div className="text-sm mt-2 border-b-4 border-black py-1">
              <p className="text-xxs font-semibold">
                Affiliation No.: जा. क्र. ठाजिप/ शिक्षण/ माध्य/ भा.क्र./४३८
                दिनांक-२८-१०-२००९
                <br></br> क्र. शिउस/ माध्य-१५/ प्रथम मान्यता/ ०८-०९/३४५५५-५६
                Dated -१०-१२-२००९
              </p>
            </div>

            <h2 className="text-xl font-bold text-red-900 mt-1 underline">
              SCHOOL LEAVING CERTIFICATE
            </h2>
            <p className="font-bold text-gray-800">
              (Vide Chapter II, Section III, Rule 17)
            </p>

            <div className="text-xxs font-bold py-1 text-gray-800">
              <p>
                (No Changes In Any Entry In This Certificate Would Be Valid
                Unless It Is Duly Countersigned By The Issuing Authority. Any
                Infringement <br></br>Of This Clause Is Liable To Invoke The
                Imposition Of Penalty Such As That Of Rustication.)
              </p>
            </div>
          </div>

          {/* Certificate Body */}
          <div className="grid grid-cols-2 gap-1">
            <div className="flex">
              <div className="w-32">
                <span className="font-bold">Student ID No.:</span>
              </div>
              <div className="underline">
                <span className="font-light ml-1">{student.studentId}</span>
              </div>
            </div>
            <div className="flex">
              <div className="w-48">
                <span className="font-bold">UID (Aadhar Card No.):</span>
              </div>
              <div>
                <span className="font-light ml-1">
                  {student.uidAadharCardNo}
                </span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 border-b-4 border-black pb-2">
            <div className="flex">
              <div className="w-32">
                <span className="font-bold">Serial No.:</span>
              </div>
              <div>
                <span className="font-light ml-1">{student.lcNo}</span>
              </div>
            </div>
            <div className="flex">
              <div className="w-44">
                <span className="font-bold">General Register No.:</span>
              </div>
              <div>
                <span className="font-light ml-1">
                  {student.generalRegisterNo || "-"}
                </span>
              </div>
            </div>
            <div className="flex ml-28">
              <div>
                <span className="font-bold">Date:</span>
              </div>
              <div>
                <span className="font-light ml-1">
                  {dayjs(student.issueDate).format("DD-MM-YYYY")}
                </span>
              </div>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-1 gap-2 font-bold text-neutral-900">
            <div className="flex">
              <div className="w-48">Student's Full Name:</div>
              <div className="uppercase">
                {student.student.firstName} {student.student.lastName}{" "}
                {student.student.fatherName}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex">
                <div className="w-32">Father's Name:</div>
                <div className="uppercase">{student.student.fatherName}</div>
              </div>
              <div className="flex">
                <div className="w-32">Mother's Name:</div>
                <div className="uppercase">{student.student.motherName}</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex">
                <div className="w-32">Nationality:</div>
                <div className="uppercase">
                  {student.student.nationality || "INDIAN"}
                </div>
              </div>
              <div className="flex">
                <div className="w-32">Mother Tongue:</div>
                <div className="uppercase">{student.motherTongue}</div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="flex">
                <div className="w-32">Religion:</div>
                <div className="uppercase">{student.student.caste}</div>
              </div>
              <div className="flex">
                <div className="w-32">Caste:</div>
                <div className="uppercase">{student.student.category}</div>
              </div>
              <div className="flex">
                <div className="w-32">Sub-Caste:</div>
                <div className="uppercase">{student.subCaste || "-"}</div>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex">
                <div className="w-56">Place of Birth (Village / City):</div>
                <div className="uppercase">{student.placeOfBirth || "-"}</div>
              </div>
              <div className="flex">
                <div className="w-32">Taluka:</div>
                <div className="uppercase">{student.taluka || "-"}</div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="flex">
                <div className="w-32">District:</div>
                <div className="uppercase">{student.district || "-"}</div>
              </div>
              <div className="flex">
                <div className="w-32">State:</div>
                <div className="uppercase">{student.student.state}</div>
              </div>
              <div className="flex">
                <div className="w-32">Nation:</div>
                <div className="uppercase">{student.nation || "INDIAN"}</div>
              </div>
            </div>

            <div className="flex gap-4">
              <div>Date of Birth (According to Christian era):</div>
              <div>{dayjs(student.student.dob).format("DD-MM-YYYY")}</div>
            </div>
            <div className="flex gap-4">
              <div>Both in words and figures:</div>
              <div>{formatDateToWords(student.student.dob.split("T")[0])}</div>
            </div>

            <div className="flex gap-2">
              <div className="w-64">Last School Attended:</div>
              <div className="uppercase">{student.lastSchoolAttended}</div>
            </div>

            <div className="flex gap-4">
              <div>Last School Standard into admitted:</div>
              <div className="uppercase">{student.lastSchoolStandard}</div>
            </div>

            <div className="flex gap-4">
              <div>Date of Admission:</div>
              <div>
                {dayjs(student.student.admissionDate).format("DD-MM-YYYY")}
              </div>
            </div>

            <div className="flex gap-4">
              <div>Progress (in studies):</div>
              <div className="uppercase">{student.progress || "-"}</div>
            </div>

            <div className="flex gap-4">
              <div>Conduct:</div>
              <div className="uppercase">{student.conduct}</div>
            </div>

            <div className="flex gap-4">
              <div>Date of Leaving:</div>
              <div>{dayjs(student?.leftDate).format("DD-MM-YYYY")}</div>
            </div>

            <div className="flex gap-4">
              <div>Standard in which studying and since when (in words):</div>
              <div className="uppercase">
                {student.student.class.description || "-"}
              </div>
            </div>

            <div className="flex gap-4">
              <div>Reason of Leaving School:</div>
              <div className="uppercase">{student.leftReason || "-"}</div>
            </div>

            <div className="flex gap-4">
              <div>Remarks:</div>
              <div className="uppercase">{student.remark || "-"}</div>
            </div>
          </div>

          {/* Certificate Footer */}
          <div className="mt-8 border-t border-dashed border-black pt-2 font-bold">
            <p className="text-bold text-left ml-5">
              Certify that above information is in accordance with the School
              Register.
            </p>
            <div className="flex gap-4 ml-5 mt-2 text-bold">
              <div>
                Date:{" "}
                <span className="font-light ml-1">
                  {dayjs(student.issueDate).format("DD")}
                </span>
              </div>
              <div>
                Month:{" "}
                <span className="font-light ml-1">
                  {dayjs(student.issueDate).format("MM")}
                </span>
              </div>
              <div>
                Year:{" "}
                <span className="font-light ml-1">
                  {dayjs(student.issueDate).format("YYYY")}
                </span>
              </div>
            </div>
            <div className="flex justify-between mt-4">
              <div className="flex justify-between mt-64 mx-44 text-sm">
                <div className="text-center">
                  <div className="border-t border-black pt-1 w-32">
                    Class Teacher
                  </div>
                </div>
                <div className="text-center">
                  <div className="border-t border-black pt-1 w-32">Clerk</div>
                </div>
                <div className="text-center">
                  <div className="border-t border-black pt-1 w-48">
                    Head Master Stamp
                  </div>
                </div>
              </div>
              <div className="w-24 h-24 border border-gray-300 flex items-center justify-center">
                <span className="text-xs text-gray-500">QR Code</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
