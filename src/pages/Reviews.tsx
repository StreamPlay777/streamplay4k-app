import { site } from '../data/site';
import { reviews, distribution } from '../data/reviews';
import ReviewCard from '../components/ReviewCard';
import { Stars } from '../components/ui';

export default function Reviews() {
  return (
    <>
      <section className="px-7 pb-[46px] pt-[74px]">
        <div className="mx-auto max-w-shell">
          <div className="label-accent">Customer reviews</div>
          <h1 className="mt-4 font-display font-extrabold leading-none text-ink" style={{ fontSize: 'clamp(38px, 6.5vw, 66px)' }}>
            Reviews from
            <br />
            real subscribers
          </h1>
          <p className="mt-6 max-w-[620px] text-[18px] leading-relaxed text-ink-3">
            Verified reviews from subscribers across the United States, published word for word.
          </p>
        </div>
      </section>

      {/* Score + distribution */}
      <section className="px-7 pb-14">
        <div className="mx-auto grid max-w-shell gap-6 lg:grid-cols-[300px_1fr]">
          <div className="card grid place-items-center px-6 py-9 text-center">
            <div>
              <div className="font-display text-[76px] font-extrabold leading-none text-ink">{site.rating}</div>
              <div className="mt-3 flex justify-center">
                <Stars size={15} />
              </div>
              <div className="mt-3 text-[14px] text-ink-3">{site.reviewCount} verified reviews</div>
            </div>
          </div>

          <div className="card px-7 py-8">
            <div className="flex flex-col gap-3.5">
              {distribution.map((row) => (
                <div key={row.stars} className="flex items-center gap-4">
                  <span className="w-[46px] flex-none text-[13px] text-ink-3">{row.stars} star</span>
                  <div className="h-[9px] flex-1 overflow-hidden rounded-[5px] bg-white/[.07]">
                    <div className="h-full rounded-[5px] bg-accent" style={{ width: `${row.percent}%` }} />
                  </div>
                  <span className="w-11 flex-none text-right font-mono text-[12px] text-ink-3">{row.percent}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-7 pb-[110px]">
        <div className="mx-auto grid max-w-shell gap-[18px] md:grid-cols-2 lg:grid-cols-3">
          {reviews.map((r) => <ReviewCard key={r.title} review={r} />)}
        </div>
      </section>
    </>
  );
}
