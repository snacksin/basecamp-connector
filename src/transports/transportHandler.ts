import { createMcpHandler } from '@vercel/mcp-adapter';
import { listTopTodos, listUpcoming } from '../../../../lib/basecamp';

export const { GET, POST } = createMcpHandler({
  auth: { provider: 'oauth', service: 'basecamp' },
  tools: {
    list_top_todos: {
      description: 'Top N open to-dos for a project',
      parameters: { project_id: 'string', limit: 'number' },
      handler: listTopTodos,
    },
    list_upcoming_due: {
      description: 'Tasks due within X days',
      parameters: { project_id: 'string', days: 'number' },
      handler: listUpcoming,
    },
  },
});