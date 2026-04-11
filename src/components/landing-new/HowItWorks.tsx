import { Bot, Scan, Sparkles } from 'lucide-react';

import { FadeIn } from './ui/FadeIn';

export const HowItWorks = () => {
  const steps = [
    {
      icon: Scan,
      title: 'Create Your Profile',
      desc: 'Answer a few questions about your skin and hair characteristics',
      step: '1',
    },
    {
      icon: Bot,
      title: 'AI Analysis',
      desc: 'Our algorithms process your data using advanced machine learning',
      step: '2',
    },
    {
      icon: Sparkles,
      title: 'Get Recommendations',
      desc: 'Receive personalized product suggestions and routines instantly',
      step: '3',
    },
  ];

  return (
    <section id='how-it-works' className='bg-surface py-24 transition-colors duration-300'>
      <div className='mx-auto max-w-7xl px-6'>
        <FadeIn className='mb-16 text-center'>
          <h2 className='text-text-main mb-4 text-4xl font-bold lg:text-5xl'>How It Works</h2>
          <p className='text-text-muted text-xl'>
            Get personalized recommendations in three simple steps
          </p>
        </FadeIn>

        <div className='relative grid gap-8 md:grid-cols-3'>
          <div className='from-brand-muted via-brand to-brand-muted absolute top-24 right-[20%] left-[20%] hidden h-0.5 bg-gradient-to-r md:block' />

          {steps.map((item, i) => (
            <FadeIn key={item.title} delay={i * 0.2} className='relative'>
              <div className='text-center'>
                <div className='relative mb-6 inline-flex'>
                  <div className='from-brand to-brand-hover shadow-brand/30 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br shadow-xl'>
                    <item.icon className='h-8 w-8 text-white' />
                  </div>
                  <div className='bg-surface border-brand text-brand absolute -top-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full border-2 text-sm font-bold'>
                    {item.step}
                  </div>
                </div>
                <h3 className='text-text-main mb-2 text-xl font-bold'>{item.title}</h3>
                <p className='text-text-muted'>{item.desc}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
};
