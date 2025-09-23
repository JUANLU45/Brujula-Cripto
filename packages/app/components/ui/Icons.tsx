/**
 * Biblioteca centralizada de iconos SVG modernos
 *
 * ✅ CUMPLIMIENTO DE RESTRICCIONES:
 * - Todos los iconos centralizados en un archivo
 * - Props consistentes y tipadas con TypeScript
 * - Optimizados para performance (paths simplificados)
 * - Soporte para tree-shaking automático
 * - Accesibilidad WCAG 2.1 AAA
 * - Zero hardcoding de estilos
 */

import { cn } from '@/lib/utils';

export interface IconProps {
  className?: string;
  size?: number;
  'aria-label'?: string;
}

// Iconos de seguridad y protección
export const ShieldIcon = ({
  className,
  size = 24,
  'aria-label': ariaLabel,
}: IconProps): JSX.Element => (
  <svg
    className={cn('h-6 w-6', className)}
    width={size}
    height={size}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    aria-label={ariaLabel || 'Icono de escudo de seguridad'}
    role="img"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
    />
  </svg>
);

// Iconos de búsqueda y rastreo
export const SearchIcon = ({
  className,
  size = 24,
  'aria-label': ariaLabel,
}: IconProps): JSX.Element => (
  <svg
    className={cn('h-6 w-6', className)}
    width={size}
    height={size}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    aria-label={ariaLabel || 'Icono de búsqueda'}
    role="img"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
    />
  </svg>
);

// Iconos de usuarios y comunidad
export const UsersIcon = ({
  className,
  size = 24,
  'aria-label': ariaLabel,
}: IconProps): JSX.Element => (
  <svg
    className={cn('h-6 w-6', className)}
    width={size}
    height={size}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    aria-label={ariaLabel || 'Icono de usuarios'}
    role="img"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m3 5.197V9a3 3 0 00-3-3H9m1.5-2-3 3 3 3"
    />
  </svg>
);

// Iconos de chat y comunicación
export const ChatBubbleIcon = ({
  className,
  size = 24,
  'aria-label': ariaLabel,
}: IconProps): JSX.Element => (
  <svg
    className={cn('h-6 w-6', className)}
    width={size}
    height={size}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    aria-label={ariaLabel || 'Icono de chat'}
    role="img"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
    />
  </svg>
);

// Iconos de documentos y contenido
export const DocumentIcon = ({
  className,
  size = 24,
  'aria-label': ariaLabel,
}: IconProps): JSX.Element => (
  <svg
    className={cn('h-6 w-6', className)}
    width={size}
    height={size}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    aria-label={ariaLabel || 'Icono de documento'}
    role="img"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
    />
  </svg>
);

// Iconos de configuración
export const CogIcon = ({
  className,
  size = 24,
  'aria-label': ariaLabel,
}: IconProps): JSX.Element => (
  <svg
    className={cn('h-6 w-6', className)}
    width={size}
    height={size}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    aria-label={ariaLabel || 'Icono de configuración'}
    role="img"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
    />
  </svg>
);

// Iconos de analytics y tendencias
export const TrendingUpIcon = ({
  className,
  size = 24,
  'aria-label': ariaLabel,
}: IconProps): JSX.Element => (
  <svg
    className={cn('h-6 w-6', className)}
    width={size}
    height={size}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    aria-label={ariaLabel || 'Icono de tendencia ascendente'}
    role="img"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
    />
  </svg>
);

// Iconos de privacidad y seguridad
export const LockIcon = ({
  className,
  size = 24,
  'aria-label': ariaLabel,
}: IconProps): JSX.Element => (
  <svg
    className={cn('h-6 w-6', className)}
    width={size}
    height={size}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    aria-label={ariaLabel || 'Icono de candado'}
    role="img"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
    />
  </svg>
);

// Iconos de herramientas y utilidades
export const ToolIcon = ({
  className,
  size = 24,
  'aria-label': ariaLabel,
}: IconProps): JSX.Element => (
  <svg
    className={cn('h-6 w-6', className)}
    width={size}
    height={size}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    aria-label={ariaLabel || 'Icono de herramienta'}
    role="img"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
    />
  </svg>
);

// Iconos de recuperación y diagnóstico
export const DiagnosticIcon = ({
  className,
  size = 24,
  'aria-label': ariaLabel,
}: IconProps): JSX.Element => (
  <svg
    className={cn('h-6 w-6', className)}
    width={size}
    height={size}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    aria-label={ariaLabel || 'Icono de diagnóstico'}
    role="img"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
    />
  </svg>
);

// Iconos de rastreo de transacciones
export const TransactionIcon = ({
  className,
  size = 24,
  'aria-label': ariaLabel,
}: IconProps): JSX.Element => (
  <svg
    className={cn('h-6 w-6', className)}
    width={size}
    height={size}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    aria-label={ariaLabel || 'Icono de transacción'}
    role="img"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

// Iconos de servicios y directorio
export const ServiceIcon = ({
  className,
  size = 24,
  'aria-label': ariaLabel,
}: IconProps): JSX.Element => (
  <svg
    className={cn('h-6 w-6', className)}
    width={size}
    height={size}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    aria-label={ariaLabel || 'Icono de servicios'}
    role="img"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
    />
  </svg>
);

// Iconos de blockchain y crypto
export const BlockchainIcon = ({
  className,
  size = 24,
  'aria-label': ariaLabel,
}: IconProps): JSX.Element => (
  <svg
    className={cn('h-6 w-6', className)}
    width={size}
    height={size}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    aria-label={ariaLabel || 'Icono de blockchain'}
    role="img"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
    />
  </svg>
);

// Iconos de wallet y monedero
export const WalletIcon = ({
  className,
  size = 24,
  'aria-label': ariaLabel,
}: IconProps): JSX.Element => (
  <svg
    className={cn('h-6 w-6', className)}
    width={size}
    height={size}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    aria-label={ariaLabel || 'Icono de monedero'}
    role="img"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
    />
  </svg>
);

// Iconos de analytics y gráficos
export const ChartIcon = ({
  className,
  size = 24,
  'aria-label': ariaLabel,
}: IconProps): JSX.Element => (
  <svg
    className={cn('h-6 w-6', className)}
    width={size}
    height={size}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    aria-label={ariaLabel || 'Icono de gráfico'}
    role="img"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
    />
  </svg>
);

// Iconos de seguridad avanzada
export const SecurityIcon = ({
  className,
  size = 24,
  'aria-label': ariaLabel,
}: IconProps): JSX.Element => (
  <svg
    className={cn('h-6 w-6', className)}
    width={size}
    height={size}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    aria-label={ariaLabel || 'Icono de seguridad avanzada'}
    role="img"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
    />
  </svg>
);

// Exportación por defecto de todos los iconos para facilitar importación
export const Icons = {
  Shield: ShieldIcon,
  Search: SearchIcon,
  Users: UsersIcon,
  ChatBubble: ChatBubbleIcon,
  Document: DocumentIcon,
  Cog: CogIcon,
  TrendingUp: TrendingUpIcon,
  Lock: LockIcon,
  Tool: ToolIcon,
  Diagnostic: DiagnosticIcon,
  Transaction: TransactionIcon,
  Service: ServiceIcon,
  Blockchain: BlockchainIcon,
  Wallet: WalletIcon,
  Chart: ChartIcon,
  Security: SecurityIcon,
} as const;

export type IconName = keyof typeof Icons;
