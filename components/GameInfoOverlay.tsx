import { Loader2, RocketIcon } from 'lucide-react'; // Importar íconos de la librería lucide-react
import React from 'react';
import SocialMediaLinks from './SocialLinks'; // Importar el componente de enlaces de redes sociales

type Props = {
    info: any
}

// Componente GameInfoOverlay para mostrar la superposición de información del juego
const GameInfoOverlay = ({ info }: Props) => {
    // Desestructurar las propiedades del objeto info
    const { isLoading, isDetected, isColliding, distance, livesRemainingState, isGameOver } = info;

    // Crear un array de íconos de cohetes según la cantidad de vidas restantes
    const lives = [];
    for (let i = 0; i < livesRemainingState; i++) {
        lives.push(<RocketIcon key={i} size={20} className='fill-red-600' />)
    }

    return (
        // Contenedor principal del overlay del juego
        <div className={`absolute z-30 h-screen w-screen flex items-center justify-center ${isColliding && 'border-[20px] border-red-600'}`}>
            {/* Mostrar el loader cuando el juego está cargando */}
            {isLoading && <Loader2 size={80} className='animate-spin' />}
            {/* Mostrar "PAUSED" cuando el juego no está detectado y no ha terminado */}
            {!isLoading && !isDetected && !isGameOver && <div className='text-2xl animate-ping font-extrabold'>P A U S A</div>}
            {/* Mostrar "GAME OVER" cuando el juego ha terminado */}
            {isGameOver && <div className='text-2xl animate-ping font-extrabold'>FIN DEL JUEGO</div>}
            {/* Mostrar la distancia recorrida */}
            <div className='fixed top-6 right-6'>{`Distancia: ${distance}`}</div>
            {/* Mostrar las vidas restantes */}
            <div className='fixed top-12 right-6 flex flex-row gap-1'>{lives}</div>
            {/* Mostrar enlaces a redes sociales */}
            <div className='text-xs fixed bottom-6 right-6 space-y-4 flex flex-row items-center gap-3'>
                <p className='mt-4'>Mis redes! 👉 </p>
                <SocialMediaLinks />
            </div>
        </div>
    );
}

export default GameInfoOverlay;
