import { Timestamp } from 'firebase/firestore';

/**
 * Tipos TypeScript centralizados para herramienta de archivos eliminados
 * Siguiendo PROYEC_PARTE1.MD - Centralización absoluta de tipos
 */

export enum WalletFileType {
  BITCOIN_CORE = 'bitcoin-core',
  ETHEREUM_KEYSTORE = 'ethereum-keystore',
  ELECTRUM = 'electrum',
  METAMASK = 'metamask',
  EXODUS = 'exodus',
  LEDGER_LIVE = 'ledger-live',
  TREZOR = 'trezor',
  MYETHERWALLET = 'myetherwallet',
  OTHER = 'other'
}

export enum OperatingSystem {
  WINDOWS = 'windows',
  MACOS = 'macos',
  LINUX = 'linux',
  ANDROID = 'android',
  IOS = 'ios'
}

export enum TimeRange {
  UNDER_24H = 'under-24h',
  UNDER_7D = 'under-7d',
  UNDER_30D = 'under-30d',
  OVER_30D = 'over-30d'
}

export enum RecoveryStatus {
  ANALYZING = 'analyzing',
  READY = 'ready',
  IN_PROGRESS = 'in-progress',
  SUCCESS = 'success',
  PARTIAL_SUCCESS = 'partial-success',
  FAILED = 'failed',
  NEEDS_PROFESSIONAL = 'needs-professional'
}

export interface RecoveryStep {
  stepNumber: number;
  title: string;
  description: string;
  commands?: string[];
  warningLevel: 'info' | 'warning' | 'critical';
  estimatedTime: number; // en minutos
  requiredTools?: string[];
  videoUrl?: string;
}

export interface RecoveryTool {
  name: string;
  type: 'free' | 'paid' | 'professional';
  operatingSystems: OperatingSystem[];
  supportedFileTypes: WalletFileType[];
  successRate: number;
  downloadUrl?: string;
  instructions: RecoveryStep[];
  cost?: number;
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedTime: number; // en minutos
}

export interface IFileRecoveryCase {
  id: string;
  userId: string;
  fileType: WalletFileType;
  operatingSystem: OperatingSystem;
  timeElapsed: TimeRange;
  estimatedValue?: number;
  recoveryProbability: number;
  recommendedTools: RecoveryTool[];
  status: RecoveryStatus;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface DiagnosisData {
  fileType: WalletFileType;
  operatingSystem: OperatingSystem;
  timeElapsed: TimeRange;
  estimatedValue?: number;
}

export interface AnalysisResult {
  success: boolean;
  recoveryProbability: number;
  recommendedTools: RecoveryTool[];
  estimatedDifficulty: 'easy' | 'medium' | 'hard';
  urgencyLevel: 'low' | 'medium' | 'high';
  sessionId: string;
}

export interface RecoverySessionResponse {
  sessionId: string;
  analysis: AnalysisResult;
}

// Documento Firestore para herramientas de recuperación
export interface FileRecoveryToolDocument {
  id: string;
  name: string;
  type: 'free' | 'paid' | 'professional';
  operatingSystems: OperatingSystem[];
  supportedFileTypes: WalletFileType[];
  successRate: number;
  downloadUrl?: string;
  instructions: RecoveryStep[];
  cost?: number;
  difficulty: 'easy' | 'medium' | 'hard';
  isActive: boolean;
  lastUpdated: Timestamp;
}

// Documento Firestore para guías de recuperación
export interface RecoveryGuideDocument {
  id: string;
  fileType: WalletFileType;
  operatingSystem: OperatingSystem;
  timeRange: TimeRange;
  steps: RecoveryStep[];
  estimatedSuccess: number;
  difficulty: 'easy' | 'medium' | 'hard';
  requiredTier: 'free' | 'premium';
  createdAt: Timestamp;
  lastUpdated: Timestamp;
}

// Documento Firestore para casos de usuario
export interface UserFileRecoveryCaseDocument {
  id: string;
  scenario: IFileRecoveryCase;
  toolsUsed: string[];
  outcome: RecoveryStatus;
  notes?: string;
  feedbackRating?: number; // 1-5
  creditsUsed: number;
  sessionDuration: number; // en segundos
  createdAt: Timestamp;
  completedAt?: Timestamp;
}