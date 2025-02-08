
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { VPSDialog } from "@/components/VPSDialog";
import { VPSData } from "@/types/vps";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface VPSTableProps {
  data: VPSData[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onSuccess: () => void;
}

export const VPSTable = ({
  data,
  currentPage,
  totalPages,
  onPageChange,
  onSuccess,
}: VPSTableProps) => {
  return (
    <div className="table-container">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nama VPS</TableHead>
            <TableHead>Spesifikasi</TableHead>
            <TableHead>Aplikasi</TableHead>
            <TableHead>Unit/Instansi</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-[100px]">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((vps) => (
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
              <TableCell>
                <VPSDialog mode="edit" data={vps} onSuccess={onSuccess} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {totalPages > 1 && (
        <div className="mt-4 flex justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
              {Array.from({ length: totalPages }).map((_, index) => (
                <PaginationItem key={index + 1}>
                  <PaginationLink
                    onClick={() => onPageChange(index + 1)}
                    isActive={currentPage === index + 1}
                  >
                    {index + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
};
