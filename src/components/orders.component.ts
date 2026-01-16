
import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StoreService, Order } from '../services/store.service';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <!-- Header -->
      <div class="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
        <div>
            <h2 class="text-xl font-bold text-gray-900">Реестр заказов</h2>
            <p class="text-sm text-gray-500">Централизованное управление заявками</p>
        </div>
        <button (click)="toggleNewOrder()" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>
          Новая заявка
        </button>
      </div>

      <!-- New Order Form (Collapsible) -->
      @if (showNewOrder) {
        <div class="p-6 bg-blue-50 border-b border-blue-100 animate-in slide-in-from-top-2 duration-200">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
                <label class="block text-xs font-medium text-gray-500 mb-1">Контрагент</label>
                <input [(ngModel)]="newOrder.client" placeholder="ООО Вектор" class="w-full p-2 border rounded-md text-sm focus:ring-2 focus:ring-blue-500 outline-none">
            </div>
            <div>
                <label class="block text-xs font-medium text-gray-500 mb-1">Маршрут</label>
                <input [(ngModel)]="newOrder.route" placeholder="Точка А -> Точка Б" class="w-full p-2 border rounded-md text-sm focus:ring-2 focus:ring-blue-500 outline-none">
            </div>
            <div>
                <label class="block text-xs font-medium text-gray-500 mb-1">Дата и время подачи</label>
                <input [(ngModel)]="newOrder.date" type="datetime-local" class="w-full p-2 border rounded-md text-sm focus:ring-2 focus:ring-blue-500 outline-none">
            </div>
            <div>
                <label class="block text-xs font-medium text-gray-500 mb-1">Стоимость (₽)</label>
                <input [(ngModel)]="newOrder.price" type="number" placeholder="0.00" class="w-full p-2 border rounded-md text-sm focus:ring-2 focus:ring-blue-500 outline-none">
            </div>
          </div>
          <div class="mt-4 flex justify-end gap-2">
            <button (click)="toggleNewOrder()" class="text-gray-600 px-4 py-2 text-sm hover:bg-gray-100 rounded">Отмена</button>
            <button (click)="saveOrder()" class="bg-blue-600 text-white px-4 py-2 rounded-md text-sm shadow-sm hover:bg-blue-700">Подтвердить заявку</button>
          </div>
        </div>
      }

      <!-- Filters Toolbar -->
      <div class="p-4 border-b border-gray-100 bg-white flex flex-wrap gap-4 items-end">
        <div>
          <label class="block text-xs font-medium text-gray-500 mb-1">Фильтр по статусу</label>
          <select [ngModel]="filterStatus()" (ngModelChange)="filterStatus.set($event)" class="w-40 p-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50">
            <option value="">Все заявки</option>
            <option value="New">В обработке</option>
            <option value="Assigned">На линии</option>
            <option value="Completed">Завершенные</option>
          </select>
        </div>
        <div>
           <label class="block text-xs font-medium text-gray-500 mb-1">Фильтр по дате</label>
           <input type="date" [ngModel]="filterDate()" (ngModelChange)="filterDate.set($event)" class="p-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50">
        </div>
        @if (filterStatus() || filterDate()) {
          <button (click)="resetFilters()" class="text-xs text-red-600 hover:text-red-800 underline pb-2">
            Сбросить фильтры
          </button>
        }
      </div>

      <!-- Order List -->
      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm">
          <thead class="bg-gray-50 text-gray-600 uppercase font-medium text-xs">
            <tr>
              <th class="px-6 py-4">ID заявки</th>
              <th class="px-6 py-4">Детали рейса</th>
              <th class="px-6 py-4">Дата подачи</th>
              <th class="px-6 py-4">Статус</th>
              <th class="px-6 py-4">Водитель / ТС</th>
              <th class="px-6 py-4 text-right">Фрахт</th>
              <th class="px-6 py-4">Управление</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            @for (order of filteredOrders(); track order.id) {
              <tr class="hover:bg-gray-50 transition-colors">
                <td class="px-6 py-4 font-mono text-xs text-gray-500">{{ order.id }}</td>
                <td class="px-6 py-4">
                  <div class="font-medium text-gray-900">{{ order.client }}</div>
                  <div class="text-xs text-gray-500 mt-1 flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    {{ order.route }}
                  </div>
                  @if(order.aiNotes) {
                    <div class="mt-2 text-xs text-purple-700 bg-purple-50 p-2 rounded border border-purple-100 max-w-xs">
                        <span class="font-bold flex items-center gap-1">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" /></svg>
                            AI Отчет:
                        </span> 
                        {{ order.aiNotes }}
                    </div>
                  }
                </td>
                <td class="px-6 py-4 text-gray-600">{{ order.date | date:'dd.MM.yyyy HH:mm' }}</td>
                <td class="px-6 py-4">
                  <span class="px-2.5 py-1 rounded-full text-xs font-medium border"
                    [class.bg-yellow-50]="order.status === 'New'"
                    [class.text-yellow-700]="order.status === 'New'"
                    [class.border-yellow-200]="order.status === 'New'"
                    [class.bg-blue-50]="order.status === 'Assigned'"
                    [class.text-blue-700]="order.status === 'Assigned'"
                    [class.border-blue-200]="order.status === 'Assigned'"
                    [class.bg-green-50]="order.status === 'Completed'"
                    [class.text-green-700]="order.status === 'Completed'"
                    [class.border-green-200]="order.status === 'Completed'">
                    @switch(order.status) {
                        @case('New') { В обработке }
                        @case('Assigned') { На линии }
                        @case('Completed') { Завершен }
                        @default { {{ order.status }} }
                    }
                  </span>
                </td>
                <td class="px-6 py-4">
                  @if (order.driver) {
                    <div class="flex items-center gap-2">
                       <div class="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600 border border-slate-200">
                         {{ order.driver.charAt(0) }}
                       </div>
                       <div>
                           <div class="text-sm font-medium text-gray-900">{{ order.driver }}</div>
                           <div class="text-xs text-gray-500">{{ order.vehicle || 'ТС назначено' }}</div>
                       </div>
                    </div>
                  } @else {
                     <span class="text-gray-400 text-sm italic">-- нет данных --</span>
                  }
                </td>
                <td class="px-6 py-4 text-right font-medium text-gray-900">₽{{ order.price | number }}</td>
                <td class="px-6 py-4">
                  <!-- Actions Column -->
                  @if (order.status === 'New') {
                    
                    @if (assigningOrderId() === order.id) {
                      <!-- Dropdown Mode -->
                      <div class="flex flex-col gap-2 min-w-[180px]">
                        <select [ngModel]="selectedDriver()" (ngModelChange)="selectedDriver.set($event)" class="w-full text-xs p-1.5 border border-blue-300 rounded focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                          <option value="" disabled>Выберите водителя</option>
                          @for (driver of store.drivers(); track driver) {
                            <option [value]="driver">{{ driver }} (Свободен)</option>
                          }
                        </select>
                        <div class="flex gap-2">
                          <button (click)="confirmAssignment(order.id)" [disabled]="!selectedDriver()" class="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-xs py-1 rounded disabled:opacity-50">ОК</button>
                          <button (click)="cancelAssignment()" class="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs py-1 rounded">Отмена</button>
                        </div>
                      </div>
                    } @else {
                      <!-- Default Mode -->
                      <button (click)="startAssignment(order.id)" class="text-blue-600 hover:text-white hover:bg-blue-600 text-xs font-semibold bg-blue-50 px-3 py-1.5 rounded-md border border-blue-200 transition-all shadow-sm">
                        Назначить
                      </button>
                    }

                  } @else if (order.status === 'Assigned') {
                    <button (click)="completeOrder(order.id)" class="text-green-600 hover:text-white hover:bg-green-600 text-xs font-semibold bg-green-50 px-3 py-1.5 rounded-md border border-green-200 transition-all shadow-sm">
                      Закрыть путевой
                    </button>
                  }
                </td>
              </tr>
            }
            @if (filteredOrders().length === 0) {
              <tr>
                <td colspan="7" class="px-6 py-12 text-center text-gray-400">
                  <div class="flex flex-col items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 mb-2 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    <span>По вашему запросу ничего не найдено</span>
                  </div>
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class OrdersComponent {
  store = inject(StoreService);
  showNewOrder = false;
  
  // State for assignment UI
  assigningOrderId = signal<string | null>(null);
  selectedDriver = signal<string>('');

  // Filters State
  filterStatus = signal<string>('');
  filterDate = signal<string>('');

  // Filtered List Logic
  filteredOrders = computed(() => {
    const orders = this.store.orders();
    const status = this.filterStatus();
    const date = this.filterDate();

    return orders.filter(o => {
      const matchStatus = status ? o.status === status : true;
      // Date in store is ISO string. Filter date is YYYY-MM-DD. Simple startsWith works.
      const matchDate = date ? o.date.startsWith(date) : true;
      return matchStatus && matchDate;
    });
  });

  newOrder: Partial<Order> = {
    client: '',
    route: '',
    date: '',
    price: 0
  };

  toggleNewOrder() {
    this.showNewOrder = !this.showNewOrder;
  }

  saveOrder() {
    if (!this.newOrder.client || !this.newOrder.price) return;
    
    const order: Order = {
      id: `REQ-${Math.floor(Math.random() * 10000)}`,
      client: this.newOrder.client!,
      route: this.newOrder.route || 'По городу',
      date: this.newOrder.date || new Date().toISOString(),
      status: 'New',
      price: Number(this.newOrder.price)
    };
    
    this.store.addOrder(order);
    this.toggleNewOrder();
    this.newOrder = { client: '', route: '', date: '', price: 0 };
  }

  // Start the inline assignment process
  startAssignment(orderId: string) {
    this.assigningOrderId.set(orderId);
    this.selectedDriver.set(''); // Reset selection
  }

  cancelAssignment() {
    this.assigningOrderId.set(null);
    this.selectedDriver.set('');
  }

  confirmAssignment(orderId: string) {
    if (!this.selectedDriver()) return;
    
    // In a real app, we would also select a vehicle or check logic.
    // For now, we simulate vehicle assignment based on availability (random for demo).
    const randomVehicle = this.store.vehicles()[Math.floor(Math.random() * this.store.vehicles().length)];
    
    this.store.updateOrderStatusWithVehicle(orderId, 'Assigned', this.selectedDriver(), randomVehicle);
    this.cancelAssignment();
  }

  completeOrder(orderId: string) {
    this.store.updateOrderStatus(orderId, 'Completed');
  }

  resetFilters() {
    this.filterStatus.set('');
    this.filterDate.set('');
  }
}
