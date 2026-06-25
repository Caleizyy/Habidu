import { PageLayout } from '@/components/layout/PageLayout';
import './AboutPage.css';

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
      <div className="about-container">
        <section className="about-intro">
          <h2>
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

        <section className="team-section">
          <h2>Meet our Team</h2>
          <p className="team-list">
            {teamMembers.map((member) => (
              <span key={member.name} className="team-name" style={{ color: member.color }}>
                {member.name}
              </span>
            ))}
          </p>
        </section>

        <section className="closing">
          <p>
            We hope <b>Habidu</b> will help you build habits and have a blast doing it!
          </p>
        </section>
      </div>
    </PageLayout>
  );
}
