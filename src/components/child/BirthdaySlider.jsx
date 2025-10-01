// import React, { useState, useEffect } from "react";

// const BirthdayDisplay = () => {
//   const [currentIndex, setCurrentIndex] = useState(0);

//   // Sample data from your API response
//   const students = [
//     {
//       firstName: "Sahil",
//       lastName: "SHarma",
//       studentPhoto:
//         "uploads/studentPhotos/b3d27d40-a701-435c-90e5-c381b726997b_1737472050222.jpg",
//       dob: "2025-01-22T00:00:00.000Z",
//     },
//     {
//       firstName: "Piyush",
//       lastName: "SHarma",
//       studentPhoto:
//         "uploads/studentPhotos/49df3a98-833d-4aaf-99ba-d5ac4cb404bf_1737472151568.jpg",
//       dob: "2025-01-22T00:00:00.000Z",
//     },
//   ];

//   // Auto-slide effect
//   useEffect(() => {
//     const timer = setInterval(() => {
//       setCurrentIndex((prevIndex) =>
//         prevIndex === students.length - 1 ? 0 : prevIndex + 1
//       );
//     }, 3000);

//     return () => clearInterval(timer);
//   }, [students.length]);

//   // Format date to show only day and month
//   const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     return date.toLocaleDateString("en-US", {
//       day: "numeric",
//       month: "long",
//     });
//   };

//   return (
//     <div className="w-96 h-48 mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
//       {/* Header */}
//       <div className="bg-orange-100 p-4">
//         <div className="flex items-center gap-2">
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             className="w-6 h-6 text-orange-500"
//             viewBox="0 0 24 24"
//             fill="none"
//             stroke="currentColor"
//             strokeWidth="2"
//             strokeLinecap="round"
//             strokeLinejoin="round"
//           >
//             <path d="M20 12v10H4V12" />
//             <path d="M2 7h20v5H2z" />
//             <path d="M12 22V7" />
//             <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
//             <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
//           </svg>
//           <h2 className="text-lg font-semibold text-gray-800">Birthday's</h2>
//         </div>
//       </div>

//       {/* Content */}
//       <div className="relative h-28">
//         {students.map((student, index) => (
//           <div
//             key={index}
//             className={`absolute w-full transition-all duration-500 ease-in-out ${
//               index === currentIndex
//                 ? "opacity-100 translate-x-0"
//                 : "opacity-0 translate-x-full"
//             }`}
//           >
//             <div className="p-4 flex items-center gap-4">
//               <img
//                 src={`${import.meta.env.VITE_SERVER_BASE_URL}${
//                   student.studentPhoto
//                 }`}
//                 alt={`${student.firstName}'s photo`}
//                 className="w-20 h-20 rounded-lg object-cover"
//               />
//               <div>
//                 <h3 className="font-semibold text-gray-800 text-lg">
//                   {student.firstName} {student.lastName}
//                 </h3>
//                 <p className="text-sm text-gray-600">Student</p>
//                 <p className="text-sm text-gray-600">
//                   {formatDate(student.dob)}
//                 </p>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Indicator Dots */}
//       <div className="px-4 py-2 flex justify-center gap-1 border-t">
//         {students.map((_, index) => (
//           <div
//             key={index}
//             className={`h-1 rounded-full transition-all duration-300 ${
//               index === currentIndex ? "w-8 bg-orange-500" : "w-4 bg-gray-200"
//             }`}
//           />
//         ))}
//       </div>
//     </div>
//   );
// };

// export default BirthdayDisplay;

import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Download, Video } from "lucide-react";

const BirthdayDisplay = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [students, setStudents] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const canvasRef = useRef(null);
  
  const accessToken = localStorage.getItem("accessToken");
  const todaysDate = new Date().toISOString().split("T")[0];

  useEffect(() => {
    const fetchBirthday = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_API_URL}students/students-birthday?date=${todaysDate}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        setStudents(response.data.data);
      } catch (error) {
        console.error("Error fetching student data:", error);
      }
    };
    fetchBirthday();
  }, []);

  useEffect(() => {
    if (students.length > 0) {
      const timer = setInterval(() => {
        setCurrentIndex((prevIndex) =>
          prevIndex === students.length - 1 ? 0 : prevIndex + 1
        );
      }, 4000);
      return () => clearInterval(timer);
    }
  }, [students.length]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
    });
  };

  const handleDotClick = (index) => {
    setCurrentIndex(index);
  };

  const loadImage = (src) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => resolve(img);
      img.onerror = () => resolve(null);
      img.src = src;
    });
  };

  const drawInitials = (ctx, firstName, lastName, x, y, size) => {
    const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
    
    // Draw circle background with gradient
    const gradient = ctx.createLinearGradient(x - size/2, y - size/2, x + size/2, y + size/2);
    gradient.addColorStop(0, "#667eea");
    gradient.addColorStop(1, "#764ba2");
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, size / 2, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw white border
    ctx.strokeStyle = "rgba(255, 255, 255, 0.8)";
    ctx.lineWidth = 8;
    ctx.stroke();
    
    // Draw initials
    ctx.fillStyle = "#ffffff";
    ctx.font = `bold ${size * 0.4}px "Segoe UI", Arial, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(initials, x, y);
  };

  const generateBirthdayVideo = async (student) => {
    setIsGenerating(true);
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = 1920;
    canvas.height = 1080;

    // Try to load student image
    const studentImg = await loadImage(
      `${import.meta.env.VITE_SERVER_BASE_URL}${student.studentPhoto}`
    );

    const stream = canvas.captureStream(30);
    const mediaRecorder = new MediaRecorder(stream, {
      mimeType: "video/webm;codecs=vp9",
      videoBitsPerSecond: 8000000
    });

    const chunks = [];
    mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
    
    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks, { type: "video/webm" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${student.firstName}_${student.lastName}_Birthday.webm`;
      a.click();
      URL.revokeObjectURL(url);
      setIsGenerating(false);
    };

    mediaRecorder.start();

    // Animation parameters
    let frame = 0;
    const totalFrames = 180; // 6 seconds at 30fps
    const confetti = [];
    
    // Create confetti particles
    for (let i = 0; i < 150; i++) {
      confetti.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height - canvas.height,
        size: Math.random() * 12 + 4,
        color: `hsl(${Math.random() * 360}, 85%, 65%)`,
        speedY: Math.random() * 4 + 2,
        speedX: Math.random() * 3 - 1.5,
        rotation: Math.random() * 360,
        rotationSpeed: Math.random() * 10 - 5
      });
    }

    const balloons = [];
    const balloonColors = ["#FF6B9D", "#C44569", "#FFA07A", "#FFD93D", "#6BCF7F", "#4ECDC4", "#95E1D3"];
    for (let i = 0; i < 20; i++) {
      balloons.push({
        x: Math.random() * canvas.width,
        y: canvas.height + Math.random() * 300,
        size: Math.random() * 70 + 50,
        color: balloonColors[Math.floor(Math.random() * balloonColors.length)],
        speedY: Math.random() * 1.2 + 0.6,
        swing: Math.random() * 3,
        swingSpeed: Math.random() * 0.02 + 0.01
      });
    }

    // Stars for sparkle effect
    const stars = [];
    for (let i = 0; i < 30; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 4 + 2,
        opacity: Math.random(),
        speed: Math.random() * 0.05 + 0.02
      });
    }

    const animate = () => {
      // Professional gradient background
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, "#1a1a2e");
      gradient.addColorStop(0.3, "#16213e");
      gradient.addColorStop(0.7, "#0f3460");
      gradient.addColorStop(1, "#533483");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Add subtle overlay pattern
      ctx.fillStyle = "rgba(255, 255, 255, 0.02)";
      for (let i = 0; i < canvas.width; i += 40) {
        for (let j = 0; j < canvas.height; j += 40) {
          ctx.fillRect(i, j, 20, 20);
        }
      }

      // Draw floating balloons
      balloons.forEach((balloon, index) => {
        balloon.y -= balloon.speedY;
        balloon.x += Math.sin(frame * balloon.swingSpeed + index) * balloon.swing;
        
        if (balloon.y < -150) {
          balloon.y = canvas.height + 100;
          balloon.x = Math.random() * canvas.width;
        }

        // Balloon shadow
        ctx.fillStyle = "rgba(0, 0, 0, 0.15)";
        ctx.beginPath();
        ctx.ellipse(balloon.x + 10, balloon.y + 10, balloon.size * 0.6, balloon.size * 0.85, 0, 0, Math.PI * 2);
        ctx.fill();

        // Balloon body with gradient
        const balloonGradient = ctx.createRadialGradient(
          balloon.x - balloon.size * 0.2, 
          balloon.y - balloon.size * 0.3, 
          0,
          balloon.x, 
          balloon.y, 
          balloon.size
        );
        balloonGradient.addColorStop(0, balloon.color);
        balloonGradient.addColorStop(1, balloon.color + "99");
        
        ctx.fillStyle = balloonGradient;
        ctx.beginPath();
        ctx.ellipse(balloon.x, balloon.y, balloon.size * 0.6, balloon.size * 0.85, 0, 0, Math.PI * 2);
        ctx.fill();

        // Balloon highlight
        ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
        ctx.beginPath();
        ctx.ellipse(balloon.x - balloon.size * 0.15, balloon.y - balloon.size * 0.25, balloon.size * 0.15, balloon.size * 0.25, 0, 0, Math.PI * 2);
        ctx.fill();

        // Balloon knot
        ctx.fillStyle = balloon.color;
        ctx.beginPath();
        ctx.ellipse(balloon.x, balloon.y + balloon.size * 0.8, balloon.size * 0.08, balloon.size * 0.12, 0, 0, Math.PI * 2);
        ctx.fill();

        // Balloon string with curve
        ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(balloon.x, balloon.y + balloon.size * 0.85);
        ctx.quadraticCurveTo(
          balloon.x + Math.sin(frame * 0.1) * 20,
          balloon.y + balloon.size * 1.2,
          balloon.x,
          balloon.y + balloon.size * 1.5
        );
        ctx.stroke();
      });

      // Draw confetti with rotation
      confetti.forEach(particle => {
        particle.y += particle.speedY;
        particle.x += particle.speedX;
        particle.rotation += particle.rotationSpeed;
        
        if (particle.y > canvas.height) {
          particle.y = -10;
          particle.x = Math.random() * canvas.width;
        }

        ctx.save();
        ctx.translate(particle.x, particle.y);
        ctx.rotate((particle.rotation * Math.PI) / 180);
        
        // Add shadow to confetti
        ctx.shadowColor = "rgba(0, 0, 0, 0.3)";
        ctx.shadowBlur = 4;
        
        ctx.fillStyle = particle.color;
        ctx.fillRect(-particle.size / 2, -particle.size / 2, particle.size, particle.size * 1.5);
        ctx.restore();
      });

      // Animated stars
      stars.forEach(star => {
        star.opacity += star.speed;
        if (star.opacity > 1 || star.opacity < 0) star.speed *= -1;
        
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.abs(star.opacity)})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
        
        // Star cross effect
        ctx.strokeStyle = `rgba(255, 255, 255, ${Math.abs(star.opacity) * 0.5})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(star.x - star.size * 2, star.y);
        ctx.lineTo(star.x + star.size * 2, star.y);
        ctx.moveTo(star.x, star.y - star.size * 2);
        ctx.lineTo(star.x, star.y + star.size * 2);
        ctx.stroke();
      });

      // Entrance animation for text
      const progress = Math.min(frame / 40, 1);
      const bounceProgress = progress < 1 ? 1 - Math.pow(1 - progress, 3) : 1;
      
      // Draw student photo or initials in a circle
      const photoSize = 280;
      const photoX = canvas.width / 2;
      const photoY = 320;
      
      ctx.save();
      ctx.translate(photoX, photoY);
      ctx.scale(bounceProgress, bounceProgress);
      
      if (studentImg) {
        // Clip to circle
        ctx.beginPath();
        ctx.arc(0, 0, photoSize / 2, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();
        
        // Draw image
        const aspectRatio = studentImg.width / studentImg.height;
        let drawWidth = photoSize;
        let drawHeight = photoSize;
        
        if (aspectRatio > 1) {
          drawHeight = photoSize / aspectRatio;
        } else {
          drawWidth = photoSize * aspectRatio;
        }
        
        ctx.drawImage(studentImg, -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight);
        
        // Border
        ctx.strokeStyle = "rgba(255, 255, 255, 0.9)";
        ctx.lineWidth = 10;
        ctx.stroke();
      } else {
        // Draw initials avatar
        drawInitials(ctx, student.firstName, student.lastName, 0, 0, photoSize);
      }
      
      // Outer glow
      ctx.shadowColor = "rgba(255, 255, 255, 0.5)";
      ctx.shadowBlur = 30;
      ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, 0, photoSize / 2 + 10, 0, Math.PI * 2);
      ctx.stroke();
      
      ctx.restore();

      // "Happy Birthday" text with professional font
      const scale = 1 + Math.sin(frame * 0.08) * 0.05;
      
      ctx.save();
      ctx.translate(canvas.width / 2, 650);
      ctx.scale(scale * bounceProgress, scale * bounceProgress);
      
      ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
      ctx.shadowBlur = 25;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 8;
      
      ctx.font = "bold 110px 'Georgia', 'Times New Roman', serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      
      // Gold gradient text
      const textGradient = ctx.createLinearGradient(0, -55, 0, 55);
      textGradient.addColorStop(0, "#FFE66D");
      textGradient.addColorStop(0.5, "#FFD700");
      textGradient.addColorStop(1, "#FFA500");
      ctx.fillStyle = textGradient;
      ctx.fillText("Happy Birthday", 0, 0);
      
      // Text outline
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 6;
      ctx.strokeText("Happy Birthday", 0, 0);
      ctx.restore();

      // Student name with elegant font
      ctx.save();
      ctx.translate(canvas.width / 2, 800);
      ctx.scale(scale * bounceProgress, scale * bounceProgress);
      
      ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
      ctx.shadowBlur = 20;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 6;
      
      ctx.font = "600 85px 'Segoe UI', 'Helvetica Neue', Arial, sans-serif";
      ctx.fillStyle = "#ffffff";
      ctx.fillText(`${student.firstName} ${student.lastName}`, 0, 0);
      
      ctx.strokeStyle = "#4ECDC4";
      ctx.lineWidth = 4;
      ctx.strokeText(`${student.firstName} ${student.lastName}`, 0, 0);
      ctx.restore();

      // Decorative line above name
      ctx.save();
      ctx.translate(canvas.width / 2, 740);
      ctx.scale(bounceProgress, bounceProgress);
      const lineGradient = ctx.createLinearGradient(-150, 0, 150, 0);
      lineGradient.addColorStop(0, "rgba(255, 255, 255, 0)");
      lineGradient.addColorStop(0.5, "rgba(255, 255, 255, 0.8)");
      lineGradient.addColorStop(1, "rgba(255, 255, 255, 0)");
      ctx.strokeStyle = lineGradient;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(-150, 0);
      ctx.lineTo(150, 0);
      ctx.stroke();
      ctx.restore();

      // Celebration message at bottom
      if (frame > 60) {
        const messageOpacity = Math.min((frame - 60) / 30, 1);
        ctx.save();
        ctx.translate(canvas.width / 2, 950);
        ctx.globalAlpha = messageOpacity;
        ctx.font = "italic 40px 'Georgia', serif";
        ctx.fillStyle = "#FFE66D";
        ctx.textAlign = "center";
        ctx.fillText("🎉 Wishing you an amazing year ahead! 🎂", 0, 0);
        ctx.restore();
      }

      frame++;
      
      if (frame < totalFrames) {
        requestAnimationFrame(animate);
      } else {
        mediaRecorder.stop();
      }
    };

    animate();
  };

  return (
    <div className="w-screen bg-white rounded-lg shadow-lg p-4">
      <canvas ref={canvasRef} style={{ display: "none" }} />
      
      {/* Header */}
      <div className="bg-orange-100 p-4">
        <div className="flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6 text-orange-500"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20 12v10H4V12" />
            <path d="M2 7h20v5H2z" />
            <path d="M12 22V7" />
            <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
            <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
          </svg>
          <h2 className="text-lg font-semibold text-gray-800">Birthday's</h2>
        </div>
      </div>

      {/* Content */}
      {students.length > 0 ? (
        <div className="relative h-36 overflow-hidden">
          {students.map((student, index) => (
            <div
              key={index}
              className={`absolute w-full transition-transform duration-500 ease-in-out ${
                index === currentIndex
                  ? "translate-x-0 opacity-100"
                  : index < currentIndex
                  ? "-translate-x-full opacity-0"
                  : "translate-x-full opacity-0"
              }`}
            >
              <div className="p-4 flex items-center gap-4">
                <img
                  src={`${import.meta.env.VITE_SERVER_BASE_URL}${student.studentPhoto}`}
                  alt={`${student.firstName}'s photo`}
                  className="w-20 h-20 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800 text-xl">
                    {student.firstName} {student.lastName}
                  </h3>
                  <p className="text-sm text-gray-600">Student</p>
                  <p className="text-sm text-blue-600 font-bold">
                    {formatDate(student.dob)}
                  </p>
                </div>
                <button
                  onClick={() => generateBirthdayVideo(student)}
                  disabled={isGenerating}
                  className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                >
                  {isGenerating ? (
                    <>
                      <Video className="w-5 h-5 animate-pulse" />
                      <span>Generating...</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-5 h-5" />
                      <span>Download Video</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-4 text-center text-gray-500">
          No birthdays to display.
        </div>
      )}

      {/* Indicator Dots */}
      {students.length > 0 && (
        <div className="px-4 py-2 flex justify-center gap-1">
          {students.map((_, index) => (
            <div
              key={index}
              onClick={() => handleDotClick(index)}
              className={`h-2 cursor-pointer rounded-full transition-all duration-300 ${
                index === currentIndex ? "w-8 bg-orange-500" : "w-4 bg-gray-300"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default BirthdayDisplay;
