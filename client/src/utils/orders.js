import localforage from 'localforage';
import { matchSorter } from 'match-sorter';
import sortBy from 'sort-by';
export async function getOrders(query) {
  await fakeNetwork(`getOrders:${query}`);
  let orders = await localforage.getItem('orders');
  if (!orders) orders = [];
  if (query) {
    orders = matchSorter(orders, query, { keys: ['first', 'last'] });
  }
  return orders.sort(sortBy('last', 'createdAt'));
}
export async function createOrder() {
  await fakeNetwork();
  const id = Math.random().toString(36).substring(2, 9);
  const order = {
    id,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    table: [],
    active: true,
    products: [],
  };
  const orders = await getOrders();
  orders.unshift(order);
  await set(orders);
  return order;
}
function set(orders) {
  return localforage.setItem('orders', orders);
}
let fakeCache = {};
async function fakeNetwork(key) {
  console.log('key', key);
  if (!key) {
    fakeCache = {};
  } else if (fakeCache[key]) {
    return;
  }
  fakeCache[key] = true;
  console.log('fakeCache', fakeCache);
  return new Promise(res => {
    setTimeout(res, Math.random() * 800);
  });
}
