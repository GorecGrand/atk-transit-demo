
import { Injectable } from '@angular/core';
import { GoogleGenAI, GenerateContentResponse } from '@google/genai';

@Injectable({
  providedIn: 'root'
})
export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env['API_KEY'] });
  }

  async calculateDynamicPrice(basePrice: number, context: any): Promise<string> {
    const prompt = `
      Ты — коммерческий директор транспортной компании.
      Рассчитай итоговую стоимость фрахта автобуса для клиента.
      
      Входные данные:
      - Базовый тариф: ${basePrice} RUB
      - Погода: ${context.weather}
      - Пробки (1-10): ${context.traffic}
      - Время подачи: ${context.time}

      Логика наценок:
      1. Пробки > 7 баллов: +20-30% (амортизация, время).
      2. Сложные метеоусловия (Снег/Шторм): +15% (риск).
      3. Ночная подача (22:00-06:00): +40% (тариф водителя).
      
      Верни ТОЛЬКО JSON:
      {
        "finalPrice": number (округленное до сотен),
        "surgeMultiplier": number (например 1.2),
        "reasoning": "Деловое обоснование цены для клиента на русском языке (макс 1 предложение)."
      }
    `;

    try {
      const response: GenerateContentResponse = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });
      return response.text.trim().replace(/```json/g, '').replace(/```/g, '');
    } catch (e) {
      console.error(e);
      return '{"error": "Ошибка вычисления AI"}';
    }
  }

  async parseDriverVoiceNote(transcript: string): Promise<string> {
    const prompt = `
      Ты — AI-диспетчер автопарка. Твоя задача — извлечь факты из сообщения водителя для ERP-системы.
      
      Текст водителя: "${transcript}"

      Верни JSON (строго эту структуру):
      {
        "status": "COMPLETED" (если рейс завершен) или "DELAYED" или "ISSUE",
        "fuelSpent": number (только число, если есть, иначе null),
        "incidents": string (краткое описание поломки или проблемы, иначе null),
        "driverMood": "Спокоен" | "Устал" | "Раздражен",
        "nextAction": "В парк" | "На СТО" | "К менеджеру"
      }
    `;

    try {
      const response: GenerateContentResponse = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });
      return response.text.trim().replace(/```json/g, '').replace(/```/g, '');
    } catch (e) {
      console.error(e);
      return '{"error": "Ошибка парсинга"}';
    }
  }
}
