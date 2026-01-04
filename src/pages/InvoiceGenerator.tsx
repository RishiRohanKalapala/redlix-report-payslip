import { useState } from "react";
import { Plus, Trash2, Download } from "lucide-react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { usePdfExport } from "@/hooks/usePdfExport";
import type { InvoiceData, InvoiceItem } from "@/types/documents";

const generateInvoiceNumber = () => {
  const date = new Date();
  return `INV-${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, "0")}${String(date.getDate()).padStart(2, "0")}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
};

const initialData: InvoiceData = {
  invoiceNumber: generateInvoiceNumber(),
  invoiceDate: new Date().toISOString().split("T")[0],
  dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
  client: { name: "", company: "", address: "", email: "", phone: "" },
  projectName: "",
  projectDescription: "",
  items: [{ id: "1", description: "", quantity: 1, rate: 0, amount: 0 }],
  subtotal: 0,
  taxRate: 0,
  taxAmount: 0,
  discount: 0,
  total: 0,
  paymentTerms: "Net 30 days",
  bankDetails: "",
  notes: "",
};

export default function InvoiceGenerator() {
  const [data, setData] = useState<InvoiceData>(initialData);
  const { exportToPdf, isExporting } = usePdfExport();

  const updateClient = (field: keyof InvoiceData["client"], value: string) => {
    setData((prev) => ({ ...prev, client: { ...prev.client, [field]: value } }));
  };

  const addItem = () => {
    const newItem: InvoiceItem = {
      id: Date.now().toString(),
      description: "",
      quantity: 1,
      rate: 0,
      amount: 0,
    };
    setData((prev) => ({ ...prev, items: [...prev.items, newItem] }));
  };

  const removeItem = (id: string) => {
    if (data.items.length > 1) {
      setData((prev) => ({ ...prev, items: prev.items.filter((item) => item.id !== id) }));
    }
  };

  const updateItem = (id: string, field: keyof InvoiceItem, value: string | number) => {
    setData((prev) => {
      const items = prev.items.map((item) => {
        if (item.id === id) {
          const updated = { ...item, [field]: value };
          updated.amount = updated.quantity * updated.rate;
          return updated;
        }
        return item;
      });
      const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
      const taxAmount = subtotal * (prev.taxRate / 100);
      const total = subtotal + taxAmount - prev.discount;
      return { ...prev, items, subtotal, taxAmount, total };
    });
  };

  const updateTaxOrDiscount = (field: "taxRate" | "discount", value: number) => {
    setData((prev) => {
      const taxAmount = prev.subtotal * ((field === "taxRate" ? value : prev.taxRate) / 100);
      const discount = field === "discount" ? value : prev.discount;
      const total = prev.subtotal + taxAmount - discount;
      return { ...prev, [field]: value, taxAmount, total };
    });
  };

  return (
    <Layout>
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Form Section */}
        <div className="space-y-6 no-print">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Invoice Generator</h1>
            <p className="text-muted-foreground">Create professional client invoices</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Invoice Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>Invoice Number</Label>
                  <Input value={data.invoiceNumber} onChange={(e) => setData((prev) => ({ ...prev, invoiceNumber: e.target.value }))} />
                </div>
                <div>
                  <Label>Invoice Date</Label>
                  <Input type="date" value={data.invoiceDate} onChange={(e) => setData((prev) => ({ ...prev, invoiceDate: e.target.value }))} />
                </div>
                <div>
                  <Label>Due Date</Label>
                  <Input type="date" value={data.dueDate} onChange={(e) => setData((prev) => ({ ...prev, dueDate: e.target.value }))} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Client Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Client Name</Label>
                  <Input value={data.client.name} onChange={(e) => updateClient("name", e.target.value)} placeholder="John Doe" />
                </div>
                <div>
                  <Label>Company</Label>
                  <Input value={data.client.company} onChange={(e) => updateClient("company", e.target.value)} placeholder="Acme Inc." />
                </div>
              </div>
              <div>
                <Label>Address</Label>
                <Textarea value={data.client.address} onChange={(e) => updateClient("address", e.target.value)} placeholder="123 Business St, City, Country" rows={2} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Email</Label>
                  <Input type="email" value={data.client.email} onChange={(e) => updateClient("email", e.target.value)} placeholder="client@email.com" />
                </div>
                <div>
                  <Label>Phone</Label>
                  <Input value={data.client.phone} onChange={(e) => updateClient("phone", e.target.value)} placeholder="+1 234 567 890" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Project Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Project Name</Label>
                <Input value={data.projectName} onChange={(e) => setData((prev) => ({ ...prev, projectName: e.target.value }))} placeholder="Website Redesign" />
              </div>
              <div>
                <Label>Description</Label>
                <Textarea value={data.projectDescription} onChange={(e) => setData((prev) => ({ ...prev, projectDescription: e.target.value }))} placeholder="Brief project description..." rows={2} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Billing Items</CardTitle>
              <Button size="sm" variant="outline" onClick={addItem}>
                <Plus className="w-4 h-4 mr-1" /> Add Item
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {data.items.map((item, index) => (
                <div key={item.id} className="grid grid-cols-12 gap-2 items-end">
                  <div className="col-span-5">
                    {index === 0 && <Label>Description</Label>}
                    <Input value={item.description} onChange={(e) => updateItem(item.id, "description", e.target.value)} placeholder="Service description" />
                  </div>
                  <div className="col-span-2">
                    {index === 0 && <Label>Qty</Label>}
                    <Input type="number" min="0" value={item.quantity} onChange={(e) => updateItem(item.id, "quantity", parseFloat(e.target.value) || 0)} />
                  </div>
                  <div className="col-span-2">
                    {index === 0 && <Label>Rate</Label>}
                    <Input type="number" min="0" value={item.rate} onChange={(e) => updateItem(item.id, "rate", parseFloat(e.target.value) || 0)} />
                  </div>
                  <div className="col-span-2">
                    {index === 0 && <Label>Amount</Label>}
                    <Input value={item.amount.toFixed(2)} readOnly className="bg-muted" />
                  </div>
                  <div className="col-span-1">
                    <Button size="icon" variant="ghost" onClick={() => removeItem(item.id)} disabled={data.items.length === 1}>
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
              <Separator />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Tax Rate (%)</Label>
                  <Input type="number" min="0" max="100" value={data.taxRate} onChange={(e) => updateTaxOrDiscount("taxRate", parseFloat(e.target.value) || 0)} />
                </div>
                <div>
                  <Label>Discount</Label>
                  <Input type="number" min="0" value={data.discount} onChange={(e) => updateTaxOrDiscount("discount", parseFloat(e.target.value) || 0)} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payment Terms</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Payment Terms</Label>
                <Input value={data.paymentTerms} onChange={(e) => setData((prev) => ({ ...prev, paymentTerms: e.target.value }))} placeholder="Net 30 days" />
              </div>
              <div>
                <Label>Bank Details</Label>
                <Textarea value={data.bankDetails} onChange={(e) => setData((prev) => ({ ...prev, bankDetails: e.target.value }))} placeholder="Bank name, Account number, SWIFT code..." rows={3} />
              </div>
              <div>
                <Label>Notes</Label>
                <Textarea value={data.notes} onChange={(e) => setData((prev) => ({ ...prev, notes: e.target.value }))} placeholder="Additional notes for the client..." rows={2} />
              </div>
            </CardContent>
          </Card>

          <Button onClick={() => exportToPdf("invoice-preview", `invoice-${data.invoiceNumber}`)} disabled={isExporting} className="w-full" size="lg">
            <Download className="w-4 h-4 mr-2" />
            {isExporting ? "Generating PDF..." : "Download PDF"}
          </Button>
        </div>

        {/* Preview Section */}
        <div className="lg:sticky lg:top-24 lg:h-fit">
          <div id="invoice-preview" className="bg-white text-black p-8 shadow-lg rounded-lg border">
            <div className="flex items-center justify-between border-b border-gray-200 pb-6 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-2xl">R</span>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Redlix</h1>
                  <p className="text-sm text-gray-500">Professional Document Solutions</p>
                </div>
              </div>
              <div className="text-right">
                <h2 className="text-2xl font-bold text-blue-600">INVOICE</h2>
                <p className="text-sm text-gray-500">{data.invoiceNumber}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Bill To:</h3>
                <p className="font-medium text-gray-900">{data.client.name || "Client Name"}</p>
                <p className="text-gray-600">{data.client.company}</p>
                <p className="text-gray-600 text-sm whitespace-pre-line">{data.client.address}</p>
                <p className="text-gray-600 text-sm">{data.client.email}</p>
                <p className="text-gray-600 text-sm">{data.client.phone}</p>
              </div>
              <div className="text-right">
                <div className="space-y-1 text-sm">
                  <p><span className="text-gray-500">Invoice Date:</span> <span className="font-medium">{data.invoiceDate}</span></p>
                  <p><span className="text-gray-500">Due Date:</span> <span className="font-medium">{data.dueDate}</span></p>
                </div>
              </div>
            </div>

            {(data.projectName || data.projectDescription) && (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-900">{data.projectName || "Project"}</h3>
                <p className="text-gray-600 text-sm">{data.projectDescription}</p>
              </div>
            )}

            <table className="w-full mb-6">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 text-sm font-semibold text-gray-600">Description</th>
                  <th className="text-right py-2 text-sm font-semibold text-gray-600">Qty</th>
                  <th className="text-right py-2 text-sm font-semibold text-gray-600">Rate</th>
                  <th className="text-right py-2 text-sm font-semibold text-gray-600">Amount</th>
                </tr>
              </thead>
              <tbody>
                {data.items.map((item) => (
                  <tr key={item.id} className="border-b border-gray-100">
                    <td className="py-3 text-gray-900">{item.description || "—"}</td>
                    <td className="py-3 text-right text-gray-600">{item.quantity}</td>
                    <td className="py-3 text-right text-gray-600">${item.rate.toFixed(2)}</td>
                    <td className="py-3 text-right font-medium text-gray-900">${item.amount.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex justify-end mb-8">
              <div className="w-64 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal:</span>
                  <span className="text-gray-900">${data.subtotal.toFixed(2)}</span>
                </div>
                {data.taxRate > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Tax ({data.taxRate}%):</span>
                    <span className="text-gray-900">${data.taxAmount.toFixed(2)}</span>
                  </div>
                )}
                {data.discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Discount:</span>
                    <span className="text-gray-900">-${data.discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-lg border-t border-gray-200 pt-2">
                  <span>Total:</span>
                  <span className="text-blue-600">${data.total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6 space-y-4 text-sm">
              {data.paymentTerms && (
                <div>
                  <h4 className="font-semibold text-gray-900">Payment Terms</h4>
                  <p className="text-gray-600">{data.paymentTerms}</p>
                </div>
              )}
              {data.bankDetails && (
                <div>
                  <h4 className="font-semibold text-gray-900">Bank Details</h4>
                  <p className="text-gray-600 whitespace-pre-line">{data.bankDetails}</p>
                </div>
              )}
              {data.notes && (
                <div>
                  <h4 className="font-semibold text-gray-900">Notes</h4>
                  <p className="text-gray-600">{data.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
