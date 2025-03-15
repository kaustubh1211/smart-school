export function AffidavitDocument({ student }) {
  return (
    <div className="print:p-0 print:border-0">
      <div className="p-8 max-w-[210mm] mx-auto">
        {/* School Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold font-serif text-red-800">
            Shri Raghubir Primary English School
          </h1>
          <p className="text-sm mt-1">
            YADAV NAGAR, BOISAR (EAST), PALGHAR-401501 MAHARASHTRA
          </p>
          <p className="text-xs mt-1">Contact No.: 9657173935</p>
          <div className="border-b-2 border-red-800 my-4"></div>
        </div>

        {/* Affidavit Title */}
        <div className="text-center mb-12">
          <h2 className="text-xl font-bold underline">SELF AFFIDAVIT</h2>
          <div className="px-4 mt-2 space-y-1">
            <p className="text-xs">
              (Parents/Guardians Written Promise letter Regarding their Son /
              Daughter / Wards date of Birth)
            </p>
            <p className="text-xs">(Maharashtra Government)</p>
            <p className="text-xs">
              Decision Std P.R.E. / 2010 / (215) Primary Education Mantralaya
              Mumbai - 32, Dated: 11-06-2010
            </p>
            <p className="text-sm mt-2">DATE OF BIRTH (AGE) PROMISE LETTER</p>
          </div>
          <p className="text-sm mt-2">
            (To Be Submitted At Time Of Admission If There Is No Birth
            Certificate /Leaving Certificate)
          </p>
        </div>

        {/* Affidavit Content */}
        <div className="space-y-8 text-justify leading-relaxed">
          <p>
            I Shri/Smt{" "}
            <span className="font-bold underline decoration-dotted mx-1">
              {student.parentName}
            </span>
            , Father of{" "}
            <span className="font-bold underline decoration-dotted">
              {student.name}
            </span>
            , Residing At{" "}
            <span className="font-bold underline decoration-dotted mx-1">
              {student.address}
            </span>{" "}
            Do Here With On Solemn Affirmation State That My Child/ward was born
            on{" "}
            <span className="font-bold underline decoration-dotted mx-1">
              {student.dob}
            </span>
            <span> In words ( </span>
            <span className="font-bold underline decoration-dotted mx-1">
              {student.dobInWords}
            </span>{" "}
            ). At{" "}
            <span className="font-bold underline decoration-dotted mx-1">
              {student.birthPlace}
            </span>
            , ( Place of Birth ), Dist.{" "}
            <span className="font-bold underline decoration-dotted mx-1">
              {student.district}
            </span>
            , State{" "}
            <span className="font-bold underline decoration-dotted mx-1">
              {student.state}
            </span>
          </p>

          <p>
            I have Not Registered His Birth details At Any Appropriate
            Authority. Hence I am Giving This Self Affidavit To the School
            Authority For Admission Of My Child In Standard{" "}
            <span className="font-bold underline decoration-dotted mx-1">
              {student.class}
            </span>
            , Medium{" "}
            <span className="font-bold underline decoration-dotted mx-1">
              {student.medium}
            </span>{" "}
            Academic Year{" "}
            <span className="font-bold underline decoration-dotted mx-1">
              {student.academicYear}
            </span>
            .
          </p>

          <p>
            I State That Information Given Above is True and Correct To Best Of
            My Knowledge. I Solely Shall Be Responsible For cancellation Of
            admission if The information given above is false or incorrect.
            <br />
            I Request You to authorize to kind for Grant the admission
            to my child in Standard{" "}
            <span className="font-bold underline decoration-dotted mx-1">
              {student.class}
            </span>{" "}
            Medium{" "}
            <span className="font-bold underline decoration-dotted mx-1">
              {student.medium}
            </span>{" "}
            Academic Year{" "}
            <span className="font-bold underline decoration-dotted mx-1">
              {student.academicYear}
            </span>
            .
          </p>
        </div>

        {/* Footer with Signatures */}
        <div className="mt-16 grid grid-cols-2 gap-8">
          <div>
            <p className="mb-2">
              Date:{" "}
              <span className="font-bold underline decoration-dotted mx-1">
                {new Date().toLocaleDateString("en-GB")}
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
                <div className="border border-dashed border-gray-400 h-24 w-24 flex items-center justify-center text-xs text-gray-500">
                  Student Image
                </div>
                <div className="border border-dashed border-gray-400 h-24 w-24 flex items-center justify-center text-xs text-gray-500">
                  Parent's Image
                </div>
              </div>
              <div className="text-left space-y-2">
                <p>
                  Parent Name:{" "}
                  <span className="font-bold underline decoration-dotted mx-1">
                    {student.parentName}
                  </span>
                </p>
                <p>Parent's Sign: _________________</p>
                <p>
                  Mobile No.:{" "}
                  <span className="font-bold underline decoration-dotted mx-1">
                    {student.mobileNo}
                  </span>
                </p>
                <p>
                  Aadhaar No.:{" "}
                  <span className="font-bold underline decoration-dotted mx-1">
                    {student.aadhaarNo}
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
