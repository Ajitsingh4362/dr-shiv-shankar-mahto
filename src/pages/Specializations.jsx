import React, { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'

const SPECS = [
  {
    icon: '🩺',
    title: 'General Consultation',
    tagline: 'Expert Diagnosis, Every Visit',
    desc: 'Thorough physical examination and diagnosis for everyday health concerns — from minor ailments to symptoms that need a closer look, with clear guidance on what to do next.',
    points: ['Complete physical examination', 'Accurate, timely diagnosis', 'Clear treatment guidance', 'Referrals when specialist care is needed', 'Suitable for all age groups', 'Follow-up support included'],
    highlight: true,
    color: 'var(--navy-800)',
  },
  {
    icon: '🔬',
    title: 'General & Minor Surgery',
    tagline: 'Precise, Safe Surgical Care',
    desc: 'Skilled surgical care for minor procedures, performed with precision and a strong focus on patient safety and comfort — from lump and cyst removal to wound management and suturing.',
    points: ['Minor surgical procedures', 'Wound care and suturing', 'Abscess and cyst management', 'Pre- and post-operative care', 'Sterile, well-equipped setup', 'Careful pain management'],
    highlight: true,
    color: 'var(--teal)',
  },
  {
    icon: '🌡️',
    title: 'Fever & Infections',
    tagline: 'Fast Relief, Accurate Treatment',
    desc: 'Prompt diagnosis and treatment for fevers, viral infections, and bacterial illnesses — so you feel better sooner and know exactly what you\'re dealing with.',
    points: ['Same-day evaluation', 'Lab test guidance when needed', 'Treatment for viral & bacterial infections', 'Seasonal illness care', 'Clear recovery instructions', 'Follow-up if symptoms persist'],
    highlight: false,
  },
  {
    icon: '❤️',
    title: 'Diabetes & Hypertension',
    tagline: 'Long-Term Management, Personal Attention',
    desc: 'Ongoing care for diabetes, blood pressure, and other chronic conditions — with regular monitoring and a treatment plan that adjusts as your health does.',
    points: ['Regular monitoring & review', 'Medication management', 'Diet and lifestyle guidance', 'Risk screening for complications', 'Coordinated long-term care', 'Family history assessment'],
    highlight: false,
  },
  {
    icon: '💉',
    title: 'Vaccination',
    tagline: 'Protection at Every Age',
    desc: 'Immunization for children and adults, following recommended schedules — keeping your whole family protected against preventable illness.',
    points: ['Childhood immunization schedules', 'Adult and travel vaccines', 'Seasonal flu vaccination', 'Vaccination record guidance', 'Gentle care for children', 'Reminders for follow-up doses'],
    highlight: false,
  },
  {
    icon: '🚑',
    title: 'Emergency Care',
    tagline: 'Prompt Attention When It Matters',
    desc: 'Urgent medical situations can\'t always wait. Emergency care is available for sudden illness, minor trauma, and situations that need immediate attention.',
    points: ['Rapid initial assessment', 'Minor trauma and injury care', 'Stabilisation and referral if needed', 'Same-day appointments where possible', 'Clear next steps and guidance', 'Calm, experienced handling'],
    highlight: false,
  },
]

export default function Specializations() {
  const ref = useRef(null)
  useEffect(() => { if (ref.current) ref.current.classList.add('page-enter') }, [])

  return (
    <div ref={ref} style={{ overflowX: 'hidden' }}>
      {/* Hero */}
      <section style={{ background: 'linear-gradient(160deg, var(--navy-900), var(--navy-800))', padding: '168px 0 80px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: "url('/hero-pattern.svg')", backgroundSize: 'cover', backgroundPosition: 'center' }} className="hero-corner-pattern" />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
            <div style={{ width: '32px', height: '1px', background: 'var(--gold)' }} />
            <span style={{ fontSize: '11px', fontFamily: 'var(--font-body)', fontWeight: 600, color: 'var(--gold)', letterSpacing: '2.5px', textTransform: 'uppercase' }}>Services</span>
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(38px, 5vw, 64px)', color: 'var(--white)', fontWeight: 600, marginBottom: '20px' }}>
            Complete Healthcare, Under One Roof
          </h1>
          <p style={{ fontSize: '16px', color: 'var(--gold)', fontFamily: 'var(--font-display)', fontStyle: 'italic', marginBottom: '20px' }}>
            General Medicine & Surgical Care in Sitamarhi
          </p>
          <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.55)', maxWidth: '620px', lineHeight: '1.9', fontWeight: 300, fontFamily: 'var(--font-body)', marginBottom: '16px' }}>
            Mahto Clinic offers a wide range of medical care — general consultation, minor surgery, chronic disease management, vaccination, and emergency care — all under one roof.
          </p>
          <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.45)', maxWidth: '620px', lineHeight: '1.9', fontWeight: 300, fontFamily: 'var(--font-body)', marginBottom: '16px' }}>
            The clinic is equipped with the essentials for precise diagnosis and effective, comfortable treatment for every patient.
          </p>
          <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.45)', maxWidth: '620px', lineHeight: '1.9', fontWeight: 300, fontFamily: 'var(--font-body)' }}>
            Whether it's a routine check-up, a sudden fever, or a condition you've been managing for years — the goal is timely, careful, personal care.
          </p>
        </div>
      </section>

      {/* Highlighted */}
      <section style={{ padding: '90px 0', background: 'var(--ivory)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <span className="section-tag">Core Specialties</span>
            <div className="gold-line center" />
            <h2 className="section-title">Signature Areas of Expertise</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2px', marginBottom: '2px' }} className="two-col-grid">
            {SPECS.filter(s => s.highlight).map((s, i) => (
              <div key={i} style={{ background: s.color, padding: '48px 40px', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'var(--gold)' }} />
                <div style={{ position: 'absolute', bottom: '-20px', right: '-20px', width: '120px', height: '120px', borderRadius: '50%', background: 'rgba(13, 148, 136,0.06)' }} />
                <div style={{ fontSize: '40px', marginBottom: '20px' }}>{s.icon}</div>
                <div style={{ fontSize: '10px', color: 'var(--gold)', fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '12px' }}>Core Specialty</div>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(22px, 2.5vw, 30px)', color: 'var(--white)', fontWeight: 600, marginBottom: '12px', lineHeight: 1.2 }}>{s.title}</h2>
                <p style={{ fontSize: '13px', color: 'var(--gold)', fontStyle: 'italic', marginBottom: '16px', fontFamily: 'var(--font-display)' }}>{s.tagline}</p>
                <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.65)', lineHeight: '1.85', marginBottom: '24px' }}>{s.desc}</p>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {s.points.map((p, j) => (
                    <li key={j} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', fontSize: '13px', color: 'rgba(255,255,255,0.7)' }}>
                      <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: 'rgba(13, 148, 136,0.2)', border: '1px solid rgba(13, 148, 136,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '1px' }}>
                        <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'var(--gold)' }} />
                      </div>
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Other specialties */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2px' }}>
            {SPECS.filter(s => !s.highlight).map((s, i) => (
              <div key={i} style={{ background: 'var(--white)', padding: '36px 32px', borderBottom: '3px solid transparent', transition: 'var(--transition)' }}
                onMouseEnter={e => { e.currentTarget.style.borderBottom = '3px solid var(--gold)'; e.currentTarget.style.background = 'var(--ivory)' }}
                onMouseLeave={e => { e.currentTarget.style.borderBottom = '3px solid transparent'; e.currentTarget.style.background = 'var(--white)' }}>
                <div style={{ fontSize: '32px', marginBottom: '16px' }}>{s.icon}</div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 600, color: 'var(--navy-800)', marginBottom: '8px' }}>{s.title}</h3>
                <p style={{ fontSize: '12px', color: 'var(--gold)', fontStyle: 'italic', marginBottom: '12px' }}>{s.tagline}</p>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.8', marginBottom: '20px' }}>{s.desc}</p>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {s.points.map((p, j) => (
                    <li key={j} style={{ display: 'flex', gap: '8px', fontSize: '12px', color: 'var(--text-muted)' }}>
                      <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'var(--gold)', flexShrink: 0, marginTop: '6px' }} />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY CLIENTS CHOOSE US */}
      <section style={{ padding: '100px 0', background: 'var(--navy-900)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <span className="section-tag">Why Patients Choose Us</span>
            <div className="gold-line center" />
            <h2 className="section-title light">Healthcare You Can Trust</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '2px' }}>
            {[
              'Complete Family Healthcare Under One Roof',
              'Skilled General & Minor Surgical Care',
              'Careful, Comfort-Focused Consultations',
              'Chronic Disease Management',
              'Child-Friendly Vaccination Care',
              'Emergency Appointments Available',
              'Personalised Treatment Plans',
              'Hygienic, Well-Equipped Clinic',
              'Trusted Care in Sitamarhi',
            ].map((w, i) => (
              <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(13, 148, 136,0.08)', padding: '24px 20px', display: 'flex', alignItems: 'flex-start', gap: '12px', transition: 'var(--transition)' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(13, 148, 136,0.06)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}>
                <span style={{ color: 'var(--gold)', fontSize: '16px', flexShrink: 0, marginTop: '2px' }}>✔</span>
                <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.65)', lineHeight: '1.6', fontFamily: 'var(--font-body)' }}>{w}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PATIENT STORIES */}
      <section style={{ padding: '80px 0', background: 'var(--ivory)' }}>
        <div className="container" style={{ maxWidth: '720px', textAlign: 'center' }}>
          <span className="section-tag">Patient Stories</span>
          <div className="gold-line center" />
          <h2 className="section-title">Real Patients. Real Recoveries.</h2>
          <p style={{ fontSize: '15px', color: 'var(--text-muted)', lineHeight: '1.9', fontFamily: 'var(--font-body)', fontWeight: 300, marginBottom: '12px' }}>
            Every patient's journey is different. The greatest reward is seeing people walk out feeling heard, cared for, and on the road to recovery.
          </p>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: '1.9', fontFamily: 'var(--font-body)', fontWeight: 300 }}>
            From routine check-ups to ongoing chronic care — patient comfort and trust guide every consultation at Mahto Clinic.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: 'var(--gold)', padding: '70px 0', textAlign: 'center' }}>
        <div className="container">
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(26px, 3.5vw, 42px)', color: 'var(--navy-800)', marginBottom: '16px' }}>Ready to Book Your Visit?</h2>
          <p style={{ fontSize: '15px', color: 'rgba(15, 33, 56,0.7)', marginBottom: '28px' }}>Get in touch and let us find the right care for you.</p>
          <Link to="/contact">
            <button style={{ background: 'var(--navy-800)', color: 'var(--white)', border: 'none', padding: '14px 32px', borderRadius: '2px', fontSize: '13px', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase', cursor: 'pointer' }}>
              Book an Appointment
            </button>
          </Link>
        </div>
      </section>
    </div>
  )
}
