// import { getContact, updateContact } from '../utils/contacts'

import { Form, useLoaderData, useParams } from 'react-router-dom';

export async function action({ request, params }) {
  const formData = await request.formData();
  const name = formData.get('name');
  console.log(name);
  const res = await fetch('/api/users', {
    method: 'POST',
    body: JSON.stringify({ name }),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  console.log(res);
  return { res };
}

export async function loader({ request }) {
  // const response = await fetch("/api/users");
  // const data = await response.json();

  // return {data}
  const data = { name: 'test' };
  return data;
}

export default function Order() {
  const params = useParams();
  // const { id } = useLoaderData()
  const data = useLoaderData();
  console.log('data', data);
  // console.log(id)
  return (
    <div>
      <p>PARAMS: {params.orderId}</p>
      <Form method="post">
        <input type="text" name="name" />
        <button type="submit">click</button>
      </Form>
    </div>
  );
}
