export type SectionContent =
  | { type: "paragraph"; text: string }
  | { type: "list"; ordered: boolean; items: string[] }
  | { type: "subheading"; text: string };

export type ArticleSection = {
  num: string;
  title: string;
  content: SectionContent[];
};

export type ConstitutionArticle = {
  num: number;
  id: string;
  title: string;
  sections: ArticleSection[];
};

export type ScheduleEntry = {
  id: string;
  num: string;
  title: string;
  content: SectionContent[];
};

export type ConstitutionData = {
  preamble: string[];
  articles: ConstitutionArticle[];
  schedules: ScheduleEntry[];
  finalDeclaration: string[];
};

const p = (text: string): SectionContent => ({ type: "paragraph", text });
const ol = (items: string[]): SectionContent => ({ type: "list", ordered: true, items });
const ul = (items: string[]): SectionContent => ({ type: "list", ordered: false, items });
const sh = (text: string): SectionContent => ({ type: "subheading", text });

export const CONSTITUTION: ConstitutionData = {
  preamble: [
    "We, the sons and daughters of Oroko in the Diaspora, conscious of our common heritage, history, culture, identity and responsibility to present and future generations;",
    "Recognising that our strength lies in our unity, our diversity, our collective knowledge, our resources and our commitment to one another;",
    "Determined to create a strong, democratic and accountable international organisation through which Oroko people and persons connected to the Oroko community may unite, empower themselves, preserve their heritage and contribute meaningfully to the sustainable development of Oroko Land;",
    "Committed to building bridges between Oroko people in the Diaspora and communities in Oroko Land through sustainable social, educational, cultural, economic and developmental projects;",
    "Affirming the principles of democracy, equality, transparency, accountability, inclusion, integrity, respect for human dignity, good governance and the rule of law;",
    "Recognising that sovereignty within the Organisation belongs to its individual members and that every eligible member shall have an equal voice in its governance;",
    "Determined that no individual, office holder, geographical group, country, chapter, branch or other interest shall exercise authority above this Constitution or above the collective will of the membership;",
    "Do hereby adopt this Constitution as the supreme governing instrument of OROKO INTERNATIONAL.",
  ],

  articles: [
    {
      num: 1,
      id: "article-1",
      title: "Name, Nature and Identity",
      sections: [
        { num: "1.1", title: "Name", content: [p("The organisation shall be known as OROKO INTERNATIONAL, hereinafter referred to as \"the Organisation.\".")] },
        { num: "1.1a", title: "Motto", content: [p("The Organisation's motto shall be Unity, Culture & Development.")] },
        { num: "1.1b", title: "Logo", content: [p("The Organisation's official logo shall be a drum with hands playing.")] },
        { num: "1.2", title: "International Character", content: [p("OROKO INTERNATIONAL is an international, voluntary, non-profit and non-partisan organisation established to unite Oroko people and persons connected to the Oroko community throughout the Diaspora and elsewhere.")] },
        { num: "1.3", title: "Individual Membership Organisation", content: [p("Membership of OROKO INTERNATIONAL shall be individual-based."), p("The Organisation shall not operate a constitutional system in which geographical chapters, branches, countries or associations possess collective votes or delegate votes.")] },
        { num: "1.4", title: "Non-Profit Character", content: [p("No part of the income or assets of the Organisation shall be distributed for the private benefit of any member or officer, except for legitimate reimbursement, approved remuneration or other lawful payment authorised under this Constitution.")] },
        { num: "1.5", title: "Legal Compliance", content: [p("The Organisation shall comply with the applicable laws of the jurisdiction in which it is legally registered and shall maintain its international character to the fullest extent permitted by law.")] },
      ],
    },
    {
      num: 2,
      id: "article-2",
      title: "Vision, Mission and Objectives",
      sections: [
        { num: "2.1", title: "Vision", content: [p("To build a united, empowered and globally connected Oroko community capable of preserving its identity, improving the wellbeing of its members and contributing to the sustainable development of Oroko Land.")] },
        {
          num: "2.2", title: "Mission", content: [
            p("OROKO INTERNATIONAL exists to bring together Oroko sons and daughters in the Diaspora and persons connected to the Oroko community, to:"),
            ul(["strengthen unity and solidarity;", "empower individuals and families;", "preserve Oroko identity, culture, language and heritage;", "create opportunities for education, professional development and entrepreneurship;", "mobilise expertise, resources and partnerships;", "support sustainable development projects in Oroko Land;", "promote responsible engagement between the Diaspora and communities in Oroko Land; and", "create a lasting legacy for future generations."]),
          ],
        },
        {
          num: "2.3", title: "Objectives", content: [
            p("The Organisation shall pursue the following objectives:"),
            sh("a. Unity and Solidarity"), p("To promote unity, mutual respect, cooperation and solidarity among Oroko people worldwide."),
            sh("b. Cultural Preservation"), p("To preserve, promote, document and transmit Oroko history, language, traditions, customs, arts and cultural heritage."),
            sh("c. Empowerment"), p("To empower members through education, professional networking, entrepreneurship, skills development, mentoring and access to opportunities."),
            sh("d. Sustainable Development"), p("To design, support and implement sustainable projects in Oroko Land, particularly in areas including:"),
            ul(["education;", "healthcare;", "clean water and sanitation;", "agriculture;", "infrastructure;", "youth development;", "women's empowerment;", "digital transformation;", "environmental protection;", "entrepreneurship; and", "community development."]),
            sh("e. Diaspora Engagement"), p("To establish meaningful and sustainable links between Oroko communities in the Diaspora and Oroko Land."),
            sh("f. Youth Development"), p("To encourage younger generations to understand, preserve and contribute to Oroko heritage and development."),
            sh("g. Professional Cooperation"), p("To create networks through which members may share professional knowledge, expertise, opportunities and resources."),
            sh("h. Cultural Diplomacy"), p("To promote positive awareness and recognition of Oroko culture internationally."),
            sh("i. Partnerships"), p("To establish lawful partnerships with institutions, organisations, governments, businesses, charities and individuals whose objectives are compatible with those of the Organisation."),
          ],
        },
      ],
    },
    {
      num: 3,
      id: "article-3",
      title: "Fundamental Constitutional Principles",
      sections: [
        { num: "3.1", title: "Constitutional Supremacy", content: [p("This Constitution shall be the supreme internal governing instrument of OROKO INTERNATIONAL.")] },
        { num: "3.2", title: "Sovereignty of the Membership", content: [p("Ultimate authority shall reside in the individual membership acting collectively through the General Assembly and, where constitutionally required, through referendum.")] },
        { num: "3.3", title: "One Member, One Vote", content: [p("Every eligible voting member shall have one vote and only one vote."), p("No person shall have additional voting rights because of:"), ul(["office held;", "financial contribution;", "seniority;", "country of residence;", "nationality;", "professional status;", "membership category; or", "any other status."])] },
        { num: "3.4", title: "Equality", content: [p("All members shall be treated equally under the Constitution, subject only to objectively defined differences expressly recognised by this Constitution.")] },
        { num: "3.5", title: "Democratic Governance", content: [p("All elected authority shall derive from the membership.")] },
        { num: "3.6", title: "Separation of Powers", content: [p("Authority shall be distributed among the:"), ol(["General Assembly;", "Executive Council; and", "Committees."])] },
        { num: "3.7", title: "Accountability", content: [p("Every officer shall be accountable for the exercise of constitutional authority.")] },
        { num: "3.8", title: "Transparency", content: [p("The Organisation shall operate with reasonable transparency regarding elections, finances, membership, constitutional amendments and major decisions.")] },
        { num: "3.9", title: "Due Process", content: [p("No member shall be deprived of membership rights or subjected to disciplinary sanctions without a fair and reasonable procedure.")] },
        { num: "3.10", title: "No Personal Ownership of Office", content: [p("No office, position, title, property, database, platform, document or asset of OROKO INTERNATIONAL shall belong personally to the person occupying an office.")] },
      ],
    },
    {
      num: 4,
      id: "article-4",
      title: "Membership",
      sections: [
        { num: "4.1", title: "Individual Membership", content: [p("Membership shall be granted to individuals and shall not be held collectively by geographical groups.")] },
        {
          num: "4.2", title: "Membership Classes", content: [
            p("There shall be three principal forms of membership:"),
            sh("4.2.1 Full Oroko Lineage Membership"), p("A person shall qualify as a Full Oroko Lineage Member where both parents are of Oroko lineage."),
            sh("4.2.2 Partial Oroko Lineage Membership"), p("A person shall qualify as a Partial Oroko Lineage Member where at least one parent is of Oroko lineage."),
            sh("4.2.3 Affiliation Membership"), p("A person may qualify as an Affiliation Member through a recognised connection to the Oroko community, including:"),
            ul(["marriage to a person of Oroko lineage;", "lawful adoption;", "family affiliation;", "other legally or socially recognised relationships with the Oroko community; or", "other forms of affiliation approved under membership regulations."]),
          ],
        },
        { num: "4.3", title: "Equal Membership Rights", content: [p("Full Lineage, Partial Lineage and Affiliation Members who satisfy the requirements for voting membership shall have equal voting rights."), p("No membership category shall create a superior vote.")] },
        { num: "4.4", title: "Presidential Eligibility Exception", content: [p("Notwithstanding Article 4.3, eligibility for the Presidency shall require Oroko lineage."), p("Accordingly, a candidate for President must qualify as either:"), ol(["a Full Oroko Lineage Member; or", "a Partial Oroko Lineage Member."]), p("An Affiliation Member who does not possess Oroko lineage shall not be eligible to stand for election as President. However other Executive Council posts remain open for such members.")] },
        { num: "4.5", title: "Proof of Lineage", content: [p("Where lineage is relevant to eligibility, the Organisation may establish reasonable procedures for verification."), p("Such procedures shall respect privacy, dignity and applicable data-protection laws.")] },
        { num: "4.6", title: "Registration", content: [p("Every member shall be individually registered in the official membership register.")] },
        { num: "4.7", title: "Membership Register", content: [p("The Organisation shall maintain an accurate membership database containing information reasonably necessary for:"), ul(["identification;", "membership verification;", "voting eligibility;", "communication;", "administration; and", "lawful reporting."])] },
        { num: "4.8", title: "Membership Dues", content: [p("The General Assembly shall determine annual membership dues upon recommendation of the Executive Council."), p("The amount shall be approved transparently and communicated to members.")] },
        { num: "4.9", title: "Voting Eligibility and Dues", content: [p("Where annual membership dues are applicable, a member shall ordinarily be eligible to vote only where the member has fulfilled the applicable financial membership requirement, unless the General Assembly establishes an alternative rule for hardship, exemption or transitional circumstances."), p("No officer shall have unilateral authority to create, increase or waive membership dues.")] },
        { num: "4.10", title: "Membership Renewal", content: [p("Membership shall be renewed in accordance with regulations approved by the General Assembly.")] },
      ],
    },
    {
      num: 5,
      id: "article-5",
      title: "Rights and Duties of Members",
      sections: [
        { num: "5.1", title: "Rights", content: [p("Every eligible member shall have the right to:"), ol(["participate in the Organisation;", "attend General Assembly meetings;", "vote;", "stand for eligible elected offices;", "submit proposals;", "participate in committees;", "receive constitutional and organisational information;", "inspect approved financial reports;", "express opinions respectfully;", "challenge decisions through constitutional procedures; and", "enjoy equal protection under the Constitution."])] },
        { num: "5.2", title: "Duties", content: [p("Members shall:"), ol(["respect the Constitution;", "respect other members;", "uphold the reputation and legitimate interests of the Organisation;", "comply with lawful decisions;", "fulfil applicable membership obligations;", "avoid fraud, corruption and abuse of organisational resources; and", "contribute constructively to the objectives of the Organisation."])] },
      ],
    },
    {
      num: 6,
      id: "article-6",
      title: "Organs of OROKO International",
      sections: [
        { num: "6.1", title: "General Assembly", content: [p("The General Assembly (GA) shall be the supreme governing organ.")] },
        { num: "6.2", title: "Executive Council", content: [p("The Executive Council (EC) shall be the principal executive and administrative organ.")] },
        { num: "6.3", title: "Committees", content: [p("Committees shall provide specialised, technical, advisory, oversight, investigative or operational functions.")] },
        { num: "6.4", title: "Constitutional Boundaries", content: [p("Each organ shall exercise only powers granted by this Constitution or lawfully delegated under it."), p("No organ may permanently transfer, abolish or assume the constitutional powers of another organ.")] },
      ],
    },
    {
      num: 7,
      id: "article-7",
      title: "The General Assembly",
      sections: [
        { num: "7.1", title: "Composition", content: [p("The General Assembly shall comprise all eligible voting members of OROKO INTERNATIONAL.")] },
        { num: "7.2", title: "Supreme Authority", content: [p("The General Assembly shall have final authority over all matters not expressly reserved by this Constitution to another organ.")] },
        { num: "7.3", title: "Powers", content: [p("The General Assembly shall:"), ol(["adopt and amend the Constitution;", "elect constitutional officers;", "approve the strategic direction of the Organisation;", "approve annual budgets;", "approve annual financial reports;", "determine membership dues;", "establish permanent committees;", "approve major organisational restructuring;", "hold elected officers accountable;", "remove officers in accordance with this Constitution;", "approve major disposal of organisational assets;", "approve dissolution;", "approve major partnerships where required;", "establish policies;", "receive reports from the Executive Council and Committees;", "establish referendum procedures; and", "exercise all other powers assigned to it under this Constitution."])] },
      ],
    },
    {
      num: 8,
      id: "article-8",
      title: "General Assembly Meetings and Quorum",
      sections: [
        { num: "8.1", title: "Annual General Assembly", content: [p("At least one Annual General Assembly shall be held every calendar year.")] },
        { num: "8.2", title: "Extraordinary General Assembly", content: [p("An Extraordinary General Assembly may be convened:"), ol(["by the President;", "by resolution of the Executive Council; or", "upon written petition by at least 20% of eligible voting members."])] },
        { num: "8.3", title: "Notice", content: [p("Members shall receive at least 21 days' notice of an ordinary General Assembly."), p("For an Extraordinary General Assembly, at least 14 days' notice shall ordinarily be provided.")] },
        { num: "8.4", title: "Agenda", content: [p("The notice shall include the principal matters to be considered."), p("A matter of constitutional significance shall not ordinarily be introduced without adequate notice to members.")] },
        { num: "8.5", title: "Quorum", content: [p("The quorum for a General Assembly shall be one-third of eligible voting members.")] },
        { num: "8.6", title: "Failure to Achieve Quorum", content: [p("If quorum is not achieved, the meeting may be adjourned and reconvened within a period determined by the applicable regulations."), p("A reconvened meeting may proceed with the members present, provided that:"), ol(["the original meeting was properly convened;", "members were properly notified of the reconvened meeting; and", "no constitutional provision expressly requires a higher threshold."])] },
        { num: "8.7", title: "Ordinary Decisions", content: [p("Unless otherwise provided, decisions shall be determined by a simple majority of votes cast.")] },
        { num: "8.8", title: "Constitutional Matters", content: [p("Constitutional amendments, removal of the President, dissolution and other fundamental matters shall require the special majorities specified in this Constitution.")] },
      ],
    },
    {
      num: 9,
      id: "article-9",
      title: "The Executive Council",
      sections: [
        { num: "9.1", title: "Composition", content: [p("The Executive Council shall consist of:"), ol(["President;", "Vice President;", "Secretary General;", "Deputy Secretary General;", "Treasurer;", "Financial Secretary;", "Publicity and Communications Secretary;", "Cultural and Heritage Secretary; and", "such additional elected positions as may be established by the General Assembly."])] },
        { num: "9.2", title: "Executive Authority", content: [p("The Executive Council shall administer the Organisation between General Assembly meetings.")] },
        { num: "9.3", title: "Principal Functions", content: [p("The Executive Council shall:"), ol(["implement General Assembly decisions;", "manage the day-to-day affairs of the Organisation;", "prepare programmes and budgets;", "manage approved projects;", "maintain organisational administration;", "coordinate Committees;", "prepare reports;", "safeguard organisational assets;", "propose policies;", "facilitate membership services; and", "perform other lawful functions assigned under this Constitution."])] },
      ],
    },
    {
      num: 10,
      id: "article-10",
      title: "The President",
      sections: [
        { num: "10.1", title: "Office", content: [p("The President shall be the principal elected officer and chief executive representative of OROKO INTERNATIONAL.")] },
        { num: "10.2", title: "Constitutional Duty", content: [p("The President shall:"), ul(["uphold and defend the Constitution;", "provide strategic leadership;", "represent the Organisation;", "preside over the Executive Council;", "preside over the General Assembly, unless the Constitution requires an independent chair;", "ensure implementation of General Assembly decisions; and", "promote unity and integrity within the Organisation."])] },
        { num: "10.3", title: "Limitations", content: [p("The President shall not:"), ol(["amend the Constitution unilaterally;", "suspend the Constitution;", "cancel an election without constitutional authority;", "appropriate organisational assets;", "permanently suspend a member without due process;", "create constitutional offices without authority; or", "exercise powers reserved for the General Assembly."])] },
      ],
    },
    {
      num: 11,
      id: "article-11",
      title: "Other Executive Officers",
      sections: [
        { num: "11.1", title: "Vice President", content: [p("The Vice President shall assist the President and shall act as President when the President is temporarily unable to perform the functions of office.")] },
        { num: "11.2", title: "Secretary General", content: [p("The Secretary General shall be responsible for:"), ul(["official records;", "correspondence;", "meeting notices;", "agendas;", "minutes;", "constitutional documentation; and", "administrative coordination."])] },
        { num: "11.3", title: "Deputy Secretary General", content: [p("The Deputy Secretary General shall assist the Secretary General and act in that capacity when required.")] },
        { num: "11.4", title: "Treasurer", content: [p("The Treasurer shall oversee the custody and administration of organisational funds and financial assets.")] },
        { num: "11.5", title: "Financial Secretary", content: [p("The Financial Secretary shall maintain financial records, monitor income and expenditure and assist in financial reporting.")] },
        { num: "11.6", title: "Publicity and Communications Secretary", content: [p("The Publicity and Communications Secretary shall coordinate authorised organisational communication, publicity and media relations.")] },
        { num: "11.7", title: "Cultural and Heritage Secretary", content: [p("The Cultural and Heritage Secretary shall coordinate programmes concerning Oroko culture, history, heritage, language and cultural preservation.")] },
      ],
    },
    {
      num: 12,
      id: "article-12",
      title: "Committees",
      sections: [
        { num: "12.1", title: "Establishment", content: [p("The General Assembly or Executive Council may establish Committees within the limits of this Constitution.")] },
        { num: "12.2", title: "Permanent Committees", content: [p("The Organisation may establish, among others:"), ul(["Elections Committee;", "Finance and Audit Committee;", "Constitutional Review Committee;", "Ethics and Disciplinary Committee;", "Cultural and Heritage Committee;", "Membership Committee;", "Welfare and Development Committee; and", "any other committee approved under this Constitution."])] },
        { num: "12.3", title: "Constitutional Review Committee", content: [p("The Constitutional Review Committee may review the operation of the Constitution and propose amendments."), p("It shall not amend the Constitution.")] },
        { num: "12.4", title: "Elections Committee", content: [p("The Elections Committee shall administer elections independently of candidates and incumbent office holders.")] },
        { num: "12.5", title: "Finance and Audit Committee", content: [p("The Finance and Audit Committee shall provide independent oversight of financial administration and shall report to the General Assembly.")] },
        { num: "12.6", title: "Committee Independence", content: [p("A person shall not participate in an investigation or determination where that person's personal interests create a material conflict of interest.")] },
      ],
    },
    {
      num: 13,
      id: "article-13",
      title: "Elections",
      sections: [
        { num: "13.1", title: "Democratic Elections", content: [p("All elected offices shall be filled through free, fair, transparent and constitutionally regulated elections.")] },
        { num: "13.2", title: "Electoral Authority", content: [p("The Elections Committee shall administer the electoral process.")] },
        { num: "13.3", title: "Independence", content: [p("No candidate for election shall control the electoral process.")] },
        { num: "13.4", title: "Electoral Register", content: [p("The Elections Committee shall use an official verified register of eligible voting members.")] },
        { num: "13.5", title: "Nomination Period", content: [p("A reasonable nomination period shall be announced before an election.")] },
        { num: "13.6", title: "Candidate Requirements", content: [p("Every candidate shall:"), ol(["be a registered member;", "satisfy the applicable voting and membership requirements;", "satisfy the specific eligibility requirements for the office;", "not be under a constitutionally relevant disciplinary sanction; and", "comply with nomination procedures."])] },
        { num: "13.7", title: "Presidential Eligibility", content: [p("A candidate for President must:"), ul(["be a Full Oroko Lineage Member or Partial Oroko Lineage Member;", "have attained at least 30 years of age;", "have been a registered member for at least three consecutive years immediately preceding the election;", "demonstrate good standing within the Organisation;", "not have been convicted of serious financial or organisational misconduct, subject to applicable law and due process; and", "satisfy all other lawful nomination requirements."])] },
        { num: "13.8", title: "Eligibility for Other Executive Offices", content: [p("Candidates for other elected Executive Council positions shall:"), ul(["be eligible voting members;", "have attained at least 25 years of age, unless otherwise provided;", "have been members for at least one year immediately preceding the election; and", "satisfy the specific requirements established for the office."])] },
        { num: "13.9", title: "One Member, One Vote", content: [p("Every eligible voting member shall cast no more than one vote for each office being contested.")] },
        { num: "13.10", title: "Secret Ballot", content: [p("Election of officers shall be conducted by secret ballot.")] },
        { num: "13.11", title: "Voting Method", content: [p("The Elections Committee shall establish a voting system capable of:"), ul(["verifying voter eligibility;", "preventing multiple voting;", "protecting ballot secrecy;", "accurately counting votes; and", "preserving an auditable record."])] },
        { num: "13.12", title: "Presidential Election", content: [p("The candidate receiving more than 50% of valid votes cast shall be elected President."), p("Where no candidate receives more than 50%, a runoff shall be conducted between the two candidates receiving the highest number of votes."), p("The candidate receiving the highest number of valid votes in the runoff shall be elected.")] },
        { num: "13.13", title: "Other Offices", content: [p("For other offices, the candidate receiving the highest number of valid votes shall be elected unless the General Assembly establishes another method.")] },
        { num: "13.14", title: "Electoral Complaints", content: [p("An electoral complaint must be submitted within seven days of the publication of results."), p("The Elections Committee shall investigate and determine the complaint within a reasonable period."), p("Where the complaint concerns the Elections Committee itself, it shall be referred to an independent Electoral Appeals Panel established under regulations.")] },
      ],
    },
    {
      num: 14,
      id: "article-14",
      title: "Term of Office and Term Limits",
      sections: [
        { num: "14.1", title: "Term", content: [p("The term of office for elected Executive Council officers shall be four years.")] },
        { num: "14.2", title: "Presidential Term Limit", content: [p("No person shall serve as President for more than two consecutive terms.")] },
        { num: "14.3", title: "Cooling-Off Period", content: [p("A person who has served two consecutive presidential terms shall not be eligible to contest the Presidency for the immediately following term.")] },
        { num: "14.4", title: "Other Executive Offices", content: [p("No elected officer shall serve more than three consecutive terms in the same office, unless a constitutional amendment provides otherwise.")] },
        { num: "14.5", title: "Commencement of Term", content: [p("The term of a newly elected officer shall commence upon formal assumption of office following certification of the election.")] },
        { num: "14.6", title: "Holdover", content: [p("An officer shall remain in office only until a duly elected successor assumes office, unless the office has otherwise been constitutionally terminated."), p("A holdover period shall not be used to circumvent term limits.")] },
      ],
    },
    {
      num: 15,
      id: "article-15",
      title: "Vacancies and Succession",
      sections: [
        { num: "15.1", title: "Presidential Vacancy", content: [p("If the office of President becomes vacant through resignation, death, incapacity or removal:"), ol(["the Vice President shall become Acting President;", "an election shall be organised within 120 days, unless circumstances make this impracticable; and", "the elected successor shall serve the remainder of the term."])] },
        { num: "15.2", title: "Temporary Incapacity", content: [p("Where the President is temporarily unable to perform official duties, the Vice President shall act until the President resumes office.")] },
        { num: "15.3", title: "Other Vacancies", content: [p("Vacancies in other Executive Council positions may be filled according to procedures approved by the General Assembly.")] },
      ],
    },
    {
      num: 16,
      id: "article-16",
      title: "Removal, Impeachment and Recall",
      sections: [
        { num: "16.1", title: "Grounds for Removal", content: [p("An elected officer may be removed for:"), ul(["serious violation of this Constitution;", "corruption or financial misconduct;", "fraud;", "abuse of office;", "gross misconduct;", "persistent and serious failure to perform constitutional duties;", "deliberate interference with elections;", "serious misuse of organisational property;", "conduct fundamentally incompatible with the office; or", "other serious grounds established by law or constitutional regulation."])] },
        { num: "16.2", title: "Initiation of Proceedings", content: [p("Removal proceedings against the President may be initiated by:"), ul(["a two-thirds resolution of the Executive Council; or", "a written petition supported by at least 20% of eligible voting members."])] },
        { num: "16.3", title: "Investigation", content: [p("An independent committee or tribunal shall investigate the allegations."), p("The person accused shall not control the investigation.")] },
        { num: "16.4", title: "Right to Defence", content: [p("The officer shall receive:"), ul(["written notice of allegations;", "reasonable time to respond;", "the opportunity to present evidence;", "the right to be heard; and", "the right to challenge material procedural irregularities."])] },
        { num: "16.5", title: "Suspension Pending Investigation", content: [p("Where necessary to protect organisational assets, evidence or the integrity of the proceedings, an officer may be temporarily suspended from specific functions pending investigation."), p("Such suspension shall not constitute a finding of guilt.")] },
        { num: "16.6", title: "Removal of President", content: [p("The President may be removed only following a properly constituted process and approval by at least two-thirds of valid votes cast in a General Assembly vote or referendum expressly convened for that purpose.")] },
        { num: "16.7", title: "Removal of Other Elected Officers", content: [p("Other elected Executive Council officers may be removed by a two-thirds vote of the General Assembly following due process.")] },
        { num: "16.8", title: "No Arbitrary Removal", content: [p("An officer shall not be removed merely because of disagreement with another officer, an unpopular opinion, political disagreement or criticism made in good faith.")] },
      ],
    },
    {
      num: 17,
      id: "article-17",
      title: "Financial Governance",
      sections: [
        { num: "17.1", title: "Financial Year", content: [p("The financial year shall be established by the General Assembly.")] },
        { num: "17.2", title: "Sources of Revenue", content: [p("The Organisation may receive:"), ul(["membership dues;", "donations;", "grants;", "sponsorships;", "fundraising proceeds;", "project contributions;", "lawful income-generating activities; and", "other lawful sources."])] },
        { num: "17.3", title: "Membership Dues", content: [p("Annual membership dues shall be approved by the General Assembly."), p("The Executive Council shall not unilaterally impose new compulsory membership charges.")] },
        { num: "17.4", title: "Budget", content: [p("The Executive Council shall prepare an annual budget for approval by the General Assembly.")] },
        { num: "17.5", title: "Bank Accounts", content: [p("Organisational funds shall be deposited in accounts held in the legal name of the Organisation.")] },
        { num: "17.6", title: "Dual Authorisation", content: [p("No substantial financial transaction shall ordinarily be authorised by one person acting alone."), p("At least two authorised officers shall approve transactions above thresholds established by financial regulations.")] },
        { num: "17.7", title: "Separation of Financial Functions", content: [p("The duties of the Treasurer and Financial Secretary shall be sufficiently separated to reduce the risk of financial abuse.")] },
        { num: "17.8", title: "Financial Reporting", content: [p("The Treasurer shall provide periodic financial reports to the Executive Council and an annual financial report to the General Assembly.")] },
        { num: "17.9", title: "Audit", content: [p("The Organisation's accounts shall be independently audited or reviewed as required by law or by the General Assembly.")] },
        { num: "17.10", title: "Financial Transparency", content: [p("Members shall have reasonable access to approved annual financial reports.")] },
      ],
    },
    {
      num: 18,
      id: "article-18",
      title: "Projects and Development of Oroko Land",
      sections: [
        { num: "18.1", title: "Development Mandate", content: [p("A central purpose of OROKO INTERNATIONAL shall be to contribute to the sustainable development of Oroko Land.")] },
        { num: "18.2", title: "Project Principles", content: [p("Projects shall be guided by:"), ol(["sustainability;", "transparency;", "measurable impact;", "community participation;", "accountability;", "long-term benefit;", "responsible financial management; and", "avoidance of political or personal capture."])] },
        { num: "18.3", title: "Project Approval", content: [p("Major projects requiring substantial organisational resources shall be approved in accordance with financial and governance regulations.")] },
        { num: "18.4", title: "Project Accountability", content: [p("Every major development project shall, where practicable, have:"), ul(["a defined objective;", "an approved budget;", "responsible persons;", "implementation milestones;", "financial records; and", "an evaluation or completion report."])] },
      ],
    },
    {
      num: 19,
      id: "article-19",
      title: "Referendum",
      sections: [
        { num: "19.1", title: "Direct Democratic Authority", content: [p("A referendum may be used to obtain the direct decision of the membership on matters of fundamental importance.")] },
        { num: "19.2", title: "Initiation", content: [p("A referendum may be initiated by:"), ul(["the General Assembly;", "a resolution supported by at least two-thirds of the Executive Council; or", "a petition supported by at least 20% of eligible voting members."])] },
        { num: "19.3", title: "Referendum Questions", content: [p("A referendum question shall be:"), ul(["clear;", "neutral;", "specific;", "capable of being answered by a defined voting choice; and", "published sufficiently in advance."])] },
        { num: "19.4", title: "Notice", content: [p("Members shall receive at least 14 days' notice before a referendum unless an exceptional constitutional circumstance requires otherwise.")] },
        { num: "19.5", title: "Voting Threshold", content: [p("Ordinary referendum questions shall be determined by a simple majority of valid votes cast, unless this Constitution specifies a higher threshold.")] },
        { num: "19.6", title: "Constitutional Referendum", content: [p("Where a referendum concerns a constitutional amendment, the amendment shall require at least two-thirds of valid votes cast.")] },
        { num: "19.7", title: "Dissolution Referendum", content: [p("Dissolution shall require at least 75% of valid votes cast.")] },
        { num: "19.8", title: "Participation", content: [p("Every eligible voting member shall have one vote.")] },
      ],
    },
    {
      num: 20,
      id: "article-20",
      title: "Constitutional Amendment",
      sections: [
        { num: "20.1", title: "Proposal", content: [p("An amendment may be proposed by:"), ul(["the Executive Council;", "the Constitutional Review Committee; or", "a petition signed by at least 20% of eligible voting members."])] },
        { num: "20.2", title: "Publication", content: [p("The proposed amendment shall be circulated to members at least 21 days before voting.")] },
        { num: "20.3", title: "Debate", content: [p("Members shall have a reasonable opportunity to debate and propose modifications before final voting.")] },
        { num: "20.4", title: "Approval", content: [p("An amendment shall require two-thirds of valid votes cast.")] },
        { num: "20.5", title: "Entrenched Principles", content: [p("No amendment shall abolish:"), ol(["individual membership;", "the principle of one member, one vote;", "democratic governance;", "constitutional supremacy;", "accountability of elected officers;", "the right to due process; or", "the fundamental authority of the membership,"]), p("unless the amendment is itself approved by a three-quarters majority through referendum.")] },
      ],
    },
    {
      num: 21,
      id: "article-21",
      title: "Conflict of Interest",
      sections: [
        { num: "21.1", title: "Declaration", content: [p("An officer or committee member shall disclose any material personal, professional or financial interest that may conflict with an organisational decision.")] },
        { num: "21.2", title: "Recusal", content: [p("A person with a material conflict shall recuse themselves from the relevant decision unless otherwise authorised by applicable regulations.")] },
        { num: "21.3", title: "Organisational Contracts", content: [p("Contracts involving officers, their immediate family members or entities in which they have a substantial interest shall receive enhanced scrutiny and approval.")] },
      ],
    },
    {
      num: 22,
      id: "article-22",
      title: "Ethics and Discipline",
      sections: [
        { num: "22.1", title: "Standards", content: [p("All members and officers shall conduct themselves with integrity, respect and responsibility.")] },
        { num: "22.2", title: "Prohibited Conduct", content: [p("The Organisation shall not tolerate:"), ul(["fraud;", "corruption;", "theft;", "harassment;", "discrimination;", "intimidation;", "deliberate electoral manipulation;", "misuse of organisational funds;", "deliberate falsification of records; or", "abuse of constitutional authority."])] },
        { num: "22.3", title: "Disciplinary Procedure", content: [p("Disciplinary proceedings shall comply with due process."), p("No disciplinary sanction shall be imposed solely on the basis of an accusation.")] },
        { num: "22.4", title: "Appeals", content: [p("A member disciplined under the Constitution shall have the right to appeal to an independent appellate mechanism established under the Organisation's regulations.")] },
      ],
    },
    {
      num: 23,
      id: "article-23",
      title: "Official Records and Transparency",
      sections: [
        {
          num: "23", title: "Official Records and Transparency", content: [
            p("The Organisation shall maintain:"),
            ol(["membership records;", "minutes of official meetings;", "financial records;", "election records;", "constitutional documents;", "project records; and", "other records required by law."]),
            p("Members shall have reasonable access to non-confidential organisational information."),
          ],
        },
      ],
    },
    {
      num: 24,
      id: "article-24",
      title: "Digital Governance",
      sections: [
        {
          num: "24", title: "Digital Governance", content: [
            p("Because OROKO INTERNATIONAL is an international organisation, digital participation may be used for:"),
            ul(["membership registration;", "meetings;", "consultations;", "elections;", "referenda;", "financial reporting;", "document management; and", "official communication."]),
            p("Digital systems shall provide reasonable safeguards against:"),
            ul(["identity fraud;", "duplicate voting;", "unauthorised access;", "manipulation of results; and", "loss or alteration of official records."]),
          ],
        },
      ],
    },
    {
      num: 25,
      id: "article-25",
      title: "Official Representation",
      sections: [
        { num: "25.1", title: "Principal Representative", content: [p("The President shall ordinarily be the principal representative of OROKO INTERNATIONAL.")] },
        { num: "25.2", title: "Authorised Representation", content: [p("Other officers may represent the Organisation when authorised by the Constitution, Executive Council or General Assembly.")] },
        { num: "25.3", title: "Official Statements", content: [p("No individual shall present a personal opinion as an official position of OROKO INTERNATIONAL without appropriate authority.")] },
      ],
    },
    {
      num: 26,
      id: "article-26",
      title: "Organisational Assets and Intellectual Property",
      sections: [
        {
          num: "26", title: "Organisational Assets and Intellectual Property", content: [
            p("All organisational assets, including:"),
            ul(["funds;", "property;", "documents;", "databases;", "membership records;", "websites;", "applications;", "social media accounts;", "logos;", "intellectual property;", "archives; and", "project materials"]),
            p("shall belong to OROKO INTERNATIONAL and not to individual officers."),
            p("Upon leaving office, an officer shall return all organisational property and access credentials."),
          ],
        },
      ],
    },
    {
      num: 27,
      id: "article-27",
      title: "Transitional Provisions",
      sections: [
        { num: "27.1", title: "Continuity", content: [p("Upon adoption of this Constitution, existing organisational structures and officers shall continue only to the extent that they are not inconsistent with this Constitution.")] },
        { num: "27.2", title: "Transition to Individual Membership", content: [p("Where previous membership structures were based on geographical groups, chapters, branches or collective representation, membership shall progressively be converted into individual registration.")] },
        { num: "27.3", title: "Existing Members", content: [p("Existing members may retain their membership subject to verification and registration under the new membership framework.")] },
        { num: "27.4", title: "Existing Officers", content: [p("Existing officers shall continue in a transitional capacity until elections are conducted under this Constitution, subject to any transitional arrangements approved by the General Assembly.")] },
        { num: "27.5", title: "Transitional Elections", content: [p("The first elections conducted under this Constitution shall be organised by an independent Elections Committee established for that purpose.")] },
        { num: "27.6", title: "Transitional Period", content: [p("The General Assembly may establish a transitional period not exceeding 12 months for the implementation of this Constitution.")] },
        { num: "27.7", title: "Existing Rights", content: [p("The adoption of this Constitution shall not retrospectively invalidate legitimate decisions, contracts or rights lawfully acquired before its commencement, except where necessary to bring the Organisation into compliance with this Constitution or applicable law.")] },
      ],
    },
    {
      num: 28,
      id: "article-28",
      title: "Dissolution",
      sections: [
        { num: "28.1", title: "Decision to Dissolve", content: [p("The Organisation may be dissolved only following a resolution approved by at least 75% of valid votes cast in a referendum expressly convened for that purpose.")] },
        { num: "28.2", title: "Settlement of Liabilities", content: [p("All lawful debts and liabilities shall be settled before distribution or transfer of remaining assets.")] },
        { num: "28.3", title: "Remaining Assets", content: [p("Remaining assets shall be transferred to one or more lawful non-profit, cultural, humanitarian or development organisations whose objectives are substantially compatible with those of OROKO INTERNATIONAL."), p("No remaining assets shall be distributed personally among members.")] },
      ],
    },
    {
      num: 29,
      id: "article-29",
      title: "Interpretation",
      sections: [
        { num: "29.1", title: "Constitutional Interpretation", content: [p("This Constitution shall be interpreted in a manner that promotes:"), ul(["democracy;", "equality;", "unity;", "accountability;", "transparency;", "inclusion;", "due process;", "constitutional supremacy; and", "the long-term interests of the Organisation."])] },
        { num: "29.2", title: "No Implied Powers", content: [p("An organ or officer shall not exercise a power merely because the Constitution does not expressly prohibit it."), p("Authority must derive from:"), ul(["an express constitutional provision;", "a lawful delegation; or", "applicable law."])] },
        { num: "29.3", title: "Conflict Between Rules", content: [p("Where an organisational policy, regulation, resolution or practice conflicts with this Constitution, the Constitution shall prevail.")] },
      ],
    },
    {
      num: 30,
      id: "article-30",
      title: "Adoption and Commencement",
      sections: [
        { num: "30.1", title: "Adoption", content: [p("This Constitution shall be adopted by the required majority of eligible voting members of OROKO INTERNATIONAL.")] },
        { num: "30.2", title: "Commencement", content: [p("It shall enter into force on the date specified in the resolution adopting it.")] },
        { num: "30.3", title: "Binding Effect", content: [p("Upon commencement, this Constitution shall be binding upon all members, officers, committees and organs of OROKO INTERNATIONAL.")] },
      ],
    },
  ],

  schedules: [
    {
      id: "schedule-1",
      num: "Schedule I",
      title: "Summary of Membership Status",
      content: [
        p("Principle: Membership status shall not create different voting weights."),
        {
          type: "list", ordered: false,
          items: [
            "Full Oroko Lineage — Both parents are Oroko · One vote · Presidential eligibility: Yes",
            "Partial Oroko Lineage — At least one parent is Oroko · One vote · Presidential eligibility: Yes",
            "Affiliation — Marriage, legal adoption or recognised affiliation · One vote · Presidential eligibility: No",
          ],
        },
      ],
    },
    {
      id: "schedule-2",
      num: "Schedule II",
      title: "Summary of Governance",
      content: [
        sh("Members → Individual membership"),
        sh("General Assembly — Supreme authority"),
        ul(["Constitution", "Elections", "Major policies", "Budget", "Accountability", "Fundamental decisions"]),
        sh("Executive Council — Executive authority"),
        ul(["Administration", "Implementation", "Programmes", "Representation", "Day-to-day management"]),
        sh("Committees — Specialised oversight and technical functions"),
        ul(["Elections", "Finance & Audit", "Constitutional Review", "Ethics & Discipline", "Culture & Heritage", "Development", "Membership", "Other approved functions"]),
      ],
    },
    {
      id: "schedule-3",
      num: "Schedule III",
      title: "Key Constitutional Thresholds",
      content: [
        {
          type: "list", ordered: false,
          items: [
            "Ordinary General Assembly decision — Simple majority",
            "Extraordinary GA petition — 20% of eligible voters",
            "General Assembly quorum — 1/3 of eligible voters",
            "Referendum petition — 20%",
            "Ordinary referendum — Simple majority",
            "Constitutional amendment — 2/3",
            "Fundamental constitutional entrenchment — 3/4",
            "Presidential removal — 2/3",
            "Other elected officer removal — 2/3",
            "Constitutional dissolution — 3/4",
            "Presidential term — 4 years",
            "Maximum consecutive presidential terms — 2",
            "Minimum age for President — 30 years",
            "Minimum membership for President — 3 consecutive years",
            "Minimum age for other Executive offices — 25 years",
            "Minimum membership for other Executive offices — 1 year",
          ],
        },
      ],
    },
  ],

  finalDeclaration: [
    "We, the members of OROKO INTERNATIONAL, adopt this Constitution in recognition of our shared heritage and our collective responsibility to present and future generations.",
    "We affirm that our Organisation exists not merely to preserve a name or identity, but to transform our collective strength into meaningful action.",
    "We commit ourselves to building a united and empowered Oroko Diaspora, preserving our culture and heritage, creating opportunities for our people, and giving back to Oroko Land through sustainable projects that create lasting value for generations to come.",
    "We further affirm that leadership within OROKO INTERNATIONAL is a trust, not a possession; a responsibility, not a privilege; and a mandate from the members, not a personal entitlement.",
    "The Organisation shall therefore remain governed by its members, protected by its Constitution, strengthened by accountability, and guided by the shared vision of Unity, Identity, Empowerment and Sustainable Development.",
  ],
};
