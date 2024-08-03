import axios from 'axios';
import { useState } from 'react';

function CaptureHuella() {
  const [message, setMessage] = useState('');
  const [storedHuellas, setStoredHuellas] = useState([]);

  // Verificar soporte de WebAuthn
  const checkWebAuthnSupport = () => {
    if (window.PublicKeyCredential) {
      setMessage('WebAuthn es soportado por este navegador.');
    } else {
      setMessage('WebAuthn no es soportado por este navegador.');
    }
  };

  // Función de registro
  const handleRegistration = async () => {
    try {
      const publicKeyCredentialCreationOptions = {
        challenge: new Uint8Array([
          /* Challenge generado por el servidor */
        ]),
        rp: {
          name: 'Nombre de la aplicación',
        },
        user: {
          id: new Uint8Array(16), // Identificador único del usuario
          name: 'usuario@ejemplo.com',
          displayName: 'Nombre del Usuario',
        },
        pubKeyCredParams: [
          {
            type: 'public-key',
            alg: -7, // Algoritmo ECDSA con SHA-256
          },
        ],
        authenticatorSelection: {
          authenticatorAttachment: 'platform',
          userVerification: 'preferred',
        },
        timeout: 60000,
        attestation: 'direct',
      };

      // Crear la credencial
      const credential = await navigator.credentials.create({
        publicKey: publicKeyCredentialCreationOptions,
      });

      // Obtener los datos necesarios de la credencial
      const credentialData = {
        id: credential.id,
        rawId: Array.from(new Uint8Array(credential.rawId)),
        response: {
          attestationObject: Array.from(new Uint8Array(credential.response.attestationObject)),
          clientDataJSON: Array.from(new Uint8Array(credential.response.clientDataJSON)),
        },
        type: credential.type,
      };

      // Almacenar la huella en el estado
      setStoredHuellas([...storedHuellas, credentialData]);

      setMessage('Huella registrada exitosamente.');

      setTimeout(() => {
        setMessage('');
      }, 3000);
    } catch (error) {
      console.error('Error en el manejo de la credencial:', error);
      setMessage('Error al registrar la huella.');

      setTimeout(() => {
        setMessage('');
      }, 3000);
    }
  };

  // Función para enviar todas las huellas almacenadas
  const handleSendHuellas = async () => {
    try {
      // Enviar todas las huellas juntas
      await axios.post('http://localhost:3001/huellas', storedHuellas);
      setMessage('Huellas enviadas exitosamente.');

      setTimeout(() => {
        setMessage('');
      }, 3000);

      // Limpiar huellas almacenadas después de enviar
      setStoredHuellas([]);
    } catch (error) {
      console.error('Error al enviar las huellas:', error);
      setMessage('Error al enviar las huellas.');

      setTimeout(() => {
        setMessage('');
      }, 3000);
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>WebAuthn en React</h1>
      <button type="button" onClick={checkWebAuthnSupport}>
        Verificar soporte WebAuthn
      </button>
      <br />
      <br />
      <button type="button" onClick={handleRegistration}>
        Leer y Registrar Huella
      </button>
      <br />
      <br />
      <button type="button" onClick={handleSendHuellas}>
        Enviar Todas las Huellas
      </button>
      <br />
      <br />
      <p>{message}</p>
    </div>
  );
}

export default CaptureHuella;
