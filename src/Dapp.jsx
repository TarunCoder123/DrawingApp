import React, { useState } from 'react';
import { Stage, Layer, Line, Rect, Circle } from 'react-konva';

const SketchBoard = () => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [lines, setLines] = useState([]); // Stores the strokes (lines)
  const [tool, setTool] = useState('pen'); // Can be 'pen' or 'eraser'
  const [eraserPos, setEraserPos] = useState({ x: 0, y: 0 });

  // Handle Mouse Down for Drawing
  const handleMouseDown = (e) => {
    if (tool === 'pen') {
      setIsDrawing(true);
      const pos = e.target.getStage().getPointerPosition();
      setLines([...lines, { points: [pos.x, pos.y] }]);
    }
  };

  // Handle Mouse Move for Drawing and Erasing
  const handleMouseMove = (e) => {
    const stage = e.target.getStage();
    const point = stage.getPointerPosition();

    if (tool === 'pen' && isDrawing) {
      const lastLine = lines[lines.length - 1];
      lastLine.points = lastLine.points.concat([point.x, point.y]);
      setLines(lines.slice(0, -1).concat([lastLine]));
    } else if (tool === 'eraser') {
      // Track the eraser's position
      setEraserPos({ x: point.x, y: point.y });
      eraseStroke(point);
    }
  };

  // Handle Mouse Up for Drawing
  const handleMouseUp = () => setIsDrawing(false);

  // Erase stroke if eraser overlaps a stroke
  const eraseStroke = (eraserPosition) => {
    const remainingLines = lines.filter((line) => {
      // Check if eraser is near any point of the stroke
      return !line.points.some((point, index) => 
        index % 2 === 0 &&
        Math.abs(point - eraserPosition.x) < 10 && 
        Math.abs(line.points[index + 1] - eraserPosition.y) < 10
      );
    });
    setLines(remainingLines);
  };

  return (
    <div>
      <button onClick={() => setTool('pen')}>Pen</button>
      <button onClick={() => setTool('eraser')}>Eraser</button>

      <Stage
        width={600}
        height={400}
        style={{ border: '2px solid black' }} // Sketchboard with a solid border
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp} // Handle mouse leaving the canvas
      >
        <Layer>
          <Rect width={600} height={400} stroke="black" />
          {lines.map((line, i) => (
            <Line
              key={i}
              points={line.points}
              stroke="black"
              strokeWidth={2}
              lineCap="round"
              lineJoin="round"
            />
          ))}
          {tool === 'eraser' && (
            <Circle
              x={eraserPos.x}
              y={eraserPos.y}
              radius={10}
              fill="gray"
            />
          )}
        </Layer>
      </Stage>
    </div>
  );
};

export default SketchBoard;
