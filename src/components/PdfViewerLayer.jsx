import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function PdfViewerLayer() {
  const accessToken = localStorage.getItem("accessToken");

  const id = useParams();

  const [reciptDetail, setReciptDetail] = useState([]);

  const [showDialog, setShowDialog] = useState(false);

  const handleOpenDialog = () => {
    setShowDialog(true);
  };

  const handleCloseDialog = () => {
    setShowDialog(false);
  };

  useEffect(() => {
    async function fetchReciptDetails() {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_LOCAL_API_URL}fee/receipt/${id}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        setReciptDetail(response.data.data);
      } catch (error) {
        console.error(error);
      }
    }
    fetchReciptDetails();
  }, []);

  return <div>hii</div>;
}

export default PdfViewerLayer;
