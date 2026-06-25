import { PageLayout } from '@/components/layout/PageLayout';

const teamMembers = [
  { name: 'Jonas', color: '#FF6B6B' },
  { name: 'Karolis', color: '#4ECDC4' },
  { name: 'Ąžuolas', color: '#45B7D1' },
  { name: 'Salvijus', color: '#FFA07A' },
  { name: 'Pavel', color: '#98D8C8' },
  { name: 'Matas', color: '#F7DC6F' },
  { name: 'Adrian', color: '#BB8FCE' },
];

export function AboutPage() {
  return (
    <PageLayout title="About">
      <div className="mx-auto max-w-3xl p-8 text-lg leading-relaxed">
        <section>
          <h2 className="mb-6 text-4xl">
            What is <b>Habidu?</b>
          </h2>
          <p>
            We can all probably admit - starting a habit is easy, but <b>sustaining it</b> is the <b>real challenge</b>.
            That's where <b>Habidu</b> comes in! We've built a habit tracking application that makes forming habits{' '}
            <u>simpler</u>, more <u>engaging</u> and most importantly - more <u>social</u>.
          </p>
          <p>
            Create habits, log your progress, connect with friends and build habits together in groups. Because let's
            face it - <b>habits stick better when you've got company.</b>
          </p>
        </section>

        <section>
          <h2 className="mb-6 text-4xl">Meet our Team</h2>
          <p className="flex flex-wrap gap-6">
            {teamMembers.map((member) => (
              <span key={member.name} className="font-semibold" style={{ color: member.color }}>
                {member.name}
              </span>
            ))}
          </p>
        </section>

        <section className="mt-8">
          <p>
            We hope <b>Habidu</b> will help you build habits and have a blast doing it!
          </p>
        </section>
      </div>
    </PageLayout>
  );
}
