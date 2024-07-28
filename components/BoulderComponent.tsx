//components/BoulderComponent.tsx


import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

type Props = {
    isMoving?: boolean,
    what: any,
    soWhat: () => void,
    when: any
}

const BoulderComponent = ({ isMoving, what, soWhat, when }: Props) => {
    // Definimos estados para la posición y rotación de la roca
    const [xState, setXState] = useState(0);
    const [yState, setYState] = useState(0);
    const [rotation, setRotation] = useState(0);
    const boulderRef = useRef(null);

    // Detectar colisiones cuando cambia 'when'
    useEffect(() => {
        // Lógica de detección de colisión
        detectCollision();
    }, [when]);

    // Función para detectar colisiones con el cohete
    const detectCollision = () => {
        if (boulderRef.current) {
            const boulder = (boulderRef.current as any).getBoundingClientRect();
            const didCollide = boulder.left + 30 < what.right &&
                boulder.right - 30 > what.left &&
                boulder.bottom - 30 > what.top &&
                boulder.top + 30 < what.bottom;
            if (didCollide) {
                soWhat();
            }
        }
    };

    // Inicializar la posición y rotación de la roca
    useEffect(() => {
        setXState(Math.random() * (window.innerWidth - 80));
        setYState(-Math.random() * 100 - 100);
        setRotation(Math.random() * 360);
    }, []);

    return (
        // Componente de la roca
        <div ref={boulderRef} className='boulder-shadow' style={{
            position: 'absolute',
            left: xState,
            top: yState,
            animation: 'moveDown 10s linear forwards',
            animationPlayState: isMoving ? 'running' : 'paused'
        }}>
            {/* Imagen de la roca */}
            <Image src={'/met.png'} width={80} height={80} alt={''} style={{
                rotate: `${rotation}deg`
            }} />
        </div>
    );
};

export default BoulderComponent;
