import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Lock, Eye, EyeOff, ArrowLeft, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { api } from "@/lib/api";
import { resetPasswordSchema, type ResetPasswordFormData } from "@/components/auth/authSchemas";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [showPass, setShowPass] = useState(false);

  const form = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "", password_confirmation: "" },
  });

  useEffect(() => {
    if (!token || !email) setError("Link inválido. Use o link que enviamos no e-mail.");
  }, [token, email]);

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!token || !email) return;
    setError("");
    setLoading(true);
    try {
      await api.post("/auth/reset-password", {
        token,
        email,
        password: data.password,
        password_confirmation: data.password_confirmation,
      });
      setSuccess(true);
    } catch (err: unknown) {
      const e = err as { data?: { message?: string } };
      setError(e?.data?.message || "Não foi possível redefinir a senha. O link pode ter expirado.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-[#071423] flex flex-col items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-xl"
        >
          <div className="w-16 h-16 rounded-full bg-neon-green/20 flex items-center justify-center mx-auto mb-6 border-2 border-neon-green/50">
            <Check className="w-8 h-8 text-neon-green stroke-[3]" />
          </div>
          <h1 className="text-xl font-bold text-center text-foreground mb-2">Senha alterada!</h1>
          <p className="text-sm text-muted-foreground text-center mb-6">
            Sua senha foi redefinida. Faça login com a nova senha.
          </p>
          <Button asChild className="w-full gradient-primary border-0 text-white font-bold h-11">
            <Link to="/">Ir para o login</Link>
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#071423] flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-xl"
      >
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="w-4 h-4" /> Voltar
        </Link>
        <h1 className="text-xl font-bold text-foreground mb-1">Nova senha</h1>
        <p className="text-sm text-muted-foreground mb-6">
          Digite e confirme sua nova senha abaixo.
        </p>
        {email && (
          <p className="text-xs text-muted-foreground mb-4 truncate">Conta: {email}</p>
        )}
        {error && (
          <p className="text-sm text-destructive mb-4 bg-destructive/10 border border-destructive/30 rounded-lg p-3">
            {error}
          </p>
        )}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <FormControl>
                      <Input
                        type={showPass ? "text" : "password"}
                        placeholder="Nova senha"
                        className="pl-10 pr-10 bg-secondary border-border"
                        {...field}
                      />
                    </FormControl>
                    <button
                      type="button"
                      onClick={() => setShowPass((p) => !p)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    >
                      {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password_confirmation"
              render={({ field }) => (
                <FormItem>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <FormControl>
                      <Input
                        type={showPass ? "text" : "password"}
                        placeholder="Confirmar nova senha"
                        className="pl-10 bg-secondary border-border"
                        {...field}
                      />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full gradient-primary border-0 text-white font-bold h-11"
              disabled={loading || !token || !email}
            >
              {loading ? "Salvando..." : "Redefinir senha"}
            </Button>
          </form>
        </Form>
      </motion.div>
    </div>
  );
}
