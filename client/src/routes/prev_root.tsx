import { useEffect, useState } from 'react';
import {
  Form,
  NavLink,
  Outlet,
  redirect,
  useLoaderData,
  useNavigation,
  useSubmit,
} from 'react-router-dom';
import { createContact, getContacts } from '../utils/contacts';
import io from 'socket.io-client';

const socket = io('/');

export async function action() {
  const contact = await createContact();
  return redirect(`/contacts/${contact.id}/edit`);
}

export async function loader({ request }) {
  const url = new URL(request.url);
  const q = url.searchParams.get('q');
  const contacts = await getContacts(q);

  return { contacts, q };
}

export default function Root() {
  const navigation = useNavigation();
  const { contacts, q } = useLoaderData();
  const submit = useSubmit();

  const searching =
    navigation.location &&
    new URLSearchParams(navigation.location.search).has('q');

  useEffect(() => {
    document.getElementById('q').value = q;
  }, [q]);

  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  // MANDAS EL MENSAJE AL SERVIDOR
  const handleSubmit = e => {
    e.preventDefault(); // Previene el comportamiento predeterminado del formulario
    const newMsg = {
      from: 'client',
      body: message,
    };
    setMessages([...messages, newMsg]);
    socket.emit('message', message);
    setMessage(''); // Limpia el campo de entrada después de enviar
  };

  useEffect(() => {
    const messageListener = message => {
      setMessages(messages => [...messages, message]);
    };

    socket.on('messageClient', messageListener);

    return () => {
      socket.off('messageClient', messageListener);
    };
  }, []);

  return (
    <>
      <div id="sidebar">
        <h1>React Router Contacts</h1>
        <Form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Write..."
            onChange={e => setMessage(e.target.value)}
          />
          <button type="submit">Send</button>
        </Form>
        <ul>
          {messages.map((message, index) => (
            <li key={index} className="m-2">
              {message.from}:{message.body}
            </li>
          ))}
        </ul>
        <div>
          <Form id="search-form" role="search">
            <input
              id="q"
              className={searching ? 'loading' : ''}
              aria-label="Search contacts"
              placeholder="Search"
              type="search"
              name="q"
              defaultValue={q}
              onChange={event => {
                const isFirstSearch = q == null;
                submit(event.currentTarget.form, {
                  replace: !isFirstSearch,
                });
              }}
            />
            <div id="search-spinner" aria-hidden hidden={!searching} />
            <div className="sr-only" aria-live="polite"></div>
          </Form>
          <Form method="post">
            <button type="submit">New</button>
          </Form>
        </div>
        <nav>
          {contacts.length ? (
            <ul>
              {contacts.map(contact => (
                <li key={contact.id}>
                  <NavLink
                    to={`contacts/${contact.id}`}
                    className={({ isActive, isPending }) =>
                      isActive ? 'active' : isPending ? 'pending' : ''
                    }
                  >
                    {contact.first || contact.last ? (
                      <>
                        {contact.first} {contact.last}
                      </>
                    ) : (
                      <i>No Name</i>
                    )}{' '}
                    {contact.favorite && <span>★</span>}
                  </NavLink>
                </li>
              ))}
            </ul>
          ) : (
            <p>
              <i>No contacts</i>
            </p>
          )}
        </nav>
      </div>
      <div
        id="detail"
        className={navigation.state === 'loading' ? 'loading' : ''}
      >
        <Outlet />
      </div>
    </>
  );
}
