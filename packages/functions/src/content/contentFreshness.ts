import { database } from '../lib/database';

import type { IArticle } from '@brujula-cripto/types';

interface ContentFreshnessScore {
  contentId: string;
  contentType: 'article' | 'blog' | 'news' | 'tutorial';
  score: number; // 0-100 (100 = totalmente fresco, 0 = obsoleto)
  factors: {
    age: number; // Puntuación por edad del contenido
    engagement: number; // Puntuación por engagement reciente
    accuracy: number; // Puntuación por precisión técnica
    relevance: number; // Puntuación por relevancia actual
  };
  flags: string[]; // Banderas de alerta (ej: "outdated_prices", "deprecated_tech")
  lastAnalyzed: number;
  needsUpdate: boolean;
  priority: 'low' | 'medium' | 'high' | 'urgent';
}

interface FreshnessConfig {
  /** Peso del factor edad (0-1) */
  ageWeight: number;
  /** Peso del factor engagement (0-1) */
  engagementWeight: number;
  /** Peso del factor precisión (0-1) */
  accuracyWeight: number;
  /** Peso del factor relevancia (0-1) */
  relevanceWeight: number;
  /** Días después de los cuales el contenido se considera viejo */
  maxAgeDays: number;
}

const DEFAULT_CONFIG: FreshnessConfig = {
  ageWeight: 0.3,
  engagementWeight: 0.25,
  accuracyWeight: 0.25,
  relevanceWeight: 0.2,
  maxAgeDays: 180, // 6 meses
};

/**
 * Analizar la frescura de un artículo
 */
export async function analyzeContentFreshness(
  contentId: string,
  contentType: 'article' | 'blog' | 'news' | 'tutorial' = 'article',
  config: FreshnessConfig = DEFAULT_CONFIG,
): Promise<ContentFreshnessScore> {
  try {
    // Obtener el contenido
    const contentDoc = await database.getDocument('articles', contentId);
    
    if (!contentDoc || !contentDoc.exists) {
      throw new Error(`Contenido ${contentId} no encontrado`);
    }
    
    const contentData = contentDoc.data as IArticle;
    const now = Date.now();
    const contentAge = now - contentData.createdAt.getTime();
    const daysSinceCreated = Math.floor(contentAge / (1000 * 60 * 60 * 24));
    
    // Analizar factores de frescura
    const factors = {
      age: calculateAgeScore(daysSinceCreated, config.maxAgeDays),
      engagement: await calculateEngagementScore(contentId),
      accuracy: await calculateAccuracyScore(contentData, contentType),
      relevance: await calculateRelevanceScore(contentData, contentType),
    };
    
    // Calcular puntuación ponderada
    const score = Math.round(
      factors.age * config.ageWeight +
      factors.engagement * config.engagementWeight +
      factors.accuracy * config.accuracyWeight +
      factors.relevance * config.relevanceWeight
    );
    
    // Generar flags de alerta
    const flags = generateContentFlags(contentData, factors, daysSinceCreated);
    
    // Determinar prioridad de actualización
    const priority = determinePriority(score, flags.length);
    
    const freshnessScore: ContentFreshnessScore = {
      contentId,
      contentType,
      score: Math.max(0, Math.min(100, score)),
      factors,
      flags,
      lastAnalyzed: now,
      needsUpdate: score < 70 || flags.length > 0,
      priority,
    };
    
    // Guardar resultado en Firestore
    await database.setDocument('contentFreshness', contentId, freshnessScore);
    
    return freshnessScore;
    
  } catch (error) {
    console.error('Error analizando frescura del contenido:', error);
    throw error;
  }
}

/**
 * Calcular puntuación por edad del contenido
 */
function calculateAgeScore(daysSinceCreated: number, maxAgeDays: number): number {
  if (daysSinceCreated <= 30) return 100; // Contenido muy fresco
  if (daysSinceCreated <= 90) return 80;  // Contenido fresco
  if (daysSinceCreated <= maxAgeDays) return 60; // Contenido aceptable
  if (daysSinceCreated <= maxAgeDays * 1.5) return 30; // Contenido viejo
  return 10; // Contenido muy viejo
}

/**
 * Calcular puntuación por engagement reciente
 */
async function calculateEngagementScore(contentId: string): Promise<number> {
  try {
    const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
    
    // Obtener métricas de engagement reales de la colección analytics
    const engagementDocs = await database.queryCollection(
      'analytics',
      [
        { field: 'contentId', operator: 'eq', value: contentId },
        { field: 'timestamp', operator: 'gte', value: thirtyDaysAgo }
      ]
    );
    
    if (engagementDocs.length === 0) return 20; // Poco engagement
    
    let totalViews = 0;
    let totalShares = 0;
    let totalComments = 0;
    
    engagementDocs.forEach((doc: any) => {
      const data = doc.data;
      totalViews += data.views || 0;
      totalShares += data.shares || 0;
      totalComments += data.comments || 0;
    });
    
    // Algoritmo simple de scoring basado en engagement
    const engagementScore = Math.min(100, (totalViews / 100) + (totalShares * 5) + (totalComments * 10));
    
    return Math.round(engagementScore);
    
  } catch (error) {
    console.error('Error calculando engagement score:', error);
    return 50; // Score por defecto
  }
}

/**
 * Calcular puntuación por precisión técnica
 */
async function calculateAccuracyScore(
  contentData: IArticle, 
  contentType: string,
): Promise<number> {
  try {
    let accuracyScore = 80; // Base score
    
    // Verificar menciones de precios (pueden estar desactualizados)
    const content = contentData.es.contentMarkdown + ' ' + contentData.en.contentMarkdown;
    const priceRegex = /\$[\d,]+|\€[\d,]+|[\d,]+\s*(USD|EUR|BTC|ETH)/gi;
    const priceMatches = content.match(priceRegex);
    
    if (priceMatches && priceMatches.length > 0) {
      accuracyScore -= 15; // Penalizar contenido con precios específicos
    }
    
    // Verificar menciones de tecnología que puede volverse obsoleta
    const techTerms = ['web3', 'defi', 'nft', 'layer 2', 'ethereum 2.0', 'proof of work'];
    let techMentions = 0;
    
    techTerms.forEach(term => {
      if (content.toLowerCase().includes(term)) {
        techMentions++;
      }
    });
    
    if (techMentions > 3) {
      accuracyScore -= 10; // Contenido muy técnico puede desactualizarse rápido
    }
    
    // Bonificar contenido educativo general (más perenne)
    const educationalTerms = ['qué es', 'cómo funciona', 'guía básica', 'introducción'];
    let educationalMatches = 0;
    
    educationalTerms.forEach(term => {
      if (content.toLowerCase().includes(term)) {
        educationalMatches++;
      }
    });
    
    if (educationalMatches >= 2) {
      accuracyScore += 10; // Contenido educativo es más duradero
    }
    
    return Math.max(0, Math.min(100, accuracyScore));
    
  } catch (error) {
    console.error('Error calculando accuracy score:', error);
    return 70; // Score por defecto
  }
}

/**
 * Calcular puntuación por relevancia actual
 */
async function calculateRelevanceScore(
  contentData: IArticle,
  contentType: string,
): Promise<number> {
  try {
    let relevanceScore = 70; // Base score
    
    // Verificar si las categorías/tags siguen siendo relevantes
    const trendingTopics = [
      'bitcoin', 'ethereum', 'defi', 'nft', 'web3', 
      'staking', 'yield farming', 'dao', 'metaverse'
    ];
    
    const contentTags = contentData.tags || [];
    const category = contentData.category.toLowerCase();
    
    // Bonificar temas trending
    const relevantTags = contentTags.filter(tag => 
      trendingTopics.some(topic => 
        tag.toLowerCase().includes(topic) || 
        category.includes(topic)
      )
    );
    
    if (relevantTags.length > 0) {
      relevanceScore += relevantTags.length * 10;
    }
    
    // Penalizar temas obsoletos
    const obsoleteTerms = ['ico', 'bitcoin cash', 'litecoin', 'ripple classic'];
    const content = contentData.es.contentMarkdown + ' ' + contentData.en.contentMarkdown;
    
    obsoleteTerms.forEach(term => {
      if (content.toLowerCase().includes(term)) {
        relevanceScore -= 15;
      }
    });
    
    return Math.max(0, Math.min(100, relevanceScore));
    
  } catch (error) {
    console.error('Error calculando relevance score:', error);
    return 60; // Score por defecto
  }
}

/**
 * Generar flags de alerta para el contenido
 */
function generateContentFlags(
  contentData: IArticle,
  factors: ContentFreshnessScore['factors'],
  daysSinceCreated: number,
): string[] {
  const flags: string[] = [];
  
  // Flags basadas en edad
  if (daysSinceCreated > 365) {
    flags.push('very_old_content');
  } else if (daysSinceCreated > 180) {
    flags.push('old_content');
  }
  
  // Flags basadas en puntuaciones bajas
  if (factors.accuracy < 50) {
    flags.push('low_accuracy');
  }
  
  if (factors.relevance < 40) {
    flags.push('low_relevance');
  }
  
  if (factors.engagement < 30) {
    flags.push('low_engagement');
  }
  
  // Flags específicas de contenido crypto
  const content = contentData.es.contentMarkdown + ' ' + contentData.en.contentMarkdown;
  
  if (content.includes('$') || content.includes('€')) {
    flags.push('contains_prices');
  }
  
  if (content.toLowerCase().includes('2021') || content.toLowerCase().includes('2022')) {
    flags.push('date_specific');
  }
  
  return flags;
}

/**
 * Determinar prioridad de actualización
 */
function determinePriority(score: number, flagCount: number): 'low' | 'medium' | 'high' | 'urgent' {
  if (score < 30 || flagCount >= 4) return 'urgent';
  if (score < 50 || flagCount >= 3) return 'high';
  if (score < 70 || flagCount >= 2) return 'medium';
  return 'low';
}

/**
 * Obtener contenido que necesita actualización
 */
export async function getContentNeedingUpdate(
  priority?: 'low' | 'medium' | 'high' | 'urgent',
  limit: number = 10,
): Promise<ContentFreshnessScore[]> {
  try {
    const filters: any[] = [{ field: 'needsUpdate', operator: 'eq', value: true }];
    
    if (priority) {
      filters.push({ field: 'priority', operator: 'eq', value: priority });
    }
    
    const contentDocs = await database.queryCollection(
      'contentFreshness',
      filters,
      { 
        orderBy: { field: 'score', direction: 'asc' },
        limit 
      }
    );
    
    const results = contentDocs.map((doc: any) => doc.data as ContentFreshnessScore);
    
    return results;
    
  } catch (error) {
    console.error('Error obteniendo contenido para actualizar:', error);
    return [];
  }
}