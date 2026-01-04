import { useState, useEffect } from "react";
import { Download } from "lucide-react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { usePdfExport } from "@/hooks/usePdfExport";
import type { PayslipData } from "@/types/documents";

const generatePayslipNumber = () => {
  const date = new Date();
  return `PAY-${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, "0")}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
};

const initialData: PayslipData = {
  payslipNumber: generatePayslipNumber(),
  payPeriod: new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" }),
  payDate: new Date().toISOString().split("T")[0],
  employeeName: "",
  employeeId: "",
  designation: "",
  department: "",
  earnings: {
    basicSalary: 0,
    workHours: 0,
    hourlyRate: 0,
    overtimeHours: 0,
    overtimeRate: 0,
    bonus: 0,
    allowances: 0,
  },
  deductions: {
    tax: 0,
    insurance: 0,
    providentFund: 0,
    otherDeductions: 0,
  },
  grossPay: 0,
  totalDeductions: 0,
  netPay: 0,
};

export default function PayslipGenerator() {
  const [data, setData] = useState<PayslipData>(initialData);
  const { exportToPdf, isExporting } = usePdfExport();

  useEffect(() => {
    const { earnings, deductions } = data;
    const workPay = earnings.workHours * earnings.hourlyRate;
    const overtimePay = earnings.overtimeHours * earnings.overtimeRate;
    const grossPay = earnings.basicSalary + workPay + overtimePay + earnings.bonus + earnings.allowances;
    const totalDeductions = deductions.tax + deductions.insurance + deductions.providentFund + deductions.otherDeductions;
    const netPay = grossPay - totalDeductions;
    setData((prev) => ({ ...prev, grossPay, totalDeductions, netPay }));
  }, [data.earnings, data.deductions]);

  const updateEarnings = (field: keyof PayslipData["earnings"], value: number) => {
    setData((prev) => ({ ...prev, earnings: { ...prev.earnings, [field]: value } }));
  };

  const updateDeductions = (field: keyof PayslipData["deductions"], value: number) => {
    setData((prev) => ({ ...prev, deductions: { ...prev.deductions, [field]: value } }));
  };

  return (
    <Layout>
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Form Section */}
        <div className="space-y-6 no-print">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Payslip Generator</h1>
            <p className="text-muted-foreground">Create developer payslips with detailed breakdowns</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Payslip Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>Payslip Number</Label>
                  <Input value={data.payslipNumber} onChange={(e) => setData((prev) => ({ ...prev, payslipNumber: e.target.value }))} />
                </div>
                <div>
                  <Label>Pay Period</Label>
                  <Input value={data.payPeriod} onChange={(e) => setData((prev) => ({ ...prev, payPeriod: e.target.value }))} placeholder="January 2024" />
                </div>
                <div>
                  <Label>Pay Date</Label>
                  <Input type="date" value={data.payDate} onChange={(e) => setData((prev) => ({ ...prev, payDate: e.target.value }))} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Employee Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Employee Name</Label>
                  <Input value={data.employeeName} onChange={(e) => setData((prev) => ({ ...prev, employeeName: e.target.value }))} placeholder="Jane Smith" />
                </div>
                <div>
                  <Label>Employee ID</Label>
                  <Input value={data.employeeId} onChange={(e) => setData((prev) => ({ ...prev, employeeId: e.target.value }))} placeholder="EMP-001" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Designation</Label>
                  <Input value={data.designation} onChange={(e) => setData((prev) => ({ ...prev, designation: e.target.value }))} placeholder="Senior Developer" />
                </div>
                <div>
                  <Label>Department</Label>
                  <Input value={data.department} onChange={(e) => setData((prev) => ({ ...prev, department: e.target.value }))} placeholder="Engineering" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Earnings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Basic Salary</Label>
                <Input type="number" min="0" value={data.earnings.basicSalary} onChange={(e) => updateEarnings("basicSalary", parseFloat(e.target.value) || 0)} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Work Hours</Label>
                  <Input type="number" min="0" value={data.earnings.workHours} onChange={(e) => updateEarnings("workHours", parseFloat(e.target.value) || 0)} />
                </div>
                <div>
                  <Label>Hourly Rate</Label>
                  <Input type="number" min="0" value={data.earnings.hourlyRate} onChange={(e) => updateEarnings("hourlyRate", parseFloat(e.target.value) || 0)} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Overtime Hours</Label>
                  <Input type="number" min="0" value={data.earnings.overtimeHours} onChange={(e) => updateEarnings("overtimeHours", parseFloat(e.target.value) || 0)} />
                </div>
                <div>
                  <Label>Overtime Rate</Label>
                  <Input type="number" min="0" value={data.earnings.overtimeRate} onChange={(e) => updateEarnings("overtimeRate", parseFloat(e.target.value) || 0)} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Bonus</Label>
                  <Input type="number" min="0" value={data.earnings.bonus} onChange={(e) => updateEarnings("bonus", parseFloat(e.target.value) || 0)} />
                </div>
                <div>
                  <Label>Allowances</Label>
                  <Input type="number" min="0" value={data.earnings.allowances} onChange={(e) => updateEarnings("allowances", parseFloat(e.target.value) || 0)} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Deductions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Tax</Label>
                  <Input type="number" min="0" value={data.deductions.tax} onChange={(e) => updateDeductions("tax", parseFloat(e.target.value) || 0)} />
                </div>
                <div>
                  <Label>Insurance</Label>
                  <Input type="number" min="0" value={data.deductions.insurance} onChange={(e) => updateDeductions("insurance", parseFloat(e.target.value) || 0)} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Provident Fund (PF)</Label>
                  <Input type="number" min="0" value={data.deductions.providentFund} onChange={(e) => updateDeductions("providentFund", parseFloat(e.target.value) || 0)} />
                </div>
                <div>
                  <Label>Other Deductions</Label>
                  <Input type="number" min="0" value={data.deductions.otherDeductions} onChange={(e) => updateDeductions("otherDeductions", parseFloat(e.target.value) || 0)} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Button onClick={() => exportToPdf("payslip-preview", `payslip-${data.payslipNumber}`)} disabled={isExporting} className="w-full" size="lg">
            <Download className="w-4 h-4 mr-2" />
            {isExporting ? "Generating PDF..." : "Download PDF"}
          </Button>
        </div>

        {/* Preview Section */}
        <div className="lg:sticky lg:top-24 lg:h-fit">
          <div id="payslip-preview" className="bg-white text-black p-8 shadow-lg rounded-lg border">
            <div className="flex items-center justify-between border-b border-gray-200 pb-6 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-teal-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-2xl">R</span>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Redlix</h1>
                  <p className="text-sm text-gray-500">Professional Document Solutions</p>
                </div>
              </div>
              <div className="text-right">
                <h2 className="text-2xl font-bold text-teal-600">PAYSLIP</h2>
                <p className="text-sm text-gray-500">{data.payslipNumber}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8 mb-8">
              <div className="space-y-2">
                <p><span className="text-gray-500">Employee:</span> <span className="font-medium">{data.employeeName || "Employee Name"}</span></p>
                <p><span className="text-gray-500">ID:</span> <span className="font-medium">{data.employeeId || "—"}</span></p>
                <p><span className="text-gray-500">Designation:</span> <span className="font-medium">{data.designation || "—"}</span></p>
                <p><span className="text-gray-500">Department:</span> <span className="font-medium">{data.department || "—"}</span></p>
              </div>
              <div className="text-right space-y-2">
                <p><span className="text-gray-500">Pay Period:</span> <span className="font-medium">{data.payPeriod}</span></p>
                <p><span className="text-gray-500">Pay Date:</span> <span className="font-medium">{data.payDate}</span></p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8 mb-8">
              {/* Earnings */}
              <div>
                <h3 className="font-semibold text-gray-900 border-b border-gray-200 pb-2 mb-3">Earnings</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Basic Salary</span>
                    <span className="font-medium">${data.earnings.basicSalary.toFixed(2)}</span>
                  </div>
                  {data.earnings.workHours > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Work Hours ({data.earnings.workHours} × ${data.earnings.hourlyRate})</span>
                      <span className="font-medium">${(data.earnings.workHours * data.earnings.hourlyRate).toFixed(2)}</span>
                    </div>
                  )}
                  {data.earnings.overtimeHours > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Overtime ({data.earnings.overtimeHours} × ${data.earnings.overtimeRate})</span>
                      <span className="font-medium">${(data.earnings.overtimeHours * data.earnings.overtimeRate).toFixed(2)}</span>
                    </div>
                  )}
                  {data.earnings.bonus > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Bonus</span>
                      <span className="font-medium">${data.earnings.bonus.toFixed(2)}</span>
                    </div>
                  )}
                  {data.earnings.allowances > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Allowances</span>
                      <span className="font-medium">${data.earnings.allowances.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between border-t border-gray-200 pt-2 font-semibold">
                    <span>Gross Pay</span>
                    <span className="text-teal-600">${data.grossPay.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Deductions */}
              <div>
                <h3 className="font-semibold text-gray-900 border-b border-gray-200 pb-2 mb-3">Deductions</h3>
                <div className="space-y-2 text-sm">
                  {data.deductions.tax > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tax</span>
                      <span className="font-medium">${data.deductions.tax.toFixed(2)}</span>
                    </div>
                  )}
                  {data.deductions.insurance > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Insurance</span>
                      <span className="font-medium">${data.deductions.insurance.toFixed(2)}</span>
                    </div>
                  )}
                  {data.deductions.providentFund > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Provident Fund</span>
                      <span className="font-medium">${data.deductions.providentFund.toFixed(2)}</span>
                    </div>
                  )}
                  {data.deductions.otherDeductions > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Other Deductions</span>
                      <span className="font-medium">${data.deductions.otherDeductions.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between border-t border-gray-200 pt-2 font-semibold">
                    <span>Total Deductions</span>
                    <span className="text-red-600">${data.totalDeductions.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 text-center">
              <p className="text-gray-500 text-sm mb-1">Net Pay</p>
              <p className="text-4xl font-bold text-teal-600">${data.netPay.toFixed(2)}</p>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200 text-center text-xs text-gray-400">
              <p>This is a computer-generated document. No signature required.</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
