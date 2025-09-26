import { database } from '../lib/database';

/**
 * Cloud Function para manejar feedback de mensajes de chatbot
 */
export async function handleChatMessageFeedback(
  messageId: string,
  rating: 'positive' | 'negative',
  userId?: string,
): Promise<void> {
  try {
    const now = Date.now();
    
    // Buscar y actualizar el mensaje con el feedback
    const conversations = userId 
      ? await database.queryCollection(
          'conversations',
          [{ field: 'userId', operator: 'eq', value: userId }]
        )
      : await database.queryCollection('conversations');
    
    for (const conversationDoc of conversations) {
      const conversationData = conversationDoc.data;
      const messages = conversationData.messages || [];
      
      const messageIndex = messages.findIndex((msg: { id: string }) => msg.id === messageId);
      
      if (messageIndex !== -1) {
        // Actualizar el feedback del mensaje
        messages[messageIndex] = {
          ...messages[messageIndex],
          metadata: {
            ...messages[messageIndex].metadata,
            feedback: {
              rating,
              timestamp: now,
              userId: userId || 'anonymous',
            },
          },
        };
        
        // Actualizar el documento de la conversación
        await database.updateDocument('conversations', conversationDoc.id, {
          messages,
          updatedAt: new Date(now),
        });
        
        break; // Mensaje encontrado y actualizado
      }
    }
    
    // Registrar feedback en colección separada para analytics
    await database.addDocument('chatFeedback', {
      messageId,
      rating,
      userId: userId || 'anonymous',
      timestamp: now,
      source: 'chatbot_ui',
    });
    
  } catch (error) {
    console.error('Error procesando feedback del mensaje:', error);
    throw error;
  }
}

/**
 * Obtener estadísticas de feedback
 */
export async function getChatFeedbackStats(userId?: string): Promise<{
  totalFeedback: number;
  positiveFeedback: number;
  negativeFeedback: number;
  satisfactionRate: number;
}> {
  try {
    const feedbackDocs = userId
      ? await database.queryCollection(
          'chatFeedback',
          [{ field: 'userId', operator: 'eq', value: userId }]
        )
      : await database.queryCollection('chatFeedback');
    
    let totalFeedback = 0;
    let positiveFeedback = 0;
    let negativeFeedback = 0;
    
    feedbackDocs.forEach((doc: any) => {
      const data = doc.data;
      totalFeedback++;
      
      if (data.rating === 'positive') {
        positiveFeedback++;
      } else if (data.rating === 'negative') {
        negativeFeedback++;
      }
    });
    
    const satisfactionRate = totalFeedback > 0 
      ? (positiveFeedback / totalFeedback) * 100 
      : 0;
    
    return {
      totalFeedback,
      positiveFeedback,
      negativeFeedback,
      satisfactionRate,
    };
    
  } catch (error) {
    console.error('Error obteniendo estadísticas de feedback:', error);
    return {
      totalFeedback: 0,
      positiveFeedback: 0,
      negativeFeedback: 0,
      satisfactionRate: 0,
    };
  }
}