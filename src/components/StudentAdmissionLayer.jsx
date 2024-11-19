import React from "react";
import StudentAdmissionForm from "./child/StudentAdmissionForm";
// import InputFormWithIcons from "./child/InputFormWithIcons";
// import HorizontalInputForm from "./child/HorizontalInputForm";
// import HorizontalInputFormWithIcons from "./child/HorizontalInputFormWithIcons";

const StudentAdmissionLayer = () => {
  return (
    <div className="row gy-4">
      {/* VerticalInputForm */}
      <StudentAdmissionForm />

      {/* InputFormWithIcons */}
      {/* <InputFormWithIcons /> */}

      {/* HorizontalInputForm */}
      {/* <HorizontalInputForm /> */}

      {/* HorizontalInputFormWithIcons */}
      {/* <HorizontalInputFormWithIcons /> */}
    </div>
  );
};

export default StudentAdmissionLayer;
