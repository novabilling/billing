"use client";

import { useEffect, useState } from "react";
import { Settings as SettingsIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { apiClient } from "@/lib/api/client";
import type { PaymentProvider } from "@/types";
import { toast } from "sonner";

const providerInfo: Record<string, { logo: string; color: string }> = {
  stripe: { logo: "💳", color: "bg-indigo-500" },
  flutterwave: { logo: "🦋", color: "bg-orange-500" },
  paystack: { logo: "📦", color: "bg-blue-500" },
  dpo: { logo: "🏦", color: "bg-teal-500" },
  payu: { logo: "💰", color: "bg-emerald-500" },
  pesapal: { logo: "📱", color: "bg-green-500" },
};

const credentialFields: Record<
  string,
  { key: string; label: string; placeholder: string }[]
> = {
  stripe: [
    { key: "secretKey", label: "Secret Key", placeholder: "sk_live_..." },
    { key: "webhookSecret", label: "Webhook Secret", placeholder: "whsec_..." },
  ],
  paystack: [
    { key: "secretKey", label: "Secret Key", placeholder: "sk_live_..." },
  ],
  flutterwave: [
    { key: "secretKey", label: "Secret Key", placeholder: "FLWSECK_..." },
    { key: "encryptionKey", label: "Encryption Key", placeholder: "" },
  ],
  dpo: [
    { key: "companyToken", label: "Company Token", placeholder: "" },
    { key: "serviceType", label: "Service Type", placeholder: "e.g. 5525" },
    { key: "environment", label: "Environment", placeholder: "test or live" },
  ],
  payu: [
    { key: "apiKey", label: "API Key", placeholder: "" },
    { key: "safeKey", label: "Safe Key", placeholder: "" },
    { key: "environment", label: "Environment", placeholder: "staging or production" },
  ],
  pesapal: [
    { key: "consumerKey", label: "Consumer Key", placeholder: "" },
    { key: "consumerSecret", label: "Consumer Secret", placeholder: "" },
    { key: "environment", label: "Environment", placeholder: "sandbox or live" },
  ],
};

export default function ProvidersPage() {
  const [providers, setProviders] = useState<PaymentProvider[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Config dialog state
  const [configOpen, setConfigOpen] = useState(false);
  const [configProvider, setConfigProvider] = useState<PaymentProvider | null>(
    null,
  );
  const [credentials, setCredentials] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [isTesting, setIsTesting] = useState<string | null>(null);

  useEffect(() => {
    loadProviders();
  }, []);

  async function loadProviders() {
    try {
      const data = await apiClient.providers.list();
      setProviders(data);
    } catch (error) {
      toast.error("Failed to load providers");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleToggleActive(provider: PaymentProvider) {
    if (!provider.isConfigured) {
      toast.error("Please configure the provider before activating");
      return;
    }

    try {
      await apiClient.providers.update(provider.id, {
        isActive: !provider.isActive,
      });
      toast.success(
        `Provider ${provider.isActive ? "deactivated" : "activated"}`,
      );
      loadProviders();
    } catch (error) {
      toast.error("Failed to update provider");
    }
  }

  function openConfigDialog(provider: PaymentProvider) {
    setConfigProvider(provider);
    const fields = credentialFields[provider.code] || [];
    const creds: Record<string, string> = {};
    fields.forEach((f) => {
      creds[f.key] = "";
    });
    setCredentials(creds);
    setConfigOpen(true);
  }

  async function handleSaveConfig() {
    if (!configProvider) return;
    const fields = credentialFields[configProvider.code] || [];
    const hasEmpty = fields.some((f) => !credentials[f.key]);
    if (hasEmpty) {
      toast.error("All credential fields are required");
      return;
    }
    setIsSaving(true);
    try {
      if (configProvider.id.startsWith("default_")) {
        await apiClient.providers.create({
          providerName: configProvider.code,
          credentials,
          isActive: true,
          priority: configProvider.priority,
        });
      } else {
        await apiClient.providers.update(configProvider.id, {
          config: credentials,
        });
      }
      toast.success("Provider configured");
      setConfigOpen(false);
      loadProviders();
    } catch (error: any) {
      toast.error(error.message || "Failed to configure provider");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleTest(provider: PaymentProvider) {
    if (provider.id.startsWith("default_")) {
      toast.error("Configure the provider first");
      return;
    }
    setIsTesting(provider.id);
    try {
      const result = await apiClient.providers.test(provider.id);
      if (result.success) {
        toast.success(result.message || "Connection successful");
      } else {
        toast.error(result.message || "Connection failed");
      }
    } catch (error: any) {
      toast.error(error.message || "Connection test failed");
    } finally {
      setIsTesting(null);
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-20 animate-shimmer rounded" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-64 animate-shimmer rounded" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Payment Providers</h1>
          <p className="text-muted-foreground">
            Configure and manage payment providers
          </p>
        </div>
      </div>

      {/* Provider Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {providers.map((provider) => {
          const info = providerInfo[provider.code] || { logo: "🔌", color: "bg-gray-500" };

          return (
            <Card key={provider.id} className="relative overflow-hidden">
              <div className={`h-2 ${info.color}`} />
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-4xl">{info.logo}</div>
                    <div>
                      <CardTitle>{provider.name}</CardTitle>
                      <CardDescription className="mt-1">
                        {provider.description}
                      </CardDescription>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Status Badges */}
                <div className="flex gap-2">
                  <Badge
                    variant={provider.isConfigured ? "success" : "outline"}
                  >
                    {provider.isConfigured ? "Configured" : "Not Configured"}
                  </Badge>
                  <Badge variant={provider.isActive ? "success" : "outline"}>
                    {provider.isActive ? "Active" : "Inactive"}
                  </Badge>
                  <Badge variant="secondary">
                    Priority: {provider.priority}
                  </Badge>
                </div>

                {/* Configuration Status */}
                {!provider.isConfigured && (
                  <div className="p-3 bg-muted border border-border rounded-md">
                    <p className="text-sm text-muted-foreground">
                      This provider needs to be configured before it can be
                      activated.
                    </p>
                  </div>
                )}

                {/* Actions */}
                <div className="pt-4 border-t border-border space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Active</span>
                    <Switch
                      checked={provider.isActive}
                      onCheckedChange={() => handleToggleActive(provider)}
                      disabled={!provider.isConfigured}
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => openConfigDialog(provider)}
                    >
                      <SettingsIcon className="mr-2 h-4 w-4" />
                      {provider.isConfigured ? "Reconfigure" : "Configure"}
                    </Button>
                    {provider.isConfigured && (
                      <Button
                        variant="outline"
                        onClick={() => handleTest(provider)}
                        disabled={isTesting === provider.id}
                      >
                        {isTesting === provider.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          "Test"
                        )}
                      </Button>
                    )}
                  </div>
                </div>

                {/* Webhook URL */}
                {provider.isConfigured && (
                  <div className="text-xs">
                    <p className="text-muted-foreground mb-1">Webhook URL:</p>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 px-2 py-1 bg-muted rounded font-mono text-xs truncate">
                        https://api.novabilling.com/webhooks/{provider.code}
                      </code>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          navigator.clipboard.writeText(
                            `https://api.novabilling.com/webhooks/${provider.code}`,
                          );
                          toast.success("Webhook URL copied");
                        }}
                      >
                        Copy
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Help Section */}
      <Card>
        <CardHeader>
          <CardTitle>Need Help?</CardTitle>
          <CardDescription>
            Learn how to configure payment providers and integrate them with
            your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div>
              <h4 className="font-medium mb-2">Stripe</h4>
              <a
                href="https://stripe.com/docs"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:underline"
              >
                View Documentation &rarr;
              </a>
            </div>
            <div>
              <h4 className="font-medium mb-2">Flutterwave</h4>
              <a
                href="https://developer.flutterwave.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:underline"
              >
                View Documentation &rarr;
              </a>
            </div>
            <div>
              <h4 className="font-medium mb-2">Paystack</h4>
              <a
                href="https://paystack.com/docs"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:underline"
              >
                View Documentation &rarr;
              </a>
            </div>
            <div>
              <h4 className="font-medium mb-2">DPO Group</h4>
              <a
                href="https://dpogroup.com/developers"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:underline"
              >
                View Documentation &rarr;
              </a>
            </div>
            <div>
              <h4 className="font-medium mb-2">PayU</h4>
              <a
                href="https://developers.payu.co.za"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:underline"
              >
                View Documentation &rarr;
              </a>
            </div>
            <div>
              <h4 className="font-medium mb-2">Pesapal</h4>
              <a
                href="https://developer.pesapal.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:underline"
              >
                View Documentation &rarr;
              </a>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Configure Provider Dialog */}
      <Dialog open={configOpen} onOpenChange={setConfigOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Configure {configProvider?.name}</DialogTitle>
            <DialogDescription>
              Enter your API credentials. These will be encrypted and stored
              securely.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {configProvider &&
              (credentialFields[configProvider.code] || []).map((field) => (
                <div key={field.key} className="space-y-2">
                  <Label htmlFor={field.key}>{field.label}</Label>
                  <Input
                    id={field.key}
                    type="password"
                    placeholder={field.placeholder}
                    value={credentials[field.key] || ""}
                    onChange={(e) =>
                      setCredentials({
                        ...credentials,
                        [field.key]: e.target.value,
                      })
                    }
                  />
                </div>
              ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfigOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveConfig} disabled={isSaving}>
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Configuration
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
