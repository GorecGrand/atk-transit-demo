
import { Injectable, signal, computed } from '@angular/core';

export interface Order {
  id: string;
  client: string;
  route: string;
  date: string;
  status: 'New' | 'Assigned' | 'Completed' | 'Cancelled';
  price: number;
  driver?: string;
  vehicle?: string;
  aiNotes?: string;
}

@Injectable({
  providedIn: 'root'
})
export class StoreService {
  orders = signal<Order[]>([
    { id: 'REQ-1094', client: 'ПАО Газпром (Трансфер)', route: 'Пулково -> Лахта Центр', date: '2024-05-20 10:00', status: 'Completed', price: 18500, driver: 'Алексей С.', vehicle: 'Mercedes Sprinter (А001АА)', aiNotes: 'Рейс штатный. Простой 15 мин в ожидании делегации.' },
    { id: 'REQ-1095', client: 'Свадьба (Смирновы)', route: 'ЗАГС №1 -> Ресторан "Паруса"', date: '2024-05-21 14:00', status: 'Assigned', price: 24000, driver: 'Дмитрий К.', vehicle: 'Yutong 6122 (В555ОР)' },
    { id: 'REQ-1096', client: 'Школа "Взмах"', route: 'Школа -> Музей РЖД', date: '2024-05-22 09:00', status: 'New', price: 12000 },
    { id: 'REQ-1097', client: 'Развозка смены (Завод)', route: 'Завод Toyota -> М. Шушары', date: '2024-05-22 23:30', status: 'New', price: 9500 }
  ]);

  drivers = signal(['Алексей С.', 'Дмитрий К.', 'Иван П.', 'Сергей В.', 'Ольга М.']);
  vehicles = signal(['Mercedes Sprinter (А001АА)', 'Yutong 6122 (В555ОР)', 'Ford Transit (К321ММ)', 'Higer (Е123КХ)']);

  activeOrdersCount = computed(() => this.orders().filter(o => o.status === 'Assigned' || o.status === 'New').length);
  completedRevenue = computed(() => this.orders().filter(o => o.status === 'Completed').reduce((acc, curr) => acc + curr.price, 0));
  
  addOrder(order: Order) {
    this.orders.update(list => [order, ...list]);
  }

  updateOrderStatus(id: string, status: Order['status'], driver?: string) {
    this.orders.update(list => list.map(o => {
      if (o.id === id) {
        return { ...o, status, driver: driver || o.driver };
      }
      return o;
    }));
  }

  updateOrderStatusWithVehicle(id: string, status: Order['status'], driver: string, vehicle: string) {
    this.orders.update(list => list.map(o => {
      if (o.id === id) {
        return { ...o, status, driver, vehicle };
      }
      return o;
    }));
  }

  updateOrderNotes(id: string, notes: string) {
    this.orders.update(list => list.map(o => {
      if (o.id === id) return { ...o, aiNotes: notes };
      return o;
    }));
  }
}
