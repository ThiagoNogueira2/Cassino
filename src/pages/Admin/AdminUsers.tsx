import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Loader2, Search, Plus, Pencil, Trash2 } from "lucide-react";
import { api } from "@/lib/api";
import AdminLayout from "./AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface AdminUser {
  id: number;
  name: string;
  email: string;
  cpf: string;
  avatar?: string | null;
  balance: number;
  level: string;
  role: string;
  joinedAt: string;
}

const LEVEL_OPTIONS = ["VIP Silver", "VIP Gold", "VIP Platinum", "VIP Diamond"];
const ROLE_OPTIONS = ["user", "admin"];

function loadUsers(
  setUsers: (u: AdminUser[]) => void,
  setTotal: (n: number) => void,
  setError: (e: string | null) => void,
  setLoading: (b: boolean) => void
) {
  setLoading(true);
  setError(null);
  api
    .get("/admin/users", true)
    .then((res: { data?: AdminUser[]; total?: number }) => {
      if (res.data) {
        setUsers(res.data);
        setTotal(res.total ?? res.data.length);
      }
    })
    .catch((e: { data?: { message?: string } }) => {
      setError(e?.data?.message || "Erro ao carregar usuários.");
    })
    .finally(() => setLoading(false));
}

export default function AdminUsers() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const [addOpen, setAddOpen] = useState(false);
  const [addSubmitting, setAddSubmitting] = useState(false);
  const [addForm, setAddForm] = useState({
    name: "",
    email: "",
    cpf: "",
    password: "",
    password_confirmation: "",
  });

  const [editOpen, setEditOpen] = useState(false);
  const [editUser, setEditUser] = useState<AdminUser | null>(null);
  const [editSubmitting, setEditSubmitting] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    avatar: "",
    balance: "",
    level: "",
    role: "user",
  });

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<AdminUser | null>(null);
  const [deleteSubmitting, setDeleteSubmitting] = useState(false);

  useEffect(() => {
    loadUsers(setUsers, setTotal, setError, setLoading);
  }, []);

  const filtered =
    search.trim() !== ""
      ? users.filter(
          (u) =>
            u.name.toLowerCase().includes(search.toLowerCase()) ||
            u.email.toLowerCase().includes(search.toLowerCase())
        )
      : users;

  const openEdit = (u: AdminUser) => {
    setEditUser(u);
    setEditForm({
      name: u.name,
      email: u.email,
      avatar: u.avatar ?? "",
      balance: String(Number(u.balance)),
      level: u.level || "VIP Silver",
      role: u.role || "user",
    });
    setEditOpen(true);
  };

  const openDelete = (u: AdminUser) => {
    setUserToDelete(u);
    setDeleteOpen(true);
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (addForm.password !== addForm.password_confirmation) {
      setError("As senhas não coincidem.");
      return;
    }
    setAddSubmitting(true);
    setError(null);
    try {
      await api.post("/auth/register", {
        name: addForm.name,
        email: addForm.email,
        cpf: addForm.cpf,
        password: addForm.password,
        password_confirmation: addForm.password_confirmation,
      });
      setAddOpen(false);
      setAddForm({ name: "", email: "", cpf: "", password: "", password_confirmation: "" });
      loadUsers(setUsers, setTotal, setError, setLoading);
    } catch (err: unknown) {
      const msg = (err as { data?: { message?: string; errors?: Record<string, string[]> } })?.data;
      if (msg?.errors) {
        const first = Object.values(msg.errors).flat()[0];
        setError(first || "Erro ao cadastrar.");
      } else {
        setError(msg?.message || "Erro ao cadastrar usuário.");
      }
    } finally {
      setAddSubmitting(false);
    }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editUser) return;
    setEditSubmitting(true);
    setError(null);
    try {
      await api.put(
        `/admin/users/${editUser.id}`,
        {
          name: editForm.name,
          email: editForm.email,
          avatar: editForm.avatar || undefined,
          balance: parseFloat(editForm.balance) || 0,
          level: editForm.level,
          role: editForm.role,
        },
        true
      );
      setEditOpen(false);
      setEditUser(null);
      loadUsers(setUsers, setTotal, setError, setLoading);
    } catch (err: unknown) {
      const msg = (err as { data?: { message?: string } })?.data;
      setError(msg?.message || "Erro ao atualizar usuário.");
    } finally {
      setEditSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!userToDelete) return;
    setDeleteSubmitting(true);
    setError(null);
    try {
      await api.delete(`/admin/users/${userToDelete.id}`, true);
      setDeleteOpen(false);
      setUserToDelete(null);
      loadUsers(setUsers, setTotal, setError, setLoading);
    } catch (err: unknown) {
      const msg = (err as { data?: { message?: string } })?.data;
      setError(msg?.message || "Erro ao excluir usuário.");
    } finally {
      setDeleteSubmitting(false);
    }
  };

  return (
    <AdminLayout
      title="Usuários"
      subtitle={`${total} usuários no sistema. Gerencie contas e permissões.`}
    >
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <Input
              placeholder="Buscar por nome ou email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 border-white/10 bg-white/5 text-white placeholder:text-slate-500 focus-visible:ring-[#f02254]"
            />
          </div>
          <div className="flex items-center gap-3">
            <p className="text-sm text-slate-400">
              {filtered.length} de {total} usuários
            </p>
            <Button
              onClick={() => {
                setError(null);
                setAddForm({ name: "", email: "", cpf: "", password: "", password_confirmation: "" });
                setAddOpen(true);
              }}
              className="bg-[#f02254] hover:bg-[#e01e4c] text-white"
            >
              <Plus className="h-4 w-4 mr-2" /> Adicionar usuário
            </Button>
          </div>
        </div>

        {error && (
          <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0d2239]/80 backdrop-blur-sm">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-10 w-10 animate-spin text-[#f02254]" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-white/10 bg-white/5 text-slate-400">
                    <th className="px-6 py-4 font-semibold">Nome</th>
                    <th className="px-6 py-4 font-semibold">Email</th>
                    <th className="px-6 py-4 font-semibold hidden md:table-cell">CPF</th>
                    <th className="px-6 py-4 font-semibold">Nível</th>
                    <th className="px-6 py-4 font-semibold">Saldo</th>
                    <th className="px-6 py-4 font-semibold">Tipo</th>
                    <th className="px-6 py-4 font-semibold w-[120px]">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((u, i) => (
                    <motion.tr
                      key={u.id}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: Math.min(i * 0.02, 0.2) }}
                      className="border-b border-white/5 transition hover:bg-white/5"
                    >
                      <td className="px-6 py-4 font-medium text-white">{u.name}</td>
                      <td className="px-6 py-4 text-slate-300">{u.email}</td>
                      <td className="px-6 py-4 text-slate-400 hidden md:table-cell">{u.cpf}</td>
                      <td className="px-6 py-4 text-slate-300">{u.level}</td>
                      <td className="px-6 py-4 font-semibold text-emerald-400">
                        R$ {Number(u.balance).toFixed(2)}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={cn(
                            "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold",
                            u.role === "admin"
                              ? "bg-amber-500/20 text-amber-400"
                              : "bg-slate-500/20 text-slate-400"
                          )}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-slate-400 hover:text-white hover:bg-white/10"
                            onClick={() => openEdit(u)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-slate-400 hover:text-red-400 hover:bg-red-500/10"
                            onClick={() => openDelete(u)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {!loading && filtered.length === 0 && (
            <div className="py-16 text-center text-slate-500">
              {search
                ? "Nenhum usuário encontrado para essa busca."
                : "Nenhum usuário cadastrado."}
            </div>
          )}
        </div>
      </motion.div>

      {/* Dialog Adicionar */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="border-white/10 bg-[#0d2239] text-white">
          <DialogHeader>
            <DialogTitle>Adicionar usuário</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAdd} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="add-name">Nome</Label>
              <Input
                id="add-name"
                value={addForm.name}
                onChange={(e) => setAddForm((f) => ({ ...f, name: e.target.value }))}
                required
                className="bg-white/5 border-white/10 text-white"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="add-email">Email</Label>
              <Input
                id="add-email"
                type="email"
                value={addForm.email}
                onChange={(e) => setAddForm((f) => ({ ...f, email: e.target.value }))}
                required
                className="bg-white/5 border-white/10 text-white"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="add-cpf">CPF (000.000.000-00)</Label>
              <Input
                id="add-cpf"
                value={addForm.cpf}
                onChange={(e) => setAddForm((f) => ({ ...f, cpf: e.target.value }))}
                placeholder="000.000.000-00"
                required
                className="bg-white/5 border-white/10 text-white"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="add-password">Senha</Label>
              <Input
                id="add-password"
                type="password"
                value={addForm.password}
                onChange={(e) => setAddForm((f) => ({ ...f, password: e.target.value }))}
                required
                minLength={6}
                className="bg-white/5 border-white/10 text-white"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="add-password-confirm">Confirmar senha</Label>
              <Input
                id="add-password-confirm"
                type="password"
                value={addForm.password_confirmation}
                onChange={(e) => setAddForm((f) => ({ ...f, password_confirmation: e.target.value }))}
                required
                minLength={6}
                className="bg-white/5 border-white/10 text-white"
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setAddOpen(false)} className="border-white/20 text-white">
                Cancelar
              </Button>
              <Button type="submit" disabled={addSubmitting} className="bg-[#f02254] hover:bg-[#e01e4c] text-white">
                {addSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Cadastrar"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialog Editar */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="border-white/10 bg-[#0d2239] text-white">
          <DialogHeader>
            <DialogTitle>Editar usuário</DialogTitle>
          </DialogHeader>
          {editUser && (
            <form onSubmit={handleEdit} className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-name">Nome</Label>
                <Input
                  id="edit-name"
                  value={editForm.name}
                  onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))}
                  required
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm((f) => ({ ...f, email: e.target.value }))}
                  required
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-avatar">Avatar (URL)</Label>
                <Input
                  id="edit-avatar"
                  value={editForm.avatar}
                  onChange={(e) => setEditForm((f) => ({ ...f, avatar: e.target.value }))}
                  placeholder="https://..."
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-balance">Saldo (R$)</Label>
                <Input
                  id="edit-balance"
                  type="number"
                  step="0.01"
                  min="0"
                  value={editForm.balance}
                  onChange={(e) => setEditForm((f) => ({ ...f, balance: e.target.value }))}
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>
              <div className="grid gap-2">
                <Label>Nível</Label>
                <Select value={editForm.level} onValueChange={(v) => setEditForm((f) => ({ ...f, level: v }))}>
                  <SelectTrigger className="bg-white/5 border-white/10 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#0d2239] border-white/10">
                    {LEVEL_OPTIONS.map((l) => (
                      <SelectItem key={l} value={l} className="text-white focus:bg-white/10">
                        {l}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Tipo</Label>
                <Select value={editForm.role} onValueChange={(v) => setEditForm((f) => ({ ...f, role: v }))}>
                  <SelectTrigger className="bg-white/5 border-white/10 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#0d2239] border-white/10">
                    {ROLE_OPTIONS.map((r) => (
                      <SelectItem key={r} value={r} className="text-white focus:bg-white/10">
                        {r}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setEditOpen(false)} className="border-white/20 text-white">
                  Cancelar
                </Button>
                <Button type="submit" disabled={editSubmitting} className="bg-[#f02254] hover:bg-[#e01e4c] text-white">
                  {editSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Salvar"}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* AlertDialog Excluir */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent className="border-white/10 bg-[#0d2239] text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir usuário?</AlertDialogTitle>
            <AlertDialogDescription>
              {userToDelete && (
                <>
                  O usuário <strong>{userToDelete.name}</strong> será ocultado da listagem (soft delete). Os dados permanecem no sistema. Deseja continuar?
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-white/20 text-white hover:bg-white/10">Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleteSubmitting}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {deleteSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Excluir"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}
