import { useEffect, useState } from 'react'
import { Form, Link, Outlet, redirect } from 'react-router-dom'
import io from 'socket.io-client'
import { createContact, getContacts } from '../utils/contacts'

export default function Root() {
  return (
    <div>
      <h1>Root</h1>
      <Link to="/chat">Chat</Link>
      <Link to="/user">User</Link>

      <Outlet />
    </div>
  )
}
