//components/RocketComponent.tsx

import { RocketIcon } from 'lucide-react';
import React from 'react';

type Props = {
    degrees: number; // Propiedad que determina los grados de rotación del cohete
};

const RocketComponent = ({ degrees }: Props) => {
    return (
        <div className='rocket-shadow'>
            {/* Icono del cohete con rotación dinámica basada en la propiedad degrees */}
            <RocketIcon 
                size={32} 
                className='fill-red-600' 
                style={{
                    transform: `rotate(${-45 - degrees / 3}deg)`, // Ajustar la rotación del cohete
                    transition: 'all', // Transición para suavizar el movimiento
                    animationDuration: '10ms' // Duración de la animación
                }} 
            />
        </div>
    );
};

export default RocketComponent;
