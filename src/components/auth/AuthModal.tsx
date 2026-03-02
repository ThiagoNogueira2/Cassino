import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { X, Eye, EyeOff, Mail, Lock, User, CreditCard, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import {
  authSchemas,
  type LoginFormData,
  type RegisterFormData,
  type ForgotFormData,
} from "./authSchemas";

function formatCPF(value: string) {
  return value
    .replace(/\D/g, "")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})/, "$1-$2")
    .substring(0, 14);
}

const TITLES: Record<string, string> = {
  login: "Entrar",
  register: "Criar Conta",
  forgot: "Recuperar Senha",
};

const SUBTITLES: Record<string, string> = {
  login: "Bem-vindo de volta!",
  register: "Crie sua conta gratuitamente",
  forgot: "Enviaremos um link de recuperação",
};

function LoginSuccessView({
  authModal,
  onClose,
}: {
  authModal: "login" | "register";
  onClose: () => void;
}) {
  const isLogin = authModal === "login";
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", duration: 0.4 }}
      className="text-center py-8"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
        className="w-20 h-20 rounded-full bg-neon-green/20 flex items-center justify-center mx-auto mb-5 border-2 border-neon-green/50 shadow-[0_0_24px_rgba(0,255,136,0.3)]"
      >
        <Check className="w-10 h-10 text-neon-green stroke-[3]" />
      </motion.div>
      <motion.h3
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="text-xl font-black text-foreground mb-1"
      >
        {isLogin ? "Bem-vindo de volta!" : "Conta criada!"}
      </motion.h3>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.45 }}
        className="text-sm text-muted-foreground mb-6"
      >
        {isLogin
          ? "Login realizado com sucesso. Aproveite!"
          : "Sua conta foi criada. Boa sorte!"}
      </motion.p>
      <Button
        className="w-full gradient-primary border-0 text-white font-bold h-11"
        onClick={onClose}
      >
        Continuar
      </Button>
    </motion.div>
  );
}

export default function AuthModal() {
  const { authModal, closeAuth, openAuth, login, register: doRegister, loading: authLoading } =
    useAuth();
  const [showPass, setShowPass] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [success, setSuccess] = useState(false);
  const [apiError, setApiError] = useState("");

  const schema = authModal ? authSchemas[authModal] : null;
  const form = useForm<LoginFormData | RegisterFormData | ForgotFormData>({
    resolver: schema ? (zodResolver(schema) as any) : undefined,
    defaultValues:
      authModal === "login"
        ? { email: "", password: "" }
        : authModal === "register"
          ? { name: "", email: "", cpf: "", password: "", confirm: "", acceptTerms: false }
          : authModal === "forgot"
            ? { email: "" }
            : {},
  });

  useEffect(() => {
    setSuccess(false);
    setApiError("");
    if (authModal) {
      const defaults =
        authModal === "login"
          ? { email: "", password: "" }
          : authModal === "register"
            ? { name: "", email: "", cpf: "", password: "", confirm: "", acceptTerms: false }
            : { email: "" };
      form.reset(defaults);
    }
  }, [authModal]);

  const loading = form.formState.isSubmitting;
  const isBusy = loading || authLoading;

  const onSubmit = async (
    data: LoginFormData | RegisterFormData | ForgotFormData
  ) => {
    setApiError("");
    try {
      if (authModal === "login") {
        const d = data as LoginFormData;
        const ok = await login(d.email, d.password);
        if (ok) setSuccess(true);
        else setApiError("Email ou senha inválidos");
      } else if (authModal === "register") {
        const d = data as RegisterFormData;
        const ok = await doRegister({
          name: d.name,
          email: d.email,
          cpf: d.cpf,
          password: d.password,
        });
        if (ok) setSuccess(true);
        else setApiError("Erro ao criar conta. Verifique seus dados e tente novamente.");
      } else if (authModal === "forgot") {
        await new Promise((r) => setTimeout(r, 1000));
        setSuccess(true);
      }
    } catch (err: any) {
      setApiError(err?.data?.message || "Erro ao processar sua solicitação");
    }
  };

  if (!authModal) return null;

  const showSuccessLoginOrRegister =
    success && (authModal === "login" || authModal === "register");
  const showSuccessForgot = success && authModal === "forgot";

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          onClick={closeAuth}
        />
        <motion.div
          key={authModal}
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: "spring", duration: 0.4 }}
          className="relative w-full max-w-md card-casino rounded-2xl shadow-2xl border border-border overflow-hidden"
        >
          <div className="h-1 w-full gradient-primary" />
          <div className="p-6">
            <button
              onClick={closeAuth}
              className="absolute right-4 top-4 p-1.5 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="mb-6">
              <h2 className="text-2xl font-black">{TITLES[authModal]}</h2>
              <p className="text-sm text-muted-foreground mt-1">{SUBTITLES[authModal]}</p>
            </div>

            {showSuccessLoginOrRegister ? (
              <LoginSuccessView authModal={authModal} onClose={closeAuth} />
            ) : showSuccessForgot ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-full bg-neon-green/20 flex items-center justify-center mx-auto mb-4 glow-green">
                  <Check className="w-8 h-8 text-neon-green" />
                </div>
                <h3 className="text-lg font-bold mb-2">Email enviado!</h3>
                <p className="text-sm text-muted-foreground mb-6">
                  Verifique sua caixa de entrada para redefinir sua senha.
                </p>
                <Button
                  className="w-full gradient-primary border-0 text-white"
                  onClick={() => {
                    setSuccess(false);
                    openAuth("login");
                  }}
                >
                  Voltar ao Login
                </Button>
              </div>
            ) : (
              <div className="relative">
                <AnimatePresence>
                  {isBusy && (authModal === "login" || authModal === "register") && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 z-10 rounded-xl bg-background/90 backdrop-blur-sm flex flex-col items-center justify-center gap-4"
                    >
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-12 h-12 rounded-full border-2 border-primary/30 border-t-primary"
                      />
                      <span className="text-sm font-medium text-muted-foreground">
                        {authModal === "login" ? "Entrando..." : "Criando conta..."}
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>

                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4"
                  >
                    {apiError && (
                      <div className="p-3 rounded-lg bg-destructive/20 border border-destructive/50 text-destructive text-sm">
                        {apiError}
                      </div>
                    )}

                    {authModal === "register" && (
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <div className="relative">
                              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                              <FormControl>
                                <Input
                                  placeholder="Nome completo"
                                  className="pl-10 bg-secondary border-border"
                                  {...field}
                                />
                              </FormControl>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <FormControl>
                              <Input
                                type="email"
                                placeholder="Email"
                                className="pl-10 bg-secondary border-border"
                                {...field}
                              />
                            </FormControl>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {authModal === "register" && (
                      <FormField
                        control={form.control}
                        name="cpf"
                        render={({ field }) => (
                          <FormItem>
                            <div className="relative">
                              <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                              <FormControl>
                                <Input
                                  placeholder="CPF (000.000.000-00)"
                                  className="pl-10 bg-secondary border-border"
                                  value={field.value}
                                  onChange={(e) => field.onChange(formatCPF(e.target.value))}
                                />
                              </FormControl>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}

                    {authModal !== "forgot" && (
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
                                  placeholder="Senha"
                                  className="pl-10 pr-10 bg-secondary border-border"
                                  {...field}
                                />
                              </FormControl>
                              <button
                                type="button"
                                onClick={() => setShowPass((p) => !p)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                              >
                                {showPass ? (
                                  <EyeOff className="w-4 h-4" />
                                ) : (
                                  <Eye className="w-4 h-4" />
                                )}
                              </button>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}

                    {authModal === "register" && (
                      <FormField
                        control={form.control}
                        name="confirm"
                        render={({ field }) => (
                          <FormItem>
                            <div className="relative">
                              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                              <FormControl>
                                <Input
                                  type={showPass ? "text" : "password"}
                                  placeholder="Confirmar senha"
                                  className="pl-10 bg-secondary border-border"
                                  {...field}
                                />
                              </FormControl>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}

                    {authModal === "login" && (
                      <div className="flex items-center justify-between">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <div
                            onClick={() => setRememberMe((v) => !v)}
                            className={cn(
                              "w-4 h-4 rounded border flex items-center justify-center cursor-pointer transition-colors",
                              rememberMe ? "bg-primary border-primary" : "border-border"
                            )}
                          >
                            {rememberMe && <Check className="w-3 h-3 text-white" />}
                          </div>
                          <span className="text-xs text-muted-foreground">Lembrar de mim</span>
                        </label>
                        <button
                          type="button"
                          onClick={() => openAuth("forgot")}
                          className="text-xs text-primary hover:underline"
                        >
                          Esqueci minha senha
                        </button>
                      </div>
                    )}

                    {authModal === "register" && (
                      <FormField
                        control={form.control}
                        name="acceptTerms"
                        render={({ field }) => (
                          <FormItem>
                            <label className="flex items-start gap-2 cursor-pointer">
                              <div
                                onClick={() => field.onChange(!field.value)}
                                className={cn(
                                  "w-4 h-4 rounded border flex items-center justify-center shrink-0 mt-0.5 cursor-pointer transition-colors",
                                  field.value ? "bg-primary border-primary" : "border-border"
                                )}
                              >
                                {field.value && (
                                  <Check className="w-3 h-3 text-white" />
                                )}
                              </div>
                              <span className="text-xs text-muted-foreground">
                                Aceito os{" "}
                                <a href="#" className="text-primary hover:underline">
                                  Termos de Uso
                                </a>{" "}
                                e{" "}
                                <a href="#" className="text-primary hover:underline">
                                  Política de Privacidade
                                </a>
                                . Tenho mais de 18 anos.
                              </span>
                            </label>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}

                    <Button
                      type="submit"
                      className="w-full gradient-primary border-0 text-white font-bold h-11"
                      disabled={isBusy}
                    >
                      {isBusy ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        TITLES[authModal]
                      )}
                    </Button>
                  </form>
                </Form>

                <div className="mt-4 text-center text-sm text-muted-foreground">
                  {authModal === "login" && (
                    <>
                      Não tem conta?{" "}
                      <button
                        type="button"
                        onClick={() => openAuth("register")}
                        className="text-primary font-semibold hover:underline"
                      >
                        Cadastre-se grátis
                      </button>
                    </>
                  )}
                  {authModal === "register" && (
                    <>
                      Já tem conta?{" "}
                      <button
                        type="button"
                        onClick={() => openAuth("login")}
                        className="text-primary font-semibold hover:underline"
                      >
                        Entrar
                      </button>
                    </>
                  )}
                  {authModal === "forgot" && (
                    <>
                      Lembrou a senha?{" "}
                      <button
                        type="button"
                        onClick={() => openAuth("login")}
                        className="text-primary font-semibold hover:underline"
                      >
                        Entrar
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
