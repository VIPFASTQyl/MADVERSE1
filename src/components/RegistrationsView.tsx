import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Download, Filter } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Registration {
  id: string;
  registration_id: string;
  activity_id: string;
  activity_title: string;
  activity_category: string;
  activity_date: string;
  activity_location: string;
  registered_at: string;
  full_name?: string;
  email?: string;
  phone?: string;
}

export const RegistrationsView = () => {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [filteredRegistrations, setFilteredRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterProgram, setFilterProgram] = useState("all");
  const [programs, setPrograms] = useState<{ id: string; title: string }[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    loadRegistrations();
    loadPrograms();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [registrations, searchTerm, filterProgram]);

  const loadPrograms = async () => {
    try {
      const { data } = await supabase
        .from("activity_registrations")
        .select("activity_id, activity_title")
        .order("activity_title");

      if (data) {
        const uniquePrograms = Array.from(
          new Map(data.map((a) => [a.activity_id, { id: a.activity_id, title: a.activity_title }])).values()
        );
        setPrograms(uniquePrograms);
      }
    } catch (error) {
      console.error("Error loading programs:", error);
    }
  };

  const loadRegistrations = async () => {
    setLoading(true);
    try {
      const { data: registrationsData, error: regError } = await supabase
        .from("activity_registrations")
        .select(
          `
          id,
          registration_id,
          activity_id,
          activity_title,
          activity_category,
          activity_date,
          activity_location,
          registered_at
        `
        )
        .order("registered_at", { ascending: false });

      if (regError) throw regError;

      if (registrationsData && registrationsData.length > 0) {
        const registrationsWithDetails = await Promise.all(
          registrationsData.map(async (reg) => {
            // Get user details from registrations table
            const { data: profileData } = await supabase
              .from("registrations")
              .select("full_name, email, phone")
              .eq("id", reg.registration_id)
              .maybeSingle();

            return {
              ...reg,
              full_name: profileData?.full_name || "Unknown User",
              email: profileData?.email || "N/A",
              phone: profileData?.phone || "N/A",
            };
          })
        );

        setRegistrations(registrationsWithDetails);
      } else {
        setRegistrations([]);
      }
    } catch (error) {
      console.error("Error loading registrations:", error);
      toast({
        title: "Error",
        description: "Failed to load registrations",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = registrations;

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (reg) =>
          reg.full_name?.toLowerCase().includes(term) ||
          reg.email?.toLowerCase().includes(term) ||
          reg.phone?.toLowerCase().includes(term) ||
          reg.activity_title?.toLowerCase().includes(term)
      );
    }

    // Program filter
    if (filterProgram !== "all") {
      filtered = filtered.filter((reg) => reg.activity_id === filterProgram);
    }

    setFilteredRegistrations(filtered);
  };

  const exportToCSV = () => {
    const headers = ["Name", "Email", "Phone", "Program", "Category", "Date", "Location", "Registered Date"];
    const rows = filteredRegistrations.map((reg) => [
      reg.full_name,
      reg.email,
      reg.phone,
      reg.activity_title,
      reg.activity_category,
      reg.activity_date,
      reg.activity_location,
      new Date(reg.registered_at).toLocaleDateString(),
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `registrations-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    toast({
      description: "Registrations exported to CSV",
    });
  };

  const getStatistics = () => {
    const stats = {
      total: filteredRegistrations.length,
      uniqueUsers: new Set(filteredRegistrations.map((r) => r.registration_id)).size,
      programs: new Set(filteredRegistrations.map((r) => r.activity_id)).size,
    };
    return stats;
  };

  const stats = getStatistics();

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Registrations</h2>
        <p className="text-muted-foreground">
          View and manage all user registrations for programs
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">Total Registrations</p>
              <p className="text-3xl font-bold">{stats.total}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">Unique Users</p>
              <p className="text-3xl font-bold text-blue-600">{stats.uniqueUsers}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">Programs</p>
              <p className="text-3xl font-bold text-green-600">{stats.programs}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Filter size={20} />
              <h3 className="font-semibold">Filters & Search</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Search</label>
                <Input
                  placeholder="Name, email, phone, or program..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Program</label>
                <Select value={filterProgram} onValueChange={setFilterProgram}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Programs</SelectItem>
                    {programs.map((program) => (
                      <SelectItem key={program.id} value={program.id}>
                        {program.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                <Button
                  onClick={exportToCSV}
                  variant="outline"
                  className="w-full flex items-center gap-2"
                >
                  <Download size={16} />
                  Export CSV
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Registrations Table */}
      <Card>
        <CardContent className="pt-6">
          {filteredRegistrations.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              {registrations.length === 0 ? "No registrations yet" : "No results match your filters"}
            </p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Program</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Registered Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRegistrations.map((reg) => (
                    <TableRow key={reg.id}>
                      <TableCell className="font-medium">{reg.full_name}</TableCell>
                      <TableCell className="text-sm">{reg.email}</TableCell>
                      <TableCell>{reg.phone}</TableCell>
                      <TableCell className="font-medium">{reg.activity_title}</TableCell>
                      <TableCell>{reg.activity_category}</TableCell>
                      <TableCell>{reg.activity_date}</TableCell>
                      <TableCell>{reg.activity_location}</TableCell>
                      <TableCell className="text-sm">
                        {new Date(reg.registered_at).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
