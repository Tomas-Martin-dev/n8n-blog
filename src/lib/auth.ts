const VALID_TOKEN = "mi-token-secreto-123";

export function validateBearerToken(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader) {
      return {
        isValid: false,
        error: 'Header Authorization requerido'
      };
    }
    
    if (!authHeader.startsWith('Bearer ')) {
      return {
        isValid: false,
        error: 'Formato de token inválido. Debe ser: Bearer <token>'
      };
    }
    
    const token = authHeader.substring(7); 
    
    if (!token.trim()) {
      return {
        isValid: false,
        error: 'Token vacío'
      };
    }
    
    if (token !== VALID_TOKEN) {
      return {
        isValid: false,
        error: 'Token inválido'
      };
    }
    
    return {
      isValid: true,
      token: token
    };
    
  } catch (error) {
    return {
      isValid: false,
      error: 'Error al procesar el token'
    };
  }
}
    
export function createUnauthorizedResponse(message: string) {
  return new Response(
    JSON.stringify({
      error: message,
      status: 401
    }),
    {
      status: 401,
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
}