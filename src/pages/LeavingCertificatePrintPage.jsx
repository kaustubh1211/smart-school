import { useEffect, useState } from "react";
import axios from "axios";
import LeavingCertificate from "../components/child/LeavingCertificate";
import { useParams } from "react-router-dom";

export default function LeavingCertificatePrintPage() {
  const accessToken = localStorage.getItem("accessToken");
  // const params = useParams();
  const { id } = useParams();
  console.log("id is ", id);

  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCertificateData = async () => {
      try {
        const response = await axios.get(
          `${
            import.meta.env.VITE_LOCAL_API_URL
          }certificate/student-lc/download/${id}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (response.data.success) {
          setStudent(response.data.data);
        }
      } catch (err) {
        console.error("Error fetching certificate:", err);
        setError("Failed to load certificate");
      } finally {
        setLoading(false);
      }
    };

    fetchCertificateData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4">Loading certificate...</p>
        </div>
      </div>
    );
  }

  if (error || !student) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center text-red-500">
          <h2 className="text-2xl font-bold">Error</h2>
          <p className="mt-2">
            {error || "The requested certificate could not be found."}
          </p>
        </div>
      </div>
    );
  }

  return <LeavingCertificate student={student} />;
}
