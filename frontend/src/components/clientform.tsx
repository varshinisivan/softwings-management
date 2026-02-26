import { useState } from "react";

interface Props {
  onSubmit: (data: any) => void;
  initialData?: any;
}

export default function ClientForm({ onSubmit, initialData }: Props) {
  const [companyName, setCompanyName] = useState(initialData?.companyName || "");
  const [contactName, setContactName] = useState(initialData?.contactName || "");
  const [mobile, setMobile] = useState(initialData?.mobile || "");
  const [email, setEmail] = useState(initialData?.email || "");
  const [address, setAddress] = useState(initialData?.address || "");
  const [domainCount, setDomainCount] = useState(initialData?.services?.[0]?.domainCount || 1);
  const [hostingCount, setHostingCount] = useState(initialData?.services?.[0]?.hostingCount || 1);
  const [AMCCount, setAMCCount] = useState(initialData?.services?.[0]?.AMCCount || 0);
  const [SSLCount, setSSLCount] = useState(initialData?.services?.[0]?.SSLCount || 0);
  const [renewalAmount, setRenewalAmount] = useState(initialData?.financial?.renewalAmount || 0);
  const [renewalDeadline, setRenewalDeadline] = useState(initialData?.financial?.renewalDeadline || "");
  const [billedCost, setBilledCost] = useState(initialData?.financial?.billedCost || 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      companyName,
      contactName,
      mobile,
      email,
      address,
      services: [{ domainCount, hostingCount, AMCCount, SSLCount }],
      financial: { renewalAmount, renewalDeadline, billedCost }
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input value={companyName} onChange={e => setCompanyName(e.target.value)} placeholder="Company Name" required />
      <input value={contactName} onChange={e => setContactName(e.target.value)} placeholder="Contact Name" required />
      <input value={mobile} onChange={e => setMobile(e.target.value)} placeholder="Mobile" required />
      <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" type="email" required />
      <input value={address} onChange={e => setAddress(e.target.value)} placeholder="Address" required />
      
      <h4>Services</h4>
      <input type="number" value={domainCount} onChange={e => setDomainCount(+e.target.value)} placeholder="Domains" />
      <input type="number" value={hostingCount} onChange={e => setHostingCount(+e.target.value)} placeholder="Hosting" />
      <input type="number" value={AMCCount} onChange={e => setAMCCount(+e.target.value)} placeholder="AMC" />
      <input type="number" value={SSLCount} onChange={e => setSSLCount(+e.target.value)} placeholder="SSL" />

      <h4>Financial Info</h4>
      <input type="number" value={renewalAmount} onChange={e => setRenewalAmount(+e.target.value)} placeholder="Renewal Amount" />
      <input type="date" value={renewalDeadline} onChange={e => setRenewalDeadline(e.target.value)} placeholder="Renewal Deadline" />
      <input type="number" value={billedCost} onChange={e => setBilledCost(+e.target.value)} placeholder="Billed Cost" />

      <button type="submit">Submit</button>
    </form>
  );
}