import { Link } from "react-router-dom";
import { Receipt, UserCheck, FileText, ArrowRight } from "lucide-react";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const documentTypes = [
  {
    path: "/invoice",
    title: "Client Invoice",
    description: "Generate professional invoices for your clients with itemized billing, taxes, and payment terms.",
    icon: Receipt,
    color: "bg-primary",
  },
  {
    path: "/payslip",
    title: "Developer Payslip",
    description: "Create detailed payslips with earnings breakdown, deductions, and net pay calculations.",
    icon: UserCheck,
    color: "bg-accent",
  },
  {
    path: "/report",
    title: "Project Report",
    description: "Compile comprehensive project reports with deliverables, time analysis, and bug tracking.",
    icon: FileText,
    color: "bg-success",
  },
];

export default function Dashboard() {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Welcome to Redlix
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Generate professional business documents with ease. Create invoices, payslips, and project reports in minutes.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {documentTypes.map((doc) => {
            const Icon = doc.icon;
            return (
              <Link key={doc.path} to={doc.path} className="group">
                <Card className="h-full transition-all duration-200 hover:shadow-lg hover:border-primary/50 group-hover:-translate-y-1">
                  <CardHeader>
                    <div className={`w-12 h-12 ${doc.color} rounded-lg flex items-center justify-center mb-4`}>
                      <Icon className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <CardTitle className="flex items-center justify-between">
                      {doc.title}
                      <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-sm">
                      {doc.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </Layout>
  );
}
