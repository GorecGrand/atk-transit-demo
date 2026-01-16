
import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './components/dashboard.component';
import { OrdersComponent } from './components/orders.component';
import { AiLabComponent } from './components/ai-lab.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, DashboardComponent, OrdersComponent, AiLabComponent],
  template: `
    <div class="flex h-screen bg-gray-50 font-sans text-gray-900">
      
      <!-- Sidebar -->
      <aside class="w-64 bg-slate-900 text-white flex flex-col shadow-2xl z-20">
        <div class="p-6 border-b border-slate-800">
          <div class="flex items-center gap-3">
             <div class="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-lg">A</div>
             <h1 class="text-xl font-bold tracking-tight">ATK Transit</h1>
          </div>
          <div class="mt-2 text-xs text-slate-400 font-mono">OS: Логистика (Бета)</div>
        </div>

        <nav class="flex-1 p-4 space-y-1">
          <button (click)="view.set('dashboard')" 
            class="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors"
            [class.bg-blue-600]="view() === 'dashboard'"
            [class.text-white]="view() === 'dashboard'"
            [class.text-slate-400]="view() !== 'dashboard'"
            [class.hover:bg-slate-800]="view() !== 'dashboard'">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" /></svg>
            Сводная панель
          </button>

          <button (click)="view.set('orders')" 
            class="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors"
             [class.bg-blue-600]="view() === 'orders'"
            [class.text-white]="view() === 'orders'"
            [class.text-slate-400]="view() !== 'orders'"
            [class.hover:bg-slate-800]="view() !== 'orders'">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" /><path fill-rule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clip-rule="evenodd" /></svg>
            Управление рейсами
          </button>

          <button (click)="view.set('ai')" 
            class="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors"
            [class.bg-purple-600]="view() === 'ai'"
            [class.text-white]="view() === 'ai'"
            [class.text-slate-400]="view() !== 'ai'"
             [class.hover:bg-slate-800]="view() !== 'ai'">
             <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd" /></svg>
            Модули автопилота
          </button>
        </nav>

        <div class="p-4 border-t border-slate-800">
           <div class="flex items-center gap-3">
             <div class="h-8 w-8 rounded-full bg-slate-700"></div>
             <div>
               <p class="text-xs font-medium text-white">Старший диспетчер</p>
               <p class="text-xs text-slate-500">Смена открыта</p>
             </div>
           </div>
        </div>
      </aside>

      <!-- Main Content -->
      <main class="flex-1 overflow-y-auto p-8">
        <header class="flex justify-between items-center mb-8">
          <div>
            <h2 class="text-2xl font-bold text-gray-900">
              @switch (view()) {
                @case ('dashboard') { Показатели эффективности }
                @case ('orders') { Диспетчерский пульт }
                @case ('ai') { Лаборатория автоматизации }
              }
            </h2>
             <p class="text-gray-500 text-sm mt-1">
                @switch (view()) {
                  @case ('dashboard') { Оперативная сводка по автопарку и финансам. }
                  @case ('orders') { Единое окно управления заявками и водителями. }
                  @case ('ai') { Инструменты повышения маржинальности и контроля (AI). }
                }
             </p>
          </div>
          <div class="flex gap-2">
            <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
              <span class="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              Система активна
            </span>
          </div>
        </header>

        <div class="max-w-7xl mx-auto">
          @switch (view()) {
            @case ('dashboard') { <app-dashboard /> }
            @case ('orders') { <app-orders /> }
            @case ('ai') { <app-ai-lab /> }
          }
        </div>
      </main>
    </div>
  `
})
export class AppComponent {
  view = signal<'dashboard' | 'orders' | 'ai'>('dashboard');
}
