'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useAuthStore } from '../../lib/store/useAuthStore';
import { fetchApi } from '../../lib/api-client';

type ForumThread = {
  id: string;
  title: string;
  slug: string;
  category: string;
  status: string;
  body: string;
  votes: number;
  repliesCount: number;
  isPinned: boolean;
  lastActivityAt: string;
  createdAt: string;
  author: { id: string; name: string; role: string; avatarUrl?: string | null };
  posts?: Array<{
    id: string;
    body: string;
    createdAt: string;
    author: { id: string; name: string; role: string; avatarUrl?: string | null };
  }>;
};

type ForumLabels = {
  eyebrow: string;
  title: string;
  subtitle: string;
  newThread: string;
  loginHint: string;
  loginCta: string;
  reply: string;
  replyPlaceholder: string;
  createPlaceholder: string;
  submitThread: string;
  submitReply: string;
  noThreads: string;
  categories: string[];
};

const categoryOrder = ['GENERAL', 'CLIENT', 'GARAGE', 'SUPPLIER', 'MAINTENANCE', 'PIECES', 'AUTOBOT'];

export default function ForumBoard({ locale, labels }: { locale: string; labels: ForumLabels }) {
  const token = useAuthStore((state) => state.token);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [threads, setThreads] = useState<ForumThread[]>([]);
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [threadTitle, setThreadTitle] = useState('');
  const [threadBody, setThreadBody] = useState('');
  const [threadCategory, setThreadCategory] = useState('GENERAL');
  const [replyBody, setReplyBody] = useState('');
  const [busy, setBusy] = useState(false);

  const selectedThread = useMemo(
    () => threads.find((thread) => thread.slug === selectedSlug) ?? threads[0] ?? null,
    [threads, selectedSlug],
  );

  const loadThreads = async () => {
    setLoading(true);
    try {
      const data = await fetchApi<ForumThread[]>('/forum/threads');
      setThreads(data ?? []);
      setSelectedSlug((current) => current ?? data?.[0]?.slug ?? null);
    } catch {
      setThreads([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadThreads();
  }, []);

  useEffect(() => {
    if (selectedThread?.slug) {
      void fetchApi<ForumThread>(`/forum/threads/${selectedThread.slug}`).then((data) => {
        setThreads((current) =>
          current.map((item) => (item.slug === data.slug ? { ...item, ...data } : item)),
        );
      });
    }
  }, [selectedThread?.slug]);

  const createThread = async () => {
    if (!isAuthenticated || !token) return;
    setBusy(true);
    setMessage('');
    try {
      const data = await fetchApi<ForumThread>('/forum/threads', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          title: threadTitle,
          body: threadBody,
          category: threadCategory,
        }),
      });
      setThreads((current) => [data, ...current]);
      setSelectedSlug(data.slug);
      setThreadTitle('');
      setThreadBody('');
      setThreadCategory('GENERAL');
      setMessage('Sujet publié.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Impossible de publier le sujet.');
    } finally {
      setBusy(false);
    }
  };

  const submitReply = async () => {
    if (!isAuthenticated || !token || !selectedThread) return;
    setBusy(true);
    setMessage('');
    try {
      const post = await fetchApi(`/forum/threads/${selectedThread.id}/replies`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify({ body: replyBody }),
      });
      setReplyBody('');
      setThreads((current) =>
        current.map((thread) =>
          thread.id === selectedThread.id
            ? {
                ...thread,
                repliesCount: thread.repliesCount + 1,
                posts: [...(thread.posts ?? []), post as never],
              }
            : thread,
        ),
      );
      setMessage('Réponse publiée.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Impossible de répondre.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[360px_minmax(0,1fr)]">
      <aside className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
        <div className="mb-4">
          <span className="text-[11px] font-black uppercase tracking-[0.3em] text-primary-700">{labels.eyebrow}</span>
          <h1 className="mt-2 text-3xl font-black text-slate-900">{labels.title}</h1>
          <p className="mt-2 text-sm leading-6 text-slate-600">{labels.subtitle}</p>
        </div>

        <div className="mb-4 flex flex-wrap gap-2">
          {labels.categories.map((cat, index) => (
            <button
              key={cat}
              type="button"
              onClick={() => {
                setSelectedSlug(null);
                setThreadCategory(categoryOrder[index] ?? 'GENERAL');
              }}
              className={`rounded-full px-3 py-2 text-xs font-bold transition ${
                threadCategory === (categoryOrder[index] ?? 'GENERAL')
                  ? 'bg-primary-900 text-white'
                  : 'bg-slate-100 text-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {loading ? (
            <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-500">Chargement...</div>
          ) : threads.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 p-5 text-sm text-slate-500">
              {labels.noThreads}
            </div>
          ) : (
            threads.map((thread) => (
              <button
                key={thread.id}
                type="button"
                onClick={() => setSelectedSlug(thread.slug)}
                className={`w-full rounded-3xl border p-4 text-left transition ${
                  selectedThread?.id === thread.id
                    ? 'border-primary-700 bg-primary-50'
                    : 'border-slate-200 bg-white hover:border-primary-200'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-slate-600">
                    {thread.category}
                  </span>
                  <span className="text-xs text-slate-500">{thread.repliesCount} réponses</span>
                </div>
                <div className="mt-2 text-base font-black text-slate-900">{thread.title}</div>
                <div className="mt-1 line-clamp-2 text-sm text-slate-600">{thread.body}</div>
              </button>
            ))
          )}
        </div>
      </aside>

      <main className="space-y-6 rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
        <div className="rounded-[24px] bg-slate-50 p-5">
          <h2 className="text-xl font-black text-slate-900">{labels.newThread}</h2>
          {!isAuthenticated ? (
            <p className="mt-2 text-sm text-slate-600">
              {labels.loginHint}{' '}
              <Link href={`/${locale}/compte/login`} className="font-bold text-primary-700 underline">
                {labels.loginCta}
              </Link>
            </p>
          ) : (
            <div className="mt-4 grid gap-3">
              <input
                value={threadTitle}
                onChange={(e) => setThreadTitle(e.target.value)}
                placeholder={labels.createPlaceholder}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-primary-700"
              />
              <textarea
                value={threadBody}
                onChange={(e) => setThreadBody(e.target.value)}
                rows={5}
                placeholder={labels.replyPlaceholder}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-primary-700"
              />
              <div className="flex flex-wrap gap-2">
                {categoryOrder.map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setThreadCategory(category)}
                    className={`rounded-full px-3 py-2 text-xs font-bold ${
                      threadCategory === category ? 'bg-primary-900 text-white' : 'bg-white text-slate-700 border border-slate-200'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={createThread}
                disabled={busy || !threadTitle.trim() || !threadBody.trim()}
                className="w-fit rounded-full bg-primary-900 px-5 py-3 text-sm font-bold text-white disabled:opacity-50"
              >
                {labels.submitThread}
              </button>
            </div>
          )}
        </div>

        {selectedThread ? (
          <article className="rounded-[24px] border border-slate-200 p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-[11px] font-black uppercase tracking-[0.3em] text-primary-700">{selectedThread.category}</div>
                <h3 className="mt-2 text-2xl font-black text-slate-900">{selectedThread.title}</h3>
              </div>
              <div className="text-right text-xs text-slate-500">
                <div>{selectedThread.votes} votes</div>
                <div>{selectedThread.repliesCount} réponses</div>
              </div>
            </div>

            <p className="mt-4 whitespace-pre-line text-sm leading-7 text-slate-700">{selectedThread.body}</p>

            <div className="mt-6 space-y-3">
              {(selectedThread.posts ?? []).map((post) => (
                <div key={post.id} className="rounded-2xl bg-slate-50 p-4">
                  <div className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
                    {post.author.name} · {post.author.role}
                  </div>
                  <p className="mt-2 whitespace-pre-line text-sm leading-6 text-slate-700">{post.body}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 border-t border-slate-200 pt-5">
              {!isAuthenticated ? (
                <p className="text-sm text-slate-600">
                  {labels.loginHint}{' '}
                  <Link href={`/${locale}/compte/login`} className="font-bold text-primary-700 underline">
                    {labels.loginCta}
                  </Link>
                </p>
              ) : (
                <div className="grid gap-3">
                  <textarea
                    value={replyBody}
                    onChange={(e) => setReplyBody(e.target.value)}
                    rows={4}
                    placeholder={labels.submitReply}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-primary-700"
                  />
                  <button
                    type="button"
                    onClick={submitReply}
                    disabled={busy || !replyBody.trim()}
                    className="w-fit rounded-full bg-primary-700 px-5 py-3 text-sm font-bold text-white disabled:opacity-50"
                  >
                    {labels.reply}
                  </button>
                </div>
              )}
            </div>
          </article>
        ) : (
          <div className="rounded-[24px] border border-dashed border-slate-200 p-8 text-center text-sm text-slate-500">
            {labels.noThreads}
          </div>
        )}

        {message && <p className="text-sm font-medium text-primary-700">{message}</p>}
      </main>
    </div>
  );
}
