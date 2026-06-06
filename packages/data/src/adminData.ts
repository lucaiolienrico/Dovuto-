import type { AdminUser, MRRDataPoint, ActivityLog, PlanDistribution } from './types'

export const ADMIN_CREDENTIALS = {
  email: 'admin@dovuto.it',
  password: 'admin2024',
}

export const MOCK_USERS: AdminUser[] = [
  { id: 1,  name: 'Enrico Lucaioli',  email: 'enrico@example.com',   plan: 'pro',      status: 'active',   joined: '2024-01-15', lastSeen: '2024-06-16', deadlines: 16, mrr: 12.90, avatar: 'EL' },
  { id: 2,  name: 'Marco Rossi',      email: 'marco@example.com',    plan: 'personal', status: 'active',   joined: '2024-02-03', lastSeen: '2024-06-15', deadlines: 8,  mrr: 3.90,  avatar: 'MR' },
  { id: 3,  name: 'Giulia Trombetti', email: 'giulia@example.com',   plan: 'famiglia', status: 'active',   joined: '2024-02-18', lastSeen: '2024-06-14', deadlines: 22, mrr: 6.90,  avatar: 'GT' },
  { id: 4,  name: 'Luca Ferrari',     email: 'luca@example.com',     plan: 'free',     status: 'active',   joined: '2024-03-05', lastSeen: '2024-06-10', deadlines: 7,  mrr: 0,     avatar: 'LF' },
  { id: 5,  name: 'Anna Bianchi',     email: 'anna@example.com',     plan: 'personal', status: 'active',   joined: '2024-03-12', lastSeen: '2024-06-16', deadlines: 11, mrr: 3.90,  avatar: 'AB' },
  { id: 6,  name: 'Roberto Neri',     email: 'roberto@example.com',  plan: 'free',     status: 'churned',  joined: '2024-03-20', lastSeen: '2024-05-01', deadlines: 3,  mrr: 0,     avatar: 'RN' },
  { id: 7,  name: 'Sofia Conti',      email: 'sofia@example.com',    plan: 'famiglia', status: 'active',   joined: '2024-04-01', lastSeen: '2024-06-13', deadlines: 19, mrr: 6.90,  avatar: 'SC' },
  { id: 8,  name: 'Davide Marini',    email: 'davide@example.com',   plan: 'personal', status: 'trial',    joined: '2024-06-10', lastSeen: '2024-06-16', deadlines: 5,  mrr: 3.90,  avatar: 'DM' },
  { id: 9,  name: 'Chiara Lombardi',  email: 'chiara@example.com',   plan: 'pro',      status: 'active',   joined: '2024-04-22', lastSeen: '2024-06-15', deadlines: 28, mrr: 12.90, avatar: 'CL' },
  { id: 10, name: 'Federico Galli',   email: 'federico@example.com', plan: 'free',     status: 'active',   joined: '2024-05-03', lastSeen: '2024-06-12', deadlines: 6,  mrr: 0,     avatar: 'FG' },
  { id: 11, name: 'Valentina Russo',  email: 'valentina@example.com',plan: 'personal', status: 'active',   joined: '2024-05-14', lastSeen: '2024-06-16', deadlines: 9,  mrr: 3.90,  avatar: 'VR' },
  { id: 12, name: 'Pietro Esposito',  email: 'pietro@example.com',   plan: 'famiglia', status: 'past_due', joined: '2024-04-08', lastSeen: '2024-06-08', deadlines: 14, mrr: 6.90,  avatar: 'PE' },
]

export const MRR_DATA: MRRDataPoint[] = [
  { month: 'Gen', mrr: 120,  users: 12  },
  { month: 'Feb', mrr: 198,  users: 21  },
  { month: 'Mar', mrr: 340,  users: 38  },
  { month: 'Apr', mrr: 520,  users: 56  },
  { month: 'Mag', mrr: 780,  users: 89  },
  { month: 'Giu', mrr: 1041, users: 112 },
]

export const ACTIVITY_LOGS: ActivityLog[] = [
  { id: 1, user: 'Davide Marini',   action: 'signup',         detail: 'Registrazione nuovo account',       time: '5 min fa',   type: 'success' },
  { id: 2, user: 'Anna Bianchi',    action: 'upgrade',        detail: 'Free → Personal (mensile)',          time: '23 min fa',  type: 'revenue' },
  { id: 3, user: 'Pietro Esposito', action: 'payment_failed', detail: 'Pagamento fallito — carta scaduta',  time: '1 ora fa',   type: 'warning' },
  { id: 4, user: 'Chiara Lombardi', action: 'deadline_add',   detail: 'Aggiunta scadenza: Bollo auto',      time: '2 ore fa',   type: 'info'    },
  { id: 5, user: 'Roberto Neri',    action: 'churn',          detail: 'Account cancellato — motivo: prezzo',time: '1 giorno fa',type: 'danger'  },
  { id: 6, user: 'Sofia Conti',     action: 'upgrade',        detail: 'Personal → Famiglia (annuale)',      time: '1 giorno fa',type: 'revenue' },
  { id: 7, user: 'Marco Rossi',     action: 'login',          detail: 'Accesso da Milano, IT',              time: '2 giorni fa',type: 'info'    },
  { id: 8, user: 'Giulia Trombetti',action: 'export',         detail: 'Export PDF scadenzario annuale',     time: '2 giorni fa',type: 'info'    },
]

export const PLAN_DISTRIBUTION: PlanDistribution[] = [
  { plan: 'Free',     count: 4, color: '#94a3b8', pct: 33 },
  { plan: 'Personal', count: 4, color: '#6366f1', pct: 33 },
  { plan: 'Famiglia', count: 3, color: '#10b981', pct: 25 },
  { plan: 'Pro',      count: 2, color: '#8b5cf6', pct: 17 },
]
