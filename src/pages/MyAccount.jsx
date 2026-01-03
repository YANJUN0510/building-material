import React from 'react';
import { useAuth } from '../auth/AuthContext';

function Section({ title, children }) {
  return (
    <section className="account-section">
      <h2 className="account-section-title">{title}</h2>
      <div className="account-section-body">{children}</div>
    </section>
  );
}

function BuilderAccount() {
  return (
    <>
      <Section title="Profit Sharing Model">
        <div className="account-grid">
          <div className="account-card">
            <div className="account-card-title">Company Guaranteed Profit</div>
            <div className="account-card-value">20% net profit</div>
          </div>
          <div className="account-card">
            <div className="account-card-title">Distributable Profit</div>
            <div className="account-card-value">40%</div>
            <div className="account-card-note">Based on price 250, cost 100, profit space 150</div>
          </div>
          <div className="account-card">
            <div className="account-card-title">Showroom Commission</div>
            <div className="account-card-value">10%</div>
          </div>
          <div className="account-card">
            <div className="account-card-title">Salesperson Commission</div>
            <div className="account-card-value">20%</div>
          </div>
          <div className="account-card">
            <div className="account-card-title">Referral Reward</div>
            <div className="account-card-value">10%</div>
          </div>
        </div>
      </Section>

      <Section title="Builder Income Structure">
        <ul className="account-list">
          <li>Self sales: 30% (20% sales + 10% showroom)</li>
          <li>Downline sales override: 10%</li>
          <li>Referral store-opening reward: 2–3% revenue share</li>
          <li>First stocking reward: 10%</li>
        </ul>
      </Section>

      <Section title="Store Types">
        <div className="account-grid">
          <div className="account-card">
            <div className="account-card-title">A Builder</div>
            <div className="account-card-note">Physical store + website + recruitment rights</div>
            <div className="account-card-note">Can recruit Traders and Builders</div>
          </div>
          <div className="account-card">
            <div className="account-card-title">B Builder</div>
            <div className="account-card-note">Website-only operations</div>
            <div className="account-card-note">Revenue split: 5% to A Builder, keep 5%</div>
          </div>
        </div>
      </Section>
    </>
  );
}

function TraderAccount() {
  return (
    <>
      <Section title="Trader Income Structure">
        <ul className="account-list">
          <li>Direct sales: 20%</li>
          <li>Referral customer purchase: 5% rebate</li>
          <li>Upgrade: yearly revenue reaches 1,000,000 to become Builder</li>
          <li>Referral mechanism: only 1 generation (anti-MLM)</li>
        </ul>
      </Section>

      <Section title="Market Target (Context)">
        <ul className="account-list">
          <li>AU building materials & furniture market: 36.1B / year</li>
          <li>Company goal: 1% market share (3.6B revenue)</li>
          <li>Scale plan: 1,000 Traders + 10 Builders</li>
          <li>Income expectation: ~60k/year increase per Trader</li>
        </ul>
      </Section>
    </>
  );
}

function QuestAccount() {
  return (
    <>
      <Section title="Overview">
        <div className="account-grid">
          <div className="account-card">
            <div className="account-card-title">成交额</div>
            <div className="account-card-value">0</div>
            <div className="account-card-note">（示例）后续可对接真实订单数据</div>
          </div>
          <div className="account-card">
            <div className="account-card-title">已购买订单</div>
            <div className="account-card-note">暂无订单</div>
          </div>
        </div>
      </Section>
    </>
  );
}

export default function MyAccount() {
  const { user, logout } = useAuth();
  const role = user?.role;

  return (
    <div className="page account-page">
      <div className="account-header">
        <div>
          <h1 className="account-title metallic-text">My Account</h1>
          <div className="account-meta">
            <span className="account-pill">Role: {role}</span>
            <span className="account-pill">User: {user?.username}</span>
          </div>
        </div>
      </div>

      {role === 'builder' ? <BuilderAccount /> : null}
      {role === 'trader' ? <TraderAccount /> : null}
      {role === 'quest' ? <QuestAccount /> : null}
      {!role ? <div className="account-empty">No role assigned.</div> : null}

      <div className="account-footer">
        <button className="account-logout-danger" onClick={logout}>Logout</button>
      </div>
    </div>
  );
}
