import React, { useEffect, useState, useRef } from 'react'
import './App.css'

const App = () => {
  const canvasRef=useRef(null);
  const [isDrawing,setIsDrawing]=useState(false);
  const [context,setContext]=useState(null);
  const [drawingData,setDrawingData]=useState([]);
  const [shape,setShape]=useState('sketch');
  const [startCoords,setStartCoords]=useState({x:0,y:0});

  useEffect(()=>{
    const canvas=canvasRef.current;
    canvas.width=600;
    canvas.height=600;
    const ctx=canvas.getContext('2d');
    ctx.lineWidth= 5;
    ctx.lineCap='round';
    setContext(ctx);
  },[]);

  useEffect(()=>{
    if(context){
      context.clearRect(0,0,context.canvas.width,context.canvas.height);
      drawingData.forEach(({shape,...coords})=>{
        drawOnCanvas(shape,coords,context);
      });
    }
  },[drawingData,context])

  const handleMouseDown=(e)=>{
    setIsDrawing(true);
    const canvas=canvasRef.current;
    const rect=canvas.getBoundingClientRect();
    setStartCoords({x:e.clientX-rect.left,y:e.clientY-rect.top});
  }

  const handleMouseUp=(e)=>{
    setIsDrawing(false);
    const canvas=canvasRef.current;
    const rect=canvas.getBoundingClientRect();
    const x=e.clientX-rect.left;
    const y=e.clientY-rect.top;

    if(shape==='rectangle'||shape==='circle'){
      const coords={
        x0: startCoords.x,
        y0: startCoords.y,
        x1: x,
        y1: y,
        shape: shape,
      };
      drawOnCanvas(shape,coords,context);
      setDrawingData(prev=>[...prev,coords]);
    }
    context.beginPath();
  }

  const handleMouseMove=(e)=>{
    if(!isDrawing)return;

    const canvas=canvasRef.current;
    const rect=canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if(shape==='sketch'){
      const coords={
        x0: startCoords.x,
        y0: startCoords.y,
        x1: x,
        y1: y,
        shape: shape,
      };
      drawOnCanvas(shape,coords,context);
      setDrawingData((prev)=>[...prev,coords]);
      setStartCoords({x,y});
    }
  };

  const drawOnCanvas=(shape,{x0,y0,x1,y1},ctx)=>{
    if(shape=='sketch'){
      ctx.lineTo(x1,y1);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x1,y1);
    }else if(shape==='rectangle'){
      ctx.beginPath();
      ctx.rect(x0,y0,x1-x0,y1-y0);
      ctx.stroke();
    }else if(shape==='circle'){
      const radius=Math.sqrt(Math.pow(x1-x0,2)+Math.pow(y1-y0,2));
      ctx.beginPath();
      ctx.arc(x0,y0,radius,0,Math.PI*2);
      ctx.stroke();
    }
  };

  const eraseShape=(x,y)=>{
    const newDrawingData=drawingData.filter(({x0,y0,x1,y1,shape})=>{
      if(shape==='rectangle'||shape=='circle'){
        return !isPointInShape(x,y,{x0,y0,x1,y1,shape});
      }
      if(shape==='sketch'){
        return !isPointOnLine(x,y,{x0,y0,x1,y1});
      }
      return true;
    });
    setDrawingData(newDrawingData);
  }

  const isPointOnLine=(x,y,{x0,y0,x1,y1})=>{
    const distance = Math.abs((y1 - y0) * x - (x1 - x0) * y + x1 * y0 - y1 * x0) /
    Math.sqrt(Math.pow(y1 - y0, 2) + Math.pow(x1 - x0, 2));
  return distance < 5; 
  };

  const isPointInShape = (x, y, { x0, y0, x1, y1, shape }) => {
    if (shape === 'rectangle') {
      return x >= x0 && x <= x1 && y >= y0 && y <= y1;
    }
    if (shape === 'circle') {
      const radius = Math.sqrt(Math.pow(x1 - x0, 2) + Math.pow(y1 - y0, 2));
      const distance = Math.sqrt(Math.pow(x - x0, 2) + Math.pow(y - y0, 2));
      return distance <= radius;
    }
    return false;
  };


  return (
    <div>
      <div className='toolbar'>
        <button onClick={()=>setShape('sketch')}>Sketch</button>
        <button onClick={()=>setShape('rectangle')}>Rectangle</button>
        <button onClick={()=>setShape('circle')}>Circle</button>
        <button onClick={()=>setShape('eraser')}>Eraser</button>
      </div>

      <canvas 
      ref={canvasRef}
      onMouseDown={shape==='eraser'?(e)=>eraseShape(e.clientX,e.clientY):handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
      style={{ border: '1px solid black' }}
      ></canvas>
    </div>
  )
}

export default App
