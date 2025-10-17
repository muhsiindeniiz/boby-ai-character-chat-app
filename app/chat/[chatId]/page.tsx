import { ChatDetailPage } from '@/modules/chat/view/chat-detail-page';
import { use } from 'react';

export default function Page({
    params,
}: {
    params: Promise<{ chatId: string }>;
}) {
    const resolvedParams = use(params);
    return <ChatDetailPage chatId={resolvedParams.chatId} />;
}