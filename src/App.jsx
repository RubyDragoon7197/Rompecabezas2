import React, { useState, useEffect } from "react";

export default function App() {
  const [rows, setRows] = useState(2);
  const [cols, setCols] = useState(2);
  const pieceSize = 100;
  const imageUrl =
    "https://pm1.aminoapps.com/8062/75c43124267d9dc4a0be3e37648406cda1add0edr1-859-393v2_hq.jpg";

  const createInitial = (r, c) => Array.from({ length: r * c }, (_, i) => i);

  const shuffle = (arr) => {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };

  const [pieces, setPieces] = useState(() => shuffle(createInitial(rows, cols)));
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setPieces(shuffle(createInitial(rows, cols)));
  }, [rows, cols]);

  const handleDragStart = (e, index) => {
    e.dataTransfer.setData("text/plain", String(index));
    setDraggedIndex(index);
  };
  const handleDragOver = (e) => e.preventDefault();
  const handleDrop = (e, index) => {
    e.preventDefault();
    const fromStr = e.dataTransfer.getData("text/plain");
    const from = fromStr ? parseInt(fromStr, 10) : draggedIndex;
    if (isNaN(from) || from === index) {
      setDraggedIndex(null);
      return;
    }
    const next = [...pieces];
    [next[from], next[index]] = [next[index], next[from]];
    setPieces(next);
    setDraggedIndex(null);
    setSelectedIndex(null);
  };

  const handleClickPiece = (index) => {
    if (selectedIndex === null) {
      setSelectedIndex(index);
    } else {
      const next = [...pieces];
      [next[selectedIndex], next[index]] = [next[index], next[selectedIndex]];
      setPieces(next);
      setSelectedIndex(null);
    }
  };

  const reshuffle = () => setPieces(shuffle(createInitial(rows, cols)));

  const isSolved = pieces.every((val, idx) => val === idx);

  function bgPositionFor(pieceIndex) {
    const col = pieceIndex % cols;
    const row = Math.floor(pieceIndex / cols);
    const x = cols === 1 ? 50 : (col * 100) / (cols - 1);
    const y = rows === 1 ? 50 : (row * 100) / (rows - 1);
    return `${x}% ${y}%`;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="flex flex-col items-center justify-center w-full max-w-lg">
        <h1 className="text-3xl font-bold text-center mb-6">🧩 Rompecabezas</h1>

        {/* Selector de dificultad */}
        <div className="flex justify-center mb-4">
          <label className="mr-2 font-medium">Dificultad:</label>
          <select
            value={rows}
            onChange={(e) => {
              const size = parseInt(e.target.value, 10);
              setRows(size);
              setCols(size);
            }}
            className="border p-2 rounded"
          >
            <option value={2}>2x2 (Fácil)</option>
            <option value={3}>3x3 (Medio)</option>
            <option value={4}>4x4 (Difícil)</option>
          </select>
        </div>

        {/* Preview de la imagen completa */}
        <div className="flex justify-center mb-4">
          {!imageError ? (
            <img
              src={imageUrl}
              alt="Preview"
              onError={() => setImageError(true)}
              className="w-56 h-auto rounded shadow"
            />
          ) : (
            <div className="w-56 h-40 flex items-center justify-center bg-red-100 text-red-700 rounded">
              Error cargando imagen
            </div>
          )}
        </div>

        {/* Controles */}
        <div className="flex items-center justify-center mb-4 gap-4">
          <button
            onClick={reshuffle}
            className="px-3 py-2 bg-blue-600 text-white rounded shadow"
          >
            Mezclar
          </button>
          <div className="text-sm text-gray-600 text-center">
            {isSolved ? "🎉 Resuelto" : "🔀 Mezcla las piezas"}
          </div>
        </div>

        {/* Puzzle */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${cols}, ${pieceSize}px)`,
            gap: 6,
            background: "#000",
            padding: 6,
            borderRadius: 8,
            justifyContent: "center",
          }}
        >
          {pieces.map((piece, index) => (
            <div
              key={index}
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, index)}
              onClick={() => handleClickPiece(index)}
              style={{
                width: pieceSize,
                height: pieceSize,
                backgroundImage: `url("${imageUrl}")`,
                backgroundSize: `${cols * 100}% ${rows * 100}%`,
                backgroundPosition: bgPositionFor(piece),
                backgroundRepeat: "no-repeat",
                border:
                  selectedIndex === index ? "3px solid #f59e0b" : "2px solid #fff",
                borderRadius: 6,
                cursor: "pointer",
                boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
              }}
            />
          ))}
        </div>

        {isSolved && (
          <p className="mt-4 text-green-600 font-semibold text-center">
            🎉 ¡Felicidades, completaste el rompecabezas!
          </p>
        )}
      </div>
    </div>
  );
}
