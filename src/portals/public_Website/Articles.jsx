import React from 'react';
import { Link } from 'react-router-dom';
import { articles } from './siteData';
import { useLanguage } from './LanguageContext';

function Articles() {
  const { dictionary } = useLanguage();
  const localizedArticles = articles.map((article, index) => ({
    ...article,
    title: dictionary.articles[index]?.[0] || article.title,
    category: dictionary.articles[index]?.[1] || article.category,
    excerpt: dictionary.articles[index]?.[2] || article.excerpt,
    abstract: dictionary.articles[index]?.[3] || article.abstract,
    patientTakeaway: dictionary.articles[index]?.[4] || article.patientTakeaway,
  }));

  return (
    <section className="bg-[#fff7fc] py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-[#e84faf]">{dictionary.articlesPage.eyebrow}</p>
          <h1 className="mt-3 text-4xl font-bold text-slate-950">{dictionary.articlesPage.title}</h1>
          <p className="mt-4 text-lg leading-8 text-slate-600">
            {dictionary.articlesPage.body}
          </p>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          {localizedArticles.map((article) => (
            <article key={article.slug} className="overflow-hidden rounded-lg border border-pink-100 bg-white shadow-sm">
              <img src={article.image} alt={article.title} className="h-56 w-full object-cover" loading="lazy" width="600" height="320" />
              <div className="p-6">
                <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-wide text-[#e84faf]">
                  <span>{article.category}</span>
                  <span className="text-slate-300">/</span>
                  <span>{article.readTime}</span>
                </div>
                <h2 className="mt-3 text-xl font-bold leading-snug text-slate-950">{article.title}</h2>
                <p className="mt-2 text-sm text-slate-500">{article.date}</p>
                <p className="mt-4 text-sm leading-6 text-slate-600">{article.excerpt}</p>
                {article.abstract && (
                  <div className="mt-5 rounded-lg border border-pink-100 bg-[#fff7fc] p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-[#e84faf]">{dictionary.labels?.patientFriendlyAbstract || 'Patient-friendly abstract'}</p>
                    <p className="mt-2 text-sm leading-6 text-slate-700">{article.abstract}</p>
                  </div>
                )}
                {article.patientTakeaway && (
                  <div className="mt-4 rounded-lg border border-blue-100 bg-white p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-[#3157b7]">{dictionary.labels?.patientTakeaway || 'Patient takeaway'}</p>
                    <p className="mt-2 text-sm leading-6 text-slate-700">{article.patientTakeaway}</p>
                  </div>
                )}
                {article.sourceUrl ? (
                  <div className="mt-5 flex flex-wrap gap-4">
                    <Link to={`/blog/${article.slug}`} className="text-sm font-semibold text-[#3157b7] hover:text-[#e84faf]">
                      {dictionary.common.readArticle}
                    </Link>
                    <a
                      href={article.sourceUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm font-semibold text-[#3157b7] hover:text-[#e84faf]"
                    >
                      {dictionary.labels?.viewSource || 'View source'}: {article.sourceLabel || dictionary.common.readArticle}
                    </a>
                  </div>
                ) : (
                  <button className="mt-5 text-sm font-semibold text-[#3157b7] hover:text-[#e84faf]" type="button">
                    {dictionary.common.readArticle}
                  </button>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Articles;
