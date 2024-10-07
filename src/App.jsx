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

  }


  return (
    <div>
      HI
    </div>
  )
}

export default App
