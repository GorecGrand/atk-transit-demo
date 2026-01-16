
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreService } from '../services/store.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <!-- KPI Cards -->
      <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100 relative overflow-hidden">
        <div class="absolute right-0 top-0 p-4 opacity-10">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <h3 class="text-sm font-medium text-gray-500 uppercase tracking-wider">Заказы в работе</h3>
        <p class="text-3xl font-bold text-gray-900 mt-2">{{ store.activeOrdersCount() }}</p>
        <span class="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full mt-2 inline-block">Статус: Штатный режим</span>
      </div>

      <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100 relative overflow-hidden">
        <div class="absolute right-0 top-0 p-4 opacity-10">
           <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 class="text-sm font-medium text-gray-500 uppercase tracking-wider">Выручка (Неделя)</h3>
        <p class="text-3xl font-bold text-gray-900 mt-2">₽{{ store.completedRevenue() | number }}</p>
        <span class="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full mt-2 inline-block">Динамика: +15% к плану</span>
      </div>

      <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100 relative overflow-hidden">
         <div class="absolute right-0 top-0 p-4 opacity-10">
           <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <h3 class="text-sm font-medium text-gray-500 uppercase tracking-wider">Уровень автоматизации</h3>
        <p class="text-3xl font-bold text-gray-900 mt-2">28%</p>
        <div class="w-full bg-gray-200 rounded-full h-2.5 mt-2">
          <div class="bg-purple-600 h-2.5 rounded-full" style="width: 28%"></div>
        </div>
        <span class="text-xs text-purple-600 mt-2 inline-block">Цель: Внедрение авто-документооборота</span>
      </div>
    </div>

    <!-- Strategy Status -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h3 class="text-lg font-bold text-gray-900 mb-4">План цифровой трансформации</h3>
      <div class="space-y-4">
        <div class="flex items-center">
          <div class="flex-shrink-0 h-8 w-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" /></svg>
          </div>
          <div class="ml-4 flex-1">
            <p class="text-sm font-medium text-gray-900">Этап 1: Единая база заказов</p>
            <p class="text-sm text-gray-500">Реализовано. Отказ от Excel, прозрачный учет рейсов, статусы в реальном времени.</p>
          </div>
        </div>
        <div class="flex items-center">
          <div class="flex-shrink-0 h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 animate-pulse">
            <span class="font-bold text-xs">AI</span>
          </div>
          <div class="ml-4 flex-1">
            <p class="text-sm font-medium text-gray-900">Этап 2: Умное ценообразование</p>
            <p class="text-sm text-gray-500">Активно. Алгоритм рассчитывает рентабельность с учетом пробок, погоды и срочности.</p>
          </div>
        </div>
         <div class="flex items-center opacity-60">
          <div class="flex-shrink-0 h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
            <span class="font-bold text-xs">5</span>
          </div>
          <div class="ml-4 flex-1">
            <p class="text-sm font-medium text-gray-900">Этап 3: Оцифровка "голоса" (Human API)</p>
            <p class="text-sm text-gray-500">Пилотный проект. Автоматическое заполнение отчетов из голосовых сообщений водителей.</p>
          </div>
        </div>
      </div>
    </div>
  `
})
export class DashboardComponent {
  store = inject(StoreService);
}
