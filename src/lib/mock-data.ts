export interface Mikrotik {
  id: string;
  name: string;
  ip_address: string;
  username: string;
  is_active: boolean;
  total_users: number;
  active_users: number;
  balance: number;
}

export interface WifiUser {
  id: string;
  username: string;
  mikrotik_id: string;
  mikrotik_name: string;
  is_active: boolean;
  is_blocked: boolean;
  created_at: string;
}

export interface Withdrawal {
  id: string;
  amount: number;
  fees: number;
  net_amount: number;
  phone_number: string;
  status: "completed" | "pending" | "failed";
  created_at: string;
}

export interface Owner {
  id: string;
  name: string;
  email: string;
  phone: string;
  is_blocked: boolean;
  mikrotik_count: number;
  total_balance: number;
}

export interface Deposit {
  id: string;
  client_phone: string;
  amount: number;
  mikrotik_name: string;
  created_at: string;
}

export const mockMikrotiks: Mikrotik[] = [
  { id: "1", name: "Zone A - Centre", ip_address: "192.168.1.1", username: "admin", is_active: true, total_users: 45, active_users: 23, balance: 125000 },
  { id: "2", name: "Zone B - Marché", ip_address: "192.168.2.1", username: "admin", is_active: true, total_users: 78, active_users: 42, balance: 230000 },
  { id: "3", name: "Zone C - Gare", ip_address: "192.168.3.1", username: "admin", is_active: false, total_users: 12, active_users: 0, balance: 45000 },
];

export const mockUsers: WifiUser[] = [
  { id: "1", username: "client_001", mikrotik_id: "1", mikrotik_name: "Zone A", is_active: true, is_blocked: false, created_at: "2024-01-15" },
  { id: "2", username: "client_002", mikrotik_id: "1", mikrotik_name: "Zone A", is_active: false, is_blocked: true, created_at: "2024-01-20" },
  { id: "3", username: "client_003", mikrotik_id: "2", mikrotik_name: "Zone B", is_active: true, is_blocked: false, created_at: "2024-02-01" },
  { id: "4", username: "client_004", mikrotik_id: "2", mikrotik_name: "Zone B", is_active: true, is_blocked: false, created_at: "2024-02-10" },
  { id: "5", username: "client_005", mikrotik_id: "3", mikrotik_name: "Zone C", is_active: false, is_blocked: false, created_at: "2024-03-05" },
];

export const mockWithdrawals: Withdrawal[] = [
  { id: "1", amount: 50000, fees: 10000, net_amount: 40000, phone_number: "691234567", status: "completed", created_at: "2024-03-01" },
  { id: "2", amount: 100000, fees: 20000, net_amount: 80000, phone_number: "691234567", status: "completed", created_at: "2024-03-10" },
  { id: "3", amount: 30000, fees: 6000, net_amount: 24000, phone_number: "691234567", status: "pending", created_at: "2024-03-15" },
];

export const mockOwners: Owner[] = [
  { id: "1", name: "Jean Dupont", email: "jean@example.com", phone: "691234567", is_blocked: false, mikrotik_count: 2, total_balance: 355000 },
  { id: "2", name: "Marie Claire", email: "marie@example.com", phone: "698765432", is_blocked: false, mikrotik_count: 1, total_balance: 120000 },
  { id: "3", name: "Paul Martin", email: "paul@example.com", phone: "677889900", is_blocked: true, mikrotik_count: 3, total_balance: 0 },
];

export const mockDeposits: Deposit[] = [
  { id: "1", client_phone: "670112233", amount: 500, mikrotik_name: "Zone A", created_at: "2024-03-15 10:30" },
  { id: "2", client_phone: "655443322", amount: 1000, mikrotik_name: "Zone A", created_at: "2024-03-15 11:00" },
  { id: "3", client_phone: "699887766", amount: 500, mikrotik_name: "Zone B", created_at: "2024-03-15 12:15" },
];
