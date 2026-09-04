import type { Review } from '../data/reviews';
import { Stars } from './ui';

export default function ReviewCard({ review }: { review: Review }) {
  return (
    <article className="flex flex-col rounded-2xl border border-white/[.08] bg-white/[.02] px-6 pb-6 pt-[26px]">
      <Stars />
      <h3 className="mt-3.5 font-display text-[17px] font-bold text-ink">{review.title}</h3>
      <p className="mt-2.5 flex-1 text-[15px] leading-relaxed text-ink-3">{review.body}</p>
      <div className="mt-5 border-t border-white/[.08] pt-4 text-[12.5px] text-ink-4">
        {review.name} · {review.location} · {review.date}
      </div>
    </article>
  );
}
