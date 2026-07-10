import React from 'react';
import { articles } from './siteData';

function Articles() {
  return (
    <section className="bg-slate-50 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-teal-700">Articles and blogs</p>
          <h1 className="mt-3 text-4xl font-bold text-slate-950">Health notes from our clinical team</h1>
          <p className="mt-4 text-lg leading-8 text-slate-600">
            Publish patient education, seasonal care updates, clinic news, and preventive health guides here.
          </p>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {articles.map((article) => (
            <article key={article.slug} className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
              <img src={article.image} alt="" className="h-56 w-full object-cover" />
              <div className="p-6">
                <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-wide text-teal-700">
                  <span>{article.category}</span>
                  <span className="text-slate-300">/</span>
                  <span>{article.readTime}</span>
                </div>
                <h2 className="mt-3 text-xl font-bold leading-snug text-slate-950">{article.title}</h2>
                <p className="mt-2 text-sm text-slate-500">{article.date}</p>
                <p className="mt-4 text-sm leading-6 text-slate-600">{article.excerpt}</p>
                <button className="mt-5 text-sm font-semibold text-teal-700 hover:text-teal-800" type="button">
                  Read article
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Articles;
