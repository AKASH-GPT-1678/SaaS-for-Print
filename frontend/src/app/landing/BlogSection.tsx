import { ArrowRight } from "lucide-react";

const posts = [
  {
    title:
      "Agent and customer guardrails: protecting both sides of financial services",
    category: "Product",
    date: "Feb 23, 2026",
  },
  {
    title:
      "The three pillars of AI programme growth for financial services in 2026",
    category: "Industry",
    date: "Feb 17, 2026",
  },
  {
    title:
      "Finovate Europe Keynote: How AI agents are driving higher CSAT in finance",
    category: "Company",
    date: "Feb 17, 2026",
  },
];

export default function BlogSection() {
  return (
    <section className="bg-[#f5f2ed] py-24">
      <div className="mx-auto max-w-7xl px-6">
        {/* Top Border */}
        <div className="border-t border-zinc-400 pt-4">
          <p className="text-sm italic text-zinc-700">
            ▪ Blog
          </p>
        </div>

        {/* Heading */}
        <h2 className="mt-6 mb-14 text-5xl font-semibold tracking-tight text-black">
          Our latest insights
        </h2>

        {/* Featured Card */}
        <div className="mb-6 overflow-hidden rounded-3xl bg-white shadow-sm">
          <div className="grid lg:grid-cols-2">
            {/* Content */}
            <div className="p-8 md:p-10">
              <div className="mb-4 border-t border-zinc-300 pt-3">
                <span className="font-serif text-lg italic">
                  Featured
                </span>
              </div>

              <h3 className="mb-4 text-4xl font-medium leading-tight">
                Introducing outbound conversations
              </h3>

              <p className="max-w-xl text-zinc-600">
                Now, your AI agent can initiate contact via text,
                email, or voice to handle the operational work
                that never seems to stop.
              </p>

              <div className="mt-16 border-t border-zinc-200 pt-6 flex gap-4 text-sm">
                <span className="text-orange-500 font-medium">
                  Product
                </span>
                <span className="text-zinc-500">
                  Feb 9, 2026
                </span>
              </div>
            </div>

            {/* Image Side */}
            <div className="p-2">
              <div className="h-full min-h-[320px] rounded-2xl bg-black relative overflow-hidden">
                <div className="absolute inset-0 opacity-30">
                  <div className="grid grid-cols-6 gap-6 p-10">
                    {Array.from({ length: 30 }).map((_, i) => (
                      <div
                        key={i}
                        className="h-10 rounded-md border border-zinc-700"
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Small Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <article
              key={post.title}
              className="rounded-3xl bg-white p-8 shadow-sm transition hover:-translate-y-1"
            >
              <h3 className="mb-12 text-2xl font-medium leading-snug">
                {post.title}
              </h3>

              <div className="border-t border-zinc-200 pt-5 flex gap-4 text-sm">
                <span className="font-medium text-orange-500">
                  {post.category}
                </span>
                <span className="text-zinc-500">
                  {post.date}
                </span>
              </div>
            </article>
          ))}
        </div>

        {/* Button */}
        <div className="mt-10 flex justify-center">
          <button className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-medium shadow-sm transition hover:shadow-md">
            View all posts
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </section>
  );
}