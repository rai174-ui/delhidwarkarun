export const ABOUT_EVENT_CONTENT = {
  intro: [
    "DELHI DWARKA RUN is one of Delhi’s most exciting running events, bringing together runners of all ages, fitness levels, and goals.",
    "If you’re searching for a HALF MARATHON in Delhi, a 21KM HALF MARATHON, 10.5KM timed run, a 5KM fitness run, or a 3KM family fun run, this event is designed for you.",
    "Whether you want to set a personal record, build a fitness routine, run with your partner or friends, or enjoy a memorable morning with your family — this marathon offers the perfect platform.",
  ],
  categoriesSummary: [
    "21.1K Half Marathon – Timed Run",
    "10.5K Timed Run",
    "5K Timed Run",
    "3K Fun Run for beginners, kids & families",
  ],
  whyParticipate: [
    "Professionally measured & marked route",
    "Music zones & high-energy cheer points",
    "Hydration stations across the course",
    "On-ground medical support & emergency response",
    "Finisher certificate for all categories",
    "Official timing chips for competitive runners",
    "Race kit with bib, T-shirt/Jersey",
    "Smooth, well-organised experience",
  ],
  whoShouldJoin: [
    "Runners preparing for major marathons",
    "Fitness and wellness enthusiasts",
    "Individuals starting their running journey",
    "Families looking for a morning outdoor activity",
    "Kids and beginners participating in their first event",
    "Corporate teams & running clubs",
  ],
  experience: [
    "This marathon is more than a run — it’s a city-wide fitness celebration.",
    "Expect a vibrant atmosphere, enthusiastic volunteers, energising music, and a route filled with runners pushing towards one common goal: to run their best race.",
    "If you’ve been looking to participate in a Delhi running event, join a fitness challenge, or complete your first marathon distance, this is the perfect opportunity.",
  ],
};

export const DISCLAIMER_TEXT = [
  "The data on www.amigoconnect.com and delhidwarkarun.com is updated based on information provided by website visitors, event organizers, participants and thousands of volunteers. While we attempt to enforce multiple system-driven controls to make sure the data is accurate, we cannot guarantee that the information is up to date, and accurate. We DO NOT accept any liabilities that may occur through errors in postings, miscommunication, omissions and inclusions.",
  "Participants are responsible to make sure that the event is genuine before registering or participating. AMIGO CONNECT.COM assumes no responsibility for, nor does it endorse, the content or claims of any advertising or listings on this website.",
  "By visiting or using www.amigoconnect.com, delhidwarkarun.com and sub-domains, you are agreeing to the Terms of Service and Privacy Policy.",
];

export const GRIEVANCE_OFFICER = {
  name: "PADAM SHARMA",
  designation: "Director - Product & New Community Initiatives",
  email: "grievance@amigoconnect.com",
  supportEmail: "support@amigoconnect.com",
  primaryEmail: "padam@amigoconnect.com",
  mobile: "+91 99712 99631",
};

export interface PolicySection {
  title: string;
  paragraphs?: string[];
  bullets?: string[];
}

export const PRIVACY_POLICY_SECTIONS: PolicySection[] = [
  {
    title: "Our Privacy Philosophy",
    paragraphs: [
      "This Privacy Policy (“Policy”) describes how AMIGOCONNECT.COM, operated by AMIGO CONNECT (“we”, “us”, or “our”), collects, uses, processes, discloses, and retains your information when you access or use our website, online platform, mobile application, and related services (collectively, the “Platform”). The Platform enables event organizers to list, promote, advertise, and manage running and related sports events, and allows users to discover, register for, and participate in events.",
      "This Policy is issued in compliance with applicable Indian laws, including the Information Technology Act, 2000, and the Digital Personal Data Protection Act, 2023 (“DPDPA”), along with its associated rules.",
      "By accessing or using our Platform, you voluntarily agree that you have read, understood, and agree to the terms of this Policy and consent to the processing of your personal data as described herein. If you do not agree with any part of this Policy, please refrain from accessing or using the Platform.",
    ],
  },
  {
    title: "Description of AMIGOCONNECT.COM: What we do",
    paragraphs: ["The Platform provides:"],
    bullets: [
      "The ability for event organizers and planners (“Organizers” or “Host”) to promote running and related events. It helps Organizers collect payments for the promotion, marketing, and sale of tickets/registrations, merchandise, and services, as well as solicit donations for events registered on the website from users who want to attend such events (“User(s)” or “Participant(s)”). Organizers may visit the website, fill out a questionnaire about their event, including pricing, location, ticketing, inventory, and attendee registration information, and collect event registration fees online directly from Participants.",
      "Enables payments to be transacted through Razorpay, PayTM, or other third-party payment service methods (collectively, “Facilitated Payment Modes” or “FPM”) or the payment processing gateway (the “Gateway”).",
      "An e-commerce section known as the “IR Shop”, which operates on the AMIGOCONNECT.COM platform and offers event-related merchandise and accessories for participants and enthusiasts.",
      "The ability for Participants to search for running and related events, register for them, make payments for the events listed on the website, purchase tickets/registrations, merchandise, and services, and make donations in respect of such events, utilizing the payment options available on the website.",
      "A range of add-on services to enhance the participant experience, including training plans through Fit page and photography sharing via Captured. Recommendations based on the venue may also be made available to participants, suggesting nearby restaurants, cafes, or points of interest relevant to the event location. Notifications to Participants when their event photographs are available for purchase on Captured.",
      "The Platform integrates artificial intelligence features under “Amigos Buddy,” powered by OpenAI, which is configured to respond to participant queries related to running, training, and workout guidance. To provide this feature, certain data you provide may be shared with and processed by these services. You will be provided with a clear option to opt-out of the Amigos Buddy feature. By using this feature, you consent to your data being shared with OpenAI and other relevant third-party AI service providers in accordance with their respective privacy policies.",
      "Integration of data from platforms such as Fitpage, Strava, and Garmin to enhance analytics and AI-based recommendations. To ensure privacy, all personal identifiers are removed before any information is shared with third-party AI services, and only anonymized data is processed or analysed. Running-related calculators on the Platform gather personal data through a brief questionnaire to provide users with suggestive recommendations such as hydration needs, electrolyte balance, sweat-loss metrics, and race pace strategy. These recommendations are for general informational purposes only.",
    ],
  },
  {
    title: "Information We Collect",
    paragraphs: [
      "We believe in privacy by design and hence only collect necessary data/information from you for the stated purposes as set forth herein. We collect information to provide you with our services, improve it from time to time, to communicate with you and for other matters connected therewith. The information we collect from you can be broadly categorized as follows:",
      "1. Information You Provide to Us:",
      "Account Information: When you sign up for an account, whether as an event Organizer or a Participant, we require certain personal information, such as your name, email address, mobile number, and other information as prompted by the website registration form (“Registration Data”). The Platform is concerned about the safety and privacy of all its users, particularly children. For this reason, you must be at least 18 (eighteen) years of age, or the legal age of majority where you reside if that jurisdiction is an older age of majority, to register for an account.",
      "Profile and Listing Information: To use certain features of the Platform (like organizing or registering for an event), we may ask you to provide additional information, which would include your: (a) For Organizers: details about your event (pricing, location, ticketing, inventory, etc.); (b) For Users/Participants: information required for event registration; (c) Other information to enable us to curate our services to you.",
      "Identity Verification Information: To help create and maintain a trusted environment, we may collect identity verification information (such as images of your government-issued ID, passport, national ID card, or driving license, as permitted by applicable laws) or other authentication information to ensure user identity for security and trust purposes, and to establish that you are legally entitled to contract and execute the accompanying terms of use.",
      "Payment Information: We collect your payment information (like bank account or credit card details) when you use the payment services to process payments. We use third-party payment processors (such as Razorpay or PayTM) and do not store your full credit card or bank account details. However, such information may be stored by the payment gateway service providers that we have engaged to process payments on our behalf.",
      "Communications and User-Generated Content: When you communicate with us or use the Platform to communicate with other users (Organizers or Participants), we collect information about your communication and any information you choose to provide. We also collect information that you submit when you create event listings, post reviews, provide ratings, or post other content on the Platform (“Your Content”).",
      "If you provide any information that is untrue, inaccurate, not current or incomplete, or amigoconnect.com has reasonable grounds to suspect that such information is untrue, inaccurate, not current or incomplete or if your account is being misused or if you are impersonating any other person, amigoconnect.com has the right to suspend or terminate all of your accounts and refuse any and all of your current or future use of the Services (or any portion thereof).",
      "2. Information that we Automatically Collect:",
      "Geo-location Information: When you use certain features of our Platform, we may collect information about your precise or approximate location as determined through data such as your IP address or your mobile device's GPS to offer you an improved user experience.",
      "Usage Information: We collect information about your interactions with the Platform, such as the pages or content you view, your searches for events, bookings you have made, and other actions on the Platform.",
      "Device and Log Data: We automatically collect log data and device information when you access and use the Platform, including IP address, access dates and times, hardware and software information, device information, and unique device identifiers.",
      "Cookies and Similar Technologies: We use cookies and other similar technologies to collect information such as your browser type and version, operating system, and the content you viewed or searched on the Platform.",
      "3. Information We Collect from Third Parties:",
      "If you link, connect, or log in to your amigoconnect.com account with a third-party service (e.g., Google, Facebook), the third-party service may send us information such as your registration and profile information from that service.",
    ],
  },
  {
    title: "How We Use the Information We Collect",
    paragraphs: [
      "We use, store, and process information about you primarily to provide the services through the Platform, improve your user experience, and to comply with our legal obligations.",
      "1. Provide, Improve, and Develop the Platform: We use your information to enable you to access and use the Platform, facilitate communication between Organizers and Participants, process payments, and provide the services.",
      "2. Create and Maintain a Trusted and Safer Environment: The information we collect is critical for ensuring the safety and security of our community. We use it to:",
    ],
    bullets: [
      "Detect and prevent fraud, spam, abuse, security incidents, and other harmful activities.",
      "Conduct security investigations and risk assessments.",
      "Verify or authenticate information provided by you.",
      "Comply with legal obligations.",
      "Resolve any disputes with any of our users and enforce our agreements with third parties.",
      "Enforce our Terms of Service and other policies.",
      "3. Communication and Marketing: We use your personal information to send you service-related communication, such as registration confirmations, reminders, and notifications regarding our services and your account. You can opt out of receiving marketing communications from us at any time by following the unsubscribe instructions included in our marketing communications.",
    ],
  },
  {
    title: "Disclosure of Your Information",
    paragraphs: [
      "We do not sell, trade, rent, or otherwise transfer your personal information to others, except as described in this Policy.",
    ],
    bullets: [
      "Sharing between Organizers and Participants: When a registration is confirmed, we will share the Participant's name and other necessary details with the Organizer.",
      "Service Providers: We share information with third-party vendors, consultants, and other service providers who perform services on our behalf, including payment processing (Razorpay, PayTM, etc.), e-commerce hosting (Dukaan), data analytics, and identity verification.",
      "Aggregated Data: We may share aggregated and anonymized information for industry and market analysis, demographic profiling, marketing and advertising, and other business purposes.",
      "Legal and Regulatory Compliance: We reserve the right to disclose your personal information to comply with applicable law, regulatory requirements, court orders, or legal processes, to enforce our Terms of Service, or for fraud protection and prevention of crime.",
      "Business Transfers: If amigoconnect.com undertakes or is involved in any merger, acquisition, reorganization, sale of assets, bankruptcy, or insolvency event, we may sell, transfer, or share some or all of your information in connection with such transaction.",
      "International Data Transfers: To facilitate global operations, we may transfer, store, and process your information with appropriate contractual, technical, and organizational safeguards.",
    ],
  },
  {
    title: "Engagement with Third-Party Service Providers & Security Procedures",
    paragraphs: [
      "When you make payments through our Platform, all payments are processed securely by established third-party payment processors (such as Razorpay). We do not store or have access to your full credit card or bank account details; these are handled directly by the payment providers in accordance with their own privacy policies.",
      "We are committed to protecting your privacy and have implemented administrative, technical, and physical security measures to safeguard your information against unauthorized access, loss, destruction, or alteration. The personal information of each user is stored on servers that are behind a firewall and housed within secure data centres.",
      "Any data breaches and/or security lapses you may identify on the usage of the Platform may be reported by email to the Grievance Officer as provided below. In the event of a data breach likely to cause harm, we will notify affected users and the relevant authorities within a reasonable time, in accordance with applicable law.",
    ],
  },
  {
    title: "Rights of the User",
    bullets: [
      "Data Retention: We generally retain your personal information for as long as is necessary for the performance of the contract between you and us and to comply with our legal obligations (including a minimum retention period of 3 years from the last transaction for tax, legal reporting, auditing, and fraud prevention obligations).",
      "Consent Withdrawal: You can withdraw your consent for storing and/or processing of your information at any time by changing your account settings or by sending a communication to us specifying the consent you are withdrawing.",
      "Right to Know How Data is Used: You can seek information on what personal data has been collected, why it has been collected and how it is being used.",
      "Access or Deletion of Information: In accordance with applicable law, you have the right to access your information or request the deletion of your information from our systems.",
      "Rectification of Information: You have the right to ask us to correct inaccurate or incomplete personal information concerning you.",
      "Right to Nominate: You have the right to nominate another individual to exercise your rights on your behalf in the event of your death or incapacity.",
      "Grievance Redressal Mechanism: You have the right to a grievance redressal provided by us in respect of any act or omission by us regarding the performance of our obligations in relation to your information.",
    ],
  },
  {
    title: "Children’s Data, Modification & Governing Law",
    paragraphs: [
      "Children’s Data: The Platform is not intended for individuals under the age of 18, or the legal age of majority where you reside. If a parent or legal guardian registers a minor for a race category, explicit parental consent is required.",
      "Modification: We may change this Privacy Policy from time to time. Any changes to our Policy will be posted on this page so that you are always aware of our policies.",
      "Governing Law and Dispute Resolution: This Policy shall be governed by and constructed in accordance with the laws of India. Any controversy or claim arising out of or relating to this Policy shall be settled by arbitration in New Delhi, India. Subject to the foregoing, the courts in New Delhi shall have exclusive jurisdiction to determine any disputes arising in relation to, or under this Policy.",
    ],
  },
  {
    title: "Contacting Us, Grievance Redressal & Consents",
    paragraphs: [
      "Please contact our Grievance Officer for all matters relating to this Privacy Policy, including to exercise your user rights:",
      "Name: PADAM SHARMA | Designation: Director - Product & New Community Initiatives | Email-Id: grievance@amigoconnect.com",
      "Upon receiving such grievance, we shall endeavour to resolve and respond within 90 (ninety) days, or within such other maximum period as may be permitted under applicable law. We do not levy any charges or fees for enabling you to access your data or for facilitating the exercise of any other rights granted to you under applicable data protection laws.",
      "Acceptance of Policy: By using our Platform, you confirm that you have read, understood, and agree to the terms of this Privacy Policy.",
    ],
  },
];

export const PARTICIPANT_TERMS_SECTIONS: PolicySection[] = [
  {
    title: "Overview & Use of Personal Data",
    paragraphs: [
      "These Terms and Conditions (“Participants Terms”) describe how DELHI DWARKA RUN (DDR), operated by AMIGO CONNECT.COM (“we”, “us”, or “our”), provides a platform for organizing, managing or running a sports related event (“Event”), by a third-party entity (“Organizer,” or “Host”), and allows users (“Users,” “Participant”, “You,” or “Your”) to discover, register for, and participate in Events.",
      "Please read these Participants Terms carefully prior to creating an account, listing any Event, or registering for any Event on the Platform. By proceeding, you are deemed to have read, understood and consented to these Participants Terms and to processing of your personal data as described in the Privacy Policy.",
      "The collection and use of personal information in connection with your access to and use of the Platform is described in our Privacy Policy, which is incorporated by reference into these Participants Terms.",
    ],
  },
  {
    title: "Registration and Onboarding",
    bullets: [
      "a) Eligibility: To register and use the Platform as a Participant, you must be at least 18 (eighteen) years of age and have the legal capacity to enter into a binding contract under applicable law.",
      "b) Registration Information: During registration, you may be required to provide information such as name, phone number, email address, Aadhaar or other ID details, blood group, emergency contact, T-shirt size, postal address and Event-specific details as requested by the Organizer. Any notice or communication sent to the email address or mobile number provided during registration will be deemed to have been received by the Participant.",
      "c) Participants must carefully select the appropriate Event category at the time of registration.",
      "d) Registration of Minors: If you are completing a registration on behalf of a minor, you confirm that you are the parent or legal guardian and that the minor has your full consent to participate in the Event, including the requirement of being medically fit to participate.",
      "e) We will be sending regular updates to the mobile number you have provided in the registration form. This should not be treated as spam and you shall not take any action against our bulk SMS service provider as it is in your best interest to receive these updates.",
      "f) Event-Specific Terms: You are responsible for reviewing the Event-specific terms and the cancellation policy of the Organizer before completing your registration.",
      "g) Accurate Information: You must provide true, accurate, current and complete information, and keep such information updated.",
    ],
  },
  {
    title: "Booking Confirmation",
    bullets: [
      "a) Once a registration/booking is successfully completed through the Platform, a confirmation may be sent to the Participant by email and/or SMS, and the booking details will be visible on the Platform. Failure to receive a confirmation email will not, by itself, entitle the Participant to a chargeback or refund if the registration is successfully recorded on the Platform.",
      "b) Users of email services that offer filtering/blocking of messages from unknown email addresses should add support@amigoconnect.com, padam@amigoconnect.com, and no-reply@amigoconnect.com to their address list to avoid missing confirmation and communication messages sent by the Event Organizer.",
    ],
  },
  {
    title: "Payments, Cancellations and Refunds",
    paragraphs: ["a) Payment Terms:"],
    bullets: [
      "The Platform enables Organizers to collect registration fees, donations and other Event-related payments through third-party payment service providers or payment gateways (“Facilitated Payment Modes” or “FPMs” such as Razorpay) and/or through AMIGOCONNECT’S own payment processing arrangements.",
      "The ticket/registration prices displayed on each Event listing are determined solely by the Organizer (AMIGO CONNECT.COM). The Platform may charge a Platform/service fee, which is included in or added to the ticket price as applicable.",
      "In the event the participant does not receive a confirmation email, the participant must reach out to the Organizer (AMIGO CONNECT.COM) directly through an email on the Event page to request confirmation. Failure to follow this process constitutes a waiver of any right to initiate a chargeback based on non-receipt of tickets.",
      "b) Refund Terms: All confirmed registrations are non-refundable, non-transferable, and cannot be modified, unless expressly permitted by the Organizer under specific Event terms. No refunds shall be provided if the Participant fails to attend the Event or opts not to participate for personal reasons.",
      "c) Cancellation and Event Change Terms: Tickets may be cancelled only if the Organizer (AMIGO CONNECT.COM) has expressly permitted cancellations. If an Event is cancelled, postponed, suspended, or materially changed for any reason (including force majeure, adverse weather, safety concerns, or official restrictions), the Participant must rely solely on the Organizer’s refund and cancellation policy. If registrations are rejected by the Organizer, any amount collected from rejected applications shall be refunded (excluding bank charges) unless otherwise stipulated.",
    ],
  },
  {
    title: "Participants Obligations, Health and Safety",
    bullets: [
      "a) Medical Fitness and Assumption of Risk: Participants are solely responsible for assessing their medical fitness and suitability to participate in any Event. By registering or participating, the Participant is deemed to be medically fit and adequately trained and participates entirely at their own risk. Participants agree that the Event or its Organizers shall not be liable for any loss or damage of personal belongings, illness or injury that might occur as a result of participation in the Event.",
      "b) Conduct: Participants agree to follow all instructions and rules issued by the Organizer (AMIGO CONNECT.COM), volunteers, race directors, medical staff and security personnel at the venue; stop running if instructed by the race director, medical staff, or aid station volunteers; personally appear to collect running bibs (or provide written consent for in-absentee collection); stay off the course beyond the cut-off time; and refrain from any misconduct, abuse, or harassment.",
      "If the Participants opt for pre-race training plans, they will be solely responsible for the success/failure of the training in relation to the plan and should not hold the race Organizer or the training plan responsible in any way.",
    ],
  },
  {
    title: "Platform Use, Content and Intellectual Property",
    bullets: [
      "a) Ownership of Platform Content: All intellectual property rights in the Platform, including software, text, graphics, logos, trademarks, and other content, are owned or licensed by the Platform.",
      "b) User Content and Licence to the Platform: If you upload or provide any content (including Event descriptions, photos, results, or feedback) to the Platform, you grant the Platform a non-exclusive, worldwide, royalty-free, transferable and sublicensable licence to use, reproduce, adapt, modify, publish and display such content.",
      "c) Publication in Media: You agree and confirm that your name and media recordings may be taken during your participation in the races, and may be used to publicize the Event or in publicity materials by us or the Organizers. If you wish to withdraw your consent, please email support@amigoconnect.com.",
    ],
  },
  {
    title: "Disclaimers, Liability and Indemnification",
    bullets: [
      "a) The Platform and related services are provided on an “as is” and “as available” basis, without warranties of any kind.",
      "b) Limitation of Liability: To the maximum extent permitted by law, the Platform shall not be liable for any indirect, incidental, special, consequential or punitive damages, or any loss or injury arising out of or in connection with an Event.",
      "c) Release: By opting to participate in any Event, you hereby release forever AMIGO CONNECT.COM and its respective directors, shareholders, officers, employees, vendors and service providers from any and all liabilities and claims arising from your participation.",
      "d) Aggregate Liability: Any aggregate monetary liability of the Platform, if established, shall be limited to the lower of (a) the amount actually received by the Platform in respect of the specific transaction giving rise to the claim, or (b) Rs. 10,000/- (Rupees Ten Thousand Only) in the aggregate.",
      "e) Indemnity by Participants: Participants agree to indemnify, defend and hold harmless the Platform and its affiliates, directors, officers, employees, service providers and agents from any claims, damages, liabilities, costs and expenses arising out of their breach of these Participants Terms.",
    ],
  },
  {
    title: "Data Protection, Termination, Governing Law & Contact",
    paragraphs: [
      "Data Protection and Confidentiality: Participants are expected to maintain confidentiality and respect the privacy of Organizers’ information shared with them, and maintain strict confidentiality of any proprietary, business, or technical information received from the Platform.",
      "Termination, Suspension and Service Modifications: The Platform may, at its sole discretion, suspend or terminate any account or access to the Platform with or without notice in the event of breach of these Participants Terms, suspected fraud, or non-payment of fees.",
      "Governing Law and Dispute Resolution: These Participants Terms shall be governed by and construed in accordance with the laws of India. Courts having jurisdiction in NEW DELHI, India shall have exclusive jurisdiction over disputes arising out of or in connection with these Participants Terms.",
      "Violations & Escalations: Please report any violations of these Participants Terms by emailing support@amigoconnect.com.",
      "Grievance Officer Contact: Name: PADAM SHARMA | Designation: Director - Product & New Community Initiatives | Email-Id: grievance@amigoconnect.com",
    ],
  },
];

export const ORGANIZER_TERMS_SECTIONS: PolicySection[] = [
  {
    title: "Overview & Registration and Onboarding",
    paragraphs: [
      "These Organizer's Terms and Conditions (“Organizer Terms”) govern the use of the Platform, operated by Saransh Ventures Private Limited (“AMIGO CONNECT,” “we,” “us,” or “our”), by any entity or individual (“Organizer,” “Host,” “You,” or “Your”) for the purpose of listing, managing, and promoting a running or sports-related event (“Event”).",
    ],
    bullets: [
      "a) Eligibility: To be eligible to register and use the Platform as an Organizer, you must be at least 18 (eighteen) years of age and have the legal capacity to enter into a binding contract under applicable law.",
      "b) Registration Requirement: Legal name of the organization or individual, registered or principal business address, valid contact number(s) and official email address, Permanent Account Number (PAN), bank account details for settlement of payments, and details/proof of identity of authorized signatories.",
      "c) Minor Participants: If an Event permits participation by minors, the Organizer shall be solely responsible for implementing and documenting a process to obtain and verify explicit consent from the parent or legal guardian for each minor Participant.",
      "d) Know Your Customer Verification (“KYC”): The Organizer shall undergo mandatory KYC verification in accordance with applicable laws and payment gateway rules.",
      "e) Compliance with DPDPA 2023: The Organizer represents and warrants that it complies, and shall at all times comply, with the provisions of the Digital Personal Data Protection Act, 2023, and the applicable rules.",
    ],
  },
  {
    title: "Event Listing, Management & Organizer Responsibilities",
    bullets: [
      "a) Event Disclosure Requirements: Complete and accurate details of the Event including title, venue/route, date and time, race categories/distances, registration fees and applicable taxes, eligibility/age requirements, and cut-off timings.",
      "b) Participant Data Collection and Legal Compliance: Participant data collected through the Platform must be strictly limited to information necessary for the organization, conduct, and administration of the Event in compliance with the Information Technology Act, 2000 and the Digital Personal Data Protection Act, 2023.",
      "c) Communication: The Organizer shall be exclusively responsible for timely communication of all Event-related information, updates, bib-collection details, safety protocols, or changes to Participants.",
      "d) Analytics Dashboard Access: The Organizer shall have access to an analytics dashboard displaying total revenue generated, number of Participant registrations, category-wise breakdown, and detailed Participant information.",
      "e) Right of Review and Removal: The Platform reserves the right to review, modify, or remove any Event listing that appears incomplete, misleading, unlawful, or non-compliant.",
    ],
  },
  {
    title: "Payments, Cancellations, Refunds & Event Execution",
    bullets: [
      "a) Payment Terms: Organizers must complete mandatory KYC verification before requesting any payment settlement or clearance. The Organizer is solely responsible for calculation and deposit of applicable taxes in relation to all payments unless expressly collected by the Platform.",
      "b) Refund Terms: The Organizer must publish a clear refund and cancellation policy for Participants in the Event listing and is solely responsible for determining refund eligibility, issuing refunds, and handling disputes or chargebacks.",
      "c) Cancellation and Event Change Terms: Organizers are solely responsible for communicating any Event cancellation, postponement, modification, or material changes to all registered Participants promptly.",
      "d) Event Execution Responsibilities: The Organizer is solely responsible for safety, conduct, management and delivery of the Event including obtaining all required permits, route and venue safety, crowd management, first-aid and medical support, emergency response measures, and compliance with municipal regulations.",
    ],
  },
  {
    title: "Intellectual Property, Disclaimers, Liability & Governing Law",
    bullets: [
      "Platform Use & IP: The Organizer shall ensure that all uploaded media is original or properly licensed and does not infringe third-party intellectual property rights.",
      "Limitation of Liability & Release: To the maximum extent permitted by law, the Platform shall not be liable for indirect, incidental, or consequential damages, or any loss or injury arising out of an Event. Aggregate monetary liability shall not exceed Rs. 10,000/-.",
      "Indemnity by Organizers: Organizers agree to indemnify, defend and hold harmless the Platform and its affiliates from any claims, damages, liabilities, costs and expenses arising out of the organization, promotion, execution or cancellation of any Event.",
      "Governing Law & Grievance Officer: Governed by the laws of India. Grievance Officer: PADAM SHARMA, Director - Product & New Community Initiatives (grievance@amigoconnect.com | support@amigoconnect.com).",
    ],
  },
];
