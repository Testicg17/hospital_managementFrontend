import React from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import SEO from '../../components/SEO';
import { articles } from './siteData';
import { articleSchema, breadcrumbSchema, getArticleSeo, webPageSchema } from './seoData';
import { useLanguage } from './LanguageContext';

function ArticleDetail() {
  const { slug } = useParams();
  const { dictionary } = useLanguage();
  const articleIndex = articles.findIndex((item) => item.slug === slug);
  const article = articles[articleIndex];

  if (!article) return <Navigate to="/articles" replace />;

  const localizedArticle = {
    ...article,
    title: dictionary.articles[articleIndex]?.[0] || article.title,
    category: dictionary.articles[articleIndex]?.[1] || article.category,
    excerpt: dictionary.articles[articleIndex]?.[2] || article.excerpt,
    abstract: dictionary.articles[articleIndex]?.[3] || article.abstract,
    patientTakeaway: dictionary.articles[articleIndex]?.[4] || article.patientTakeaway,
  };
  const path = `/blog/${article.slug}`;
  const seo = getArticleSeo(localizedArticle);

  return (
    <article className="bg-[#fff7fc] py-16">
      <SEO
        {...seo}
        path={path}
        image={article.image}
        schemas={[
          webPageSchema({ path, title: seo.title, description: seo.description }),
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Blog', path: '/blog' },
            { name: localizedArticle.title, path },
          ]),
          articleSchema(localizedArticle, path),
        ]}
      />
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <Link to="/articles" className="text-sm font-semibold text-[#3157b7] hover:text-[#e84faf]">Back to articles</Link>
        <div className="mt-6 overflow-hidden rounded-lg border border-pink-100 bg-white shadow-sm">
          <img src={article.image} alt={localizedArticle.title} className="h-72 w-full object-cover" loading="lazy" width="1200" height="480" />
          <div className="p-6 md:p-8">
            <p className="text-xs font-semibold uppercase tracking-wide text-[#e84faf]">{localizedArticle.category}</p>
            <h1 className="mt-3 text-4xl font-bold leading-tight text-slate-950">{localizedArticle.title}</h1>
            <p className="mt-2 text-sm text-slate-500">{article.date} | {article.readTime}</p>
            <p className="mt-6 text-lg leading-8 text-slate-700">{localizedArticle.excerpt}</p>
            <section className="mt-8 rounded-lg border border-pink-100 bg-[#fff7fc] p-5">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-[#e84faf]">{dictionary.labels?.patientFriendlyAbstract || 'Patient-friendly abstract'}</h2>
              <p className="mt-3 leading-7 text-slate-700">{localizedArticle.abstract}</p>
            </section>
            <section className="mt-5 rounded-lg border border-blue-100 bg-white p-5">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-[#3157b7]">{dictionary.labels?.patientTakeaway || 'Patient takeaway'}</h2>
              <p className="mt-3 leading-7 text-slate-700">{localizedArticle.patientTakeaway}</p>
            </section>
            {article.sourceUrl && (
              <a href={article.sourceUrl} target="_blank" rel="noreferrer" className="mt-6 inline-flex text-sm font-semibold text-[#3157b7] hover:text-[#e84faf]">
                {dictionary.labels?.viewSource || 'View source'}: {article.sourceLabel}
              </a>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

export default ArticleDetail;
