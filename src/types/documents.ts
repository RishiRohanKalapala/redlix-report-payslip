export interface CompanyInfo {
  name: string;
  address: string;
  email: string;
  phone: string;
}

export interface ClientInfo {
  name: string;
  company: string;
  address: string;
  email: string;
  phone: string;
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

export interface InvoiceData {
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  client: ClientInfo;
  projectName: string;
  projectDescription: string;
  items: InvoiceItem[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  discount: number;
  total: number;
  paymentTerms: string;
  bankDetails: string;
  notes: string;
}

export interface PayslipEarnings {
  basicSalary: number;
  workHours: number;
  hourlyRate: number;
  overtimeHours: number;
  overtimeRate: number;
  bonus: number;
  allowances: number;
}

export interface PayslipDeductions {
  tax: number;
  insurance: number;
  providentFund: number;
  otherDeductions: number;
}

export interface PayslipData {
  payslipNumber: string;
  payPeriod: string;
  payDate: string;
  employeeName: string;
  employeeId: string;
  designation: string;
  department: string;
  earnings: PayslipEarnings;
  deductions: PayslipDeductions;
  grossPay: number;
  totalDeductions: number;
  netPay: number;
}

export interface Deliverable {
  id: string;
  name: string;
  status: "completed" | "in-progress" | "pending";
  notes: string;
}

export interface BugReport {
  id: string;
  title: string;
  description: string;
  status: "fixed" | "open" | "in-progress";
}

export interface ReportData {
  reportNumber: string;
  projectTitle: string;
  clientName: string;
  dateRange: string;
  preparedBy: string;
  preparedDate: string;
  projectOverview: string;
  objectives: string;
  teamMembers: string;
  deliverables: Deliverable[];
  hoursAllocated: number;
  hoursSpent: number;
  budgetAllocated: number;
  actualSpend: number;
  challenges: string;
  solutions: string;
  bugReports: BugReport[];
  nextSteps: string;
  recommendations: string;
  maintenanceNotes: string;
}
