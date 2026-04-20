/**
 * In-memory dummy data store for when MongoDB is not available.
 * Contains realistic Indian election data across 3 constituencies.
 */

const candidates = [
  // ── Varanasi ──
  {
    _id: '1', name: 'Rajesh Kumar', party: 'BJP',
    incumbent: true, past_votes: 674664, criminal_cases: 0,
    assets: 25000000, constituency: 'Varanasi',
    personal_base_score: 0.75, victory_margins: [125000, 98000], local_influence: 0.80,
    past_work: { bills_passed: 12, fund_utilization: 85, projects_completed: 45, attendance_rate: 78 },
    anti_incumbency_score: 0.35, time_in_office: 5,
    community_type: 'Mixed', minority_appeal: 0.45
  },
  {
    _id: '2', name: 'Priya Singh', party: 'INC',
    incumbent: false, past_votes: 309124, criminal_cases: 1,
    assets: 15000000, constituency: 'Varanasi',
    personal_base_score: 0.55, victory_margins: [], local_influence: 0.50,
    past_work: { bills_passed: 0, fund_utilization: 0, projects_completed: 0, attendance_rate: 0 },
    anti_incumbency_score: 0, time_in_office: 0,
    community_type: 'Urban', minority_appeal: 0.65
  },
  {
    _id: '3', name: 'Amit Sharma', party: 'AAP',
    incumbent: false, past_votes: 189234, criminal_cases: 0,
    assets: 8000000, constituency: 'Varanasi',
    personal_base_score: 0.60, victory_margins: [], local_influence: 0.55,
    past_work: { bills_passed: 0, fund_utilization: 0, projects_completed: 0, attendance_rate: 0 },
    anti_incumbency_score: 0, time_in_office: 0,
    community_type: 'Urban', minority_appeal: 0.50
  },
  {
    _id: '4', name: 'Ravi Patel', party: 'BSP',
    incumbent: false, past_votes: 143567, criminal_cases: 2,
    assets: 32000000, constituency: 'Varanasi',
    personal_base_score: 0.40, victory_margins: [], local_influence: 0.35,
    past_work: { bills_passed: 0, fund_utilization: 0, projects_completed: 0, attendance_rate: 0 },
    anti_incumbency_score: 0, time_in_office: 0,
    community_type: 'Rural', minority_appeal: 0.70
  },

  // ── Mumbai North ──
  {
    _id: '5', name: 'Sanjay Deshmukh', party: 'BJP',
    incumbent: true, past_votes: 543249, criminal_cases: 0,
    assets: 45000000, constituency: 'Mumbai North',
    personal_base_score: 0.70, victory_margins: [85000], local_influence: 0.75,
    past_work: { bills_passed: 8, fund_utilization: 72, projects_completed: 32, attendance_rate: 82 },
    anti_incumbency_score: 0.25, time_in_office: 5,
    community_type: 'Urban', minority_appeal: 0.40
  },
  {
    _id: '6', name: 'Meera Patil', party: 'INC',
    incumbent: false, past_votes: 287432, criminal_cases: 0,
    assets: 12000000, constituency: 'Mumbai North',
    personal_base_score: 0.50, victory_margins: [], local_influence: 0.45,
    past_work: { bills_passed: 0, fund_utilization: 0, projects_completed: 0, attendance_rate: 0 },
    anti_incumbency_score: 0, time_in_office: 0,
    community_type: 'Urban', minority_appeal: 0.55
  },
  {
    _id: '7', name: 'Deepak Jadhav', party: 'AAP',
    incumbent: false, past_votes: 156789, criminal_cases: 1,
    assets: 18000000, constituency: 'Mumbai North',
    personal_base_score: 0.45, victory_margins: [], local_influence: 0.40,
    past_work: { bills_passed: 0, fund_utilization: 0, projects_completed: 0, attendance_rate: 0 },
    anti_incumbency_score: 0, time_in_office: 0,
    community_type: 'Urban', minority_appeal: 0.50
  },

  // ── New Delhi ──
  {
    _id: '8', name: 'Anita Verma', party: 'BJP',
    incumbent: false, past_votes: 412345, criminal_cases: 0,
    assets: 28000000, constituency: 'New Delhi',
    personal_base_score: 0.65, victory_margins: [45000], local_influence: 0.60,
    past_work: { bills_passed: 5, fund_utilization: 68, projects_completed: 18, attendance_rate: 75 },
    anti_incumbency_score: 0, time_in_office: 0,
    community_type: 'Urban', minority_appeal: 0.45
  },
  {
    _id: '9', name: 'Vikram Chauhan', party: 'AAP',
    incumbent: true, past_votes: 487492, criminal_cases: 0,
    assets: 9000000, constituency: 'New Delhi',
    personal_base_score: 0.80, victory_margins: [75000, 62000], local_influence: 0.85,
    past_work: { bills_passed: 15, fund_utilization: 92, projects_completed: 58, attendance_rate: 88 },
    anti_incumbency_score: 0.15, time_in_office: 10,
    community_type: 'Urban', minority_appeal: 0.60
  },
  {
    _id: '10', name: 'Sunita Kapoor', party: 'INC',
    incumbent: false, past_votes: 312847, criminal_cases: 0,
    assets: 35000000, constituency: 'New Delhi',
    personal_base_score: 0.55, victory_margins: [], local_influence: 0.50,
    past_work: { bills_passed: 0, fund_utilization: 0, projects_completed: 0, attendance_rate: 0 },
    anti_incumbency_score: 0, time_in_office: 0,
    community_type: 'Urban', minority_appeal: 0.50
  },
  {
    _id: '11', name: 'Ramesh Gupta', party: 'BSP',
    incumbent: false, past_votes: 98543, criminal_cases: 3,
    assets: 42000000, constituency: 'New Delhi',
    personal_base_score: 0.35, victory_margins: [], local_influence: 0.30,
    past_work: { bills_passed: 0, fund_utilization: 0, projects_completed: 0, attendance_rate: 0 },
    anti_incumbency_score: 0, time_in_office: 0,
    community_type: 'Mixed', minority_appeal: 0.75
  }
];

const demographics = [
  {
    _id: '1',
    constituency: 'Varanasi',
    caste_distribution: { General: 35, OBC: 40, SC: 15, ST: 10 },
    religion_distribution: { Hindu: 75, Muslim: 20, Others: 5 },
    expected_turnout: 68,
    swing_voter_percentage: 18,
    urban_rural_split: { urban: 45, rural: 55 },
    total_wards: 85,
    total_booths: 1450
  },
  {
    _id: '2',
    constituency: 'Mumbai North',
    caste_distribution: { General: 45, OBC: 30, SC: 15, ST: 10 },
    religion_distribution: { Hindu: 65, Muslim: 20, Christian: 10, Others: 5 },
    expected_turnout: 62,
    swing_voter_percentage: 22,
    urban_rural_split: { urban: 90, rural: 10 },
    total_wards: 120,
    total_booths: 1850
  },
  {
    _id: '3',
    constituency: 'New Delhi',
    caste_distribution: { General: 40, OBC: 35, SC: 15, ST: 10 },
    religion_distribution: { Hindu: 70, Muslim: 15, Sikh: 10, Others: 5 },
    expected_turnout: 65,
    swing_voter_percentage: 20,
    urban_rural_split: { urban: 95, rural: 5 },
    total_wards: 95,
    total_booths: 1620
  }
];

const sentiments = [
  // Varanasi candidates
  { _id: '1', candidate_id: '1', positive: 65, negative: 20, neutral: 15 },
  { _id: '2', candidate_id: '2', positive: 45, negative: 35, neutral: 20 },
  { _id: '3', candidate_id: '3', positive: 50, negative: 25, neutral: 25 },
  { _id: '4', candidate_id: '4', positive: 30, negative: 45, neutral: 25 },
  // Mumbai North candidates
  { _id: '5', candidate_id: '5', positive: 60, negative: 25, neutral: 15 },
  { _id: '6', candidate_id: '6', positive: 40, negative: 35, neutral: 25 },
  { _id: '7', candidate_id: '7', positive: 35, negative: 40, neutral: 25 },
  // New Delhi candidates
  { _id: '8', candidate_id: '8', positive: 55, negative: 25, neutral: 20 },
  { _id: '9', candidate_id: '9', positive: 58, negative: 22, neutral: 20 },
  { _id: '10', candidate_id: '10', positive: 42, negative: 33, neutral: 25 },
  { _id: '11', candidate_id: '11', positive: 25, negative: 50, neutral: 25 }
];

module.exports = { candidates, demographics, sentiments };
