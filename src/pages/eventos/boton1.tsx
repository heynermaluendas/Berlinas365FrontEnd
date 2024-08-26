import React from 'react';
import { useNavigate } from 'react-router-dom';

const WordForm = () => {
  const navigate = useNavigate();

  const handleRedirect = () => {
    navigate('/documentos');
  };

  return (
    <div>
      <button onClick={handleRedirect}>Presentar Prueba</button>
    </div>
  );
};

export default WordForm;
