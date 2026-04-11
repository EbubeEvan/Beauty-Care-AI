import { FadeIn } from './ui/FadeIn';
import { TestimonialCard } from './ui/TestimonialCard';

export const Testimonials = () => {
  const reviews = [
    {
      name: 'Sarah M.',
      role: 'Skincare Enthusiast',
      text: 'Finally found products that actually work for my sensitive skin! The AI analysis was incredibly accurate.',
      avatar: 'https://i.pravatar.cc/150?u=sarah',
    },
    {
      name: 'Jessica L.',
      role: 'Beauty Blogger',
      text: 'The hair analysis feature is a game-changer. My curls have never looked better with the recommended routine.',
      avatar: 'https://i.pravatar.cc/150?u=jessica',
    },
    {
      name: 'Emma K.',
      role: 'Working Professional',
      text: 'Saves me so much time and money. No more guessing which products to buy!',
      avatar: 'https://i.pravatar.cc/150?u=emma',
    },
  ];

  return (
    <section className='bg-surface py-24 transition-colors duration-300'>
      <div className='mx-auto max-w-7xl px-6'>
        <FadeIn className='mb-16 text-center'>
          <h2 className='text-text-main mb-4 text-4xl font-bold lg:text-5xl'>Loved by Users</h2>
          <p className='text-text-muted text-xl'>See what our community has to say</p>
        </FadeIn>

        <div className='grid gap-6 md:grid-cols-3'>
          {reviews.map((review, i) => (
            <TestimonialCard key={review.name} {...review} delay={i * 0.1} />
          ))}
        </div>
      </div>
    </section>
  );
};
