import React, { useState } from 'react';
import { Stage, Layer, Line, Rect, Circle } from 'react-konva';
import './Dapp.css'

const SketchBoard = () => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [lines, setLines] = useState([]);
  const [shape,setShape]=useState([]);
  const [tool, setTool] = useState('pen');
  const [eraserPos, setEraserPos] = useState({ x: 0, y: 0 });
  const [startPos,setStartPos]=useState(null);// Start position for rect/circle

  const handleMouseDown = (e) => {
    const pos = e.target.getStage().getPointerPosition();

    if (tool === 'pen') {
      setIsDrawing(true);
      setLines([...lines, { points: [pos.x, pos.y] }]);
    }else if(tool=='rect'||tool=='circle'){
      setStartPos(pos);
      setIsDrawing(true);
    }else if(tool==='eraser'){
      setIsDrawing(true);
      eraseStroke(pos);
    }
  };

  const handleMouseMove = (e) => {
    if(!isDrawing)return;
    const stage = e.target.getStage();
    const point = stage.getPointerPosition();

    if (tool === 'pen') {
      const lastLine = lines[lines.length - 1];
      lastLine.points = lastLine.points.concat([point.x, point.y]);
      setLines(lines.slice(0, -1).concat([lastLine]));
    } else if(tool==='rect'&&startPos){
       const newRect={
        x: Math.min(point.x,startPos.x),
        y: Math.min(point.y,startPos.y),
        width: Math.abs(point.x-startPos.x),
        height: Math.min(point.y-startPos.y),
      };
      setShape([...shape.slice(0,-1),{type: 'rect',...newRect}]);
    }else if (tool === 'circle' && startPos) {
      const radius = Math.hypot(point.x - startPos.x, point.y - startPos.y);
      const newCircle = {
        x: startPos.x,
        y: startPos.y,
        radius: radius,
      };
      setShape([...shape.slice(0, -1), { type: 'circle', ...newCircle }]);
    } else if (tool === 'eraser') {
      setEraserPos({ x: point.x, y: point.y });
      eraseStroke(point);
    }
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
    setStartPos(null);
  }

  const eraseStroke = (eraserPosition) => {
    if (!isDrawing) return;
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
        <button 
          className={tool === 'rect' ? 'active' : ''} 
          onClick={() => setTool('rect')}
        >
          Rectangle
        </button>
        <button 
          className={tool === 'circle' ? 'active' : ''} 
          onClick={() => setTool('circle')}
        >
          Circle
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
            {shape.map((sp,i)=>(
              sp.type==='rect'?(
                <Rect
                key={i}
                x={sp.x}
                y={sp.y}
                width={sp.width}
                height={sp.height}
                stroke="black" 
                />
              ):(
                <Circle
                key={i}
                x={sp.x}
                y={sp.y}
                radius={sp.radius}
                stroke="black" 
                />
              )
            ))}
            {tool === 'eraser' && isDrawing && (
              <Circle x={eraserPos.x} y={eraserPos.y} radius={5} fill="gray" />
            )}
          </Layer>
        </Stage>
      </div>
    </div>
  );
};

export default SketchBoard;
