import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Eye, EyeOff, Mail, Lock, User, CreditCard, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";

function formatCPF(value: string) {
  return value
    .replace(/\D/g, "")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})/, "$1-$2")
    .substring(0, 14);
}

export default function AuthModal() {
  const { authModal, closeAuth, openAuth, login, register, loading: authLoading } = useAuth();
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState<string>("");

  // Login state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  // Register state
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regCPF, setRegCPF] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirm, setRegConfirm] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);

  // Forgot state
  const [forgotEmail, setForgotEmail] = useState("");

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (authModal === "login") {
      if (!loginEmail) errs.email = "Email obrigatório";
      if (!loginPassword) errs.password = "Senha obrigatória";
    } else if (authModal === "register") {
      if (!regName) errs.name = "Nome obrigatório";
      if (!regEmail) errs.email = "Email obrigatório";
      if (regCPF.length < 14) errs.cpf = "CPF inválido";
      if (regPassword.length < 6) errs.password = "Mínimo 6 caracteres";
      if (regPassword !== regConfirm) errs.confirm = "Senhas não conferem";
      if (!acceptTerms) errs.terms = "Aceite os termos para continuar";
    } else if (authModal === "forgot") {
      if (!forgotEmail) errs.email = "Email obrigatório";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async () => {
    setApiError("");
    if (!validate()) return;
    setLoading(true);
    try {
      if (authModal === "login") {
        const success = await login(loginEmail, loginPassword);
        if (!success) {
          setApiError("Email ou senha inválidos");
        }
      } else if (authModal === "register") {
        const success = await register({ name: regName, email: regEmail, cpf: regCPF, password: regPassword });
        if (!success) {
          setApiError("Erro ao criar conta. Verifique seus dados e tente novamente.");
        }
      } else if (authModal === "forgot") {
        await new Promise((r) => setTimeout(r, 1000));
        setSuccess(true);
      }
    } catch (error: any) {
      console.error("Submit error:", error);
      setApiError(error?.data?.message || "Erro ao processar sua solicitação");
    } finally {
      setLoading(false);
    }
  };

  const titles = { login: "Entrar", register: "Criar Conta", forgot: "Recuperar Senha" };

  if (!authModal) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          onClick={closeAuth}
        />

        {/* Modal */}
        <motion.div
          key={authModal}
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: "spring", duration: 0.4 }}
          className="relative w-full max-w-md card-casino rounded-2xl shadow-2xl border border-border overflow-hidden"
        >
          {/* Header gradient */}
          <div className="h-1 w-full gradient-primary" />

          <div className="p-6">
            {/* Close */}
            <button
              onClick={closeAuth}
              className="absolute right-4 top-4 p-1.5 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Title */}
            <div className="mb-6">
              <h2 className="text-2xl font-black">{titles[authModal]}</h2>
              {authModal === "login" && <p className="text-sm text-muted-foreground mt-1">Bem-vindo de volta!</p>}
              {authModal === "register" && <p className="text-sm text-muted-foreground mt-1">Crie sua conta gratuitamente</p>}
              {authModal === "forgot" && <p className="text-sm text-muted-foreground mt-1">Enviaremos um link de recuperação</p>}
            </div>

            {success && authModal === "forgot" ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-full bg-neon-green/20 flex items-center justify-center mx-auto mb-4 glow-green">
                  <Check className="w-8 h-8 text-neon-green" />
                </div>
                <h3 className="text-lg font-bold mb-2">Email enviado!</h3>
                <p className="text-sm text-muted-foreground mb-6">Verifique sua caixa de entrada para redefinir sua senha.</p>
                <Button className="w-full gradient-primary border-0 text-white" onClick={() => { setSuccess(false); openAuth("login"); }}>
                  Voltar ao Login
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {/* API Error */}
                {apiError && (
                  <div className="p-3 rounded-lg bg-destructive/20 border border-destructive/50 text-destructive text-sm">
                    {apiError}
                  </div>
                )}
                {/* Register: Name */}
                {authModal === "register" && (
                  <div>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        placeholder="Nome completo"
                        className="pl-10 bg-secondary border-border"
                        value={regName}
                        onChange={(e) => setRegName(e.target.value)}
                      />
                    </div>
                    {errors.name && <p className="text-xs text-destructive mt-1">{errors.name}</p>}
                  </div>
                )}

                {/* Email */}
                <div>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      type="email"
                      placeholder="Email"
                      className="pl-10 bg-secondary border-border"
                      value={authModal === "login" ? loginEmail : authModal === "register" ? regEmail : forgotEmail}
                      onChange={(e) => {
                        if (authModal === "login") setLoginEmail(e.target.value);
                        else if (authModal === "register") setRegEmail(e.target.value);
                        else setForgotEmail(e.target.value);
                      }}
                    />
                  </div>
                  {errors.email && <p className="text-xs text-destructive mt-1">{errors.email}</p>}
                </div>

                {/* Register: CPF */}
                {authModal === "register" && (
                  <div>
                    <div className="relative">
                      <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        placeholder="CPF (000.000.000-00)"
                        className="pl-10 bg-secondary border-border"
                        value={regCPF}
                        onChange={(e) => setRegCPF(formatCPF(e.target.value))}
                      />
                    </div>
                    {errors.cpf && <p className="text-xs text-destructive mt-1">{errors.cpf}</p>}
                  </div>
                )}

                {/* Password */}
                {authModal !== "forgot" && (
                  <div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        type={showPass ? "text" : "password"}
                        placeholder="Senha"
                        className="pl-10 pr-10 bg-secondary border-border"
                        value={authModal === "login" ? loginPassword : regPassword}
                        onChange={(e) => {
                          if (authModal === "login") setLoginPassword(e.target.value);
                          else setRegPassword(e.target.value);
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPass(!showPass)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                      >
                        {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {errors.password && <p className="text-xs text-destructive mt-1">{errors.password}</p>}
                  </div>
                )}

                {/* Register: Confirm password */}
                {authModal === "register" && (
                  <div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        type={showPass ? "text" : "password"}
                        placeholder="Confirmar senha"
                        className="pl-10 bg-secondary border-border"
                        value={regConfirm}
                        onChange={(e) => setRegConfirm(e.target.value)}
                      />
                    </div>
                    {errors.confirm && <p className="text-xs text-destructive mt-1">{errors.confirm}</p>}
                  </div>
                )}

                {/* Login extras */}
                {authModal === "login" && (
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <div
                        onClick={() => setRememberMe(!rememberMe)}
                        className={cn("w-4 h-4 rounded border flex items-center justify-center cursor-pointer transition-colors", rememberMe ? "bg-primary border-primary" : "border-border")}
                      >
                        {rememberMe && <Check className="w-3 h-3 text-white" />}
                      </div>
                      <span className="text-xs text-muted-foreground">Lembrar de mim</span>
                    </label>
                    <button onClick={() => openAuth("forgot")} className="text-xs text-primary hover:underline">
                      Esqueci minha senha
                    </button>
                  </div>
                )}

                {/* Register: Terms */}
                {authModal === "register" && (
                  <div>
                    <label className="flex items-start gap-2 cursor-pointer">
                      <div
                        onClick={() => setAcceptTerms(!acceptTerms)}
                        className={cn("w-4 h-4 rounded border flex items-center justify-center shrink-0 mt-0.5 cursor-pointer transition-colors", acceptTerms ? "bg-primary border-primary" : "border-border")}
                      >
                        {acceptTerms && <Check className="w-3 h-3 text-white" />}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        Aceito os <a href="#" className="text-primary hover:underline">Termos de Uso</a> e <a href="#" className="text-primary hover:underline">Política de Privacidade</a>. Tenho mais de 18 anos.
                      </span>
                    </label>
                    {errors.terms && <p className="text-xs text-destructive mt-1">{errors.terms}</p>}
                  </div>
                )}

                {/* Submit */}
                <Button
                  className="w-full gradient-primary border-0 text-white font-bold h-11"
                  onClick={handleSubmit}
                  disabled={loading || authLoading}
                >
                  {loading || authLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    titles[authModal]
                  )}
                </Button>

                {/* Switch links */}
                {authModal === "login" && (
                  <p className="text-center text-sm text-muted-foreground">
                    Não tem conta?{" "}
                    <button onClick={() => openAuth("register")} className="text-primary font-semibold hover:underline">
                      Cadastre-se grátis
                    </button>
                  </p>
                )}
                {authModal === "register" && (
                  <p className="text-center text-sm text-muted-foreground">
                    Já tem conta?{" "}
                    <button onClick={() => openAuth("login")} className="text-primary font-semibold hover:underline">
                      Entrar
                    </button>
                  </p>
                )}
                {authModal === "forgot" && (
                  <p className="text-center text-sm text-muted-foreground">
                    Lembrou a senha?{" "}
                    <button onClick={() => openAuth("login")} className="text-primary font-semibold hover:underline">
                      Entrar
                    </button>
                  </p>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
