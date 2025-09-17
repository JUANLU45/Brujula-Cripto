'use client';

import type { IChatConversation } from '@brujula-cripto/types';

import { MessageIcon } from './ConversationListIcons';

interface ConversationCardStatsProps {
  conversation: IChatConversation;
}

export function ConversationCardStats({ conversation }: ConversationCardStatsProps): JSX.Element {
  return (
    <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
      <span className="flex items-center gap-1">
        <MessageIcon className="h-3 w-3" />
        {conversation.messages.length}
      </span>
      {conversation.tags && conversation.tags.length > 0 && (
        <span className="rounded-full bg-gray-100 px-2 py-1 text-xs dark:bg-gray-700">
          {conversation.tags[0]}
        </span>
      )}
    </div>
  );
}
