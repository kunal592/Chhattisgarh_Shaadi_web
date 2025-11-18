
"use client"

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import api from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Loader2, UploadCloud, Trash2, FileText, CheckCircle, XCircle } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Document {
  id: string;
  documentType: string;
  status: string;
  url: string;
}

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [documentType, setDocumentType] = useState("AADHAAR");
  const { toast } = useToast();

  useEffect(() => {
    async function fetchDocuments() {
      try {
        const response = await api.get("/documents");
        setDocuments(response.data.data);
      } catch (error) {
        console.error("Failed to fetch documents", error);
        toast({ variant: "destructive", title: "Error", description: "Failed to load your documents." });
      } finally {
        setIsLoading(false);
      }
    }
    fetchDocuments();
  }, [toast]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("documentType", documentType);

    setIsUploading(true);
    try {
      const response = await api.post("/documents", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setDocuments([...documents, response.data.data]);
      toast({ title: "Document Uploaded", description: "Your document has been uploaded for verification." });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Upload Failed",
        description: error.response?.data?.message || "Could not upload your document.",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (documentId: string) => {
    try {
      await api.delete(`/documents/${documentId}`);
      setDocuments(documents.filter(d => d.id !== documentId));
      toast({ title: "Document Deleted", description: "The document has been removed." });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Deletion Failed",
        description: error.response?.data?.message || "Could not delete the document.",
      });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'REJECTED':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Loader2 className="w-5 h-5 text-yellow-500 animate-spin" />;
    }
  }

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Document Verification</CardTitle>
            <CardDescription>Upload documents to verify your profile. This helps build trust with other members.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <Select onValueChange={setDocumentType} defaultValue={documentType}>
                <SelectTrigger className="w-full sm:w-1/3">
                  <SelectValue placeholder="Select document type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="AADHAAR">Aadhaar Card</SelectItem>
                  <SelectItem value="PAN">PAN Card</SelectItem>
                  <SelectItem value="PASSPORT">Passport</SelectItem>
                  <SelectItem value="DRIVING_LICENSE">Driving License</SelectItem>
                </SelectContent>
              </Select>
              <Label htmlFor="document-upload" className="flex-grow">
                <div className="border-2 border-dashed rounded-lg p-6 text-center text-muted-foreground hover:bg-accent/50 cursor-pointer">
                  {isUploading ? (
                      <Loader2 className="w-8 h-8 mx-auto animate-spin"/>
                  ) : (
                      <>
                          <UploadCloud className="w-10 h-10 mx-auto mb-2"/>
                          <span>Click to select a file</span>
                      </>
                  )}
                </div>
                <Input id="document-upload" type="file" className="sr-only" onChange={handleFileUpload} disabled={isUploading} />
              </Label>
            </div>
             <p className="text-xs text-muted-foreground mt-2 text-center">.jpg, .jpeg, .png, .pdf accepted. Max 5MB.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Your Documents</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center items-center h-32">
                <Loader2 className="w-8 h-8 animate-spin text-primary"/>
              </div>
            ) : (
              <ul className="space-y-3">
                {documents.map(doc => (
                  <li key={doc.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-3">
                        <FileText className="w-6 h-6 text-slate-500"/>
                        <span className="font-medium">{doc.documentType}</span>
                    </div>
                    <div className="flex items-center gap-3">
                        {getStatusIcon(doc.status)}
                        <span className="text-sm font-semibold capitalize">{doc.status.toLowerCase()}</span>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(doc.id)}>
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
