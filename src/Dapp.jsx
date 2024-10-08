import React, { useState } from 'react';
import { Stage, Layer, Line, Rect, Circle } from 'react-konva';
import './Dapp.css'

const SketchBoard = () => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [lines, setLines] = useState([]);
  const [tool, setTool] = useState('pen');
  const [eraserPos, setEraserPos] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e) => {
    if (tool === 'pen') {
      setIsDrawing(true);
      const pos = e.target.getStage().getPointerPosition();
      setLines([...lines, { points: [pos.x, pos.y] }]);
    }
  };

  const handleMouseMove = (e) => {
    const stage = e.target.getStage();
    const point = stage.getPointerPosition();

    if (tool === 'pen' && isDrawing) {
      const lastLine = lines[lines.length - 1];
      lastLine.points = lastLine.points.concat([point.x, point.y]);
      setLines(lines.slice(0, -1).concat([lastLine]));
    } else if (tool === 'eraser') {
      setEraserPos({ x: point.x, y: point.y });
      eraseStroke(point);
    }
  };

  const handleMouseUp = () => setIsDrawing(false);

  const eraseStroke = (eraserPosition) => {
    const remainingLines = lines.filter((line) => {
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
      <header>SketchBoard</header>
      <div id="toolButtons">
        <button 
          className={tool === 'pen' ? 'active' : ''} 
          onClick={() => setTool('pen')}
        >
          Pen
        </button>
        <button 
          className={tool === 'eraser' ? 'active' : ''} 
          onClick={() => setTool('eraser')}
        >
          Eraser
        </button>
      </div>

      <div id="stageWrapper">
        <Stage
          width={600}
          height={400}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
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
              <Circle x={eraserPos.x} y={eraserPos.y} radius={5} fill="gray" />
            )}
          </Layer>
        </Stage>
      </div>
    </div>
  );
};

export default SketchBoard;
