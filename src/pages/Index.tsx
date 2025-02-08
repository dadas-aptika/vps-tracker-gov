
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";
import { VPSDialog } from "@/components/VPSDialog";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PDFDownloadLink } from "@react-pdf/renderer";
import VPSReport from "@/components/VPSReport";
import { VPSData } from "@/types/vps";
import { StatsCards } from "@/components/vps/StatsCards";
import { SearchBar } from "@/components/vps/SearchBar";
import { VPSTable } from "@/components/vps/VPSTable";

const ITEMS_PER_PAGE = 10;

const Index = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

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

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedData = filteredData.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 animate-fadeIn">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">
            (DADAS) Dashboard Pendataan VPS
          </h1>
          <div className="flex gap-4">
            <PDFDownloadLink
              document={<VPSReport data={vpsData} />}
              fileName="laporan-vps.pdf"
            >
              {({ loading }) => (
                <Button variant="outline" disabled={loading}>
                  <FileDown className="h-4 w-4 mr-2" />
                  {loading ? "Generating PDF..." : "Export PDF"}
                </Button>
              )}
            </PDFDownloadLink>
            <VPSDialog onSuccess={refetch} />
          </div>
        </div>

        <StatsCards vpsData={vpsData} />

        <div className="bg-white rounded-lg p-6 card-shadow">
          <div className="flex items-center gap-4 mb-6">
            <SearchBar 
              searchTerm={searchTerm} 
              onSearchChange={setSearchTerm} 
            />
          </div>

          <VPSTable
            data={paginatedData}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            onSuccess={refetch}
          />
        </div>
      </div>
    </div>
  );
};

export default Index;
