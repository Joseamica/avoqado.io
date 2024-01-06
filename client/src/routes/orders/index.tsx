import { Outlet } from 'react-router-dom';

export default function OrderIndex() {
  return (
    <div id="zero-state">
      Order Index
      <br />
      Check out{' '}
      <a href="https://reactrouter.com">the docs at reactrouter.com</a>.
      <Outlet />
    </div>
  );
}
