import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Circle, Clock, ExternalLink, Filter, GraduationCap, Laptop, Network, ShieldCheck, Search, ClipboardList, MessageSquare, Server, CalendarDays, Target, BookOpen, Wrench, FileText } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const resources = {
  ms900Guide: "https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/ms-900",
  ms900Apps: "https://learn.microsoft.com/en-us/training/paths/describe-microsoft-365-core-services-concepts/",
  m365Dev: "https://learn.microsoft.com/en-us/office/developer-program/microsoft-365-developer-program-get-started",
  m365Program: "https://developer.microsoft.com/en-us/microsoft-365/dev-program",
  entraLearn: "https://learn.microsoft.com/en-us/training/paths/describe-capabilities-of-microsoft-identity-access/",
  entraDocs: "https://learn.microsoft.com/en-us/entra/fundamentals/",
  intunePath: "https://learn.microsoft.com/en-us/training/paths/endpoint-manager-fundamentals/",
  intuneWhat: "https://learn.microsoft.com/en-us/intune/fundamentals/what-is-intune",
  adOverview: "https://learn.microsoft.com/en-us/windows-server/identity/ad-ds/get-started/virtual-dc/active-directory-domain-services-overview",
  adLearn: "https://learn.microsoft.com/en-us/training/paths/active-directory-domain-services/",
  dnsTrouble: "https://learn.microsoft.com/en-us/windows-server/networking/dns/troubleshoot/troubleshoot-dns-server",
  gpTrouble: "https://learn.microsoft.com/en-us/troubleshoot/windows-server/group-policy/applying-group-policy-troubleshooting-guidance",
  ciscoNet: "https://www.netacad.com/courses/networking-basics",
  ciscoBasics: "https://www.cisco.com/site/us/en/learn/topics/small-business/networking-basics.html",
  eventViewer: "https://learn.microsoft.com/en-us/shows/inside/event-viewer",
  kevtech: "https://www.youtube.com/@KevtechITSupport",
  johnSavill: "https://www.youtube.com/@NTFAQGuy",
  intuneTraining: "https://www.youtube.com/@IntuneTraining",
  ms900Cram: "https://www.youtube.com/watch?v=np9jfnwnO2c"
};

const days = [
  { day: 1, phase: "Setup + M365 map", focus: "Build your lab and understand the target role stack", blocks: [
    ["09:00–10:00", "Set up Microsoft 365 Developer sandbox", "Create dev tenant, record admin URL, create a learning log.", resources.m365Dev, "Lab"],
    ["10:15–11:15", "Read MS-900 study guide skills measured", "Make a checklist: apps/services, security/compliance, pricing/support.", resources.ms900Guide, "MS-900"],
    ["11:30–12:30", "Microsoft 365 apps/services learning path", "Start first module; note what Exchange, Teams, SharePoint, OneDrive each do.", resources.ms900Apps, "MS-900"],
    ["13:30–14:30", "Tenant orientation", "Find admin centers: M365, Exchange, Teams, SharePoint, Entra, Intune.", resources.m365Program, "Lab"],
    ["14:45–15:45", "Support ticket writing", "Write 3 tickets: new user onboarding, Outlook issue, Teams access issue.", "", "Ticketing"],
    ["16:00–17:00", "Interview notes", "Prepare a 60-sec explanation of what Microsoft 365 is in a school.", "", "Interview"] ]},
  { day: 2, phase: "M365 users", focus: "Users, groups, licenses, onboarding/offboarding", blocks: [
    ["09:00–10:00", "Microsoft Learn: M365 core services", "Continue apps/services modules.", resources.ms900Apps, "MS-900"],
    ["10:15–11:15", "Create 5 lab users", "Teacher, student, admin, casual staff, IT support user.", resources.m365Dev, "Lab"],
    ["11:30–12:30", "Groups and licensing", "Create security group, M365 group, assign/remove license.", resources.entraDocs, "Lab"],
    ["13:30–14:30", "Onboarding workflow", "Document exact steps to create user, assign license, add groups, send first-login info.", "", "Documentation"],
    ["14:45–15:45", "Offboarding workflow", "Block sign-in, reset password, remove groups/license, preserve mailbox notes.", "", "Documentation"],
    ["16:00–17:00", "Mock answer", "Answer: 'How would you onboard a new staff member?'", "", "Interview"] ]},
  { day: 3, phase: "Exchange + Outlook", focus: "Email support and mailbox basics", blocks: [
    ["09:00–10:00", "Exchange Online admin overview", "Explore mailboxes, shared mailboxes, groups, mail flow areas.", resources.ms900Apps, "MS-900"],
    ["10:15–11:15", "Create shared mailbox scenario", "Create 'Reception' shared mailbox and grant access to two users.", resources.m365Dev, "Lab"],
    ["11:30–12:30", "Outlook troubleshooting tree", "Document: cannot send, cannot receive, password/MFA, mailbox full, shared mailbox missing.", "", "Troubleshooting"],
    ["13:30–14:30", "DNS email concepts", "Learn MX, SPF, DKIM, DMARC at high level; write simple explanations.", resources.dnsTrouble, "Networking"],
    ["14:45–15:45", "Ticket simulation", "User cannot access shared mailbox. Write triage questions + steps + escalation point.", "", "Ticketing"],
    ["16:00–17:00", "Interview drill", "Explain difference between user mailbox, shared mailbox, group mailbox.", "", "Interview"] ]},
  { day: 4, phase: "Teams + SharePoint", focus: "Collaboration support", blocks: [
    ["09:00–10:00", "Teams/SharePoint modules", "Finish relevant Microsoft Learn content.", resources.ms900Apps, "MS-900"],
    ["10:15–11:15", "Create Teams structure", "Create Staff Team, IT Team, Year 12 Team; add channels and users.", resources.m365Dev, "Lab"],
    ["11:30–12:30", "SharePoint basics", "Open backing SharePoint site; inspect documents, permissions, recycle bin.", resources.m365Dev, "Lab"],
    ["13:30–14:30", "Permissions scenario", "Teacher cannot access folder. Write permission-check process.", "", "Troubleshooting"],
    ["14:45–15:45", "OneDrive sync issue tree", "Document steps: sign-in, sync client, storage, path length, permissions.", "", "Documentation"],
    ["16:00–17:00", "Mock answer", "Answer: 'How would you support a teacher with Teams access issues before class?'", "", "Interview"] ]},
  { day: 5, phase: "Entra ID", focus: "Identity, MFA, SSO, Conditional Access concepts", blocks: [
    ["09:00–10:00", "Introduction to Microsoft Entra", "Complete first modules on identity and access.", resources.entraLearn, "Identity"],
    ["10:15–11:15", "MFA lab", "Enable MFA/security defaults if available; document sign-in experience.", resources.entraDocs, "Lab"],
    ["11:30–12:30", "Groups and roles", "Create groups; inspect roles; learn global admin vs user admin difference.", resources.entraDocs, "Lab"],
    ["13:30–14:30", "Conditional Access concept map", "Write what it is: if user/device/location/risk then allow/block/require MFA.", resources.entraLearn, "Identity"],
    ["14:45–15:45", "Ticket simulation", "User changed phone and cannot complete MFA. Write safe support process.", "", "Ticketing"],
    ["16:00–17:00", "Weekly review", "Make flashcards for M365 admin, Exchange, Teams, SharePoint, Entra.", "", "Review"] ]},
  { day: 6, phase: "Networking basics 1", focus: "IP, DNS, DHCP, gateway, Wi-Fi concepts", blocks: [
    ["09:00–10:00", "Cisco Networking Basics", "Start course: network components and communication.", resources.ciscoNet, "Networking"],
    ["10:15–11:15", "Home network map", "Draw your laptop -> Wi-Fi -> router -> ISP -> DNS -> website path.", resources.ciscoBasics, "Lab"],
    ["11:30–12:30", "Command practice", "Run ipconfig/ifconfig, ping, tracert/traceroute, nslookup; screenshot outputs.", "", "Lab"],
    ["13:30–14:30", "DNS troubleshooting docs", "Read Microsoft DNS troubleshooting; note logs and nslookup usage.", resources.dnsTrouble, "Troubleshooting"],
    ["14:45–15:45", "Ticket simulation", "Student Wi-Fi connected but no internet. Write triage flow.", "", "Ticketing"],
    ["16:00–17:00", "Interview drill", "Explain DNS vs DHCP vs default gateway in plain English.", "", "Interview"] ]},
  { day: 7, phase: "Review + catch-up", focus: "Consolidate week 1", blocks: [
    ["10:00–11:00", "MS-900 cram overview", "Watch first half; compare against study guide checklist.", resources.ms900Cram, "MS-900"],
    ["11:15–12:15", "Lab recap", "Redo onboarding/offboarding from memory without notes.", "", "Lab"],
    ["13:15–14:15", "Ticket pack", "Write 10 finished tickets from week scenarios.", "", "Ticketing"],
    ["14:30–15:30", "Interview bank", "Record answers to 6 questions; listen and improve clarity.", "", "Interview"],
    ["15:45–16:45", "Progress checkpoint", "Score yourself 1–5 on M365, Entra, DNS/DHCP, tickets.", "", "Review"] ]},
  { day: 8, phase: "AD lab setup", focus: "Windows Server + client VM planning", blocks: [
    ["09:00–10:00", "AD DS overview", "Read what AD DS stores and why domain services matter.", resources.adOverview, "AD"],
    ["10:15–11:15", "Microsoft Learn AD path", "Start AD fundamentals.", resources.adLearn, "AD"],
    ["11:30–12:30", "Install/lab plan", "Plan VirtualBox/VMware setup: server VM, client VM, network mode.", "", "Lab"],
    ["13:30–14:30", "Domain concept map", "Write: domain, DC, OU, user, group, GPO, DNS.", resources.adOverview, "Documentation"],
    ["14:45–15:45", "School OU design", "Design OUs: Staff, Students, Admin, IT, Devices, Shared.", "", "Lab"],
    ["16:00–17:00", "Mock answer", "Explain AD vs Entra ID simply.", "", "Interview"] ]},
  { day: 9, phase: "AD users/groups", focus: "Account administration", blocks: [
    ["09:00–10:00", "KevTech AD user management", "Search channel for Active Directory user/group labs.", resources.kevtech, "AD"],
    ["10:15–11:15", "Create users/groups", "Build 10 users and 5 groups in AD or document if lab not ready.", resources.adLearn, "Lab"],
    ["11:30–12:30", "Permissions thinking", "Map group-based access: StaffShare, StudentShare, ITAdmin.", "", "Lab"],
    ["13:30–14:30", "Password reset SOP", "Write safe identity verification + reset + temporary password process.", "", "Documentation"],
    ["14:45–15:45", "Ticket simulation", "Teacher account locked before class. Write triage/resolution/escalation.", "", "Ticketing"],
    ["16:00–17:00", "Interview drill", "Answer: 'What checks would you do if a user cannot log in?'", "", "Interview"] ]},
  { day: 10, phase: "Group Policy", focus: "GPO basics and troubleshooting", blocks: [
    ["09:00–10:00", "GPO troubleshooting guidance", "Read Event Viewer + ActivityID process.", resources.gpTrouble, "AD"],
    ["10:15–11:15", "GPO concepts", "Learn computer vs user policies; inheritance; gpupdate; gpresult.", resources.adLearn, "AD"],
    ["11:30–12:30", "Policy examples", "Document policies schools use: screen lock, password, printer, drive maps.", "", "Documentation"],
    ["13:30–14:30", "Command practice", "Run gpupdate/gpresult if on Windows; otherwise document outputs to expect.", resources.gpTrouble, "Lab"],
    ["14:45–15:45", "Ticket simulation", "Mapped drive missing. Write steps: network, group, GPO, gpresult, Event Viewer.", "", "Ticketing"],
    ["16:00–17:00", "Mock answer", "Explain what Group Policy does and how you’d troubleshoot it.", "", "Interview"] ]},
  { day: 11, phase: "Windows troubleshooting", focus: "Event Viewer, services, drivers, profiles", blocks: [
    ["09:00–10:00", "Event Viewer", "Watch/read Microsoft Event Viewer overview.", resources.eventViewer, "Windows"],
    ["10:15–11:15", "Windows tools list", "Open Event Viewer, Services, Device Manager, Task Manager, Reliability Monitor.", "", "Lab"],
    ["11:30–12:30", "Common issues", "Document troubleshooting trees for slow PC, app crash, printer, no audio, profile issue.", "", "Troubleshooting"],
    ["13:30–14:30", "Log reading practice", "Find 5 system/application events and write what they indicate.", resources.eventViewer, "Lab"],
    ["14:45–15:45", "Ticket simulation", "Staff laptop is slow and crashing. Write structured diagnosis.", "", "Ticketing"],
    ["16:00–17:00", "Interview drill", "Answer: 'How do you troubleshoot a Windows device?'", "", "Interview"] ]},
  { day: 12, phase: "Networking basics 2", focus: "Wi-Fi, VLANs concept, firewall, switching", blocks: [
    ["09:00–10:00", "Cisco Networking Basics", "Continue course: devices, protocols, wireless.", resources.ciscoNet, "Networking"],
    ["10:15–11:15", "School network map", "Draw: staff Wi-Fi, student Wi-Fi, admin VLAN, printers, servers, firewall.", resources.ciscoBasics, "Documentation"],
    ["11:30–12:30", "Wi-Fi troubleshooting", "Document SSID, signal, DHCP, DNS, captive portal, certificate/802.1X ideas.", "", "Troubleshooting"],
    ["13:30–14:30", "Printer/network ticket", "User can’t print. Write checks: printer online, IP, queue, driver, permissions.", "", "Ticketing"],
    ["14:45–15:45", "Command reps", "Run ping, nslookup, tracert to 5 sites; interpret each result.", "", "Lab"],
    ["16:00–17:00", "Mock answer", "Explain how you’d troubleshoot a classroom with no Wi-Fi.", "", "Interview"] ]},
  { day: 13, phase: "Backup/DR basics", focus: "Understand why backups matter", blocks: [
    ["09:00–10:00", "Backup concepts", "Research full/incremental/differential, RPO/RTO, 3-2-1 backup rule.", "", "Infrastructure"],
    ["10:15–11:15", "School DR scenario", "Document what systems matter: identity, internet, LMS, files, admin systems.", "", "Documentation"],
    ["11:30–12:30", "Veeam awareness", "Watch official/intro material; write what Veeam is used for.", "https://www.veeam.com/resources.html", "Infrastructure"],
    ["13:30–14:30", "Restore thinking", "Write steps before restoring: confirm impact, backup point, approval, test, document.", "", "Ticketing"],
    ["14:45–15:45", "Incident note", "Write outage update: file server unavailable; workaround; next update time.", "", "Communication"],
    ["16:00–17:00", "Interview drill", "Explain RPO/RTO and why backup testing matters.", "", "Interview"] ]},
  { day: 14, phase: "Week 2 consolidation", focus: "AD + Windows + networking recap", blocks: [
    ["10:00–11:00", "AD recap", "Redo user/group/GPO explanation from memory.", resources.adOverview, "Review"],
    ["11:15–12:15", "Networking recap", "Explain DNS/DHCP/gateway/VPN/Wi-Fi to a non-technical user.", resources.ciscoNet, "Review"],
    ["13:15–14:15", "Ticket pack", "Write 10 tickets: login, Wi-Fi, printer, Outlook, MFA, slow PC, Teams, shared mailbox, GPO, DNS.", "", "Ticketing"],
    ["14:30–15:30", "Mock interview", "Record 10 technical answers, max 90 sec each.", "", "Interview"],
    ["15:45–16:45", "Progress checkpoint", "Update tracker; identify weakest 3 topics.", "", "Review"] ]},
  { day: 15, phase: "Intune basics", focus: "Endpoint management", blocks: [
    ["09:00–10:00", "Microsoft Intune fundamentals", "Start endpoint manager fundamentals path.", resources.intunePath, "Intune"],
    ["10:15–11:15", "What is Intune?", "Read official docs; write what Intune manages.", resources.intuneWhat, "Intune"],
    ["11:30–12:30", "Device management map", "Document enrollment, compliance, configuration, apps, remote actions.", resources.intunePath, "Documentation"],
    ["13:30–14:30", "School device lifecycle", "Map: procurement -> enrolment -> user assignment -> support -> wipe/retire.", "", "Documentation"],
    ["14:45–15:45", "Ticket simulation", "Student device lost. Write response: security, access, remote wipe/escalation.", "", "Ticketing"],
    ["16:00–17:00", "Mock answer", "Explain Intune in simple words to a school hiring manager.", "", "Interview"] ]},
  { day: 16, phase: "Intune policies", focus: "Compliance, configuration, apps", blocks: [
    ["09:00–10:00", "Intune fundamentals modules", "Continue compliance/configuration policy content.", resources.intunePath, "Intune"],
    ["10:15–11:15", "Policy examples", "Document 5 school policies: PIN, encryption, updates, Wi-Fi profile, blocked apps.", resources.intuneWhat, "Documentation"],
    ["11:30–12:30", "Device actions", "Learn retire/wipe/sync/restart; write when each is appropriate.", resources.intunePath, "Intune"],
    ["13:30–14:30", "App deployment concept", "Document how app deployment helps standardise classrooms/staff devices.", resources.intunePath, "Documentation"],
    ["14:45–15:45", "Ticket simulation", "App missing on teacher laptop. Write checks and escalation path.", "", "Ticketing"],
    ["16:00–17:00", "Interview drill", "Answer: 'What would you check if a device is non-compliant?'", "", "Interview"] ]},
  { day: 17, phase: "Security basics", focus: "MFA, least privilege, phishing, child-safe IT", blocks: [
    ["09:00–10:00", "Entra security/access", "Review secure authentication/access management modules.", resources.entraLearn, "Security"],
    ["10:15–11:15", "Least privilege map", "Write examples: global admin, user admin, helpdesk, teacher, student.", resources.entraDocs, "Documentation"],
    ["11:30–12:30", "Phishing support SOP", "Draft steps when staff reports phishing email.", "", "Ticketing"],
    ["13:30–14:30", "Data handling", "Write rules for student/staff data confidentiality in school IT.", "", "Documentation"],
    ["14:45–15:45", "Incident communication", "Draft calm update for suspected compromised account.", "", "Communication"],
    ["16:00–17:00", "Mock answer", "Answer: 'How do you balance helpful support with security?'", "", "Interview"] ]},
  { day: 18, phase: "AV/classroom support", focus: "Projectors, displays, audio, Teams calls, peripherals", blocks: [
    ["09:00–10:00", "AV troubleshooting map", "Create checklist: power, input/source, cable, display settings, audio output, network.", "", "Documentation"],
    ["10:15–11:15", "Teams meeting support", "Simulate camera/mic/speaker checks and document user guide.", resources.ms900Apps, "Lab"],
    ["11:30–12:30", "Printer/peripheral support", "Document printer driver, queue, network, permissions, paper/jam checks.", "", "Troubleshooting"],
    ["13:30–14:30", "Urgent classroom scenario", "Teacher’s projector fails 5 mins before class. Write triage and workaround.", "", "Ticketing"],
    ["14:45–15:45", "Staff guide", "Write one-page guide: 'Before calling IT for classroom AV'.", "", "Documentation"],
    ["16:00–17:00", "Interview drill", "Answer: 'How do you handle urgent support requests during school hours?'", "", "Interview"] ]},
  { day: 19, phase: "ITIL/service desk", focus: "Incident, request, problem, change", blocks: [
    ["09:00–10:00", "Service desk concepts", "Study incident vs request vs problem vs change.", "", "ITIL"],
    ["10:15–11:15", "Ticket quality", "Create template: summary, impact, urgency, priority, steps, resolution, closure.", "", "Ticketing"],
    ["11:30–12:30", "Prioritisation", "Rank scenarios: whole school internet down vs one printer vs one password reset.", "", "ITIL"],
    ["13:30–14:30", "Change thinking", "Write change plan for Wi-Fi update: risk, rollback, comms, testing.", "", "Documentation"],
    ["14:45–15:45", "Problem management", "Write how repeated Wi-Fi tickets become root cause investigation.", "", "ITIL"],
    ["16:00–17:00", "Mock answer", "Explain incident vs problem vs change with examples.", "", "Interview"] ]},
  { day: 20, phase: "MS-900 exam push", focus: "Exam prep + weak areas", blocks: [
    ["09:00–10:00", "MS-900 study guide review", "Tick every skill measured; mark weak areas.", resources.ms900Guide, "MS-900"],
    ["10:15–11:15", "John Savill MS-900 cram", "Watch remaining sections; pause to write notes.", resources.ms900Cram, "MS-900"],
    ["11:30–12:30", "Pricing/support/licensing", "Make simple notes: cloud models, subscriptions, support options.", resources.ms900Guide, "MS-900"],
    ["13:30–14:30", "Practice questions", "Use Microsoft Learn knowledge checks and reputable practice questions.", resources.ms900Guide, "MS-900"],
    ["14:45–15:45", "Explain M365 to school", "Write 3-minute answer linking M365 to staff/student productivity/security.", "", "Interview"],
    ["16:00–17:00", "Schedule exam decision", "If scoring 80%+ on practice, schedule MS-900 within 7 days.", "", "Certification"] ]},
  { day: 21, phase: "Week 3 consolidation", focus: "Intune/security/ITIL recap", blocks: [
    ["10:00–11:00", "Intune recap", "Explain enrollment, compliance, configuration, remote wipe.", resources.intunePath, "Review"],
    ["11:15–12:15", "Security recap", "Explain MFA, Conditional Access, least privilege, phishing response.", resources.entraLearn, "Review"],
    ["13:15–14:15", "Ticket pack", "Write 10 tickets from Intune, AV, security, ITIL scenarios.", "", "Ticketing"],
    ["14:30–15:30", "Mock interview", "20-question technical mock; record and refine.", "", "Interview"],
    ["15:45–16:45", "Progress checkpoint", "Update scorecard and choose final-week weak points.", "", "Review"] ]},
  { day: 22, phase: "School systems admin simulation", focus: "End-to-end day in the life", blocks: [
    ["09:00–10:00", "Morning checks", "Design checklist: backups, alerts, internet, Wi-Fi, M365 status, tickets.", "", "Operations"],
    ["10:15–11:15", "Incident simulation", "School internet slow. Write comms, diagnosis, escalation, closure.", "", "Ticketing"],
    ["11:30–12:30", "User lifecycle", "Redo onboarding/offboarding across AD + M365 + groups + device.", "", "Lab"],
    ["13:30–14:30", "Documentation", "Create SOP index: onboarding, password reset, MFA reset, Wi-Fi, printer, AV.", "", "Documentation"],
    ["14:45–15:45", "Vendor/MSP communication", "Write email to vendor: issue, evidence, impact, urgency, requested action.", "", "Communication"],
    ["16:00–17:00", "Interview drill", "Answer: 'What would your first 30 days in this role look like?'", "", "Interview"] ]},
  { day: 23, phase: "Azure fundamentals for support", focus: "Azure basics without overengineering", blocks: [
    ["09:00–10:00", "John Savill Azure basics", "Watch Azure fundamentals identity/network/resource group sections.", resources.johnSavill, "Azure"],
    ["10:15–11:15", "Azure portal orientation", "Explore resource groups, VMs, storage, networking areas if using free account.", "https://azure.microsoft.com/en-us/free/", "Lab"],
    ["11:30–12:30", "Hybrid concept map", "Write how on-prem AD, Entra ID, M365, devices and servers can connect.", resources.entraDocs, "Documentation"],
    ["13:30–14:30", "Azure support scenario", "App/server unavailable in cloud. Write checks: status, DNS, network, identity, logs.", "", "Ticketing"],
    ["14:45–15:45", "Cost/safety", "Write lab safety rules: don't leave paid resources running.", "", "Lab"],
    ["16:00–17:00", "Mock answer", "Explain cloud vs on-prem vs hybrid for a school.", "", "Interview"] ]},
  { day: 24, phase: "Virtualisation/storage concepts", focus: "VMware/Hyper-V/NAS/SAN awareness", blocks: [
    ["09:00–10:00", "Virtualisation basics", "Research Hyper-V/VMware concepts: host, guest, snapshot, datastore.", "", "Infrastructure"],
    ["10:15–11:15", "Storage basics", "Document NAS vs SAN vs local storage, RAID concept, capacity monitoring.", "", "Infrastructure"],
    ["11:30–12:30", "VM support scenario", "Virtual server disk full. Write checks, risks, escalation, communication.", "", "Ticketing"],
    ["13:30–14:30", "Capacity planning", "Create simple spreadsheet: server, storage used, free %, risk, action.", "", "Documentation"],
    ["14:45–15:45", "Backup tie-in", "Map which VMs/services need backup and restore priority.", "", "Infrastructure"],
    ["16:00–17:00", "Mock answer", "Explain what virtualisation is and why schools use it.", "", "Interview"] ]},
  { day: 25, phase: "Advanced troubleshooting method", focus: "Structured thinking under pressure", blocks: [
    ["09:00–10:00", "Troubleshooting framework", "Build framework: scope, impact, reproduce, isolate, logs, fix/workaround, document.", "", "Troubleshooting"],
    ["10:15–11:15", "Five Whys/root cause", "Apply to repeated Wi-Fi drops or repeated account lockouts.", "", "Problem"],
    ["11:30–12:30", "Evidence collection", "Prepare checklist: screenshots, error codes, timestamps, affected users, logs.", "", "Documentation"],
    ["13:30–14:30", "Pressure simulation", "Handle 3 urgent tickets and decide priority/order.", "", "Ticketing"],
    ["14:45–15:45", "Closure notes", "Write high-quality closure notes for 5 tickets.", "", "Ticketing"],
    ["16:00–17:00", "Mock answer", "Explain your troubleshooting process clearly.", "", "Interview"] ]},
  { day: 26, phase: "Interview technical bank", focus: "Answer 40 likely questions", blocks: [
    ["09:00–10:00", "M365 questions", "Prepare answers: MFA, shared mailbox, Teams access, OneDrive sync, licensing.", resources.ms900Guide, "Interview"],
    ["10:15–11:15", "AD questions", "Prepare answers: password reset, locked account, GPO, groups, AD vs Entra.", resources.adOverview, "Interview"],
    ["11:30–12:30", "Networking questions", "Prepare answers: DNS, DHCP, gateway, Wi-Fi, VPN, printer.", resources.ciscoNet, "Interview"],
    ["13:30–14:30", "Intune/security questions", "Prepare answers: compliance, wipe, MFA reset, phishing, least privilege.", resources.intunePath, "Interview"],
    ["14:45–15:45", "School scenarios", "Prepare answers for urgent class AV, staff laptop, student access, child safety mindset.", "", "Interview"],
    ["16:00–17:00", "Record mock", "Record full 30-min interview and review clarity.", "", "Interview"] ]},
  { day: 27, phase: "Portfolio evidence", focus: "Create proof you did the work", blocks: [
    ["09:00–10:00", "Lab screenshots", "Collect screenshots of users/groups/MFA/Teams/tickets/lab maps.", "", "Portfolio"],
    ["10:15–11:15", "SOP pack", "Finalize 6 SOPs: onboarding, offboarding, MFA, Wi-Fi, printer, AV.", "", "Documentation"],
    ["11:30–12:30", "Ticket pack", "Finalize 20 ticket examples with professional notes.", "", "Portfolio"],
    ["13:30–14:30", "Interview one-pager", "Create cheat sheet: core tools, common issues, troubleshooting steps.", "", "Interview"],
    ["14:45–15:45", "Resume proof", "Add only truthful line: 'Built M365/AD support lab...' if completed.", "", "Applications"],
    ["16:00–17:00", "LinkedIn update", "Add MS-900 in progress/lab projects carefully without exaggeration.", "", "Applications"] ]},
  { day: 28, phase: "MS-900 final prep", focus: "Exam readiness", blocks: [
    ["09:00–10:00", "Study guide final", "Review every objective and weak point.", resources.ms900Guide, "MS-900"],
    ["10:15–11:15", "Microsoft Learn checks", "Redo knowledge checks from MS Learn paths.", resources.ms900Apps, "MS-900"],
    ["11:30–12:30", "Security/compliance", "Review Microsoft Purview, Defender, Entra, compliance concepts at high level.", resources.ms900Guide, "MS-900"],
    ["13:30–14:30", "Practice exam", "Do timed practice. Target 80%+ before booking.", resources.ms900Guide, "MS-900"],
    ["14:45–15:45", "Wrong answer review", "Write why each mistake was wrong, not just the correct answer.", "", "Review"],
    ["16:00–17:00", "Exam booking", "Book MS-900 if ready; otherwise schedule for day 32–35.", "", "Certification"] ]},
  { day: 29, phase: "Application + interview blitz", focus: "Turn learning into job outcomes", blocks: [
    ["09:00–10:00", "Target roles", "Apply to 3 school/MSP/service desk roles with tailored resume.", "", "Applications"],
    ["10:15–11:15", "Outreach", "Message 5 IT managers/recruiters with concise pitch.", "", "Applications"],
    ["11:30–12:30", "Cover letter bank", "Create 3 templates: school IT, MSP support, service desk.", "", "Applications"],
    ["13:30–14:30", "Mock technical", "Ask ChatGPT/Claude to grill you on Oakleigh-style JD.", "", "Interview"],
    ["14:45–15:45", "Behavioural answers", "STAR answers: pressure, customer issue, learning fast, documentation, teamwork.", "", "Interview"],
    ["16:00–17:00", "Follow-up tracker", "Create spreadsheet: company, role, date, contact, next follow-up.", "", "Applications"] ]},
  { day: 30, phase: "Final assessment", focus: "Prove interview readiness", blocks: [
    ["09:00–10:00", "Full mock interview", "45-min mixed technical/behavioural interview recording.", "", "Interview"],
    ["10:15–11:15", "Grade yourself", "Score: M365, AD, networking, Intune, tickets, communication, confidence.", "", "Review"],
    ["11:30–12:30", "Weakness plan", "Make next 14-day plan only for weak topics.", "", "Review"],
    ["13:30–14:30", "Portfolio polish", "Finalize SOP/ticket pack and keep it ready to discuss in interviews.", "", "Portfolio"],
    ["14:45–15:45", "Interview story polish", "Prepare: why school IT, why systems admin, first 90 days, salary/WWCC answers.", "", "Interview"],
    ["16:00–17:00", "Go/no-go", "Book cert/apply/follow-up based on tracker. You should now be interview-ready.", "", "Execution"] ]}
];

const categories = ["All", "MS-900", "Lab", "Identity", "AD", "Networking", "Windows", "Intune", "Ticketing", "Documentation", "Interview", "Applications", "Infrastructure", "Security", "Review"];

function typeIcon(type) {
  const map = { "MS-900": GraduationCap, Lab: Laptop, Identity: ShieldCheck, AD: Server, Networking: Network, Windows: Laptop, Intune: ShieldCheck, Ticketing: ClipboardList, Documentation: FileText, Interview: MessageSquare, Applications: Target, Infrastructure: Server, Security: ShieldCheck, Review: BookOpen, Troubleshooting: Wrench };
  return map[type] || Clock;
}

export default function ThirtyDayITSupportRoadmap() {
  const [selectedDay, setSelectedDay] = useState(1);
  const [category, setCategory] = useState("All");
  const [done, setDone] = useState({});
  const [search, setSearch] = useState("");
  const day = days.find(d => d.day === selectedDay);

  const allTasks = useMemo(() => days.flatMap(d => d.blocks.map((b, i) => ({ day: d.day, phase: d.phase, idx: i, time: b[0], title: b[1], task: b[2], link: b[3], type: b[4] }))), []);
  const filteredTasks = allTasks.filter(t => (category === "All" || t.type === category) && (!search || [t.title, t.task, t.phase, t.type].join(" ").toLowerCase().includes(search.toLowerCase())));
  const completed = Object.values(done).filter(Boolean).length;
  const progress = Math.round((completed / allTasks.length) * 100);

  function toggle(key) { setDone(prev => ({ ...prev, [key]: !prev[key] })); }

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 text-slate-900">
      <div className="mx-auto max-w-7xl space-y-6">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-3xl border bg-white p-6 md:p-8 shadow-sm">
          <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-blue-700"><CalendarDays className="h-4 w-4" /> 30-Day IT Support + Systems Admin Speedrun</div>
              <h1 className="text-3xl md:text-5xl font-bold tracking-tight">Hour-by-hour roadmap for school/MSP IT interviews</h1>
              <p className="mt-4 max-w-3xl text-slate-600 text-base md:text-lg">Exact daily blocks, official sources, lab tasks, ticket simulations, documentation deliverables, and interview drills. Designed for Microsoft 365, Active Directory, networking basics, Intune, troubleshooting and school IT readiness.</p>
            </div>
            <Card className="rounded-2xl bg-slate-900 text-white border-0 md:w-80">
              <CardContent className="p-5">
                <div className="text-sm text-slate-300">Total progress</div>
                <div className="mt-1 text-4xl font-bold">{progress}%</div>
                <div className="mt-3 h-2 rounded-full bg-slate-700"><div className="h-2 rounded-full bg-white" style={{ width: `${progress}%` }} /></div>
                <p className="mt-3 text-xs text-slate-300">{completed} of {allTasks.length} blocks completed. Progress saves while the canvas stays open.</p>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        <div className="grid gap-4 md:grid-cols-4">
          <Card className="rounded-2xl shadow-sm"><CardContent className="p-5"><div className="text-sm text-slate-500">Daily load</div><div className="text-2xl font-bold">5–6 hrs</div><p className="text-xs text-slate-500 mt-1">Deep work blocks + breaks</p></CardContent></Card>
          <Card className="rounded-2xl shadow-sm"><CardContent className="p-5"><div className="text-sm text-slate-500">Primary cert</div><div className="text-2xl font-bold">MS-900</div><p className="text-xs text-slate-500 mt-1">Book around day 28–35</p></CardContent></Card>
          <Card className="rounded-2xl shadow-sm"><CardContent className="p-5"><div className="text-sm text-slate-500">Proof output</div><div className="text-2xl font-bold">SOP Pack</div><p className="text-xs text-slate-500 mt-1">Tickets + lab evidence</p></CardContent></Card>
          <Card className="rounded-2xl shadow-sm"><CardContent className="p-5"><div className="text-sm text-slate-500">Target jobs</div><div className="text-2xl font-bold">School/MSP</div><p className="text-xs text-slate-500 mt-1">L1/L1.5/sysadmin stretch</p></CardContent></Card>
        </div>

        <Card className="rounded-3xl shadow-sm">
          <CardContent className="p-5 md:p-6">
            <div className="mb-4 flex items-center gap-2 font-semibold"><Filter className="h-5 w-5" /> Day selector</div>
            <div className="grid grid-cols-5 gap-2 md:grid-cols-10 lg:grid-cols-15">
              {days.map(d => (
                <button key={d.day} onClick={() => setSelectedDay(d.day)} className={`rounded-xl border px-3 py-2 text-sm font-medium transition ${selectedDay === d.day ? "bg-blue-700 text-white border-blue-700" : "bg-white hover:bg-slate-100 border-slate-200"}`}>{d.day}</button>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-4">
            <Card className="rounded-3xl shadow-sm overflow-hidden">
              <CardContent className="p-5 md:p-6">
                <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                  <div>
                    <div className="text-sm font-semibold text-blue-700">Day {day.day} — {day.phase}</div>
                    <h2 className="text-2xl md:text-3xl font-bold mt-1">{day.focus}</h2>
                  </div>
                  <Badge>{day.blocks.length} blocks</Badge>
                </div>
                <div className="mt-5 space-y-3">
                  {day.blocks.map((b, i) => {
                    const key = `${day.day}-${i}`;
                    const Icon = typeIcon(b[4]);
                    return (
                      <div key={key} className="rounded-2xl border border-slate-200 bg-white p-4 flex gap-3">
                        <button onClick={() => toggle(key)} className="mt-1 shrink-0">{done[key] ? <CheckCircle2 className="h-6 w-6 text-emerald-600" /> : <Circle className="h-6 w-6 text-slate-300" />}</button>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="rounded-lg bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700">{b[0]}</span>
                            <span className="rounded-lg bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-700 flex items-center gap-1"><Icon className="h-3 w-3" /> {b[4]}</span>
                          </div>
                          <div className="mt-2 font-bold text-lg">{b[1]}</div>
                          <p className="mt-1 text-sm text-slate-600">{b[2]}</p>
                          {b[3] && <Button asChild variant="outline" size="sm" className="mt-3 rounded-xl"><a href={b[3]} target="_blank" rel="noreferrer"><ExternalLink className="mr-2 h-4 w-4" /> Open source</a></Button>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-5">
            <Card className="rounded-3xl shadow-sm sticky top-4">
              <CardContent className="p-5 md:p-6">
                <div className="font-bold text-lg flex items-center gap-2"><Search className="h-5 w-5 text-blue-700" /> Find tasks</div>
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search MFA, DNS, tickets..." className="mt-4 w-full rounded-xl border border-slate-200 px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-200" />
                <select value={category} onChange={e => setCategory(e.target.value)} className="mt-3 w-full rounded-xl border border-slate-200 px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-200">
                  {categories.map(c => <option key={c}>{c}</option>)}
                </select>
                <div className="mt-4 max-h-96 overflow-auto space-y-2 pr-1">
                  {filteredTasks.slice(0, 50).map(t => {
                    const key = `${t.day}-${t.idx}`;
                    return <button key={key} onClick={() => setSelectedDay(t.day)} className="w-full text-left rounded-xl border border-slate-200 p-3 hover:bg-slate-50"><div className="text-xs font-semibold text-blue-700">Day {t.day} · {t.time} · {t.type}</div><div className="text-sm font-semibold mt-1">{t.title}</div></button>;
                  })}
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-3xl shadow-sm bg-slate-900 text-white">
              <CardContent className="p-5 md:p-6">
                <div className="font-bold text-lg">Rules for the speedrun</div>
                <ul className="mt-3 space-y-2 text-sm text-slate-200 list-disc pl-5">
                  <li>Do the lab immediately after the lecture.</li>
                  <li>Every day produces written proof: SOP, ticket, map, or mock answer.</li>
                  <li>Don’t binge passively. Pause, perform, document, explain.</li>
                  <li>Apply to jobs while learning. Do not wait to feel ready.</li>
                  <li>Never claim production experience you do not have. Say “lab exposure” or “working knowledge.”</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="rounded-3xl shadow-sm">
              <CardContent className="p-5 md:p-6">
                <div className="font-bold text-lg">Final evidence pack</div>
                <p className="text-sm text-slate-600 mt-2">By Day 30 you should have:</p>
                <ul className="mt-3 space-y-2 text-sm text-slate-700 list-disc pl-5">
                  <li>20+ realistic ticket notes</li>
                  <li>6 SOPs: onboarding, offboarding, MFA, Wi-Fi, printer, AV</li>
                  <li>M365/Entra lab screenshots</li>
                  <li>Networking command screenshots</li>
                  <li>40 interview answers</li>
                  <li>MS-900 scheduled or passed</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

function Badge({ children }) {
  return <span className="inline-flex rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700">{children}</span>;
}
