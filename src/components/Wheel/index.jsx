import React, { useEffect, useRef, useState } from "react";
import { Button, Space } from "antd";
import { capitalize, COLOR_DICT } from "../../utils";
import confetti from "canvas-confetti";
import "./index.css";

const Wheel = ({ participants }) => {
  const canvasRef = useRef(null);
  const numSectors = participants.length;
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [spinDirection, setSpinDirection] = useState("clockwise");
  const [showPopup, setShowPopup] = useState(false);
  const [popupWinner, setPopupWinner] = useState(null);
  useEffect(() => {
    if (canvasRef.current) {
      drawWheel();
    }
  }, [participants, rotation]);

  useEffect(() => {
    if (showPopup) {
      startConfetti();
      const timer = setTimeout(() => setShowPopup(false), 5000); // Hide popup after 5 seconds
      return () => clearTimeout(timer);
    }
  }, [showPopup]);

  const darkenColor = (color, amount) => {
    let r = parseInt(color.slice(1, 3), 16);
    let g = parseInt(color.slice(3, 5), 16);
    let b = parseInt(color.slice(5, 7), 16);

    r = Math.max(0, r - amount);
    g = Math.max(0, g - amount);
    b = Math.max(0, b - amount);

    return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)}`;
  };

  const drawWheel = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const radius = canvas.width / 2;
    const sliceAngle = (2 * Math.PI) / numSectors;

    // Clear previous drawing
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.translate(radius, radius);
    ctx.rotate(-rotation * (Math.PI / 180));

    // Draw sectors
    for (let i = 0; i < numSectors; i++) {
      const startAngle = i * sliceAngle;
      const endAngle = (i + 1) * sliceAngle;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, radius, startAngle, endAngle);
      ctx.closePath();
      const color = darkenColor(COLOR_DICT[i % COLOR_DICT.length], 30);
      ctx.fillStyle = color;
      ctx.fill();

      // Draw the name in the sector
      ctx.save();
      ctx.rotate((startAngle + endAngle) / 2);
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = "white";
      ctx.font = "16px Arial";
      ctx.shadowColor = "rgba(0, 0, 0, 0.7)";
      ctx.shadowOffsetX = 1;
      ctx.shadowOffsetY = 1;
      ctx.shadowBlur = 3;
      ctx.fillText(participants[i] || "", radius * 0.5, 0);
      ctx.restore();
    }

    ctx.rotate(rotation * (Math.PI / 180)); // Reset rotation
    ctx.translate(-radius, -radius);

    // Draw the static indicator
    const indicatorLength = 20;
    const indicatorWidth = 10;
    ctx.save();
    ctx.translate(canvas.width, canvas.height / 2);
    ctx.beginPath();
    ctx.moveTo(-indicatorLength, 0);
    ctx.lineTo(0, indicatorWidth / 2);
    ctx.lineTo(0, -indicatorWidth / 2);
    ctx.closePath();
    ctx.fillStyle = "red";
    ctx.fill();
    ctx.restore();
  };

  const startSpin = () => {
    if (spinning) return;
    setSpinning(true);

    // Set the number of full rotations and calculate final rotation
    const numFullRotations = Math.random() * 5 + 5; // Between 5 and 10 full rotations
    const totalRotation = numFullRotations * 360;
    const finalRotation =
      (rotation +
        (spinDirection === "clockwise" ? -totalRotation : totalRotation)) %
      360;

    const spinDuration = 6000;

    // 定义一个缓动函数: 模拟逐渐减速的效果
    const easing = (t) => {
      return 1 - Math.pow(1 - t, 3);
    };

    let startTime;

    const animate = (time) => {
      if (!startTime) startTime = time;
      const elapsed = time - startTime;
      const t = Math.min(elapsed / spinDuration, 1);
      const easeT = easing(t);
      const currentRotation =
        rotation +
        (spinDirection === "clockwise" ? -totalRotation : totalRotation) *
          easeT;

      setRotation(currentRotation);

      if (elapsed < spinDuration) {
        requestAnimationFrame(animate);
      } else {
        setSpinning(false);
        determineWinner(finalRotation);
      }
    };

    requestAnimationFrame(animate);
  };

  const determineWinner = (finalRotation) => {
    const sliceAngle = 360 / numSectors;
    const normalizedRotation = ((finalRotation % 360) + 360) % 360;
    const winningSector = Math.floor(normalizedRotation / sliceAngle);

    setPopupWinner(participants[winningSector]);
    setShowPopup(true);
  };

  const changeSpinDirection = () => {
    setSpinDirection(
      spinDirection === "clockwise" ? "counterclockwise" : "clockwise"
    );
  };

  const startConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  return (
    <div>
      <canvas
        ref={canvasRef}
        width={400}
        height={400}
        style={{ borderRadius: "50%", border: "2px solid black" }}
      />
      <Space>
        <Button
          onClick={changeSpinDirection}
          disabled={participants.length === 0 || spinning}
        >
          {capitalize(spinDirection)}
        </Button>
        <Button
          onClick={startSpin}
          disabled={participants.length === 0 || spinning}
        >
          Spin
        </Button>
      </Space>
      {showPopup && popupWinner && (
        <div className="popup">
          <h2>Congratulations!</h2>
          <h3>{capitalize(popupWinner)}</h3>
        </div>
      )}
    </div>
  );
};

export default Wheel;
