import { useState, useRef, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';

/**
 * Modal interactivo para ajustar, encuadrar, recortar y rotar imágenes de proyectos.
 * Proporciona controles de arrastre (pan), zoom, rotación y ajuste a proporción 16:9.
 */
export const ImageAdjusterModal = ({
    isOpen,
    imageFile,
    aspectRatio = 16 / 9,
    onSave,
    onClose,
}) => {
    const canvasRef = useRef(null);
    const [imageObj, setImageObj] = useState(null);
    const [zoom, setZoom] = useState(1);
    const [pan, setPan] = useState({ x: 0, y: 0 });
    const [rotation, setRotation] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [fitMode, setFitMode] = useState('cover'); // 'cover' | 'contain'

    // Cargar la imagen cuando cambia el archivo
    useEffect(() => {
        if (!imageFile) {
            setImageObj(null);
            return;
        }

        const objectUrl = URL.createObjectURL(imageFile);
        const img = new Image();
        img.onload = () => {
            setImageObj(img);
            setZoom(1);
            setPan({ x: 0, y: 0 });
            setRotation(0);
            setFitMode('cover');
        };
        img.src = objectUrl;

        return () => {
            URL.revokeObjectURL(objectUrl);
        };
    }, [imageFile]);

    // Calcular escala base para 'cover' o 'contain' dentro del marco (cropArea)
    const getBaseScale = useCallback((img, cropWidth, cropHeight, rot, mode) => {
        if (!img) return 1;
        const isRotated = rot === 90 || rot === 270;
        const imgW = isRotated ? img.naturalHeight : img.naturalWidth;
        const imgH = isRotated ? img.naturalWidth : img.naturalHeight;

        const scaleW = cropWidth / imgW;
        const scaleH = cropHeight / imgH;

        return mode === 'cover'
            ? Math.max(scaleW, scaleH)
            : Math.min(scaleW, scaleH);
    }, []);

    // Dibujar en el canvas de previsualización
    const drawCanvas = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas || !imageObj) return;

        const ctx = canvas.getContext('2d');
        const dpr = window.devicePixelRatio || 1;

        // Tamaño visual del canvas
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;

        canvas.width = width * dpr;
        canvas.height = height * dpr;
        ctx.scale(dpr, dpr);

        // Fondo oscuro del área de trabajo
        ctx.fillStyle = '#18181b';
        ctx.fillRect(0, 0, width, height);

        // Definir marco de recorte (aspectRatio 16:9 centrado)
        const margin = 20;
        const maxW = width - margin * 2;
        const maxH = height - margin * 2;

        let cropW = maxW;
        let cropH = cropW / aspectRatio;

        if (cropH > maxH) {
            cropH = maxH;
            cropW = cropH * aspectRatio;
        }

        const cropX = (width - cropW) / 2;
        const cropY = (height - cropH) / 2;

        // Dibujar imagen con transformaciones
        ctx.save();

        // Máscara de recorte para solo mostrar dentro del marco 16:9
        ctx.beginPath();
        ctx.rect(cropX, cropY, cropW, cropH);
        ctx.clip();

        // Fondo neutro dentro del marco si no cubre todo
        ctx.fillStyle = '#27272a';
        ctx.fillRect(cropX, cropY, cropW, cropH);

        const baseScale = getBaseScale(imageObj, cropW, cropH, rotation, fitMode);
        const finalScale = baseScale * zoom;

        // Mover el contexto al centro del marco de recorte + desplazamiento del usuario
        ctx.translate(cropX + cropW / 2 + pan.x, cropY + cropH / 2 + pan.y);
        ctx.rotate((rotation * Math.PI) / 180);
        ctx.scale(finalScale, finalScale);

        // Dibujar imagen centrada en el origen transformado
        ctx.drawImage(
            imageObj,
            -imageObj.naturalWidth / 2,
            -imageObj.naturalHeight / 2
        );

        // Guía de composición (regla de los tercios)
        ctx.restore();

        // Dibujar borde del marco de recorte
        ctx.strokeStyle = '#829821';
        ctx.lineWidth = 2;
        ctx.strokeRect(cropX, cropY, cropW, cropH);

        // Líneas tenues de guía
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 4]);

        ctx.beginPath();
        // Guías verticales
        ctx.moveTo(cropX + cropW / 3, cropY);
        ctx.lineTo(cropX + cropW / 3, cropY + cropH);
        ctx.moveTo(cropX + (cropW * 2) / 3, cropY);
        ctx.lineTo(cropX + (cropW * 2) / 3, cropY + cropH);
        // Guías horizontales
        ctx.moveTo(cropX, cropY + cropH / 3);
        ctx.lineTo(cropX + cropW, cropY + cropH / 3);
        ctx.moveTo(cropX, cropY + (cropH * 2) / 3);
        ctx.lineTo(cropX + cropW, cropY + (cropH * 2) / 3);
        ctx.stroke();
        ctx.setLineDash([]);
    }, [imageObj, zoom, pan, rotation, fitMode, aspectRatio, getBaseScale]);

    useEffect(() => {
        if (isOpen) {
            drawCanvas();
        }
    }, [isOpen, drawCanvas]);

    // Redibujar al redimensionar la ventana
    useEffect(() => {
        window.addEventListener('resize', drawCanvas);
        return () => window.removeEventListener('resize', drawCanvas);
    }, [drawCanvas]);

    // Manejar inicio de arrastre
    const handleMouseDown = (e) => {
        setIsDragging(true);
        setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    };

    const handleMouseMove = (e) => {
        if (!isDragging) return;
        setPan({
            x: e.clientX - dragStart.x,
            y: e.clientY - dragStart.y,
        });
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    // Soporte táctil para móviles
    const handleTouchStart = (e) => {
        if (e.touches.length === 1) {
            setIsDragging(true);
            setDragStart({
                x: e.touches[0].clientX - pan.x,
                y: e.touches[0].clientY - pan.y,
            });
        }
    };

    const handleTouchMove = (e) => {
        if (!isDragging || e.touches.length !== 1) return;
        setPan({
            x: e.touches[0].clientX - dragStart.x,
            y: e.touches[0].clientY - dragStart.y,
        });
    };

    const handleTouchEnd = () => {
        setIsDragging(false);
    };

    // Zoom con rueda de ratón
    const handleWheel = (e) => {
        e.preventDefault();
        const delta = e.deltaY < 0 ? 0.1 : -0.1;
        setZoom((prev) => Math.min(Math.max(1, prev + delta), 3.5));
    };

    // Rotar 90 grados
    const handleRotate = () => {
        setRotation((prev) => (prev + 90) % 360);
    };

    // Resetear posición y zoom
    const handleReset = () => {
        setZoom(1);
        setPan({ x: 0, y: 0 });
        setRotation(0);
        setFitMode('cover');
    };

    // Exportar imagen final recortada
    const handleApply = () => {
        if (!imageObj) return;

        // Dimensiones estándar HD 16:9
        const outputWidth = 1280;
        const outputHeight = Math.round(outputWidth / aspectRatio);

        const exportCanvas = document.createElement('canvas');
        exportCanvas.width = outputWidth;
        exportCanvas.height = outputHeight;
        const ctx = exportCanvas.getContext('2d');

        // Fondo neutro
        ctx.fillStyle = '#18181b';
        ctx.fillRect(0, 0, outputWidth, outputHeight);

        // Relación entre el canvas de previsualización y el exportCanvas
        const previewCanvas = canvasRef.current;
        if (!previewCanvas) return;

        const margin = 20;
        const width = previewCanvas.clientWidth;
        const height = previewCanvas.clientHeight;
        const maxW = width - margin * 2;
        const maxH = height - margin * 2;

        let cropW = maxW;
        let cropH = cropW / aspectRatio;
        if (cropH > maxH) {
            cropH = maxH;
            cropW = cropH * aspectRatio;
        }

        const scaleRatio = outputWidth / cropW;
        const baseScale = getBaseScale(imageObj, outputWidth, outputHeight, rotation, fitMode);
        const finalScale = baseScale * zoom;

        ctx.save();
        ctx.translate(
            outputWidth / 2 + pan.x * scaleRatio,
            outputHeight / 2 + pan.y * scaleRatio
        );
        ctx.rotate((rotation * Math.PI) / 180);
        ctx.scale(finalScale, finalScale);

        ctx.drawImage(
            imageObj,
            -imageObj.naturalWidth / 2,
            -imageObj.naturalHeight / 2
        );
        ctx.restore();

        // Convertir a Blob y luego a File
        exportCanvas.toBlob(
            (blob) => {
                if (!blob) return;
                const fileName = imageFile.name
                    ? imageFile.name.replace(/\.[^/.]+$/, '') + '_ajustado.jpg'
                    : 'proyecto_ajustado.jpg';

                const adjustedFile = new File([blob], fileName, {
                    type: 'image/jpeg',
                });
                onSave(adjustedFile);
                onClose();
            },
            'image/jpeg',
            0.92
        );
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fadeIn">
            <div className="bg-[#1f1f23] text-white rounded-2xl shadow-2xl border border-zinc-700 w-full max-w-2xl overflow-hidden flex flex-col">
                {/* Cabecera */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800">
                    <div>
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                            <span>✂️</span> Ajustar portada del proyecto
                        </h3>
                        <p className="text-xs text-zinc-400">
                            Arrastra para encuadrar, haz zoom o rota según tus preferencias
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-zinc-400 hover:text-white text-xl p-1.5 rounded-lg hover:bg-zinc-800 transition-colors"
                        aria-label="Cerrar modal"
                    >
                        ✕
                    </button>
                </div>

                {/* Área de Visualización y Recorte */}
                <div className="relative w-full h-80 sm:h-96 bg-zinc-950 flex items-center justify-center overflow-hidden">
                    <canvas
                        ref={canvasRef}
                        onMouseDown={handleMouseDown}
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleMouseUp}
                        onMouseLeave={handleMouseUp}
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}
                        onWheel={handleWheel}
                        className={`w-full h-full ${
                            isDragging ? 'cursor-grabbing' : 'cursor-grab'
                        }`}
                        title="Haz clic y arrastra para mover la imagen. Usa la rueda para hacer zoom."
                    />
                    <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur text-zinc-300 text-[11px] px-2.5 py-1 rounded-md pointer-events-none border border-white/10">
                        🖱️ Arrastra para mover • Rueda para zoom
                    </div>
                </div>

                {/* Controles de Ajuste */}
                <div className="p-5 space-y-4 bg-[#1f1f23] border-t border-zinc-800">
                    {/* Control de Zoom */}
                    <div className="flex items-center gap-3">
                        <span className="text-xs text-zinc-400 font-medium w-12">Zoom</span>
                        <button
                            type="button"
                            onClick={() => setZoom((prev) => Math.max(1, prev - 0.15))}
                            className="w-7 h-7 flex items-center justify-center bg-zinc-800 hover:bg-zinc-700 text-white rounded text-sm font-bold"
                            title="Reducir zoom"
                        >
                            -
                        </button>
                        <input
                            type="range"
                            min="1"
                            max="3"
                            step="0.05"
                            value={zoom}
                            onChange={(e) => setZoom(parseFloat(e.target.value))}
                            className="flex-1 h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-[#829821]"
                        />
                        <button
                            type="button"
                            onClick={() => setZoom((prev) => Math.min(3, prev + 0.15))}
                            className="w-7 h-7 flex items-center justify-center bg-zinc-800 hover:bg-zinc-700 text-white rounded text-sm font-bold"
                            title="Aumentar zoom"
                        >
                            +
                        </button>
                        <span className="text-xs text-zinc-400 w-10 text-right">
                            {Math.round(zoom * 100)}%
                        </span>
                    </div>

                    {/* Botones de acción rápida */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-zinc-800/60">
                        <div className="flex items-center gap-2">
                            {/* Modo Cover / Contain */}
                            <button
                                type="button"
                                onClick={() =>
                                    setFitMode((prev) =>
                                        prev === 'cover' ? 'contain' : 'cover'
                                    )
                                }
                                className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-colors ${
                                    fitMode === 'cover'
                                        ? 'bg-[#829821]/20 border-[#829821] text-[#a5c229]'
                                        : 'bg-zinc-800 border-zinc-700 text-zinc-300 hover:bg-zinc-700'
                                }`}
                                title="Alternar entre rellenar el marco o encajar imagen completa"
                            >
                                {fitMode === 'cover' ? '⬛ Rellenar marco' : '🔲 Ajustar entera'}
                            </button>

                            {/* Rotar */}
                            <button
                                type="button"
                                onClick={handleRotate}
                                className="text-xs px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg border border-zinc-700 font-medium transition-colors flex items-center gap-1.5"
                                title="Girar 90 grados"
                            >
                                <span>🔄</span> Rotar 90°
                            </button>

                            {/* Restablecer */}
                            <button
                                type="button"
                                onClick={handleReset}
                                className="text-xs px-2.5 py-1.5 text-zinc-400 hover:text-zinc-200 transition-colors"
                                title="Restablecer encuadre original"
                            >
                                Restablecer
                            </button>
                        </div>

                        {/* Botones de Cancelar y Aplicar */}
                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 text-xs font-semibold text-zinc-300 hover:text-white bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                type="button"
                                onClick={handleApply}
                                className="px-5 py-2 text-xs font-bold text-white bg-[#829821] hover:bg-[#a1bc28] rounded-lg shadow-md transition-colors flex items-center gap-1.5"
                            >
                                <span>✓</span> Aplicar ajuste
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

ImageAdjusterModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    imageFile: PropTypes.any,
    aspectRatio: PropTypes.number,
    onSave: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
};
