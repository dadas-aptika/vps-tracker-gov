
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const formSchema = z.object({
  name: z.string().min(1, "Nama VPS harus diisi"),
  cpu: z.string().min(1, "CPU harus diisi"),
  ram: z.string().min(1, "RAM harus diisi"),
  storage: z.string().min(1, "Storage harus diisi"),
  applications: z.string().min(1, "Aplikasi harus diisi"),
  unit: z.string().min(1, "Unit/Instansi harus diisi"),
  status: z.enum(["active", "inactive"]),
});

interface VPSData {
  id: string;
  name: string;
  cpu: string;
  ram: string;
  storage: string;
  applications: string[];
  unit: string;
  status: "active" | "inactive";
}

interface VPSDialogProps {
  onSuccess: () => void;
  mode?: "create" | "edit";
  data?: VPSData;
}

export function VPSDialog({ onSuccess, mode = "create", data }: VPSDialogProps) {
  const [open, setOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      cpu: "",
      ram: "",
      storage: "",
      applications: "",
      unit: "",
      status: "active",
    },
  });

  useEffect(() => {
    if (data && mode === "edit") {
      form.reset({
        name: data.name,
        cpu: data.cpu,
        ram: data.ram,
        storage: data.storage,
        applications: data.applications.join(", "),
        unit: data.unit,
        status: data.status,
      });
    }
  }, [data, mode, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const formattedValues = {
        name: values.name,
        cpu: values.cpu,
        ram: values.ram,
        storage: values.storage,
        applications: values.applications.split(",").map(app => app.trim()),
        unit: values.unit,
        status: values.status
      };

      let error;
      if (mode === "edit" && data) {
        ({ error } = await supabase
          .from("vps")
          .update(formattedValues)
          .eq("id", data.id));
      } else {
        ({ error } = await supabase.from("vps").insert(formattedValues));
      }

      if (error) throw error;

      toast({
        title: "Berhasil",
        description: `Data VPS berhasil ${mode === "edit" ? "diperbarui" : "ditambahkan"}`,
      });
      
      setOpen(false);
      form.reset();
      onSuccess();
    } catch (error) {
      console.error("Error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: `Gagal ${mode === "edit" ? "memperbarui" : "menambahkan"} data VPS`,
      });
    }
  }

  async function handleDelete() {
    if (!data) return;

    try {
      const { error } = await supabase
        .from("vps")
        .delete()
        .eq("id", data.id);

      if (error) throw error;

      toast({
        title: "Berhasil",
        description: "Data VPS berhasil dihapus",
      });
      
      setDeleteDialogOpen(false);
      setOpen(false);
      onSuccess();
    } catch (error) {
      console.error("Error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Gagal menghapus data VPS",
      });
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          {mode === "create" ? (
            <Button className="btn-primary flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Tambah VPS
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
            >
              <Pencil className="h-4 w-4" />
            </Button>
          )}
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {mode === "edit" ? "Edit VPS" : "Tambah VPS Baru"}
            </DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama VPS</FormLabel>
                    <FormControl>
                      <Input placeholder="VPS-GOV-XX" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="cpu"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CPU</FormLabel>
                    <FormControl>
                      <Input placeholder="4 Core" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="ram"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>RAM</FormLabel>
                    <FormControl>
                      <Input placeholder="8 GB" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="storage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Storage</FormLabel>
                    <FormControl>
                      <Input placeholder="100 GB SSD" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="applications"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Aplikasi (pisahkan dengan koma)</FormLabel>
                    <FormControl>
                      <Input placeholder="E-Office, SIPD" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="unit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Unit/Instansi</FormLabel>
                    <FormControl>
                      <Input placeholder="Sekretariat Daerah" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="active">Aktif</SelectItem>
                        <SelectItem value="inactive">Non-aktif</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex gap-2">
                <Button type="submit" className="flex-1">
                  Simpan
                </Button>
                {mode === "edit" && (
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => setDeleteDialogOpen(true)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus VPS</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus VPS ini? Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
