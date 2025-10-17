// app/chat/loading.tsx
export default function Loading() {
    return (
        <div className="flex min-h-screen items-center justify-center">
            <div className="text-center">
                <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-purple-600" />
                <p className="text-sm text-gray-600">Loading...</p>
            </div>
        </div>
    );
}