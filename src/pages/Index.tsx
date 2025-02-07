
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, Server, Database, AppWindow } from "lucide-react";
import { VPSDialog } from "@/components/VPSDialog";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

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

const Index = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: vpsData = [], refetch } = useQuery({
    queryKey: ["vps"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("vps")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as VPSData[];
    },
  });

  const filteredData = vpsData.filter(
    (vps) =>
      vps.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vps.unit.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vps.applications.some((app) =>
        app.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  const totalVPS = vpsData.length;
  const activeVPS = vpsData.filter((vps) => vps.status === "active").length;
  const totalApps = vpsData.reduce(
    (sum, vps) => sum + vps.applications.length,
    0
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 animate-fadeIn">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">
            Dashboard Pendataan VPS
          </h1>
          <VPSDialog onSuccess={refetch} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="stats-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total VPS</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {totalVPS}
                </p>
              </div>
              <Server className="h-8 w-8 text-primary" />
            </div>
          </div>

          <div className="stats-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">VPS Aktif</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {activeVPS}
                </p>
              </div>
              <Database className="h-8 w-8 text-primary" />
            </div>
          </div>

          <div className="stats-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Aplikasi
                </p>
                <p className="text-2xl font-semibold text-gray-900">
                  {totalApps}
                </p>
              </div>
              <AppWindow className="h-8 w-8 text-primary" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 card-shadow">
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Cari berdasarkan nama VPS, unit, atau aplikasi..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 search-input"
              />
            </div>
          </div>

          <div className="table-container">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama VPS</TableHead>
                  <TableHead>Spesifikasi</TableHead>
                  <TableHead>Aplikasi</TableHead>
                  <TableHead>Unit/Instansi</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.map((vps) => (
                  <TableRow
                    key={vps.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <TableCell className="font-medium">{vps.name}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <p className="text-sm">CPU: {vps.cpu}</p>
                        <p className="text-sm">RAM: {vps.ram}</p>
                        <p className="text-sm">Storage: {vps.storage}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-2">
                        {vps.applications.map((app, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="text-xs"
                          >
                            {app}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>{vps.unit}</TableCell>
                    <TableCell>
                      <Badge
                        variant={vps.status === "active" ? "default" : "secondary"}
                        className={`${
                          vps.status === "active"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {vps.status === "active" ? "Aktif" : "Non-aktif"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
