import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import {
  Settings as SettingsIcon,
  Palette,
  Shield,
  Bell,
  Code2,
  Save,
  Check,
  Building,
  Lock,
  Layers,
  Copy,
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const {
    currentTenantId,
    tenants,
    updateTenantBranding,
    users,
    currentUserId,
    addToast,
  } = useStore();

  const [activeTab, setActiveTab] = useState<'branding' | 'roles' | 'notifications' | 'api'>('branding');
  const activeTenant = tenants.find((t) => t.id === currentTenantId) || tenants[0];

  // Branding state
  const [tenantName, setTenantName] = useState(activeTenant.name);
  const [logoText, setLogoText] = useState(activeTenant.logoText);
  const [primaryColor, setPrimaryColor] = useState(activeTenant.primaryColor);
  const [dotNumber, setDotNumber] = useState(activeTenant.dotNumber);
  const [mcNumber, setMcNumber] = useState(activeTenant.mcNumber);
  const [fleetSize, setFleetSize] = useState(activeTenant.fleetSize);
  const [contactEmail, setContactEmail] = useState(activeTenant.contactEmail);
  const [contactPhone, setContactPhone] = useState(activeTenant.contactPhone);

  const [copiedEndpoint, setCopiedEndpoint] = useState<string | null>(null);

  const handleSaveBranding = (e: React.FormEvent) => {
    e.preventDefault();
    updateTenantBranding(currentTenantId, {
      name: tenantName,
      logoText,
      primaryColor,
      dotNumber,
      mcNumber,
      fleetSize: Number(fleetSize),
      contactEmail,
      contactPhone,
    });
  };

  const copyToClipboard = (text: string, endpointName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedEndpoint(endpointName);
    addToast('Copied', 'JSON schema copied to clipboard', 'info');
    setTimeout(() => setCopiedEndpoint(null), 2000);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-lg font-bold font-heading text-[#14161A]">
          Platform Administration & Compliance Settings
        </h1>
        <p className="text-xs text-[#5B616B] mt-0.5">
          Manage tenant identity, live white-label branding, access control policies, and developer API contracts
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#ECEAE4]">
        {[
          { id: 'branding', label: 'Tenant Branding & Profile', icon: Palette },
          { id: 'roles', label: 'RBAC Roles & Permissions', icon: Shield },
          { id: 'notifications', label: 'Compliance Alert Rules', icon: Bell },
          { id: 'api', label: 'Developer API Contracts', icon: Code2 },
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 -mb-px transition-all ${
                isActive
                  ? 'border-[#0E7C7B] text-[#0E7C7B]'
                  : 'border-transparent text-[#5B616B] hover:text-[#14161A]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Tenant Branding */}
      {activeTab === 'branding' && (
        <div className="bg-white rounded-2xl border border-[#ECEAE4] p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-[#ECEAE4]">
            <div>
              <h3 className="text-sm font-semibold font-heading text-[#14161A]">
                Carrier Profile & White-Label Customization
              </h3>
              <p className="text-xs text-[#5B616B] mt-0.5">
                Changes apply in real-time across the header, offer letter generator, and applicant portal.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: primaryColor }} />
              <span className="text-xs font-mono font-medium text-[#14161A]">Live Preview</span>
            </div>
          </div>

          <form onSubmit={handleSaveBranding} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[#14161A] font-semibold mb-1">Company Legal Name</label>
                <input
                  type="text"
                  value={tenantName}
                  onChange={(e) => setTenantName(e.target.value)}
                  className="w-full px-3 py-2 border border-[#ECEAE4] rounded-lg"
                />
              </div>
              <div>
                <label className="block text-[#14161A] font-semibold mb-1">Short Brand Name (Navbar)</label>
                <input
                  type="text"
                  value={logoText}
                  onChange={(e) => setLogoText(e.target.value)}
                  className="w-full px-3 py-2 border border-[#ECEAE4] rounded-lg"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-[#14161A] font-semibold mb-1">Brand Primary Color (HEX)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="w-9 h-9 rounded-lg border border-[#ECEAE4] cursor-pointer"
                  />
                  <input
                    type="text"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="w-full px-3 py-2 border border-[#ECEAE4] rounded-lg font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#14161A] font-semibold mb-1">US DOT Number</label>
                <input
                  type="text"
                  value={dotNumber}
                  onChange={(e) => setDotNumber(e.target.value)}
                  className="w-full px-3 py-2 border border-[#ECEAE4] rounded-lg font-mono"
                />
              </div>

              <div>
                <label className="block text-[#14161A] font-semibold mb-1">Operating Authority MC #</label>
                <input
                  type="text"
                  value={mcNumber}
                  onChange={(e) => setMcNumber(e.target.value)}
                  className="w-full px-3 py-2 border border-[#ECEAE4] rounded-lg font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-[#14161A] font-semibold mb-1">Active Power Units (Fleet Size)</label>
                <input
                  type="number"
                  value={fleetSize}
                  onChange={(e) => setFleetSize(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-[#ECEAE4] rounded-lg font-mono"
                />
              </div>

              <div>
                <label className="block text-[#14161A] font-semibold mb-1">Recruiting Email</label>
                <input
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-[#ECEAE4] rounded-lg"
                />
              </div>

              <div>
                <label className="block text-[#14161A] font-semibold mb-1">Recruiting Phone</label>
                <input
                  type="text"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  className="w-full px-3 py-2 border border-[#ECEAE4] rounded-lg"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-[#ECEAE4] flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 text-xs font-semibold text-white bg-[#0E7C7B] hover:bg-[#0c6b6a] rounded-xl shadow-xs transition-colors"
              >
                Save Branding Settings
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tab 2: RBAC Roles */}
      {activeTab === 'roles' && (
        <div className="bg-white rounded-2xl border border-[#ECEAE4] p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-[#ECEAE4]">
            <div>
              <h3 className="text-sm font-semibold font-heading text-[#14161A]">
                Role-Based Access Control (RBAC) Matrix
              </h3>
              <p className="text-xs text-[#5B616B] mt-0.5">
                Compliance rules strictly enforce separation between recruiters and safety authorization authorities.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {[
              {
                role: 'Admin',
                permissions: 'Full tenant authority: branding configuration, user assignment, billing, pipeline editor.',
                activeStaff: users.filter((u) => u.role === 'Admin' && u.tenantId === currentTenantId),
              },
              {
                role: 'Recruiting Manager',
                permissions: 'Manage recruiter assignments, approve pay models, approve offer letters, view full analytics.',
                activeStaff: users.filter((u) => u.role === 'Recruiting Manager' && u.tenantId === currentTenantId),
              },
              {
                role: 'Recruiter',
                permissions: 'Create driver leads, execute OCR scans, log communications, dispatch VOE inquiries, draft offers.',
                activeStaff: users.filter((u) => u.role === 'Recruiter' && u.tenantId === currentTenantId),
              },
              {
                role: 'Safety Manager',
                permissions: 'Sole authority to grant final Part 391 Safety Approval. Disqualify drivers, review drug tests and MVRs.',
                activeStaff: users.filter((u) => u.role === 'Safety Manager' && u.tenantId === currentTenantId),
              },
              {
                role: 'Viewer',
                permissions: 'Read-only access to driver records and high-level reports. Cannot alter compliance state.',
                activeStaff: users.filter((u) => u.role === 'Viewer' && u.tenantId === currentTenantId),
              },
            ].map((item) => (
              <div key={item.role} className="p-4 rounded-xl border border-[#ECEAE4] bg-[#FAF9F6] space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#14161A] font-heading">{item.role}</span>
                  <span className="text-[11px] font-mono text-[#0E7C7B]">
                    {item.activeStaff.length} Assigned Staff
                  </span>
                </div>
                <p className="text-[#5B616B]">{item.permissions}</p>
                {item.activeStaff.length > 0 && (
                  <div className="text-[11px] text-[#9AA0A8] pt-1">
                    Users: {item.activeStaff.map((s) => s.name).join(', ')}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Notifications Rules */}
      {activeTab === 'notifications' && (
        <div className="bg-white rounded-2xl border border-[#ECEAE4] p-6 shadow-sm space-y-4 text-xs">
          <h3 className="text-sm font-semibold font-heading text-[#14161A]">
            Automated Compliance Triggers & Alerts
          </h3>
          <p className="text-[#5B616B]">
            Rules that automatically generate alerts in the top bar notification bell:
          </p>

          <div className="space-y-3">
            {[
              { rule: 'DOT Medical Card Expiration Alert', desc: 'Triggers when a certificate expires or has < 30 days remaining.', severity: 'High' },
              { rule: 'VOE Overdue Carrier Escalation', desc: 'Triggers when prior carrier has not replied after 5 business days.', severity: 'Medium' },
              { rule: 'Mobile Application Completed', desc: 'Notifies assigned recruiter immediately upon driver digital signature.', severity: 'Low' },
              { rule: 'Conditional Offer Ready for Manager', desc: 'Notifies Recruiting Manager when recruiter drafts an offer letter.', severity: 'High' },
            ].map((nRule) => (
              <div key={nRule.rule} className="p-3 bg-[#FAF9F6] border border-[#ECEAE4] rounded-xl flex items-center justify-between">
                <div>
                  <span className="font-semibold text-[#14161A] block">{nRule.rule}</span>
                  <span className="text-[11px] text-[#5B616B]">{nRule.desc}</span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white border border-[#ECEAE4] text-[#14161A]">
                  {nRule.severity} Priority
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Developer API Contracts */}
      {activeTab === 'api' && (
        <div className="bg-white rounded-2xl border border-[#ECEAE4] p-6 shadow-sm space-y-6">
          <div>
            <h3 className="text-sm font-semibold font-heading text-[#14161A]">
              RigReady REST API & Webhook Contracts
            </h3>
            <p className="text-xs text-[#5B616B] mt-0.5">
              Documented endpoints for integrating with TMS, Tenstreet, DriverReach, Samsara, and Motive
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                method: 'POST',
                path: '/v1/drivers/leads',
                desc: 'Ingest lead from job board or landing page with automated duplicate detection',
                sampleJson: `{
  "firstName": "Michael",
  "lastName": "Miller",
  "phone": "(214) 555-0199",
  "email": "m.miller@email.com",
  "cdlNumber": "TX9841280",
  "cdlState": "TX",
  "cdlClass": "Class A",
  "source": "Indeed",
  "targetPosition": "OTR Solo"
}`,
              },
              {
                method: 'POST',
                path: '/v1/ocr/license-scan',
                desc: 'Upload front and back image of commercial license for Gemini multimodal extraction',
                sampleJson: `{
  "driverId": "drv_1002",
  "imageFrontBase64": "data:image/jpeg;base64,...",
  "extractDiscrepancies": true
}`,
              },
              {
                method: 'GET',
                path: '/v1/compliance/dq-status/:driverId',
                desc: 'Query verified Driver Qualification file readiness and Safety Manager approval status',
                sampleJson: `{
  "driverId": "drv_1002",
  "dqReadinessPercentage": 100,
  "safetyApprovalStatus": "Approved",
  "safetyApprovedBy": "Elena Rodriguez",
  "readyForDispatch": true
}`,
              },
            ].map((ep) => (
              <div key={ep.path} className="p-4 rounded-xl border border-[#ECEAE4] bg-[#FAF9F6] space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-[#0E7C7B] text-white">
                      {ep.method}
                    </span>
                    <span className="font-mono text-xs font-semibold text-[#14161A]">
                      {ep.path}
                    </span>
                  </div>
                  <button
                    onClick={() => copyToClipboard(ep.sampleJson, ep.path)}
                    className="text-[11px] text-[#0E7C7B] hover:underline flex items-center gap-1"
                  >
                    <Copy className="w-3 h-3" />
                    <span>{copiedEndpoint === ep.path ? 'Copied!' : 'Copy Schema'}</span>
                  </button>
                </div>
                <p className="text-xs text-[#5B616B]">{ep.desc}</p>
                <pre className="p-3 bg-[#14161A] text-slate-100 rounded-lg text-[11px] font-mono overflow-x-auto">
                  {ep.sampleJson}
                </pre>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
