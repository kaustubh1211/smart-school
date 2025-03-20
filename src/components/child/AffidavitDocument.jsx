const getDateInWords = (dateString) => {
  if (!dateString) return "";

  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.toLocaleString("default", { month: "long" });
  const year = date.getFullYear();

  // Add ordinal suffix to the day (e.g., 1st, 2nd, 3rd, 4th)
  const getOrdinalSuffix = (day) => {
    if (day > 3 && day < 21) return "th"; // Handle 11th, 12th, 13th, etc.
    switch (day % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  };

  return `${day}${getOrdinalSuffix(day)} ${month} ${year}`;
};

export function AffidavitDocument({ student }) {
  console.log("student data", JSON.stringify(student));

  // Use optional chaining to safely access nested properties
  const studentData = student?.student || {};
  const classData = studentData?.class || {};
  const dob = studentData?.dob
    ? new Date(studentData.dob).toLocaleDateString("en-GB")
    : "";
  const dobInWords = getDateInWords(studentData?.dob); // Convert DOB to words
  const issueDate = student?.issueDate
    ? new Date(student.issueDate).toLocaleDateString("en-GB")
    : "";

  return (
    <div className="print:p-0 print:border-0 print:shadow-none">
      <div className="p-8 mx-auto print:p-12">
        {/* School Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold font-serif text-red-800 print:text-2xl">
            Shri Raghubir Primary English School
          </h1>
          <p className="text-sm mt-1 print:text-sm">
            YADAV NAGAR, BOISAR (EAST), PALGHAR-401501 MAHARASHTRA
          </p>
          <p className="text-xs mt-1 print:text-xs">Contact No.: 9657173935</p>
          <div className="border-b-2 border-red-800 my-4"></div>
        </div>

        {/* Affidavit Title */}
        <div className="text-center mb-8">
          <h2 className="text-xl font-bold underline print:text-xl">
            SELF AFFIDAVIT
          </h2>
          <div className="px-4 mt-2 space-y-1">
            <p className="text-xs print:text-xs">
              (Parents/Guardians Written Promise letter Regarding their Son /
              Daughter / Wards date of Birth)
            </p>
            <p className="text-xs print:text-xs">(Maharashtra Government)</p>
            <p className="text-xs print:text-xs">
              Decision Std P.R.E. / 2010 / (215) Primary Education Mantralaya
              Mumbai - 32, Dated: 11-06-2010
            </p>
            <p className="text-sm mt-2 print:text-sm">
              DATE OF BIRTH (AGE) PROMISE LETTER
            </p>
          </div>
          <p className="text-sm mt-2 print:text-sm">
            (To Be Submitted At Time Of Admission If There Is No Birth
            Certificate /Leaving Certificate)
          </p>
        </div>

        {/* Affidavit Content */}
        <div className="space-y-6 text-justify leading-relaxed print:text-base">
          <p>
            I Shri/Smt{" "}
            <span className="font-bold underline decoration-dotted mx-1">
              {studentData?.fatherName || ""}
            </span>
            , Father of{" "}
            <span className="font-bold underline decoration-dotted">
              {studentData?.firstName || ""}
            </span>
            , Residing At{" "}
            <span className="font-bold underline decoration-dotted mx-1">
              {studentData?.address || ""}
            </span>{" "}
            Do Here With On Solemn Affirmation State That My Child/ward was born
            on{" "}
            <span className="font-bold underline decoration-dotted mx-1">
              {dob}
            </span>
            <span> In words ( </span>
            <span className="font-bold underline decoration-dotted mx-1">
              {dobInWords}
            </span>{" "}
            ). At{" "}
            <span className="font-bold underline decoration-dotted mx-1">
              {student?.birthPlace || ""}
            </span>
            , ( Place of Birth ), Dist.{" "}
            <span className="font-bold underline decoration-dotted mx-1">
              {student?.district || ""}
            </span>
            , State{" "}
            <span className="font-bold underline decoration-dotted mx-1">
              {studentData?.state || ""}
            </span>
          </p>

          <p>
            I have Not Registered His Birth details At Any Appropriate
            Authority. Hence I am Giving This Self Affidavit To the School
            Authority For Admission Of My Child In Standard{" "}
            <span className="font-bold underline decoration-dotted mx-1">
              {classData?.class || ""}
            </span>
            , Medium{" "}
            <span className="font-bold underline decoration-dotted mx-1">
              {studentData?.mediumName || ""}
            </span>{" "}
            Academic Year{" "}
            <span className="font-bold underline decoration-dotted mx-1">
              {studentData?.academicYearName || ""}
            </span>
            .
          </p>

          <p>
            I State That Information Given Above is True and Correct To Best Of
            My Knowledge. I Solely Shall Be Responsible For cancellation Of
            admission if The information given above is false or incorrect.
            <br />I Request You to authorize to kind for Grant the admission to
            my child in Standard{" "}
            <span className="font-bold underline decoration-dotted mx-1">
              {classData?.class || ""}
            </span>{" "}
            Medium{" "}
            <span className="font-bold underline decoration-dotted mx-1">
              {studentData?.mediumName || ""}
            </span>{" "}
            Academic Year{" "}
            <span className="font-bold underline decoration-dotted mx-1">
              {studentData?.academicYearName || ""}
            </span>
            .
          </p>
        </div>

        {/* Footer with Signatures */}
        <div className="mt-16 grid grid-cols-2 gap-8 print:mt-20">
          <div>
            <p className="mb-2">
              Date:{" "}
              <span className="font-bold underline decoration-dotted mx-1">
                {issueDate}
              </span>
            </p>
            <p>
              Place:{" "}
              <span className="font-bold underline decoration-dotted mx-1">
                PALGHAR
              </span>
            </p>
          </div>

          <div className="text-right">
            <div className="flex flex-col items-end">
              <div className="flex gap-4 mb-4">
                <div className="border border-dashed border-gray-400 h-24 w-24 flex items-center justify-center text-xs text-gray-500 print:border-2">
                  Student Image
                </div>
                <div className="border border-dashed border-gray-400 h-24 w-24 flex items-center justify-center text-xs text-gray-500 print:border-2">
                  Parent's Image
                </div>
              </div>
              <div className="text-left space-y-2">
                <p>
                  Parent Name:{" "}
                  <span className="font-bold underline decoration-dotted mx-1">
                    {studentData?.fatherName || ""}
                  </span>
                </p>
                <p>Parent's Sign: _________________</p>
                <p>
                  Mobile No.:{" "}
                  <span className="font-bold underline decoration-dotted mx-1">
                    {studentData?.fatherPhone || ""}
                  </span>
                </p>
                <p>
                  Aadhaar No.:{" "}
                  <span className="font-bold underline decoration-dotted mx-1">
                    {student?.aadhaarNo || ""}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
