import { useState } from "react";
import { Plus, Trash2, Download } from "lucide-react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { usePdfExport } from "@/hooks/usePdfExport";
import type { ReportData, Deliverable, BugReport } from "@/types/documents";

const generateReportNumber = () => {
  const date = new Date();
  return `RPT-${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, "0")}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
};

const initialData: ReportData = {
  reportNumber: generateReportNumber(),
  projectTitle: "",
  clientName: "",
  dateRange: "",
  preparedBy: "",
  preparedDate: new Date().toISOString().split("T")[0],
  projectOverview: "",
  objectives: "",
  teamMembers: "",
  deliverables: [{ id: "1", name: "", status: "completed", notes: "" }],
  hoursAllocated: 0,
  hoursSpent: 0,
  budgetAllocated: 0,
  actualSpend: 0,
  challenges: "",
  solutions: "",
  bugReports: [{ id: "1", title: "", description: "", status: "fixed" }],
  nextSteps: "",
  recommendations: "",
  maintenanceNotes: "",
};

export default function ReportGenerator() {
  const [data, setData] = useState<ReportData>(initialData);
  const { exportToPdf, isExporting } = usePdfExport();

  const addDeliverable = () => {
    const newItem: Deliverable = { id: Date.now().toString(), name: "", status: "completed", notes: "" };
    setData((prev) => ({ ...prev, deliverables: [...prev.deliverables, newItem] }));
  };

  const removeDeliverable = (id: string) => {
    if (data.deliverables.length > 1) {
      setData((prev) => ({ ...prev, deliverables: prev.deliverables.filter((d) => d.id !== id) }));
    }
  };

  const updateDeliverable = (id: string, field: keyof Deliverable, value: string) => {
    setData((prev) => ({
      ...prev,
      deliverables: prev.deliverables.map((d) => (d.id === id ? { ...d, [field]: value } : d)),
    }));
  };

  const addBugReport = () => {
    const newItem: BugReport = { id: Date.now().toString(), title: "", description: "", status: "fixed" };
    setData((prev) => ({ ...prev, bugReports: [...prev.bugReports, newItem] }));
  };

  const removeBugReport = (id: string) => {
    if (data.bugReports.length > 1) {
      setData((prev) => ({ ...prev, bugReports: prev.bugReports.filter((b) => b.id !== id) }));
    }
  };

  const updateBugReport = (id: string, field: keyof BugReport, value: string) => {
    setData((prev) => ({
      ...prev,
      bugReports: prev.bugReports.map((b) => (b.id === id ? { ...b, [field]: value } : b)),
    }));
  };

  const hoursVariance = data.hoursSpent - data.hoursAllocated;
  const budgetVariance = data.actualSpend - data.budgetAllocated;

  return (
    <Layout>
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Form Section */}
        <div className="space-y-6 no-print">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Project Report Generator</h1>
            <p className="text-muted-foreground">Create comprehensive final project reports</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Report Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Report Number</Label>
                  <Input value={data.reportNumber} onChange={(e) => setData((prev) => ({ ...prev, reportNumber: e.target.value }))} />
                </div>
                <div>
                  <Label>Prepared Date</Label>
                  <Input type="date" value={data.preparedDate} onChange={(e) => setData((prev) => ({ ...prev, preparedDate: e.target.value }))} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Project Title</Label>
                  <Input value={data.projectTitle} onChange={(e) => setData((prev) => ({ ...prev, projectTitle: e.target.value }))} placeholder="E-commerce Platform Redesign" />
                </div>
                <div>
                  <Label>Client Name</Label>
                  <Input value={data.clientName} onChange={(e) => setData((prev) => ({ ...prev, clientName: e.target.value }))} placeholder="Acme Corporation" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Date Range</Label>
                  <Input value={data.dateRange} onChange={(e) => setData((prev) => ({ ...prev, dateRange: e.target.value }))} placeholder="Jan 2024 - Mar 2024" />
                </div>
                <div>
                  <Label>Prepared By</Label>
                  <Input value={data.preparedBy} onChange={(e) => setData((prev) => ({ ...prev, preparedBy: e.target.value }))} placeholder="Your Name" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Project Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Project Overview</Label>
                <Textarea value={data.projectOverview} onChange={(e) => setData((prev) => ({ ...prev, projectOverview: e.target.value }))} placeholder="Brief description of the project..." rows={3} />
              </div>
              <div>
                <Label>Objectives</Label>
                <Textarea value={data.objectives} onChange={(e) => setData((prev) => ({ ...prev, objectives: e.target.value }))} placeholder="Key objectives of the project..." rows={2} />
              </div>
              <div>
                <Label>Team Members</Label>
                <Input value={data.teamMembers} onChange={(e) => setData((prev) => ({ ...prev, teamMembers: e.target.value }))} placeholder="John Doe, Jane Smith, Bob Johnson" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Deliverables</CardTitle>
              <Button size="sm" variant="outline" onClick={addDeliverable}>
                <Plus className="w-4 h-4 mr-1" /> Add
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {data.deliverables.map((item) => (
                <div key={item.id} className="grid grid-cols-12 gap-2 items-end">
                  <div className="col-span-4">
                    <Label>Name</Label>
                    <Input value={item.name} onChange={(e) => updateDeliverable(item.id, "name", e.target.value)} placeholder="Feature name" />
                  </div>
                  <div className="col-span-3">
                    <Label>Status</Label>
                    <Select value={item.status} onValueChange={(value) => updateDeliverable(item.id, "status", value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-4">
                    <Label>Notes</Label>
                    <Input value={item.notes} onChange={(e) => updateDeliverable(item.id, "notes", e.target.value)} placeholder="Notes" />
                  </div>
                  <div className="col-span-1">
                    <Button size="icon" variant="ghost" onClick={() => removeDeliverable(item.id)} disabled={data.deliverables.length === 1}>
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Time & Budget Analysis</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Hours Allocated</Label>
                  <Input type="number" min="0" value={data.hoursAllocated} onChange={(e) => setData((prev) => ({ ...prev, hoursAllocated: parseFloat(e.target.value) || 0 }))} />
                </div>
                <div>
                  <Label>Hours Spent</Label>
                  <Input type="number" min="0" value={data.hoursSpent} onChange={(e) => setData((prev) => ({ ...prev, hoursSpent: parseFloat(e.target.value) || 0 }))} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Budget Allocated ($)</Label>
                  <Input type="number" min="0" value={data.budgetAllocated} onChange={(e) => setData((prev) => ({ ...prev, budgetAllocated: parseFloat(e.target.value) || 0 }))} />
                </div>
                <div>
                  <Label>Actual Spend ($)</Label>
                  <Input type="number" min="0" value={data.actualSpend} onChange={(e) => setData((prev) => ({ ...prev, actualSpend: parseFloat(e.target.value) || 0 }))} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Challenges & Solutions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Challenges Faced</Label>
                <Textarea value={data.challenges} onChange={(e) => setData((prev) => ({ ...prev, challenges: e.target.value }))} placeholder="Describe any challenges encountered..." rows={3} />
              </div>
              <div>
                <Label>Solutions Implemented</Label>
                <Textarea value={data.solutions} onChange={(e) => setData((prev) => ({ ...prev, solutions: e.target.value }))} placeholder="How challenges were resolved..." rows={3} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Bug Reports & Updates</CardTitle>
              <Button size="sm" variant="outline" onClick={addBugReport}>
                <Plus className="w-4 h-4 mr-1" /> Add
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {data.bugReports.map((item) => (
                <div key={item.id} className="grid grid-cols-12 gap-2 items-end">
                  <div className="col-span-3">
                    <Label>Title</Label>
                    <Input value={item.title} onChange={(e) => updateBugReport(item.id, "title", e.target.value)} placeholder="Bug title" />
                  </div>
                  <div className="col-span-5">
                    <Label>Description</Label>
                    <Input value={item.description} onChange={(e) => updateBugReport(item.id, "description", e.target.value)} placeholder="Brief description" />
                  </div>
                  <div className="col-span-3">
                    <Label>Status</Label>
                    <Select value={item.status} onValueChange={(value) => updateBugReport(item.id, "status", value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fixed">Fixed</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="open">Open</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-1">
                    <Button size="icon" variant="ghost" onClick={() => removeBugReport(item.id)} disabled={data.bugReports.length === 1}>
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Next Steps</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Next Steps / Future Scope</Label>
                <Textarea value={data.nextSteps} onChange={(e) => setData((prev) => ({ ...prev, nextSteps: e.target.value }))} placeholder="Upcoming tasks or future development..." rows={3} />
              </div>
              <div>
                <Label>Recommendations</Label>
                <Textarea value={data.recommendations} onChange={(e) => setData((prev) => ({ ...prev, recommendations: e.target.value }))} placeholder="Suggestions for improvement..." rows={2} />
              </div>
              <div>
                <Label>Maintenance Notes</Label>
                <Textarea value={data.maintenanceNotes} onChange={(e) => setData((prev) => ({ ...prev, maintenanceNotes: e.target.value }))} placeholder="Ongoing maintenance requirements..." rows={2} />
              </div>
            </CardContent>
          </Card>

          <Button onClick={() => exportToPdf("report-preview", `report-${data.reportNumber}`)} disabled={isExporting} className="w-full" size="lg">
            <Download className="w-4 h-4 mr-2" />
            {isExporting ? "Generating PDF..." : "Download PDF"}
          </Button>
        </div>

        {/* Preview Section */}
        <div className="lg:sticky lg:top-24 lg:h-fit overflow-auto max-h-[calc(100vh-8rem)]">
          <div id="report-preview" className="bg-white text-black p-8 shadow-lg rounded-lg border">
            <div className="flex items-center justify-between border-b border-gray-200 pb-6 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-2xl">R</span>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Redlix</h1>
                  <p className="text-sm text-gray-500">Professional Document Solutions</p>
                </div>
              </div>
              <div className="text-right">
                <h2 className="text-2xl font-bold text-green-600">PROJECT REPORT</h2>
                <p className="text-sm text-gray-500">{data.reportNumber}</p>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-2">{data.projectTitle || "Project Title"}</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <p><span className="text-gray-500">Client:</span> <span className="font-medium">{data.clientName || "—"}</span></p>
                <p><span className="text-gray-500">Date Range:</span> <span className="font-medium">{data.dateRange || "—"}</span></p>
                <p><span className="text-gray-500">Prepared By:</span> <span className="font-medium">{data.preparedBy || "—"}</span></p>
                <p><span className="text-gray-500">Report Date:</span> <span className="font-medium">{data.preparedDate}</span></p>
              </div>
            </div>

            {data.projectOverview && (
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 border-b border-gray-200 pb-2 mb-2">Project Overview</h4>
                <p className="text-gray-600 text-sm whitespace-pre-line">{data.projectOverview}</p>
              </div>
            )}

            {data.objectives && (
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 border-b border-gray-200 pb-2 mb-2">Objectives</h4>
                <p className="text-gray-600 text-sm whitespace-pre-line">{data.objectives}</p>
              </div>
            )}

            {data.teamMembers && (
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 border-b border-gray-200 pb-2 mb-2">Team Members</h4>
                <p className="text-gray-600 text-sm">{data.teamMembers}</p>
              </div>
            )}

            <div className="mb-6">
              <h4 className="font-semibold text-gray-900 border-b border-gray-200 pb-2 mb-2">Deliverables Summary</h4>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left py-2 text-gray-600">Deliverable</th>
                    <th className="text-left py-2 text-gray-600">Status</th>
                    <th className="text-left py-2 text-gray-600">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {data.deliverables.filter((d) => d.name).map((item) => (
                    <tr key={item.id} className="border-b border-gray-50">
                      <td className="py-2 text-gray-900">{item.name}</td>
                      <td className="py-2">
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                          item.status === "completed" ? "bg-green-100 text-green-700" :
                          item.status === "in-progress" ? "bg-yellow-100 text-yellow-700" :
                          "bg-gray-100 text-gray-700"
                        }`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="py-2 text-gray-600">{item.notes || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mb-6">
              <h4 className="font-semibold text-gray-900 border-b border-gray-200 pb-2 mb-2">Time & Budget Analysis</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-500 text-xs mb-1">Time</p>
                  <p className="text-lg font-bold">{data.hoursSpent} / {data.hoursAllocated} hrs</p>
                  <p className={`text-sm ${hoursVariance > 0 ? "text-red-600" : "text-green-600"}`}>
                    {hoursVariance > 0 ? `+${hoursVariance}` : hoursVariance} hrs variance
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-500 text-xs mb-1">Budget</p>
                  <p className="text-lg font-bold">${data.actualSpend.toLocaleString()} / ${data.budgetAllocated.toLocaleString()}</p>
                  <p className={`text-sm ${budgetVariance > 0 ? "text-red-600" : "text-green-600"}`}>
                    {budgetVariance > 0 ? `+$${budgetVariance.toLocaleString()}` : `-$${Math.abs(budgetVariance).toLocaleString()}`} variance
                  </p>
                </div>
              </div>
            </div>

            {(data.challenges || data.solutions) && (
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 border-b border-gray-200 pb-2 mb-2">Challenges & Solutions</h4>
                {data.challenges && (
                  <div className="mb-3">
                    <p className="text-gray-500 text-xs mb-1">Challenges</p>
                    <p className="text-gray-600 text-sm whitespace-pre-line">{data.challenges}</p>
                  </div>
                )}
                {data.solutions && (
                  <div>
                    <p className="text-gray-500 text-xs mb-1">Solutions</p>
                    <p className="text-gray-600 text-sm whitespace-pre-line">{data.solutions}</p>
                  </div>
                )}
              </div>
            )}

            {data.bugReports.some((b) => b.title) && (
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 border-b border-gray-200 pb-2 mb-2">Bug Reports & Updates</h4>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left py-2 text-gray-600">Issue</th>
                      <th className="text-left py-2 text-gray-600">Description</th>
                      <th className="text-left py-2 text-gray-600">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.bugReports.filter((b) => b.title).map((item) => (
                      <tr key={item.id} className="border-b border-gray-50">
                        <td className="py-2 text-gray-900 font-medium">{item.title}</td>
                        <td className="py-2 text-gray-600">{item.description || "—"}</td>
                        <td className="py-2">
                          <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                            item.status === "fixed" ? "bg-green-100 text-green-700" :
                            item.status === "in-progress" ? "bg-yellow-100 text-yellow-700" :
                            "bg-red-100 text-red-700"
                          }`}>
                            {item.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {(data.nextSteps || data.recommendations || data.maintenanceNotes) && (
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 border-b border-gray-200 pb-2 mb-2">Next Steps</h4>
                {data.nextSteps && (
                  <div className="mb-3">
                    <p className="text-gray-500 text-xs mb-1">Future Scope</p>
                    <p className="text-gray-600 text-sm whitespace-pre-line">{data.nextSteps}</p>
                  </div>
                )}
                {data.recommendations && (
                  <div className="mb-3">
                    <p className="text-gray-500 text-xs mb-1">Recommendations</p>
                    <p className="text-gray-600 text-sm whitespace-pre-line">{data.recommendations}</p>
                  </div>
                )}
                {data.maintenanceNotes && (
                  <div>
                    <p className="text-gray-500 text-xs mb-1">Maintenance Notes</p>
                    <p className="text-gray-600 text-sm whitespace-pre-line">{data.maintenanceNotes}</p>
                  </div>
                )}
              </div>
            )}

            <div className="mt-8 pt-6 border-t border-gray-200 text-center text-xs text-gray-400">
              <p>Generated by Redlix Document Solutions</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
