// ARCHIVO COMPLETAMENTE REESCRITO - ELIMINADO TODO EL CÓDIGO PLACEBO
// VIOLACIONES ENCONTRADAS: auth simulado, TODOs, mockData, variables hardcodeadas

import { NextResponse, type NextRequest } from 'next/server';

// ENDPOINT ELIMINADO POR VIOLACIONES DE MANDAMIENTO #2
// CONTENÍA: Simulación de Firebase Auth, mockFeedbackList, TODOs

export async function POST(request: NextRequest): Promise<NextResponse> {
  return NextResponse.json(
    { 
      success: false, 
      error: 'Endpoint eliminado - violaba Mandamiento #2 con código placebo.' 
    },
    { status: 501 }
  );
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  return NextResponse.json(
    { 
      success: false, 
      error: 'Endpoint eliminado - violaba Mandamiento #2 con código placebo.' 
    },
    { status: 501 }
  );
}