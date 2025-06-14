import axios from 'axios';
import { cookies } from 'next/headers';

function getToken() {
  const raw = cookies().get('bc_token')?.value;
  if (!raw) throw new Error('Not authorised');
  const { access_token, account_id } = JSON.parse(raw);
  return { token: access_token, accountId: account_id };
}

export async function listTopTodos({ project_id, limit }) {
  const { token, accountId } = getToken();
  const url = `https://3.basecampapi.com/${accountId}/projects/${project_id}/todolists.json`;

  const { data } = await axios.get(url, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const todos = data
    .flatMap((l: any) => l.todos)
    .filter((t: any) => !t.completed)
    .sort((a: any, b: any) => new Date(a.due_on).getTime() - new Date(b.due_on).getTime())
    .slice(0, limit);

  return { todos };
}

export async function listUpcoming({ project_id, days }) {
  const { token, accountId } = getToken();
  const until = new Date();
  until.setDate(until.getDate() + days);

  const url = `https://3.basecampapi.com/${accountId}/projects/${project_id}/todolists.json`;
  const { data } = await axios.get(url, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const upcoming = data
    .flatMap((l: any) => l.todos)
    .filter(
      (t: any) =>
        !t.completed && t.due_on && new Date(t.due_on) <= until,
    )
    .map((t: any) => ({
      title: t.title,
      due_on: t.due_on,
      assignee: t.assignee?.name ?? 'Unassigned',
    }));

  return { upcoming };
}