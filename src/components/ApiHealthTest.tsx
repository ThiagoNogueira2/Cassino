import { useEffect, useState } from "react";
import { healthCheck } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AlertCircle, CheckCircle2 } from "lucide-react";

export const ApiHealthTest = () => {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const testConnection = async () => {
    setStatus("loading");
    setError(null);
    setData(null);

    try {
      const response = await healthCheck();
      setData(response);
      setStatus("success");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      setStatus("error");
    }
  };

  useEffect(() => {
    testConnection();
  }, []);

  return (
    <Card className="p-6 bg-gradient-to-br from-slate-50 to-slate-100 border-2">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-bold">API Connection Test</h2>
          {status === "success" && <CheckCircle2 className="w-6 h-6 text-green-500" />}
          {status === "error" && <AlertCircle className="w-6 h-6 text-red-500" />}
        </div>

        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            <strong>Backend URL:</strong> http://localhost:8000/api
          </p>
          <p className="text-sm text-muted-foreground">
            <strong>Status:</strong>{" "}
            <span className={`font-semibold ${
              status === "success" ? "text-green-600" :
              status === "error" ? "text-red-600" :
              "text-yellow-600"
            }`}>
              {status === "idle" ? "Idle" : status === "loading" ? "Loading..." : status === "success" ? "✅ Connected" : "❌ Failed"}
            </span>
          </p>
        </div>

        {status === "success" && data && (
          <div className="bg-white p-4 rounded-lg border border-green-200 space-y-2">
            <p className="text-sm font-semibold text-green-700">✅ Connection Successful!</p>
            <pre className="text-xs bg-slate-100 p-3 rounded overflow-auto max-h-48">
              {JSON.stringify(data, null, 2)}
            </pre>
          </div>
        )}

        {status === "error" && error && (
          <div className="bg-white p-4 rounded-lg border border-red-200 space-y-2">
            <p className="text-sm font-semibold text-red-700">❌ Connection Failed</p>
            <p className="text-xs text-red-600">{error}</p>
          </div>
        )}

        <Button onClick={testConnection} disabled={status === "loading"} className="w-full">
          {status === "loading" ? "Testing..." : "Test Connection"}
        </Button>
      </div>
    </Card>
  );
};
