
import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GeminiService } from '../services/gemini.service';
import { StoreService } from '../services/store.service';

@Component({
  selector: 'app-ai-lab',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-8">
      
      <!-- Feature 1: Dynamic Pricing (Level 1) -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div class="flex items-center gap-3 mb-4">
           <div class="p-2 bg-blue-100 rounded-lg text-blue-600">
             <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
           </div>
           <div>
             <h2 class="text-lg font-bold text-gray-900">Калькулятор рентабельности рейса</h2>
             <p class="text-sm text-gray-500">Автоматический расчет наценок (Коэффициенты: Погода, Пробки, Срочность)</p>
           </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Базовый тариф (RUB)</label>
              <input type="number" [(ngModel)]="pricingInput.base" class="mt-1 block w-full rounded-md border-gray-300 border p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-gray-50">
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700">Загруженность дорог (1-10)</label>
                <input type="number" [(ngModel)]="pricingInput.traffic" min="1" max="10" class="mt-1 block w-full rounded-md border-gray-300 border p-2 bg-gray-50">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Метеоусловия</label>
                <select [(ngModel)]="pricingInput.weather" class="mt-1 block w-full rounded-md border-gray-300 border p-2 bg-gray-50">
                  <option value="Ясно">Норма (Ясно)</option>
                  <option value="Дождь">Дождь (+ Коэфф.)</option>
                  <option value="Снег">Снегопад (+ Коэфф.)</option>
                  <option value="Шторм">Шторм (Опасно)</option>
                </select>
              </div>
            </div>
            <div>
               <label class="block text-sm font-medium text-gray-700">Время подачи</label>
               <select [(ngModel)]="pricingInput.time" class="mt-1 block w-full rounded-md border-gray-300 border p-2 bg-gray-50">
                  <option value="10:00">Стандарт (День)</option>
                  <option value="08:00">Час пик (Утро/Вечер)</option>
                  <option value="02:00">Ночной тариф</option>
                </select>
            </div>
            <button (click)="calculatePrice()" [disabled]="pricingLoading()" class="w-full bg-blue-600 text-white py-2 px-4 rounded-md shadow hover:bg-blue-700 transition-colors flex justify-center items-center font-medium">
              @if(pricingLoading()) {
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                Анализ маржинальности...
              } @else {
                Рассчитать итоговую стоимость
              }
            </button>
          </div>

          <!-- Result Card -->
          <div class="bg-slate-50 rounded-lg p-6 flex flex-col justify-center border border-slate-200">
             @if (pricingResult()) {
               <div class="text-center">
                 <p class="text-sm text-gray-500 mb-1">Рекомендованная цена для клиента</p>
                 <div class="text-4xl font-extrabold text-slate-900 mb-2">₽{{ pricingResult().finalPrice | number }}</div>
                 <div class="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200">
                   Коэффициент спроса: {{ pricingResult().surgeMultiplier }}x
                 </div>
                 <div class="mt-6 text-left bg-white p-4 rounded border border-gray-200 shadow-sm">
                    <p class="text-xs font-bold text-gray-400 uppercase mb-1">Обоснование AI:</p>
                    <p class="text-sm text-gray-700">"{{ pricingResult().reasoning }}"</p>
                 </div>
               </div>
             } @else {
               <div class="text-center text-gray-400">
                 <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto mb-2 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                 <p>Заполните параметры слева для расчета оптимальной стоимости.</p>
               </div>
             }
          </div>
        </div>
      </div>

      <!-- Feature 2: Human API (Level 5) -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div class="flex items-center gap-3 mb-4">
           <div class="p-2 bg-purple-100 rounded-lg text-purple-600">
             <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
           </div>
           <div>
             <h2 class="text-lg font-bold text-gray-900">Модуль обработки голосовых отчетов</h2>
             <p class="text-sm text-gray-500">Автоматическое заполнение путевых листов из аудиосообщений водителя.</p>
           </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Входящее сообщение (Транскрипция)</label>
            <textarea [(ngModel)]="voiceInput" rows="5" class="block w-full rounded-md border-gray-300 border p-3 text-sm focus:border-purple-500 focus:ring-purple-500 shadow-sm" placeholder="Водитель может сказать: 'Закрыл заявку 45. Клиент расплатился. Топлива 40 литров. Застучала правая стойка.'"></textarea>
            
            <div class="flex gap-2 mt-3">
               <button (click)="fillDemoVoice('standard')" class="text-xs bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-full text-gray-600 border border-gray-200">Шаблон: Успешный рейс</button>
               <button (click)="fillDemoVoice('issue')" class="text-xs bg-red-50 hover:bg-red-100 px-3 py-1 rounded-full text-red-600 border border-red-100">Шаблон: Инцидент/Ремонт</button>
            </div>

            <button (click)="processVoice()" [disabled]="voiceLoading()" class="mt-4 w-full bg-purple-600 text-white py-2 px-4 rounded-md shadow hover:bg-purple-700 transition-colors flex justify-center items-center font-medium">
               @if(voiceLoading()) {
                Обработка данных (NLP)...
              } @else {
                Извлечь данные и обновить статус
              }
            </button>
          </div>

          <div class="bg-gray-900 rounded-lg p-6 font-mono text-sm text-green-400 overflow-auto border border-gray-800 relative">
             <div class="flex justify-between items-start mb-2 border-b border-gray-700 pb-2">
                <span class="text-gray-400 font-bold">СИСТЕМНЫЙ ЖУРНАЛ</span>
                @if(voiceResult()) { <span class="text-green-500 text-xs font-bold bg-green-900 bg-opacity-30 px-2 py-0.5 rounded">ДАННЫЕ ПОЛУЧЕНЫ</span> }
             </div>
             @if (voiceResult()) {
               <div class="space-y-1">
                 <div><span class="text-purple-400">STATUS:</span> {{ voiceResult().status }}</div>
                 <div><span class="text-purple-400">FUEL_SPENT:</span> {{ voiceResult().fuelSpent }} L</div>
                 <div><span class="text-purple-400">DRIVER_MOOD:</span> {{ voiceResult().driverMood }}</div>
                 <div><span class="text-purple-400">INCIDENTS:</span> {{ voiceResult().incidents || 'None' }}</div>
                 <div><span class="text-purple-400">ACTION:</span> {{ voiceResult().nextAction }}</div>
               </div>
               <div class="mt-6 pt-4 border-t border-gray-700">
                 <button (click)="updateOrderFromVoice()" class="w-full bg-green-700 hover:bg-green-600 text-white py-2 px-3 rounded text-xs font-bold uppercase tracking-wide transition-colors">
                    Применить к активному заказу
                 </button>
               </div>
             } @else {
               <div class="flex flex-col items-center justify-center h-32 text-gray-600">
                  <span>Ожидание пакета данных...</span>
               </div>
             }
          </div>
        </div>
      </div>

    </div>
  `
})
export class AiLabComponent {
  gemini = inject(GeminiService);
  store = inject(StoreService);

  // Pricing State
  pricingInput = { base: 15000, traffic: 5, weather: 'Ясно', time: '10:00', urgency: 'Нормально' };
  pricingResult = signal<any>(null);
  pricingLoading = signal(false);

  // Voice State
  voiceInput = '';
  voiceResult = signal<any>(null);
  voiceLoading = signal(false);

  async calculatePrice() {
    this.pricingLoading.set(true);
    const result = await this.gemini.calculateDynamicPrice(this.pricingInput.base, this.pricingInput);
    try {
        this.pricingResult.set(JSON.parse(result));
    } catch(e) {
        console.error("Failed to parse JSON", e);
    } finally {
        this.pricingLoading.set(false);
    }
  }

  fillDemoVoice(type: 'standard' | 'issue') {
    if (type === 'standard') {
        this.voiceInput = "Диспетчер, заявку закрыл. Пассажиры довольны, высадил у отеля. Заправился на 40 литров по карте. Машина в порядке.";
    } else {
        this.voiceInput = "Это Алексей. Рейс закончил, но есть проблема. Правое колесо спускает, нужен шиномонтаж. Потратил 55 литров из-за пробок.";
    }
  }

  async processVoice() {
    this.voiceLoading.set(true);
    const result = await this.gemini.parseDriverVoiceNote(this.voiceInput);
    try {
        this.voiceResult.set(JSON.parse(result));
    } catch(e) {
        console.error("Failed to parse JSON", e);
    } finally {
        this.voiceLoading.set(false);
    }
  }

  updateOrderFromVoice() {
    // Simulate updating the last active order
    const result = this.voiceResult();
    const activeOrder = this.store.orders().find(o => o.status === 'Assigned');
    if (activeOrder && result) {
        const note = `Статус: ${result.status}, Инциденты: ${result.incidents || 'Нет'}, Топливо: ${result.fuelSpent}л`;
        this.store.updateOrderNotes(activeOrder.id, note);
        if (result.status === 'COMPLETED') {
            this.store.updateOrderStatus(activeOrder.id, 'Completed');
        }
        alert(`Система: Данные по рейсу ${activeOrder.id} успешно обновлены.`);
        this.voiceResult.set(null);
        this.voiceInput = '';
    } else {
        alert('Ошибка: В системе нет активных рейсов со статусом "На линии".');
    }
  }
}
