import { getTranslations } from 'next-intl/server';
import Header from '../../../components/layout/Header';
import Footer from '../../../components/layout/Footer';
import ForumBoard from '../../../components/forum/ForumBoard';

export default async function ForumPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations('ForumPage');

  return (
    <main className="min-h-screen bg-slate-50">
      <Header />
      <section className="pt-32 pb-16">
        <div className="container">
          <ForumBoard
            locale={locale}
            labels={{
              eyebrow: t('eyebrow'),
              title: t('title'),
              subtitle: t('subtitle'),
              newThread: t('new_thread'),
              loginHint: t('login_hint'),
              loginCta: t('login_cta'),
              reply: t('reply'),
              replyPlaceholder: t('reply_placeholder'),
              createPlaceholder: t('create_placeholder'),
              submitThread: t('submit_thread'),
              submitReply: t('submit_reply'),
              noThreads: t('no_threads'),
              categories: [
                t('category_general'),
                t('category_client'),
                t('category_garage'),
                t('category_supplier'),
                t('category_maintenance'),
                t('category_parts'),
                t('category_autobot'),
              ],
            }}
          />
        </div>
      </section>
      <Footer />
    </main>
  );
}
