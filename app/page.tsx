import ListPost from '../components/ListPost';
import Background3D from '../components/Background3D';

export default function HomePage() {
  return (
    <>
      {/* Comentado porque es una falopeada horrible  */}
      {/* <Background3D />   */}
      <main className='max-w-[75ch] mx-auto my-36 flex flex-col gap-4 px-4 relative z-10'>
        <h1 className='text-4xl font-bold text-custom-1'>Recetas by Juancito</h1>

        <p className='text-xl font-medium text-custom-2'>
          Bienvenido a mi rincón de la web donde cada semana publico un set de recetas pensado para los 7 días. Desde platos fáciles para el lunes hasta algo especial para el domingo, este blog es para quienes buscan inspiración diaria sin complicarse.
        </p>

        <p className='text-xl font-medium text-custom-2'>
          Cocinar puede ser simple, delicioso y parte de tu rutina. Cada post contiene ideas variadas, ingredientes accesibles y pasos claros.
          <br />
          Ya sea que estés buscando qué cocinar hoy o quieras planificar tu semana completa, estás en el lugar correcto.
        </p>

        <ListPost />
      </main>

    </>
  );
}
