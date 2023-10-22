import React, { useState, useEffect, createRef } from 'react';
import '../assets/style.css';

const ColorPicker = () => {
    const [rgbaColor, setRgbaColor] = useState('rgba(255,0,0,1)');
    const [drag, setDrag] = useState(false);

    const colorStripRef = createRef<HTMLCanvasElement>();
    const colorBlockRef = createRef<HTMLCanvasElement>();
    const colorLabelRef = createRef<HTMLLabelElement>();

    const width1 = 150;
    const height1 = 150;
    const width2 = 50;
    const height2 = 150;

    let ctx1: CanvasRenderingContext2D | null = null;
    let ctx2: CanvasRenderingContext2D | null = null;

    const initializeCanvases = () => {
        if (colorBlockRef.current && colorStripRef.current) {
            ctx1 = colorBlockRef.current.getContext('2d');
            ctx2 = colorStripRef.current.getContext('2d');

            if (ctx1 && ctx2) {
                ctx1.rect(0, 0, width1, height1);
                fillGradient();

                ctx2.rect(0, 0, width2, height2);
                const grd1 = ctx2.createLinearGradient(0, 0, 0, height1);
                grd1.addColorStop(0, 'rgba(255, 0, 0, 1)');
                grd1.addColorStop(0.17, 'rgba(255, 255, 0, 1)');
                grd1.addColorStop(0.34, 'rgba(0, 255, 0, 1)');
                grd1.addColorStop(0.51, 'rgba(0, 255, 255, 1)');
                grd1.addColorStop(0.68, 'rgba(0, 0, 255, 1)');
                grd1.addColorStop(0.85, 'rgba(255, 0, 255, 1)');
                grd1.addColorStop(1, 'rgba(255, 0, 0, 1)');
                ctx2.fillStyle = grd1;
                ctx2.fill();
            }
        }
    };

    const fillGradient = () => {
        if (ctx1) {
            ctx1.fillStyle = rgbaColor;
            ctx1.fillRect(0, 0, width1, height1);

            const grdWhite = ctx2?.createLinearGradient(0, 0, width1, 0);
            if (grdWhite) {
                grdWhite.addColorStop(0, 'rgba(255,255,255,1)');
                grdWhite.addColorStop(1, 'rgba(255,255,255,0)');
                ctx1.fillStyle = grdWhite;
                ctx1.fillRect(0, 0, width1, height1);
            }

            const grdBlack = ctx2?.createLinearGradient(0, 0, 0, height1);
            if (grdBlack) {
                grdBlack.addColorStop(0, 'rgba(0,0,0,0)');
                grdBlack.addColorStop(1, 'rgba(0,0,0,1)');
                ctx1.fillStyle = grdBlack;
                ctx1.fillRect(0, 0, width1, height1);
            }
        }
    };

    const mousedown = (e: React.MouseEvent<HTMLCanvasElement>) => {
        setDrag(true);
        changeColor(e);
    };

    const mousemove = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (drag) {
            changeColor(e);
        }
    };

    const mouseup = () => {
        setDrag(false);
    };

    const changeColor = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (ctx1) {
            const x = e.nativeEvent.offsetX;
            const y = e.nativeEvent.offsetY;
            const imageData = ctx1.getImageData(x, y, 1, 1).data;
            const newRgbaColor = `rgba(${imageData[0]},${imageData[1]},${imageData[2]},1)`;
            setRgbaColor(newRgbaColor);
            colorLabelRef.current!.style.backgroundColor = newRgbaColor;
        }
    };

    useEffect(() => {
        initializeCanvases();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div>
            <label ref={colorLabelRef} id="color-label" htmlFor="color-input" style={{ backgroundColor: rgbaColor }}></label>
            <input type="checkbox" id="color-input" checked={drag} onChange={(e) => setDrag(e.target.checked)} />

            <div id="color-picker" style={{ display: 'flex', gap: '10px' }}>
                <canvas
                    ref={colorBlockRef} id="color-block" height={height1} width={width1} onMouseDown={mousedown} onMouseUp={mouseup}
                    onMouseMove={mousemove}
                ></canvas>
                <canvas style={{ width: '15px', borderRadius: '20px' }}
                    ref={colorStripRef}
                    id="color-strip"
                    height={height2}
                    width={width2}
                    onMouseDown={mousedown}
                    onMouseUp={mouseup}
                    onMouseMove={mousemove}
                >
                </canvas>

            </div>
        </div>
    );
};

export default ColorPicker;
