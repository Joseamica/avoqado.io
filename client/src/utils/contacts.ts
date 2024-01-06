import localforage from 'localforage';
import { matchSorter } from 'match-sorter';
import sortBy from 'sort-by';

interface Contact {
  id: string;
  createdAt: number;
  first?: string;
  last?: string;
}

export async function getContacts(query?: string): Promise<Contact[]> {
  await fakeNetwork(`getContacts:${query}`);
  let contacts = (await localforage.getItem('contacts')) as Contact[] | null;
  if (!contacts) contacts = [];
  if (query) {
    contacts = matchSorter(contacts, query, { keys: ['first', 'last'] });
  }
  return contacts.sort(sortBy('last', 'createdAt'));
}

export async function createContact(): Promise<Contact> {
  await fakeNetwork();

  const id = Math.random().toString(36).substring(2, 9);
  const contact: Contact = { id, createdAt: Date.now() };
  const contacts = await getContacts();
  contacts.unshift(contact);
  await set(contacts);
  return contact;
}

export async function getContact(id: string): Promise<Contact | null> {
  await fakeNetwork(`contact:${id}`);
  const contacts = (await localforage.getItem('contacts')) as Contact[] | null;
  const contact = contacts?.find(contact => contact.id === id);
  return contact ?? null;
}

export async function updateContact(
  id: string,
  updates: Partial<Contact>,
): Promise<Contact> {
  await fakeNetwork();
  const contacts = (await localforage.getItem('contacts')) as Contact[] | null;
  const contact = contacts?.find(contact => contact.id === id);
  if (!contact) throw new Error('No contact found for ' + id);
  Object.assign(contact, updates);
  await set(contacts as Contact[]);
  return contact;
}

export async function deleteContact(id: string): Promise<boolean> {
  const contacts = (await localforage.getItem('contacts')) as Contact[] | null;
  const index = contacts?.findIndex(contact => contact.id === id) ?? -1;
  if (index > -1) {
    contacts?.splice(index, 1);
    await set(contacts as Contact[]);
    return true;
  }
  return false;
}

function set(contacts: Contact[]) {
  return localforage.setItem('contacts', contacts);
}

let fakeCache: { [key: string]: boolean } = {};

async function fakeNetwork(key?: string): Promise<void> {
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
