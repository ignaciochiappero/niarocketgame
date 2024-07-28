//components/HandRecognizer.tsx

import { FilesetResolver, HandLandmarker, HandLandmarkerResult } from '@mediapipe/tasks-vision';
import React, { useEffect, useRef } from 'react';

type Props = {
    setHandResults: (result: any) => void; // Función para establecer los resultados del reconocimiento de manos
};

let detectionInterval: any; // Variable para almacenar el intervalo de detección

// Componente HandRecognizer para reconocer las manos usando MediaPipe
const HandRecognizer = ({ setHandResults }: Props) => {
    const videoRef = useRef<HTMLVideoElement>(null); // Referencia al elemento de video

    useEffect(() => {
        initVideoAndModel(); // Inicializar el video y el modelo al montar el componente

        return () => {
            clearInterval(detectionInterval); // Limpiar el intervalo de detección al desmontar el componente
        };
    }, []);

    // Función para inicializar el video y el modelo de MediaPipe
    const initVideoAndModel = async () => {
        setHandResults({ isLoading: true }); // Establecer el estado de carga

        const videoElement = videoRef.current;
        if (!videoElement) {
            return;
        }

        await initVideo(videoElement); // Inicializar el video

        const handLandmarker = await initModel(); // Inicializar el modelo de MediaPipe

        // Configurar el intervalo de detección para ejecutar 30 veces por segundo
        detectionInterval = setInterval(() => {
            const detections = handLandmarker.detectForVideo(videoElement, Date.now());
            processDetections(detections, setHandResults); // Procesar las detecciones y actualizar los resultados
        }, 1000 / 30);

        setHandResults({ isLoading: false }); // Establecer el estado de carga como falso
    };

    return (
        <div>
            {/* Elemento de video para capturar la entrada de la cámara */}
            <video className='-scale-x-1 border-2 border-stone-800 rounded-lg' ref={videoRef}></video>
        </div>
    );
};

export default HandRecognizer;

// Función para inicializar el video capturando la entrada de la cámara
async function initVideo(videoElement: HTMLVideoElement) {
    const stream = await navigator.mediaDevices.getUserMedia({
        video: true
    });
    videoElement.srcObject = stream;
    videoElement.addEventListener("loadeddata", () => {
        videoElement.play();
    });
}

// Función para inicializar el modelo de MediaPipe
async function initModel() {
    const wasm = await FilesetResolver.forVisionTasks("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm");
    const handLandmarker = HandLandmarker.createFromOptions(wasm, {
        baseOptions: {
            modelAssetPath: "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task",
            delegate: 'GPU'
        },
        numHands: 2,
        runningMode: 'VIDEO'
    });
    return handLandmarker;
}

// Función para procesar las detecciones del modelo de MediaPipe y actualizar los resultados
function processDetections(detections: HandLandmarkerResult, setHandResults: (result: any) => void) {
    if (detections && detections.handedness.length > 1) {
        // Determinar la mano derecha e izquierda
        const rightIndex = detections.handedness[0][0].categoryName === 'Right' ? 0 : 1;
        const leftIndex = rightIndex === 0 ? 1 : 0;

        // Obtener las coordenadas de los puntos clave de la mano izquierda y derecha
        const { x: leftX, y: leftY, z: leftZ } = detections.landmarks[leftIndex][6];
        const { x: rightX, y: rightY, z: rightZ } = detections.landmarks[rightIndex][6];

        // Calcular la inclinación y convertirla a grados
        const tilt = (rightY - leftY) / (rightX - leftX);
        const degrees = (Math.atan(tilt) * 180) / Math.PI;

        // Establecer los resultados del reconocimiento de manos
        setHandResults({
            isDetected: true,
            tilt,
            degrees
        });
    } else {
        // No se detectaron manos, establecer los resultados en falso
        setHandResults({
            isDetected: false,
            tilt: 0,
            degrees: 0
        });
    }
}
