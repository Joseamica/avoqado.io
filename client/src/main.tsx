import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Root from './routes/root'
import ErrorPage from './error-page'
import Contact, { loader as contactLoader, action as contactAction } from './routes/contact'
import EditContact, { action as editAction } from './routes/edit'
import { action as destroyAction } from './routes/destroy'
import Index from './routes/index'

import './index.css'

import OrderIndex from './routes/orders'
import Order, { loader as orderLoader, action as orderAction } from './routes/orders/order'
import BillsIndex from './routes/bills'
import Chat from './routes/tests/chat'
// , { loader as chatLoader, action as chatAction }
import User, { loader as userLoader, action as userAction } from './routes/tests/user'

//OPTION1: import { createBrowserRouter } from 'react-router-dom'
const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    // loader: rootLoader,
    // action: rootAction,
    errorElement: <ErrorPage />,

    children: [
      {
        errorElement: <ErrorPage />,
        children: [
          { index: true, element: <Index /> },
          {
            path: 'chat',
            element: <Chat />,
            // loader: chatLoader,
            // action: chatAction,
          },
          {
            path: 'user',
            element: <User />,
            loader: userLoader,
            action: userAction,
          },
          {
            path: 'orders',
            element: <OrderIndex />,
            children: [
              {
                path: ':orderId',
                element: <Order />,
                loader: orderLoader,
                action: orderAction,
              },
            ],
          },
          {
            path: 'bills',
            element: <BillsIndex />,
            // children: [{ path: ':orderId', element: <Order />, loader: orderLoader }],
          },

          {
            path: 'contacts/:contactId',
            element: <Contact />,
            loader: contactLoader,
            action: contactAction,
          },
          {
            path: 'contacts/:contactId/destroy',
            action: destroyAction,
            errorElement: <div>Oops! There was an error.</div>,
          },
        ],
      },
    ],
  },
  {
    path: 'contacts/:contactId/edit',
    element: <EditContact />,
    loader: contactLoader,
    action: editAction,
  },
])

//OPTION2: import { createBrowserFromElements,createBrowserRouter, Route } from 'react-router-dom'
// const router = createBrowserRouter(
//   createRoutesFromElements(
//     <Route
//       path="/"
//       element={<Root />}
//       loader={rootLoader}
//       action={rootAction}
//       errorElement={<ErrorPage />}
//     >
//       <Route errorElement={<ErrorPage />}>
//         <Route index element={<Index />} />
//         <Route
//           path="contacts/:contactId"
//           element={<Contact />}
//           loader={contactLoader}
//           action={contactAction}
//         />
//         <Route
//           path="contacts/:contactId/edit"
//           element={<EditContact />}
//           loader={contactLoader}
//           action={editAction}
//         />
//         <Route
//           path="contacts/:contactId/destroy"
//           action={destroyAction}
//         />
//       </Route>
//     </Route>
//   )
// );

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
