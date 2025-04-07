import Breadcrumb from "@/components/Breadcrumb";
import UpdateBonafideCertificate from "@/components/UpdateBonafideCertificate";
import MasterLayout from "@/masterLayout/MasterLayout";
import { NavigationOff } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const UpdateBonafidePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);

  useEffect(() => {
    const students = JSON.parse(
      localStorage.getItem("bonafideCertificates") || []
    );
    const foundStudent = students.find((s) => String(s.id) === String(id));

    if (!foundStudent) {
      navigate("/bonafide-certificates");
      return;
    }

    setStudent(foundStudent);
  }, [id, navigate]);

  const handleUpdate = (updatedStudent) => {
    try {
      const bonafideStudents = JSON.parse(
        localStorage.getItem("bonafideCertificates") || []
      );
      const updateList = (list) => {
        return list.map((s) =>
          String(s.id) === String(id) ? updatedStudent : s
        );
      };

      if (bonafideStudents.some((s) => String(s.id) === String(id))) {
        localStorage.setItem(
          "bonafideCertificates",
          JSON.stringify(updateList(bonafideStudents))
        );
      }

      navigate("/bonafide-certificates");
    } catch (error) {
      console.log("Error updating student: ", error);
    }
  };

  if (!student) {
    return null;
  }
  return (
    <div>
      <MasterLayout>
        <Breadcrumb title="Update Leaving Certificate" />
        <UpdateBonafideCertificate
          student={student}
          onUpdate={handleUpdate}
          onCancel={() => navigate("/bonafide-certificates")}
        />
      </MasterLayout>
    </div>
  );
};

export default UpdateBonafidePage;
