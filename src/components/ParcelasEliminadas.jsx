import '../styles/dashboard.css';

const ParcelasEliminadas = () => {
  const parcelasEliminadas = [
    { id: 1, ubicacion: 'Sector Norte', cultivo: 'Maíz', responsable: 'Juan Pérez', fechaEliminacion: '2024-01-15' },
    { id: 2, ubicacion: 'Sector Sur', cultivo: 'Trigo', responsable: 'María García', fechaEliminacion: '2024-01-10' }
  ];

  return (
    <div className="parcelas-eliminadas-container">
      <h3>Parcelas Eliminadas</h3>
      <div className="tabla-container">
        <table>
          <thead>
            <tr>
              <th>Ubicación</th>
              <th>Cultivo</th>
              <th>Responsable</th>
              <th>Fecha Eliminación</th>
            </tr>
          </thead>
          <tbody>
            {parcelasEliminadas.map(parcela => (
              <tr key={parcela.id}>
                <td>{parcela.ubicacion}</td>
                <td>{parcela.cultivo}</td>
                <td>{parcela.responsable}</td>
                <td>{parcela.fechaEliminacion}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ParcelasEliminadas;